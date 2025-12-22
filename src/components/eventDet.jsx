// src/components/EventDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaInfoCircle,
  FaTicketAlt,
  FaArrowLeft,
  FaTimes,
  FaExpand,
  FaChevronDown,
  FaWallet
} from 'react-icons/fa';

export default function EventDetail() {
  const { widgetSlug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSkOpen, setIsSkOpen] = useState(true);

  // --- HELPERS ---
  const imageUrl = (path) => (path ? `https://api.artatix.co.id/${path}` : null);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price || price === "0") return "GRATIS";
    const num = parseInt(price, 10);
    return num ? `Rp${num.toLocaleString('id-ID')}` : "Harga tidak tersedia";
  };

  // --- FETCHING ---
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.artatix.co.id/api/v1/customer/event/${widgetSlug}`);
        if (!res.ok) throw new Error('Event tidak ditemukan');
        const data = await res.json();
        if (data.message === 'success') {
          setEvent(data.data);
          document.title = `${data.data.name} | Artatix`;
        } else {
          throw new Error('Gagal memuat data event');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (widgetSlug) fetchEvent();
  }, [widgetSlug]);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffbeb]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-16 w-16 border-8 border-black border-t-[#facc15] rounded-full"></div>
          <p className="font-black text-xl uppercase tracking-widest">Memuat Event...</p>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#fffbeb]">
        <div className="bg-white text-black p-8 border-4 border-black shadow-[8px_8px_0px_0px_black] max-w-md w-full">
          <h2 className="font-black text-3xl mb-4 bg-red-500 text-white inline-block px-2 transform -rotate-2">ERROR</h2>
          <p className="font-bold text-lg mb-6">{error || 'Event tidak ditemukan'}</p>
          <Link
            to="/"
            className="inline-block bg-black text-white px-8 py-3 font-bold border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
          >
            KEMBALI KE BERANDA
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffbeb] font-sans pb-24 md:pb-12">
      
      {/* === HERO SECTION (Brutalist Style) === */}
      <div className="relative w-full bg-black border-b-4 border-black overflow-hidden pb-12">
        {/* Pattern Background Overlay */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-16 flex flex-col md:flex-row items-start md:items-end gap-8 md:gap-12">
          
          {/* Poster Desktop */}
          <div className="hidden md:block w-[400px] shrink-0 relative group">
             {/* Decorative Box Behind */}
            <div className="absolute inset-0 bg-[#facc15] transform translate-x-4 translate-y-4 border-4 border-black"></div>
            <img
              src={imageUrl(event.image)}
              alt={event.name}
              className="relative w-full h-auto border-4 border-black z-10 bg-white"
              onError={(e) => (e.target.src = "https://placehold.co/480x270?text=No+Image")}
            />
          </div>

          {/* Info Header */}
          <div className="flex-1 flex flex-col items-start w-full mb-8">
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 bg-white text-black px-4 py-2 font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_white] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <FaArrowLeft /> Kembali
            </Link>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-none uppercase tracking-tighter mb-6 drop-shadow-[4px_4px_0_#000]">
              {event.name}
            </h1>

            {/* Info Badges */}
            <div className="flex flex-wrap gap-4 w-full">
              {[
                { icon: FaCalendarAlt, label: formatDate(event.dateStart), bg: 'bg-[#facc15]' },
                { icon: FaClock, label: `${event.timeStart.slice(0, 5)} WIB`, bg: 'bg-[#bfdbfe]' },
                { icon: FaMapMarkerAlt, label: event.city, bg: 'bg-[#ffadad]' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-4 py-2 font-bold text-black border-2 border-black shadow-[4px_4px_0px_0px_white] ${item.bg}`}
                >
                  <item.icon className="text-black" />
                  <span className="uppercase">{item.label}</span>
                </div>
              ))}
            </div>

            {event.user?.name && (
              <div className="mt-8 flex items-center gap-2 bg-black border-2 border-white px-4 py-2 rounded-full">
                 <span className="text-white text-xs uppercase font-bold tracking-widest">Organizer:</span>
                 <span className="text-[#facc15] font-black uppercase">{event.user.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 md:mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI (Content) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Poster Mobile (Muncul hanya di HP) */}
            <div className="block md:hidden -mt-20 mb-6 relative">
               <div className="absolute inset-0 bg-black transform translate-x-2 translate-y-2"></div>
               <img
                src={imageUrl(event.image)}
                alt={event.name}
                className="relative w-full h-auto border-4 border-black bg-white"
                onError={(e) => (e.target.src = "https://placehold.co/480x270?text=No+Image")}
              />
            </div>

            {/* Deskripsi */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-6 md:p-8">
              <h2 className="text-2xl font-black text-black mb-6 uppercase inline-flex items-center gap-3 border-b-4 border-black pb-2">
                <FaInfoCircle /> Tentang Event
              </h2>
              <div
                className="text-gray-800 leading-relaxed text-base space-y-4 font-medium"
                dangerouslySetInnerHTML={{ __html: event.description || "<p>Tidak ada deskripsi.</p>" }}
              />
            </div>

            {/* Syarat & Ketentuan Accordion */}
            {event.sk && (
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-0 overflow-hidden">
                <button
                  onClick={() => setIsSkOpen(!isSkOpen)}
                  className="w-full flex justify-between items-center p-6 md:p-8 bg-black text-white hover:bg-gray-900 transition-colors text-left"
                >
                  <h2 className="text-xl md:text-2xl font-black uppercase flex items-center gap-2">
                    Syarat & Ketentuan
                  </h2>
                  <div className={`p-1 bg-white border-2 border-black text-black transition-transform duration-300 ${isSkOpen ? 'rotate-180' : ''}`}>
                    <FaChevronDown />
                  </div>
                </button>

                <div
                  className={`transition-all duration-500 ease-in-out bg-white ${
                    isSkOpen ? 'max-h-[3000px] border-t-4 border-black' : 'max-h-0'
                  }`}
                >
                  <div className="p-6 md:p-8 text-gray-800 font-medium">
                     <div dangerouslySetInnerHTML={{ __html: event.sk }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR KANAN */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              
              {/* Card Beli Tiket */}
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-6 hidden lg:block relative overflow-hidden">
                {/* Decoration Tape */}
                <div className="absolute top-3 right-[-30px] bg-red-500 text-white text-xs font-bold py-1 px-10 rotate-45 border-y-2 border-black shadow-sm">
                   HOT
                </div>

                <div className="mb-6 text-center border-b-2 border-dashed border-black pb-4">
                  <p className="text-black font-bold text-sm uppercase mb-1">Harga Mulai</p>
                  <p className="text-4xl font-black text-black tracking-tighter">{formatPrice(event.lowestPrice)}</p>
                </div>
                
                <Link
                  to={`/event/${widgetSlug}/ticket`}
                  className="group block w-full bg-[#facc15] border-2 border-black text-black text-center py-4 text-xl font-black uppercase shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
                >
                  Beli Tiket <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                </Link>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-gray-500 uppercase">
                  <FaTicketAlt /> Secured by Artatix
                </div>
              </div>

              {/* Layout Venue */}
              {event.eventLayoutVenue?.layout && (
                <div
                  className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-4 cursor-pointer group hover:bg-gray-50 transition-colors"
                  onClick={() => setIsModalOpen(true)}
                >
                  <h3 className="font-black text-black uppercase mb-3 flex justify-between items-center border-b-2 border-black pb-2">
                    Layout Venue <FaExpand />
                  </h3>
                  <div className="relative border-2 border-black h-40 bg-gray-200 overflow-hidden">
                    <img
                      src={imageUrl(event.eventLayoutVenue.layout)}
                      alt="Venue Layout"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                       <span className="bg-white border-2 border-black px-3 py-1 font-bold text-xs uppercase shadow-[2px_2px_0px_0px_black]">Zoom</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Metode Pembayaran */}
              <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_black] p-6">
                <h3 className="font-black text-black uppercase mb-4 text-sm flex items-center gap-2">
                   <FaWallet /> Pembayaran
                </h3>
                <div className="flex flex-wrap gap-2">
                   {/* UPDATE: Grayscale dihapus agar selalu berwarna */}
                   {[
                      ...(event.paymentMethod?.ewallet ? Object.entries(event.paymentMethod.ewallet) : []),
                      ...(event.paymentMethod?.bank ? Object.entries(event.paymentMethod.bank) : [])
                   ].filter(([_, v]) => v.isEnabled).map(([key, v]) => (
                      <div 
                        key={key} 
                        className="w-14 h-10 p-1 bg-white flex items-center justify-center hover:scale-110 transition-transform duration-200" 
                        title={key}
                      >
                         <img src={imageUrl(v.image)} alt={key} className="max-w-full max-h-full object-contain" onError={(e)=>e.target.style.display='none'} />
                      </div>
                   ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* === MOBILE CTA BAR (Sticky Bottom) === */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black p-4 z-40 flex items-center justify-between lg:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase">Mulai dari</p>
          <p className="text-2xl font-black text-black">{formatPrice(event.lowestPrice)}</p>
        </div>
        <Link
          to={`/event/${widgetSlug}/ticket`}
          className="bg-[#facc15] border-2 border-black text-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          BELI TIKET
        </Link>
      </div>

      {/* === MODAL IMAGE === */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-white border-4 border-black shadow-[10px_10px_0px_0px_white] p-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
              className="absolute -top-6 -right-6 bg-red-600 text-white w-12 h-12 flex items-center justify-center border-2 border-black font-bold text-xl shadow-[4px_4px_0px_0px_black] hover:scale-110 transition-transform z-50"
            >
              <FaTimes />
            </button>
            <div className="flex justify-center items-center h-full bg-gray-100 border-2 border-black overflow-hidden">
              <img
                src={imageUrl(event.eventLayoutVenue?.layout)}
                alt="Layout Venue Full"
                className="max-w-full max-h-[80vh] object-contain"
                onError={(e) => (e.target.style.display = 'none')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}