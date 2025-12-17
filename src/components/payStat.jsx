import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaTimesCircle, FaMapMarkerAlt, FaCalendarAlt, FaCopy, FaTicketAlt, FaSync, FaArrowLeft } from 'react-icons/fa';

export default function PaymentStatus() {
  const { orderId } = useParams();
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.artatix.co.id/api/v1/customer/transaction/${orderId}`);
        if (!res.ok) throw new Error('Gagal memuat status');
        const data = await res.json();
        if (data.message === 'success') {
          setStatusData(data.data);
        } else {
          throw new Error('Data tidak valid');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchStatus();
  }, [orderId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrice = (price) => `Rp${parseInt(price).toLocaleString('id-ID')}`;
  const formatDate = (date) => new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getStatusConfig = (status) => {
    switch (status) {
      case 'paid':
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          // Responsive Icon Size
          icon: <FaCheckCircle className="w-12 h-12 md:w-16 md:h-16 text-green-500 mb-3 md:mb-4" />,
          title: 'Pembayaran Berhasil!',
          desc: 'Terima kasih! Tiket elektronik telah dikirim ke email Anda.'
        };
      case 'pending':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          icon: <FaClock className="w-12 h-12 md:w-16 md:h-16 text-amber-500 mb-3 md:mb-4 animate-pulse" />,
          title: 'Menunggu Pembayaran',
          desc: 'Selesaikan pembayaran sebelum batas waktu berakhir.'
        };
      case 'expired':
      case 'failed':
      case 'cancel':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          icon: <FaTimesCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mb-3 md:mb-4" />,
          title: 'Transaksi Gagal',
          desc: 'Maaf, transaksi ini telah dibatalkan atau kadaluarsa.'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          icon: <FaSync className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mb-3 md:mb-4" />,
          title: 'Status Tidak Diketahui',
          desc: 'Silakan hubungi admin.'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-medium text-sm md:text-base">Memverifikasi transaksi...</p>
      </div>
    );
  }

  if (error || !statusData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
          <div className="bg-red-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
             <FaTimesCircle className="text-red-500 text-2xl md:text-3xl" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p className="text-sm md:text-base text-gray-500 mb-6">{error || 'Data transaksi tidak ditemukan.'}</p>
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const theme = getStatusConfig(statusData.status);

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* === 1. HEADER STATUS (Responsive Padding & Text) === */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-6 md:mb-8 text-center p-6 md:p-12 relative">
          {/* Garis atas berwarna sesuai status */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 md:h-2 ${theme.bg.replace('bg-', 'bg-gradient-to-r from-white via-').replace('50', '400') + ' to-white'}`}></div>
          
          <div className="flex flex-col items-center relative z-10">
            {theme.icon}
            
            <h1 className={`text-2xl md:text-4xl font-extrabold mb-2 md:mb-3 ${theme.text}`}>
              {theme.title}
            </h1>
            
            <p className="text-gray-500 text-sm md:text-lg max-w-lg mx-auto leading-relaxed">
              {theme.desc}
            </p>
            
            {statusData.status === 'pending' && (
               <div className="mt-4 md:mt-6 bg-amber-50 border border-amber-200 px-3 py-2 md:px-4 rounded-lg inline-flex items-center gap-2 flex-wrap justify-center">
                 <span className="text-amber-800 text-xs md:text-sm font-semibold">Batas Waktu:</span>
                 <span className="text-amber-900 font-mono font-bold text-sm md:text-base">
                    {statusData.expiredAt ? formatDate(statusData.expiredAt) : '-'}
                 </span>
               </div>
            )}
          </div>
        </div>

        {/* === 2. GRID LAYOUT (1 Kolom di Mobile, 3 Kolom di Desktop) === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* --- KOLOM KIRI (Detail Transaksi) --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-base md:text-lg font-bold text-gray-800">Rincian Transaksi</h2>
                <div className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wide ${theme.bg} ${theme.text} border ${theme.border}`}>
                  {statusData.status}
                </div>
              </div>
              
              <div className="p-4 md:p-8 space-y-6">
                {/* Order ID - Stacked di Mobile Kecil, Row di layar lebar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 md:p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 gap-2 sm:gap-0">
                  <div>
                    <span className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider font-semibold">Order ID</span>
                    <p className="text-gray-900 font-mono font-bold text-base md:text-lg mt-0.5 md:mt-1 tracking-wide break-all">
                        {statusData.orderId}
                    </p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(statusData.orderId)}
                    className="self-end sm:self-auto text-xs md:text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 font-medium transition py-1 px-2 hover:bg-indigo-50 rounded"
                  >
                    <FaCopy /> {copied ? 'Tersalin!' : 'Salin'}
                  </button>
                </div>

                {/* Total Bayar */}
                <div className="space-y-3">
                   <div className="flex justify-between text-gray-600 text-sm md:text-base">
                      <span>Total Pesanan</span>
                      <span>{formatPrice(statusData.grandTotal)}</span> 
                   </div>
                   <div className="border-t border-gray-100 my-2"></div>
                   <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-bold text-base md:text-lg">Total Pembayaran</span>
                      <span className="text-xl md:text-2xl font-extrabold text-indigo-600">{formatPrice(statusData.grandTotal)}</span>
                   </div>
                </div>
              </div>
            </div>

            {/* BUTTONS ACTION (Stacked di Mobile) */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link to={`/event/${statusData.event?.widgetSlug}`} className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-bold text-center hover:bg-gray-50 transition shadow-sm text-sm md:text-base flex items-center justify-center gap-2">
                   <FaArrowLeft /> Kembali ke Event
                </Link>
                {statusData.status === 'pending' && (
                    <button onClick={() => window.location.reload()} className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold text-center hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 text-sm md:text-base flex items-center justify-center gap-2">
                       <FaSync className={loading ? "animate-spin" : ""}/> Cek Status Terbaru
                    </button>
                )}
            </div>
          </div>

          {/* --- KOLOM KANAN / SIDEBAR (Detail Event) --- */}
          <div className="lg:col-span-1">
            {/* Sticky hanya di layar besar (lg) */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden lg:sticky lg:top-8">
               
               {/* Header Gambar Event */}
               <div className="h-28 md:h-32 bg-gray-800 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-gray-900 opacity-90"></div>
                  <div className="absolute bottom-3 left-4 md:bottom-4 md:left-6 text-white pr-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-0.5">Event</p>
                      <h3 className="font-bold text-base md:text-xl leading-tight line-clamp-2">{statusData.event?.name}</h3>
                  </div>
               </div>

               <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                  {/* Info Lokasi & Waktu */}
                  <div className="space-y-3 text-xs md:text-sm">
                      <div className="flex items-start gap-3 text-gray-600">
                          <FaCalendarAlt className="mt-0.5 text-indigo-500 shrink-0" />
                          <div>
                              <p className="font-semibold text-gray-900">
                                {new Date(statusData.event?.dateStart).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})}
                              </p>
                              <p>{statusData.event?.timeStart} - {statusData.event?.timeEnd}</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3 text-gray-600">
                          <FaMapMarkerAlt className="mt-0.5 text-indigo-500 shrink-0" />
                          <div>
                              <p className="font-semibold text-gray-900">{statusData.event?.location}</p>
                              <p>{statusData.event?.city}</p>
                          </div>
                      </div>
                  </div>

                  <div className="border-t border-dashed border-gray-200"></div>

                  {/* List Tiket */}
                  <div>
                      <h4 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tiket Dibeli</h4>
                      <div className="space-y-2">
                          {statusData.tickets?.map((t, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                  <div className="flex items-center gap-2.5">
                                      <div className="bg-white p-1.5 rounded shadow-sm text-indigo-600">
                                        <FaTicketAlt size={12} />
                                      </div>
                                      <div>
                                          <p className="font-bold text-gray-800 text-xs md:text-sm line-clamp-1">{t.name}</p>
                                          <p className="text-[10px] text-gray-500">Tiket Masuk</p>
                                      </div>
                                  </div>
                                  <div className="bg-indigo-100 text-indigo-700 text-[10px] md:text-xs font-bold px-2 py-1 rounded">
                                      x{t.qty}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}