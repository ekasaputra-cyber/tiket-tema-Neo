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
  FaChevronDown
} from 'react-icons/fa';

export default function EventDetail() {
  const { widgetSlug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSkOpen, setIsSkOpen] = useState(true);

  // ✅ PERBAIKAN: Hapus spasi di URL
  const imageUrl = (path) => (path ? `https://api.artatix.co.id/${path}` : null);

  // ✅ PERBAIKAN: Handle date-only string dengan aman
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // ✅ PERBAIKAN: Tambahkan fallback harga
  const formatPrice = (price) => {
    if (!price || price === "0") return "Gratis";
    const num = parseInt(price, 10);
    return num ? `Rp${num.toLocaleString('id-ID')}` : "Harga tidak tersedia";
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        // ✅ PERBAIKAN: Hapus spasi di URL API
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

  // --- LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // --- ERROR ---
  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 max-w-md w-full">
          <p className="font-bold text-lg mb-2">⚠️ Terjadi Kesalahan</p>
          <p>{error || 'Event tidak ditemukan'}</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 md:pb-12">
      {/* === HERO SECTION === */}
      <div className="relative w-full min-h-[400px] md:h-[550px] overflow-hidden bg-black pb-24 md:pb-16">
        <div className="absolute inset-0">
          <img
            src={imageUrl(event.image) || "https://placehold.co/1200x600?text=Event+Background"}
            alt="Event Background"
            className="w-full h-full object-cover opacity-50 blur-xl scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-purple-950/60 to-black/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-28 md:pt-16 flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
          {/* Poster Desktop — STATIS, TANPA HOVER & TANPA BUTTON */}
          <div className="hidden md:block w-[480px] shrink-0">
            <img
              src={imageUrl(event.image)}
              alt={event.name}
              className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white/20"
              onError={(e) => (e.target.src = "https://placehold.co/480x270?text=No+Image&bg=1f2937&color=ffffff")}
            />
          </div>

          {/* Info Text */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left text-white mb-6 md:mb-10 w-full">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-indigo-200 hover:text-white mb-6 text-sm font-bold transition-all bg-white/5 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/10 hover:scale-105 hover:shadow-lg"
            >
              <FaArrowLeft className="text-xs" /> Kembali
            </Link>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent drop-shadow-lg">
              {event.name}
            </h1>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 mt-4">
              {[
                { icon: FaCalendarAlt, label: formatDate(event.dateStart), color: 'indigo' },
                { icon: FaClock, label: `${event.timeStart.slice(0, 5)} WIB`, color: 'blue' },
                { icon: FaMapMarkerAlt, label: event.city, color: 'red' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-md bg-${item.color}-500/10 backdrop-blur-md border border-${item.color}-500/20`}
                >
                  <item.icon className={`text-${item.color}-400`} />
                  {item.label}
                </div>
              ))}
            </div>

            {event.user?.name && (
              <p className="mt-6 text-sm text-gray-300 italic">
                Diselenggarakan oleh: <span className="font-semibold text-white">{event.user.name}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <div className="max-w-6xl mx-auto px-4 mt-8 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri */}
          <div className="lg:col-span-2 space-y-8">
            {/* Poster Mobile */}
            <div className="block md:hidden rounded-xl overflow-hidden shadow-lg -mt-24 mb-6 border-2 border-white relative z-20">
              <img
                src={imageUrl(event.image)}
                alt={event.name}
                className="w-full h-auto object-cover"
                onError={(e) => (e.target.src = "https://placehold.co/480x270?text=No+Image&bg=1f2937&color=ffffff")}
              />
            </div>

            {/* Deskripsi */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-indigo-600" /> Tentang Event
              </h2>
              <div
                className="text-gray-600 leading-relaxed text-sm md:text-base space-y-3"
                dangerouslySetInnerHTML={{ __html: event.description || "<p>Tidak ada deskripsi.</p>" }}
              />
            </div>

            {/* Syarat & Ketentuan */}
            {event.sk && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 transition-all duration-300">
                <button
                  onClick={() => setIsSkOpen(!isSkOpen)}
                  className="w-full flex justify-between items-center text-left focus:outline-none group"
                >
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    Syarat & Ketentuan
                  </h2>
                  <div className={`p-2 rounded-full bg-gray-50 group-hover:bg-indigo-50 transition-colors`}>
                    <FaChevronDown
                      className={`text-gray-500 group-hover:text-indigo-600 transition-transform duration-300 ${
                        isSkOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isSkOpen
                      ? 'max-h-[3000px] opacity-100 mt-4 pt-4 border-t border-gray-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div
                    className="text-gray-600 text-sm space-y-2"
                    dangerouslySetInnerHTML={{ __html: event.sk }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Kanan */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Card Pembelian */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hidden lg:block">
                <div className="mb-4">
                  <p className="text-gray-500 text-sm mb-1">Harga Mulai Dari</p>
                  <p className="text-3xl font-bold text-indigo-600">{formatPrice(event.lowestPrice)}</p>
                </div>
                <Link
                  to={`/event/${widgetSlug}/ticket`}
                  className="block w-full bg-gray-900 hover:bg-black text-white text-center py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  Beli Tiket Sekarang
                </Link>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <FaTicketAlt /> Transaksi Aman & Terpercaya
                </div>
              </div>

              {/* Layout Venue (jika ada) */}
              {event.eventLayoutVenue?.layout && (
                <div
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 group cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  <h3 className="font-bold text-gray-800 mb-3 flex justify-between items-center">
                    Layout Venue <FaExpand className="text-gray-400 group-hover:text-indigo-600 transition" />
                  </h3>
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 h-40">
                    <img
                      src={imageUrl(event.eventLayoutVenue.layout)}
                      alt="Venue Layout"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-800 transition-opacity shadow-sm">
                        Lihat Detail
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Metode Pembayaran */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">
                  Metode Pembayaran
                </h3>
                <div className="flex flex-wrap gap-3">
                  {event.paymentMethod?.ewallet &&
                    Object.entries(event.paymentMethod.ewallet)
                      .filter(([_, v]) => v.isEnabled)
                      .map(([key, v]) => (
                        <div
                          key={key}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center justify-center w-14 h-10"
                          title={key}
                        >
                          <img
                            src={imageUrl(v.image)}
                            alt={key}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => (e.target.style.display = 'none')}
                          />
                        </div>
                      ))}
                  {event.paymentMethod?.bank &&
                    Object.entries(event.paymentMethod.bank)
                      .filter(([_, v]) => v.isEnabled)
                      .map(([key, v]) => (
                        <div
                          key={key}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center justify-center w-14 h-10"
                          title={key}
                        >
                          <img
                            src={imageUrl(v.image)}
                            alt={key}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => (e.target.style.display = 'none')}
                          />
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === MOBILE CTA BAR === */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:hidden z-40 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Mulai dari</p>
          <p className="text-xl font-bold text-indigo-600">{formatPrice(event.lowestPrice)}</p>
        </div>
        <Link
          to={`/event/${widgetSlug}/ticket`}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          Beli Tiket
        </Link>
      </div>

      {/* === MODAL IMAGE === */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative w-full max-w-5xl max-h-[90vh]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition text-2xl"
            >
              <FaTimes />
            </button>
            <div className="bg-transparent flex justify-center items-center h-full">
              <img
                src={imageUrl(event.eventLayoutVenue?.layout)}
                alt="Layout Venue Full"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onError={(e) => (e.target.style.display = 'none')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}