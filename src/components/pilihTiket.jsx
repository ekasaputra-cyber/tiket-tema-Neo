import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaCheck, 
  FaArrowLeft, 
  FaTicketAlt, 
  FaMinus, 
  FaPlus, 
  FaWallet, 
  FaExclamationTriangle 
} from 'react-icons/fa'; 
import PemesanForm from './form';
import TicketAttendeeForm from './tiketAtt';

export default function TicketAndCheckout() {
  const { widgetSlug } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- STATE UTAMA ---
  const [quantities, setQuantities] = useState({});
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    namaLengkap: '',
    tipeIdentitas: '',
    nomorIdentitas: '',
    email: '',
    noWa: '',
  });

  const [ticketForms, setTicketForms] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [timeLeft, setTimeLeft] = useState(59 * 60);
  
  // State untuk mencegah overwrite data saat refresh
  const [isLoaded, setIsLoaded] = useState(false);

  // State untuk loading tombol bayar
  const [isProcessing, setIsProcessing] = useState(false);

  const STORAGE_KEY = `checkout_state_${widgetSlug}`;

  // 1. LOAD DATA
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.quantities) setQuantities(parsed.quantities);
        if (parsed.step) setStep(parsed.step);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.ticketForms) setTicketForms(parsed.ticketForms);
        if (parsed.paymentSummary) setPaymentSummary(parsed.paymentSummary);
      } catch (e) {
        console.error("Gagal memuat data", e);
      }
    }
    setIsLoaded(true);
  }, [STORAGE_KEY]);

  // 2. SAVE DATA
  useEffect(() => {
    if (!isLoaded) return;
    const dataToSave = { quantities, step, formData, ticketForms, paymentSummary };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [quantities, step, formData, ticketForms, paymentSummary, STORAGE_KEY, isLoaded]);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const eventRes = await fetch(`https://api.artatix.co.id/api/v1/customer/event/${widgetSlug}`);
        const ticketRes = await fetch(`https://api.artatix.co.id/api/v1/customer/ticket/${widgetSlug}?date=`);
        const eventData = await eventRes.json();
        const ticketData = await ticketRes.json();
        if (eventData.message === 'success') setEvent(eventData.data);
        if (ticketData.message === 'success') setTickets(ticketData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (widgetSlug) fetchData();
  }, [widgetSlug]);

  const selectedTickets = tickets
    .filter(t => quantities[t.id] > 0)
    .map(t => ({ ...t, qty: quantities[t.id] }));

  // Generate Forms
  useEffect(() => {
    if (!isLoaded) return;
    const total = selectedTickets.reduce((sum, t) => sum + t.qty, 0);
    if (ticketForms.length === total && total > 0) return;

    if (total > 0 && total <= 5) {
      if (ticketForms.length !== total) {
        const newForms = Array(total).fill().map((_, i) => ticketForms[i] || { name: '', idType: '', idNumber: '', email: '', phone: '' });
        setTicketForms(newForms);
      }
    } else if (total === 0) {
      setTicketForms([]);
      setPaymentSummary(null);
    }
  }, [selectedTickets, ticketForms, isLoaded]);

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const isCheckoutEnabled = totalTickets > 0 && totalTickets <= 5;

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Helpers
  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const formatPrice = (price) => `Rp${parseInt(price).toLocaleString('id-ID')}`;
  const getFormIndex = (currentTicket, currentIdx, allTickets) => {
    let index = 0;
    for (const t of allTickets) {
      if (t.id === currentTicket.id) return index + currentIdx;
      index += t.qty;
    }
    return index;
  };

  const updateQuantity = (ticketId, newQty, maxPerTx) => {
    if (newQty < 0) return;
    const currentTotal = Object.values(quantities).reduce((a, b) => a + b, 0);
    const currentQty = quantities[ticketId] || 0;
    
    if (newQty > currentQty && currentTotal >= 5) {
      alert('Maksimal 5 tiket per transaksi.');
      return;
    }
    if (newQty > maxPerTx) {
      alert(`Maksimal ${maxPerTx} tiket untuk kategori ini.`);
      return;
    }

    if (newQty === 0) {
      setQuantities(p => { const u = { ...p }; delete u[ticketId]; return u; });
    } else {
      setQuantities(p => ({ ...p, [ticketId]: newQty }));
    }
  };

  const calculatePayment = async () => {
    if (!event || selectedTickets.length === 0 || !formData.email) {
      alert('Lengkapi data terlebih dahulu.');
      return;
    }
    
    const payload = { eventId: event.id, tickets: selectedTickets.map(t => ({ id: t.id, qty: t.qty })), email: formData.email };
    
    try {
      const res = await fetch('https://api.artatix.co.id/api/v1/customer/transaction/calculatetax', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.message === 'success') {
        setPaymentSummary(result.data);
        setStep(3);
      } else alert('Gagal menghitung: ' + result.message);
    } catch (err) { alert('Gagal menghubungi server.'); }
  };

  // --- LOGIC CREATE TRANSACTION ---
  const createTransaction = async () => {
    if (!event || !selectedPayment || !paymentSummary) {
      alert('Data tidak lengkap.');
      return;
    }

    setIsProcessing(true);

    const formatPhone = (phone) => {
      if (!phone) return '6280000000000';
      let p = phone.replace(/\D/g, '');
      if (p.startsWith('0')) p = `62${p.slice(1)}`;
      else if (!p.startsWith('62')) p = `62${p}`;
      return p;
    };

    const mapIdentityType = (type) => {
      if (!type) return 'KTP';
      const upper = type.toUpperCase();
      if (upper === 'PASPOR' || upper === 'PASSPORT') return 'PASSPORT';
      if (upper === 'SIM') return 'SIM';
      return 'KTP';
    };

    const mainAttendee = {
      fullname: formData.namaLengkap.trim() || 'Pembeli',
      identityType: mapIdentityType(formData.tipeIdentitas),
      identityNumber: formData.nomorIdentitas.trim() || '1234567890',
      email: formData.email.trim() || 'user@example.com',
      phoneNumber: formatPhone(formData.noWa)
    };

    let ticketIndex = 0;
    const ticketsPayload = selectedTickets.map(ticket => {
      const documents = [];
      for (let i = 0; i < ticket.qty; i++) {
        const form = ticketForms[ticketIndex] || {};
        documents.push({
          fullname: (form.name || mainAttendee.fullname).trim() || 'Pengunjung',
          identityType: mapIdentityType(form.idType || formData.tipeIdentitas),
          identityNumber: (form.idNumber || mainAttendee.identityNumber).trim() || '1234567890',
          email: (form.email || mainAttendee.email).trim() || 'user@example.com',
          phoneNumber: formatPhone(form.phone || formData.noWa)
        });
        ticketIndex++;
      }
      return {
        id: ticket.id,
        qty: ticket.qty,
        seats: [],
        documents
      };
    });

    const payload = {
      eventId: event.id,
      paymentMethod: selectedPayment.id,
      voucher: "",
      orderDetail: mainAttendee,
      tickets: ticketsPayload
    };

    try {
      const res = await fetch('https://api.artatix.co.id/api/v1/customer/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.message === 'success' && result.data?.transaction?.invoiceUrl) {
          localStorage.removeItem(STORAGE_KEY);
          window.open(result.data.transaction.invoiceUrl, '_blank');
          window.location.href = `/payment/${result.data.transaction.orderId}`;
      } else {
        alert('Gagal membuat transaksi!\n' + (result.message || 'Cek console untuk detail.'));
      }
    } catch (err) {
      console.error('🔥 Error:', err);
      alert('Gagal koneksi ke server pembayaran.');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- RENDER ---
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffbeb]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-16 w-16 border-8 border-black border-t-[#facc15] rounded-full"></div>
          <p className="font-black text-xl uppercase tracking-widest">Memuat...</p>
        </div>
    </div>
  );
  
  if (error) return <div className="p-10 text-center text-red-500 font-black bg-[#fffbeb] min-h-screen">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-[#fffbeb] pb-24 font-sans text-gray-900">
      
      {/* === HERO HEADER (Style EventDetail) === */}
      <div className="relative w-full bg-black border-b-4 border-black overflow-hidden pb-8 pt-20">
         {/* Pattern Overlay */}
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
         
         <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
            {/* Navigasi Back */}
            <div className="flex justify-start mb-6">
                <Link
                    to={`/event/${widgetSlug}`}
                    className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 text-sm font-black uppercase border-2 border-black shadow-[3px_3px_0px_0px_white] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                    <FaArrowLeft /> Batal
                </Link>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-[4px_4px_0_#000]">
               {step === 1 ? 'Pilih Tiket' : step === 2 ? 'Isi Data Diri' : 'Pembayaran'}
            </h1>
            <p className="inline-block bg-[#facc15] text-black px-2 py-1 font-bold uppercase text-sm md:text-lg border-2 border-black transform -rotate-1">
               {event.name}
            </p>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-20 -mt-6">
        
        {/* === STEPPER (Neo Style) === */}
        <div className="flex justify-center mb-10">
           <div className="flex bg-white border-4 border-black shadow-[6px_6px_0px_0px_black] p-2 gap-2 md:gap-4 overflow-x-auto">
              {[
                  {id:1, label: 'Tiket'}, 
                  {id:2, label: 'Data'}, 
                  {id:3, label: 'Bayar'}
              ].map((s) => (
                 <div key={s.id} className="flex items-center">
                    <div className={`px-4 py-1 font-black uppercase text-sm border-2 border-black transition-all ${
                       step >= s.id ? 'bg-black text-[#facc15]' : 'bg-gray-100 text-gray-400'
                    }`}>
                       <span className="mr-2">{s.id}.</span> {s.label}
                    </div>
                    {/* Arrow connector */}
                    {s.id !== 3 && <div className="hidden md:block w-8 h-1 bg-black mx-2"></div>}
                 </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* === KONTEN UTAMA (KIRI) === */}
            <div className="lg:col-span-2 space-y-8">
                
                {step === 1 && (
                    <div className="space-y-6">
                         {/* Header Info Event (Mobile Friendly) */}
                         <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-6">
                            <h2 className="text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2">Info Jadwal</h2>
                            <div className="flex flex-wrap gap-4 font-bold text-sm md:text-base">
                                <div className="flex items-center gap-2 bg-[#bfdbfe] border-2 border-black px-3 py-1">
                                    <FaCalendarAlt /> {new Date(event.dateStart).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-2 bg-[#ffadad] border-2 border-black px-3 py-1">
                                    <FaClock /> {event.timeStart}
                                </div>
                            </div>
                         </div>

                        {/* List Tiket */}
                        {tickets.map((ticket) => {
                            const qty = quantities[ticket.id] || 0;
                            const isOnSale = ticket.status === 'On Sale';
                            const maxLimit = ticket.ticketPerTransaction || 5;
                            const isMaxReached = qty >= maxLimit;

                            return (
                                <div key={ticket.id} 
                                     className={`group relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] transition-all ${!isOnSale && 'opacity-70 bg-gray-100'}`}>
                                    {/* Decoration Strip */}
                                    <div className="absolute top-0 bottom-0 left-0 w-3 bg-[#facc15] border-r-2 border-black"></div>
                                    
                                    <div className="p-6 pl-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FaTicketAlt className="text-xl"/>
                                                <h3 className="text-xl md:text-2xl font-black uppercase leading-none">{ticket.name}</h3>
                                            </div>
                                            <p className="text-sm font-medium text-gray-600 mb-2 border-l-2 border-black pl-2">{ticket.description || 'Tiket Masuk'}</p>
                                            <div className="text-2xl font-black text-black bg-[#e0f2fe] inline-block px-2 border-2 border-black transform -rotate-1">
                                                {formatPrice(ticket.price)}
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex flex-col items-end gap-2">
                                            {isOnSale ? (
                                                <div className="flex items-center bg-white border-2 border-black shadow-[3px_3px_0px_0px_black]">
                                                    <button onClick={() => updateQuantity(ticket.id, qty - 1, maxLimit)} disabled={qty <= 0}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-red-100 border-r-2 border-black disabled:opacity-50 transition-colors">
                                                        <FaMinus />
                                                    </button>
                                                    <span className="w-12 text-center font-black text-lg">{qty}</span>
                                                    <button onClick={() => updateQuantity(ticket.id, qty + 1, maxLimit)} disabled={isMaxReached}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-green-100 border-l-2 border-black disabled:opacity-50 transition-colors">
                                                        <FaPlus />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="px-4 py-1 bg-red-600 text-white font-black uppercase border-2 border-black transform rotate-2">Habis</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8">
                        {/* Data Pemesan */}
                        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-6 md:p-8">
                             <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
                                <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-black text-lg">1</div>
                                <h2 className="text-xl md:text-2xl font-black uppercase">Data Pemesan</h2>
                             </div>
                             {/* Form Logic dari Component Lain */}
                             <PemesanForm formData={formData} setFormData={setFormData} />
                        </div>

                        {/* Data Pengunjung */}
                        {selectedTickets.flatMap(ticket => 
                             Array.from({ length: ticket.qty }, (_, idx) => {
                                const formIndex = getFormIndex(ticket, idx, selectedTickets);
                                return (
                                    <div key={`${ticket.id}-${idx}`} className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-6 relative">
                                        <div className="bg-[#bfdbfe] border-b-4 border-black -mx-6 -mt-6 p-4 mb-6 flex justify-between items-center">
                                            <h3 className="font-black uppercase flex items-center gap-2">
                                                <FaTicketAlt /> {ticket.name} <span className="text-sm bg-black text-white px-2 py-0.5 rounded-none">#{idx + 1}</span>
                                            </h3>
                                            <button type="button" 
                                                onClick={() => {
                                                    const m = formData;
                                                    const newData = { name: m.namaLengkap, idType: m.tipeIdentitas, idNumber: m.nomorIdentitas, email: m.email, phone: m.noWa };
                                                    setTicketForms(p => { const u = [...p]; u[formIndex] = newData; return u; });
                                                }}
                                                className="text-xs font-bold uppercase border-2 border-black bg-white px-3 py-1 hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_black] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                                            >
                                                Salin Data Pemesan
                                            </button>
                                        </div>
                                        {/* Form Logic dari Component Lain */}
                                        <TicketAttendeeForm index={formIndex} ticketForms={ticketForms} setTicketForms={setTicketForms} />
                                    </div>
                                );
                             })
                        )}
                    </div>
                )}

                {step === 3 && paymentSummary && (
                    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-6 md:p-8">
                        <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2 flex items-center gap-2">
                           <FaWallet /> Pilih Pembayaran
                        </h2>
                        
                        {event?.paymentMethod ? (
                            <div className="space-y-8">
                                {/* E-Wallet */}
                                <div>
                                    <h3 className="font-bold uppercase mb-3 bg-black text-white inline-block px-2">E-Wallet</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {Object.entries(event.paymentMethod.ewallet).filter(([_,v])=>v.isEnabled).map(([key,v])=>(
                                            <button key={key} onClick={()=>setSelectedPayment({type:'ewallet',id:key})}
                                                className={`h-28 flex flex-col items-center justify-center gap-2 border-4 transition-all ${
                                                    selectedPayment?.id===key 
                                                    ? 'border-black bg-[#facc15] shadow-[4px_4px_0px_0px_black]' 
                                                    : 'border-gray-300 hover:border-black'
                                                }`}>
                                                {selectedPayment?.id === key && <FaCheck className="mb-1 text-black"/>}
                                                <img src={`https://api.artatix.co.id/${v.image}`} alt={key} className="h-8 object-contain" onError={(e)=>e.target.style.display='none'}/>
                                                <span className="text-xs font-black uppercase">{key}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Bank */}
                                <div>
                                    <h3 className="font-bold uppercase mb-3 bg-black text-white inline-block px-2">Virtual Account</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {Object.entries(event.paymentMethod.bank).filter(([_,v])=>v.isEnabled).map(([key,v])=>(
                                            <button key={key} onClick={()=>setSelectedPayment({type:'bank',id:key})}
                                                className={`h-28 flex flex-col items-center justify-center gap-2 border-4 transition-all ${
                                                    selectedPayment?.id===key 
                                                    ? 'border-black bg-[#facc15] shadow-[4px_4px_0px_0px_black]' 
                                                    : 'border-gray-300 hover:border-black'
                                                }`}>
                                                {selectedPayment?.id === key && <FaCheck className="mb-1 text-black"/>}
                                                <img src={`https://api.artatix.co.id/${v.image}`} alt={key} className="h-8 object-contain" onError={(e)=>e.target.style.display='none'}/>
                                                <span className="text-xs font-black uppercase">{key}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : <div className="bg-red-100 border-2 border-red-500 p-4 font-bold text-red-600">Metode pembayaran tidak tersedia</div>}
                    </div>
                )}
            </div>

            {/* === SIDEBAR RINGKASAN (KANAN) === */}
            <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                    
                    {/* Timer Alert */}
                    <div className="bg-[#facc15] border-4 border-black p-4 shadow-[4px_4px_0px_0px_black] flex items-center justify-between">
                        <div className="font-bold text-xs uppercase flex items-center gap-2">
                             <FaClock /> Sisa Waktu
                        </div>
                        <div className="text-2xl font-black font-mono tracking-widest bg-black text-[#facc15] px-2">
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-6">
                        <h3 className="text-xl font-black uppercase border-b-4 border-black pb-2 mb-4">Ringkasan</h3>
                        
                        <div className="space-y-3 mb-6 font-bold text-sm text-gray-700">
                             {selectedTickets.length === 0 ? (
                                 <p className="text-gray-400 italic">Belum ada tiket dipilih</p>
                             ) : (
                                selectedTickets.map(t => (
                                    <div key={t.id} className="flex justify-between border-b-2 border-dashed border-gray-300 pb-2">
                                        <span>{t.qty}x {t.name}</span>
                                        <span>{formatPrice(t.price * t.qty)}</span>
                                    </div>
                                ))
                             )}
                        </div>

                        {paymentSummary && step === 3 && (
                            <div className="bg-gray-100 p-3 mb-6 border-2 border-black">
                                <div className="flex justify-between text-xs font-bold mb-1">
                                    <span>Subtotal</span><span>{formatPrice(paymentSummary.total)}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold mb-1 text-gray-500">
                                    <span>Pajak/Admin</span><span>{formatPrice(paymentSummary.tax)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-black border-t-2 border-black mt-2 pt-1 text-blue-600">
                                    <span>TOTAL</span><span>{formatPrice(paymentSummary.grandTotal)}</span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {step === 1 && (
                                <button onClick={() => setStep(2)} disabled={!isCheckoutEnabled}
                                    className={`w-full py-3 font-black uppercase text-lg border-4 border-black transition-all ${
                                        isCheckoutEnabled 
                                        ? 'bg-black text-white shadow-[4px_4px_0px_0px_#facc15] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}>
                                    Lanjut Data ({totalTickets})
                                </button>
                            )}
                            {step === 2 && (
                                <div className="grid gap-3">
                                    <button onClick={calculatePayment} disabled={!isCheckoutEnabled}
                                        className={`w-full py-3 font-black uppercase text-lg border-4 border-black transition-all ${
                                            isCheckoutEnabled
                                            ? 'bg-[#3b82f6] text-white shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}>
                                        Lanjut Bayar
                                    </button>
                                    <button onClick={() => setStep(1)} className="w-full py-2 font-bold uppercase border-2 border-black hover:bg-gray-100">
                                        Kembali
                                    </button>
                                </div>
                            )}
                            {step === 3 && (
                                <div className="grid gap-3">
                                    <button onClick={createTransaction} disabled={!selectedPayment || isProcessing}
                                        className={`w-full py-3 font-black uppercase text-lg border-4 border-black transition-all ${
                                            selectedPayment && !isProcessing
                                            ? 'bg-[#ef4444] text-white shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}>
                                        {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
                                    </button>
                                    <button onClick={() => setStep(2)} className="w-full py-2 font-bold uppercase border-2 border-black hover:bg-gray-100">
                                        Kembali
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Secure Badge */}
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500 uppercase">
                        <FaExclamationTriangle className="text-yellow-600"/> Pastikan data sudah benar
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
}