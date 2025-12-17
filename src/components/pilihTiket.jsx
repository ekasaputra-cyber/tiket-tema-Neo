import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaCheck, FaArrowLeft, FaTicketAlt } from 'react-icons/fa'; 
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

  // --- LOGIC CREATE TRANSACTION YANG SUDAH DIPERBAIKI ---
  const createTransaction = async () => {
    if (!event || !selectedPayment || !paymentSummary) {
      alert('Data tidak lengkap.');
      return;
    }

    setIsProcessing(true); // Aktifkan loading state tombol

    // Helper format phone
    const formatPhone = (phone) => {
      if (!phone) return '6280000000000';
      let p = phone.replace(/\D/g, '');
      if (p.startsWith('0')) p = `62${p.slice(1)}`;
      else if (!p.startsWith('62')) p = `62${p}`;
      return p;
    };

    // Helper map ID type
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
          // Sukses! Hapus data dari Local Storage
          localStorage.removeItem(STORAGE_KEY);
          
          // Buka Invoice
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 font-sans text-gray-800">
      
      {/* HEADER BACKGROUND ACCENT */}
      <div className="h-48 bg-gradient-to-r from-gray-900 to-gray-800 absolute top-0 left-0 right-0 z-0 shadow-lg"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 pt-10">
        
        {/* === STEPPER MODERN === */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            {[
              { id: 1, label: 'Tiket' }, 
              { id: 2, label: 'Data Diri' }, 
              { id: 3, label: 'Bayar' }
            ].map((s, idx) => (
              <div key={s.id} className="flex-1 flex flex-col items-center relative">
                {/* Line connector */}
                {idx !== 0 && (
                  <div className={`absolute top-4 right-[50%] w-full h-[2px] -z-10 ${step >= s.id ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                )}
                
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold transition-all duration-500 ${
                  step >= s.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.id ? <FaCheck /> : s.id}
                </div>
                <span className={`mt-2 text-xs md:text-sm font-medium tracking-wide ${step >= s.id ? 'text-indigo-900' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          /* === STEP 1: PILIH TIKET === */
          <div className="animate-fade-in-up">
            {/* Event Header Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
                <div className="p-6 md:p-10">
                    <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                        Event Mendatang
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{event.name}</h1>
                    <div className="flex flex-wrap gap-4 text-gray-600 font-medium">
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                            <FaCalendarAlt className="text-indigo-500"/> 
                            {new Date(event.dateStart).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                            <FaClock className="text-indigo-500"/> {event.timeStart}
                        </div>
                    </div>
                </div>
            </div>

            {/* Ticket List */}
            <div className="grid gap-5">
              {tickets.map((ticket) => {
                const qty = quantities[ticket.id] || 0;
                const isOnSale = ticket.status === 'On Sale';
                const maxLimit = ticket.ticketPerTransaction || 5;
                const isMaxReached = qty >= maxLimit;

                return (
                  <div key={ticket.id} 
                       className={`group relative bg-white rounded-2xl p-6 transition-all duration-300 border ${
                         isOnSale ? 'border-gray-100 hover:border-indigo-100 hover:shadow-lg' : 'border-gray-100 bg-gray-50 opacity-75'
                       }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      {/* Ticket Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <FaTicketAlt className="text-gray-300 group-hover:text-indigo-400 transition-colors" size={20}/>
                            <h3 className="text-xl font-bold text-gray-800">{ticket.name}</h3>
                        </div>
                        <div className="text-sm text-gray-500 mb-2 pl-8 line-clamp-2">{ticket.description || "Tiket masuk reguler"}</div>
                        {isOnSale ? (
                             <p className="text-xl font-bold text-indigo-600 pl-8">{formatPrice(ticket.price)}</p>
                        ) : (
                             <span className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-bold ml-8">Sold Out</span>
                        )}
                      </div>

                      {/* Controls */}
                      {isOnSale && (
                        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl self-start md:self-center">
                          <button
                            onClick={() => updateQuantity(ticket.id, qty - 1, maxLimit)}
                            disabled={qty <= 0}
                            className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all text-lg font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-lg text-gray-800">{qty}</span>
                          <button
                            onClick={() => updateQuantity(ticket.id, qty + 1, maxLimit)}
                            disabled={isMaxReached}
                            className={`w-10 h-10 rounded-lg shadow-sm border flex items-center justify-center transition-all text-lg font-bold ${
                                isMaxReached 
                                ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' 
                                : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
                            }`}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:static md:bg-transparent md:border-0 md:shadow-none md:mt-8 z-50">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <Link to={`/event/${widgetSlug}`} className="text-gray-500 hover:text-gray-800 font-medium flex items-center gap-2 transition-colors">
                        <FaArrowLeft /> Kembali
                    </Link>
                    <button
                        onClick={() => setStep(2)}
                        disabled={!isCheckoutEnabled}
                        className={`px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
                        isCheckoutEnabled 
                            ? 'bg-gray-900 text-white hover:bg-black hover:shadow-xl' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                        }`}
                    >
                        Lanjut Pesan ({totalTickets})
                    </button>
                </div>
            </div>
          </div>
        )}

        {step === 2 && (
          /* === STEP 2: FORM DATA === */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Card Data Pemesan */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1 h-8 bg-indigo-500 rounded-full block"></span>
                    Data Pemesan
                </h2>
                <PemesanForm formData={formData} setFormData={setFormData} />
              </div>

              {/* Form Pengunjung per Tiket */}
              {selectedTickets.flatMap(ticket =>
                Array.from({ length: ticket.qty }, (_, idx) => {
                  const formIndex = getFormIndex(ticket, idx, selectedTickets);
                  return (
                    <div key={`${ticket.id}-${idx}`} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gray-200"></div>
                      <div className="flex justify-between items-center mb-6 pl-4">
                        <h3 className="text-lg font-bold text-gray-800">{ticket.name} <span className="text-gray-400 text-sm font-normal">#{idx + 1}</span></h3>
                        <button
                          type="button"
                          onClick={() => {
                            const main = formData;
                            const newTicketData = { name: main.namaLengkap, idType: main.tipeIdentitas, idNumber: main.nomorIdentitas, email: main.email, phone: main.noWa };
                            setTicketForms(prev => { const u = [...prev]; u[formIndex] = newTicketData; return u; });
                          }}
                          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Salin Data Pemesan
                        </button>
                      </div>
                      <div className="pl-4">
                        <TicketAttendeeForm index={formIndex} ticketForms={ticketForms} setTicketForms={setTicketForms} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sidebar Sticky */}
            <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-4">
                    {/* Timer Card */}
                    <div className="bg-gradient-to-r from-amber-100 to-orange-50 p-4 rounded-xl border border-amber-100 flex items-center justify-between shadow-sm">
                        <span className="text-amber-800 font-medium text-sm">Selesaikan dalam:</span>
                        <span className="text-xl font-black text-amber-600 font-mono tracking-widest">{formatTime(timeLeft)}</span>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b border-dashed border-gray-200">Ringkasan Pesanan</h3>
                        <div className="space-y-3 mb-6">
                            {selectedTickets.map(t => (
                                <div key={t.id} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{t.qty}x <span className="font-medium text-gray-800">{t.name}</span></span>
                                    <span className="font-semibold text-gray-900">{formatPrice(t.price * t.qty)}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="space-y-3">
                            <button onClick={calculatePayment} disabled={!isCheckoutEnabled}
                                className={`w-full py-3.5 rounded-xl font-bold shadow-lg transition-all ${
                                    isCheckoutEnabled ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}>
                                Lanjut Pembayaran
                            </button>
                            <button onClick={() => setStep(1)} className="w-full py-3 rounded-xl font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {step === 3 && paymentSummary && (
          /* === STEP 3: PAYMENT === */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pilih Metode Pembayaran</h2>
                
                {event?.paymentMethod ? (
                  <div className="space-y-6">
                    {/* Section Label E-Wallet */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">E-Wallet</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Object.entries(event.paymentMethod.ewallet).filter(([_, v]) => v.isEnabled).map(([key, v]) => (
                            <button key={key} onClick={() => setSelectedPayment({ type: 'ewallet', id: key })}
                                className={`relative p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-300 h-28 group ${
                                selectedPayment?.id === key 
                                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-600' 
                                    : 'border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md'
                                }`}>
                                {selectedPayment?.id === key && <div className="absolute top-2 right-2 text-indigo-600"><FaCheck /></div>}
                                <img src={`https://api.artatix.co.id/${v.image}`} alt={key} className="h-8 object-contain group-hover:scale-110 transition-transform" onError={(e) => (e.target.style.display = 'none')} />
                                <span className="text-xs font-semibold text-gray-600 capitalize">{key}</span>
                            </button>
                        ))}
                        </div>
                    </div>

                    {/* Section Label Bank */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 mt-6">Transfer Bank</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Object.entries(event.paymentMethod.bank).filter(([_, v]) => v.isEnabled).map(([key, v]) => (
                            <button key={key} onClick={() => setSelectedPayment({ type: 'bank', id: key })}
                                className={`relative p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-300 h-28 group ${
                                selectedPayment?.id === key 
                                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-600' 
                                    : 'border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md'
                                }`}>
                                {selectedPayment?.id === key && <div className="absolute top-2 right-2 text-indigo-600"><FaCheck /></div>}
                                <img src={`https://api.artatix.co.id/${v.image}`} alt={key} className="h-8 object-contain group-hover:scale-110 transition-transform" onError={(e) => (e.target.style.display = 'none')} />
                                <span className="text-xs font-semibold text-gray-600 capitalize">{key}</span>
                            </button>
                        ))}
                        </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Metode pembayaran tidak tersedia.</p>
                )}
              </div>
            </div>

            {/* Sidebar Payment Summary */}
            <div className="lg:col-span-1">
                <div className="sticky top-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Total Tagihan</h3>
                    
                    <div className="space-y-3 mb-6 pb-6 border-b border-dashed border-gray-200">
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span>Subtotal Tiket</span>
                            <span>Rp{paymentSummary.total.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span>Biaya Layanan/Pajak</span>
                            <span>Rp{paymentSummary.tax.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-8">
                        <span className="text-gray-500 font-medium">Total Bayar</span>
                        <span className="text-2xl font-extrabold text-indigo-600">Rp{paymentSummary.grandTotal.toLocaleString('id-ID')}</span>
                    </div>

                    <button 
                        onClick={createTransaction} 
                        disabled={!selectedPayment || isProcessing}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center ${
                            selectedPayment && !isProcessing
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-300 transform hover:-translate-y-1' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {isProcessing ? (
                            <span className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Memproses...
                            </span>
                        ) : 'Bayar Sekarang'}
                    </button>
                    <button onClick={() => setStep(2)} className="w-full mt-3 py-3 text-gray-500 font-semibold hover:text-gray-800 transition-colors">
                        Kembali
                    </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}