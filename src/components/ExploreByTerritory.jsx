// src/components/ExploreByTerritory.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EventCard from './evnCard';

const TERRITORY_SLUG_TO_NAME = {
  'sumatera': 'SUMATERA',
  'jabodetabek': 'JABODETABEK',
  'jawa-barat': 'JAWA BARAT',
  'diy-jateng': 'DIY-JATENG',
  'jawa-timur': 'JAWA TIMUR',
  'kalimantan': 'KALIMANTAN',
  'sulawesi': 'SULAWESI',
  'indonesia-timur': 'INDONESIA TIMUR',
};

export default function ExploreByTerritory() {
  const { wilayah } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const territoryName = TERRITORY_SLUG_TO_NAME[wilayah] || wilayah?.toUpperCase();

  useEffect(() => {
    if (!territoryName) {
      setLoading(false);
      setError('Wilayah tidak dikenali');
      return;
    }

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const encoded = encodeURIComponent(territoryName);
        const res = await fetch(
          `https://api.artatix.co.id/api/v1/customer/event/territory?territory=${encoded}`
        );

        if (!res.ok) throw new Error('Gagal memuat event');
        const data = await res.json();
        if (data.message === 'success' && Array.isArray(data.data)) {
          setEvents(data.data);
        } else {
          throw new Error('Data tidak valid');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [wilayah]);

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

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Event di {territoryName}
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Memuat event...</p>
      ) : error ? (
        <p className="text-center text-red-600">⚠️ {error}</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-600">Tidak ada event ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              title={event.name}
              date={formatDate(event.dateStart)}
              location={`${event.city}, ${event.province}`}
              imageUrl={imageUrl(event.image)}
              lowestPrice={event.lowestPrice}
              dateEnd={event.dateEnd}
              timeEnd={event.timeEnd}
              slug={event.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}