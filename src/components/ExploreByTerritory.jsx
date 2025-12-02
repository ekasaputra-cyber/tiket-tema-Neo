import React, { useState, useEffect } from 'react';
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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [territoryName, setTerritoryName] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('wilayah');

    if (slug && TERRITORY_SLUG_TO_NAME[slug]) {
      const name = TERRITORY_SLUG_TO_NAME[slug];
      setTerritoryName(name);
      fetchEvents(name);
    } else {
      setLoading(false);
      setError('Wilayah tidak dikenali');
    }
  }, []);

  const fetchEvents = async (territory) => {
    try {
      setLoading(true);
      const encoded = encodeURIComponent(territory);
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

  const imageUrl = (path) => {
    return path ? `https://assets.artatix.co.id/${path}` : null;
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
              date={`${new Date(event.dateStart).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}`}
              location={`${event.city}, ${event.province}`}
              imageUrl={imageUrl(event.image)}
              lowestPrice={event.lowestPrice}
              dateEnd={event.dateEnd}
              timeEnd={event.timeEnd}
            />
          ))}
        </div>
      )}
    </div>
  );
}