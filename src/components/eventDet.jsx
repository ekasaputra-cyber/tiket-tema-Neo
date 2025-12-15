// src/components/EventDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function EventDetail() {
  const { widgetSlug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.artatix.co.id/api/v1/customer/event/${widgetSlug}`);
        if (!res.ok) throw new Error('Event tidak ditemukan');
        const data = await res.json();
        if (data.message === 'success') {
          setEvent(data.data);
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

  const imageUrl = (path) => {
    return path ? `https://api.artatix.co.id/${path}` : null;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr) => timeStr.slice(0, 5);
  const formatPrice = (price) => `Rp${parseInt(price).toLocaleString('id-ID')}`;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return <div className="py-20 text-center"><p className="text-gray-600">Memuat detail event...</p></div>;
  }

  if (error || !event) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-600">⚠️ {error || 'Event tidak ditemukan'}</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Kembali ke beranda</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Poster Event */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <img
          src={imageUrl(event.image)}
          alt={event.name}
          className="w-full h-auto"
          onError={(e) => {
            e.target.src = "https://placehold.co/1200x600/eee/999?text=Event+Poster";
          }}
        />
      </div>

      {/* Info Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.name}</h1>
          <div className="flex flex-wrap gap-4 mb-6 text-md text-gray-600">
            <div>🗓️ {formatDate(event.dateStart)}</div>
            <div>⏰ {formatTime(event.timeStart)} – {formatTime(event.timeEnd)}</div>
            <div>📍 {event.location}, {event.city}</div>
          </div>

          {/* Deskripsi */}
          {event.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Tentang Event</h2>
              <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: event.description }} />
            </div>
          )}

          {/* Syarat & Ketentuan */}
          {event.sk && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Syarat & Ketentuan</h2>
              <div className="prose prose-gray max-w-none text-gray-700 border-t border-gray-200 pt-4" dangerouslySetInnerHTML={{ __html: event.sk }} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="bg-gray-50 rounded-xl p-6 sticky top-6">
          {/* Layout Venue */}
          {event.eventLayoutVenue?.layout && (
            <img
              src={imageUrl(event.eventLayoutVenue.layout)}
              alt="Layout Venue"
              className="max-w-full h-auto rounded-lg cursor-pointer mb-4"
              onClick={openModal}
            />
          )}

          <div className="text-center mb-6">
            <p className="text-gray-600">Harga Tiket Mulai Dari</p>
            <p className="text-2xl font-bold text-green-600">{formatPrice(event.lowestPrice)}</p>
          </div>

          {/* ✅ Arahkan ke halaman tiket */}
          <Link
            to={`/event/${widgetSlug}/ticket`}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition mb-4 block text-center"
          >
            Pilih Tiket
          </Link>

          {/* Metode Pembayaran */}
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Metode Pembayaran</h3>
            <div className="flex flex-wrap gap-2">
              {event.paymentMethod?.ewallet &&
                Object.entries(event.paymentMethod.ewallet)
                  .filter(([_, v]) => v.isEnabled)
                  .map(([key, v]) => (
                    <img
                      key={key}
                      src={imageUrl(v.image)}
                      alt={key}
                      className="h-8"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Layout Venue */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-xl font-bold">Layout Venue</h3>
              <button onClick={closeModal} className="text-2xl">×</button>
            </div>
            <div className="p-4 flex-1 flex items-center justify-center min-h-0 overflow-hidden">
              <img
                src={imageUrl(event.eventLayoutVenue?.layout)}
                alt="Layout Venue"
                className="max-w-full max-h-[75vh] object-contain"
                onError={(e) => {
                  e.target.src = "https://placehold.co/1200x800/eee/999?text=Gambar+Tidak+Ditemukan";
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}