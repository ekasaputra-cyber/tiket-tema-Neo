import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaCopy, 
  FaTicketAlt, 
  FaSync, 
  FaArrowLeft,
  FaReceipt
} from 'react-icons/fa';

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

  // --- KONFIGURASI TEMA STATUS (NEO BRUTALISM) ---
  const getStatusConfig = (status) => {
    switch (status) {
      case 'paid':
      case 'success':
        return {
          bg: 'bg-green-100', // Warna background card
          border: 'border-black',
          text: 'text-green-800',
          icon: <FaCheckCircle className="text-6xl md:text-7xl text-green-600 mb-4 drop-shadow-[2px_2px_0_black]" />,
          title: 'PEMBAYARAN BERHASIL!',
          desc: 'Terima kasih! Tiket sudah aman. Cek email kamu sekarang ya.',
          accentColor: 'bg-green-500' // Untuk garis/hiasan
        };
      case 'pending':
        return {
          bg: 'bg-[#facc15]', // Kuning terang
          border: 'border-black',
          text: 'text-black',
          icon: <FaClock className="text-6xl md:text-7xl text-black mb-4 animate-pulse drop-shadow-[2px_2px_0_white]" />,
          title: 'MENUNGGU PEMBAYARAN',
          desc: 'Ayo segera bayar sebelum tiketmu diambil orang lain!',
          accentColor: 'bg-black'
        };
      case 'expired':
      case 'failed':
      case 'cancel':
        return {
          bg: 'bg-red-100',
          border: 'border-black',
          text: 'text-red-800',
          icon: <FaTimesCircle className="text-6xl md:text-7xl text-red-600 mb-4 drop-shadow-[2px_2px_0_black]" />,
          title: 'TRANSAKSI GAGAL',
          desc: 'Yah, transaksi batal atau kadaluarsa. Coba pesan ulang yuk!',
          accentColor: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-gray-100',
          border: 'border-black',
          text: 'text-gray-800',
          icon: <FaSync className="text-6xl md:text-7xl text-gray-500 mb-4" />,
          title: 'STATUS TIDAK DIKETAHUI',
          desc: 'Hmm, ada yang aneh. Coba hubungi admin ya.',
          accentColor: 'bg-gray-500'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffbeb]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-16 w-16 border-8 border-black border-t-[#facc15] rounded-full"></div>
          <p className="font-black text-xl uppercase tracking-widest">Memuat Transaksi...</p>
        </div>
      </div>
    );
  }

  if (error || !statusData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffbeb] px-4">
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-8 text-center max-w-md w-full">
          <FaTimesCircle className="text-6xl text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase mb-2">Terjadi Kesalahan</h2>
          <p className="font-bold text-gray-600 mb-6">{error || 'Data transaksi tidak ditemukan.'}</p>
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-black text-white font-black uppercase border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-all shadow-[4px_4px_0px_0px_#facc15]">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const theme = getStatusConfig(statusData.status);

  return (
    <div 
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900"
      style={{
        backgroundColor: '#fffbeb',
        backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)',
        backgroundSize: '24px 24px'
      }}
    >
      <div className="max-w-5xl mx-auto">
        
        {/* === 1. HEADER STATUS (Style Kartu Besar) === */}
        <div className={`relative border-4 border-black shadow-[10px_10px_0px_0px_black] mb-8 p-8 md:p-12 text-center overflow-hidden ${theme.bg}`}>
          {/* Dekorasi Garis Miring */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-black transform rotate-45 opacity-10"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-black transform rotate-45 opacity-10"></div>

          <div className="relative z-10 flex flex-col items-center">
            {theme.icon}
            
            <h1 className={`text-3xl md:text-5xl font-black uppercase tracking-tight mb-3 ${theme.text}`}>
              {theme.title}
            </h1>
            
            <p className="font-bold text-base md:text-xl max-w-lg mx-auto leading-relaxed border-2 border-black bg-white/80 p-2 inline-block transform -rotate-1">
              {theme.desc}
            </p>
            
            {statusData.status === 'pending' && (
               <div className="mt-6 bg-black text-[#facc15] border-2 border-white px-6 py-2 shadow-[4px_4px_0px_0px_white] inline-flex items-center gap-2">
                 <span className="text-sm md:text-base font-bold uppercase">Batas Waktu:</span>
                 <span className="font-mono font-black text-lg md:text-xl">
                    {statusData.expiredAt ? formatDate(statusData.expiredAt) : '-'}
                 </span>
               </div>
            )}
          </div>
        </div>

        {/* === 2. GRID LAYOUT === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- KOLOM KIRI (Detail Transaksi) --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black]">
              <div className="p-4 md:p-6 border-b-4 border-black flex justify-between items-center bg-gray-50">
                <h2 className="text-xl md:text-2xl font-black uppercase flex items-center gap-2">
                    <FaReceipt /> Rincian Transaksi
                </h2>
                <div className={`px-3 py-1 font-black uppercase text-xs md:text-sm border-2 border-black ${theme.bg} ${theme.text}`}>
                  {statusData.status}
                </div>
              </div>
              
              <div className="p-6 md:p-8 space-y-6">
                {/* Order ID */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#e0f2fe] border-2 border-black gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase text-gray-500 block mb-1">Order ID</span>
                    <p className="font-mono font-black text-lg md:text-xl tracking-wide break-all text-black">
                        {statusData.orderId}
                    </p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(statusData.orderId)}
                    className="self-end sm:self-auto text-xs md:text-sm bg-white border-2 border-black px-3 py-2 font-bold uppercase hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_black] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    <span className="flex items-center gap-2"><FaCopy /> {copied ? 'Tersalin!' : 'Salin'}</span>
                  </button>
                </div>

                {/* Total Bayar */}
                <div className="space-y-3">
                   <div className="flex justify-between text-gray-700 font-bold text-sm md:text-base border-b-2 border-dashed border-gray-300 pb-2">
                      <span>Total Pesanan</span>
                      <span>{formatPrice(statusData.grandTotal)}</span> 
                   </div>
                   <div className="flex justify-between items-center bg-black p-3 text-white">
                      <span className="font-black uppercase text-sm md:text-base">Total Pembayaran</span>
                      <span className="text-xl md:text-2xl font-black text-[#facc15]">{formatPrice(statusData.grandTotal)}</span>
                   </div>
                </div>
              </div>
            </div>

            {/* BUTTONS ACTION */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/event/${statusData.event?.widgetSlug}`} 
                    className="flex-1 py-3 px-4 border-4 border-black font-black uppercase text-center hover:bg-gray-100 transition shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] flex items-center justify-center gap-2 bg-white">
                   <FaArrowLeft /> Kembali ke Event
                </Link>
                {statusData.status === 'pending' && (
                    <button onClick={() => window.location.reload()} 
                        className="flex-1 py-3 px-4 border-4 border-black bg-[#3b82f6] text-white font-black uppercase text-center hover:bg-blue-700 transition shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] flex items-center justify-center gap-2">
                       <FaSync className={loading ? "animate-spin" : ""}/> Cek Status
                    </button>
                )}
            </div>
          </div>

          {/* --- KOLOM KANAN / SIDEBAR (Detail Event) --- */}
          <div className="lg:col-span-1">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] lg:sticky lg:top-8">
               
               {/* Header Gambar Event */}
          <div className="h-32 bg-gray-800 relative border-b-4 border-black bg-cover bg-center"
                  style={{ backgroundImage: statusData.event?.image 
                          ? `url(https://api.artatix.co.id/${statusData.event.image})` 
                          : 'none' 
                  }}
                >  
               <div className="absolute inset-0 bg-black opacity-50"></div>
                  <div className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black to-transparent">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#facc15] mb-0.5 bg-black inline-block px-1">Event</p>
                      <h3 className="font-black text-white text-lg md:text-xl leading-tight line-clamp-2 uppercase">{statusData.event?.name}</h3>
                  </div>
               </div>

               <div className="p-6 space-y-6">
                  {/* Info Lokasi & Waktu */}
                  <div className="space-y-4 text-sm font-medium">
                      <div className="flex items-start gap-3">
                          <div className="bg-black text-white p-1"><FaCalendarAlt /></div>
                          <div>
                              <p className="font-bold text-black uppercase">
                                {new Date(statusData.event?.dateStart).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})}
                              </p>
                              <p>{statusData.event?.timeStart} - {statusData.event?.timeEnd}</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-3">
                          <div className="bg-black text-white p-1"><FaMapMarkerAlt /></div>
                          <div>
                              <p className="font-bold text-black uppercase">{statusData.event?.location}</p>
                              <p>{statusData.event?.city}</p>
                          </div>
                      </div>
                  </div>

                  <div className="border-t-4 border-black"></div>

                  {/* List Tiket */}
                  <div>
                      <h4 className="text-xs font-black text-black uppercase tracking-wider mb-3 bg-[#facc15] inline-block px-2 border-2 border-black transform -rotate-1">Tiket Dibeli</h4>
                      <div className="space-y-3">
                          {statusData.tickets?.map((t, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 border-2 border-black shadow-[2px_2px_0px_0px_black]">
                                  <div className="flex items-center gap-3">
                                      <FaTicketAlt className="text-gray-400" />
                                      <div>
                                          <p className="font-black text-black text-sm uppercase line-clamp-1">{t.name}</p>
                                          <p className="text-[10px] text-gray-500 font-bold">TIKET MASUK</p>
                                      </div>
                                  </div>
                                  <div className="bg-black text-white text-xs font-black px-2 py-1">
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