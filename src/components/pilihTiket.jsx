import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PemesanForm from './form';
import TicketAttendeeForm from './tiketAtt';

export default function TicketAndCheckout() {
  const { widgetSlug } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  // Fetch event & tickets
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

  useEffect(() => {
    const total = selectedTickets.reduce((sum, t) => sum + t.qty, 0);
    if (total > 0 && total <= 5) {
      if (ticketForms.length !== total) {
        const newForms = Array(total).fill().map((_, i) => {
          return ticketForms[i] || { name: '', idType: '', idNumber: '', email: '', phone: '' };
        });
        setTicketForms(newForms);
      }
    } else if (total === 0) {
      setTicketForms([]);
      setPaymentSummary(null);
    }
  }, [selectedTickets, ticketForms]);

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const isCheckoutEnabled = totalTickets > 0 && totalTickets <= 5;

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price) => `Rp${parseInt(price).toLocaleString('id-ID')}`;

  const getFormIndex = (currentTicket, currentIdx, allTickets) => {
    let index = 0;
    for (const t of allTickets) {
      if (t.id === currentTicket.id) {
        return index + currentIdx;
      }
      index += t.qty;
    }
    return index;
  };

  const updateQuantity = (ticketId, newQty, maxPerTx) => {
    if (newQty < 0) return;
    const currentTotal = Object.values(quantities).reduce((a, b) => a + b, 0);
    const currentQty = quantities[ticketId] || 0;
    const diff = newQty - currentQty;

    if (newQty === 0) {
      setQuantities(p => {
        const updated = { ...p };
        delete updated[ticketId];
        return updated;
      });
      return;
    }

    if (currentTotal + diff > 5) {
      alert('Maksimal 5 tiket per transaksi.');
      return;
    }

    if (newQty > maxPerTx) {
      alert(`Maksimal ${maxPerTx} tiket untuk kategori ini.`);
      return;
    }

    setQuantities(p => ({ ...p, [ticketId]: newQty }));
  };

  const calculatePayment = async () => {
    if (!event || selectedTickets.length === 0 || !formData.email) {
      alert('Lengkapi data terlebih dahulu.');
      return;
    }

    const payload = {
      eventId: event.id,
      tickets: selectedTickets.map(t => ({ id: t.id, qty: t.qty })),
      email: formData.email
    };

    try {
      const res = await fetch('https://api.artatix.co.id/api/v1/customer/transaction/calculatetax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.message === 'success') {
        setPaymentSummary(result.data);
        setStep(3);
      } else {
        alert('Gagal menghitung: ' + (result.message || 'Coba lagi.'));
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Gagal menghubungi server pembayaran.');
    }
  };

  const createTransaction = async () => {
  if (!event || !selectedPayment || !paymentSummary) {
    alert('Data tidak lengkap.');
    return;
  }

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
    // console.log('📥 Respons dari API:', result);

    if (result.message === 'success' && result.data?.transaction?.invoiceUrl) {
        window.open(result.data.transaction.invoiceUrl, '_blank');
        window.location.href = `/payment/${result.data.transaction.orderId}`;
    } else {
      alert('Gagal membuat transaksi!\n' + (result.message || 'Cek console untuk detail.'));
    }
  } catch (err) {
    console.error('🔥 Error:', err);
    alert('Gagal koneksi ke server pembayaran.');
  }
};

  if (loading) return <div className="py-20 text-center">Memuat...</div>;
  if (error) return (
    <div className="py-20 text-center text-red-600">
      Error: {error}
      <br />
      <Link to={`/event/${widgetSlug}`} className="text-blue-600 hover:underline mt-4 inline-block">
        Kembali ke event
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* === PROGRESS BAR (3 LANGKAH) === */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}>
            1
          </div>
          <span className={step >= 1 ? 'text-gray-800' : 'text-gray-500'}>Pilih Tiket</span>
        </div>
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}>
            2
          </div>
          <span className={step >= 2 ? 'text-gray-800' : 'text-gray-500'}>Detail Pesanan</span>
        </div>
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}>
            3
          </div>
          <span className={step >= 3 ? 'text-gray-800' : 'text-gray-500'}>Pembayaran</span>
        </div>
      </div>

      {step === 1 && (
        // === STEP 1: PILIH TIKET ===
        <>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold">{event.name}</h1>
            <p className="text-gray-600 mt-1">
              {new Date(event.dateStart).toLocaleDateString('id-ID')} • {event.timeStart}
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {tickets.map((ticket) => {
              const qty = quantities[ticket.id] || 0;
              const isOnSale = ticket.status === 'On Sale';
              return (
                <div key={ticket.id} className={`border rounded-lg p-4 ${isOnSale ? 'bg-white' : 'bg-gray-50 opacity-80'}`}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{ticket.name}</h3>
                      {isOnSale && <p className="text-sm text-green-600">{formatPrice(ticket.price)}</p>}
                    </div>
                    {isOnSale ? (
                      qty === 0 ? (
                        <button
                          onClick={() => updateQuantity(ticket.id, 1, ticket.ticketPerTransaction || 5)}
                          className="px-4 py-1.5 bg-black text-white rounded hover:bg-gray-800"
                        >
                          Pilih
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(ticket.id, qty - 1, ticket.ticketPerTransaction || 5)}
                            disabled={qty <= 0}
                            className="w-8 h-8 bg-gray-200 rounded-full"
                          >
                            -
                          </button>
                          <span>{qty}</span>
                          <button
                            onClick={() => updateQuantity(ticket.id, qty + 1, ticket.ticketPerTransaction || 5)}
                            disabled={qty >= (ticket.ticketPerTransaction || 5)}
                            className="w-8 h-8 bg-gray-200 rounded-full"
                          >
                            +
                          </button>
                        </div>
                      )
                    ) : (
                      <span className="text-red-600 font-medium">Habis</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between">
            <Link to={`/event/${widgetSlug}`} className="text-blue-600 hover:underline">
              ← Kembali ke event
            </Link>
            <button
              onClick={() => setStep(2)}
              disabled={!isCheckoutEnabled}
              className={`px-6 py-2 rounded font-medium ${
                isCheckoutEnabled ? 'bg-black text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Lanjutkan
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Data Pemesan</h2>
              <PemesanForm formData={formData} setFormData={setFormData} />
            </div>

            {selectedTickets.flatMap(ticket =>
              Array.from({ length: ticket.qty }, (_, idx) => {
                const formIndex = getFormIndex(ticket, idx, selectedTickets);
                return (
                  <div key={`${ticket.id}-${idx}`} className="bg-white rounded-xl p-6 shadow">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">{ticket.name}</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const main = formData;
                          const newTicketData = {
                            name: main.namaLengkap,
                            idType: main.tipeIdentitas,
                            idNumber: main.nomorIdentitas,
                            email: main.email,
                            phone: main.noWa
                          };
                          setTicketForms(prev => {
                            const updated = [...prev];
                            updated[formIndex] = newTicketData;
                            return updated;
                          });
                        }}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Samakan dengan detail pemesan
                      </button>
                    </div>
                    <TicketAttendeeForm
                      index={formIndex}
                      ticketForms={ticketForms}
                      setTicketForms={setTicketForms}
                    />
                  </div>
                );
              })
            )}
          </div>

          <div className="bg-gray-50 sticky top-6 p-6 rounded-xl">
            <div className="bg-white p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Rincian Pesanan</h3>
              {selectedTickets.map(t => (
                <div key={t.id} className="flex justify-between text-sm mb-1">
                  <span>{t.name} x{t.qty}</span>
                  <span>{formatPrice(t.price * t.qty)}</span>
                </div>
              ))}
            </div>

            <div className="bg-yellow-100 p-3 rounded-lg text-center mb-4">
              <p className="text-sm text-yellow-800">Batas Waktu</p>
              <p className="text-xl font-bold text-yellow-800">{formatTime(timeLeft)}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setStep(1)}
                className="w-full py-2 border border-gray-300 rounded"
              >
                ← Kembali
              </button>
              <button
                onClick={calculatePayment}
                disabled={!isCheckoutEnabled}
                className={`w-full py-2 rounded font-medium ${
                  isCheckoutEnabled ? 'bg-black text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Hitung & Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && paymentSummary && (
        
        // === STEP 3: PEMBAYARAN ===
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Pilih Metode Pembayaran</h2>
              
              {event?.paymentMethod ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {/* E-Wallet */}
                  {Object.entries(event.paymentMethod.ewallet)
                    .filter(([_, v]) => v.isEnabled)
                    .map(([key, v]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedPayment({ type: 'ewallet', id: key })}
                        className={`p-3 rounded-lg border flex flex-col items-center ${
                          selectedPayment?.id === key
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={`https://api.artatix.co.id/${v.image}`}
                          alt={key}
                          className="h-10"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                        <span className="text-xs mt-1 text-gray-700 capitalize">{key}</span>
                      </button>
                    ))}

                  {/* Bank Transfer */}
                  {Object.entries(event.paymentMethod.bank)
                    .filter(([_, v]) => v.isEnabled)
                    .map(([key, v]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedPayment({ type: 'bank', id: key })}
                        className={`p-3 rounded-lg border flex flex-col items-center ${
                          selectedPayment?.id === key
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={`https://api.artatix.co.id/${v.image}`}
                          alt={key}
                          className="h-10"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                        <span className="text-xs mt-1 text-gray-700 capitalize">{key}</span>
                      </button>
                    ))}
                </div>
              ) : (
                <p className="text-gray-600">Metode pembayaran tidak tersedia.</p>
              )}
            </div>
          </div>

          {/* Sidebar: Rincian + Total */}
          <div className="bg-gray-50 sticky top-6 p-6 rounded-xl">
            <div className="bg-white p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Rincian Pesanan</h3>
              {selectedTickets.map(t => (
                <div key={t.id} className="flex justify-between text-sm mb-1">
                  <span>{t.name} x{t.qty}</span>
                  <span>{formatPrice(t.price * t.qty)}</span>
                </div>
              ))}
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h4 className="font-bold text-green-800 text-center mb-2">Total Pembayaran</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Harga Tiket</span>
                  <span>Rp{paymentSummary.total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak</span>
                  <span>Rp{paymentSummary.tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                  <span>Total Bayar</span>
                  <span className="text-lg">Rp{paymentSummary.grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-2 border border-gray-300 rounded mb-3"
            >
              ← Kembali
            </button>
            <button
              onClick={createTransaction}
              disabled={!selectedPayment}
              className={`w-full py-2 rounded font-medium ${
                selectedPayment ? 'bg-black text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}