// src/components/ExploreByTerritory.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// HAPUS FaMapMarkedAlt dari import di bawah ini
import { FaArrowLeft, FaSadTear } from "react-icons/fa";
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

  // --- 1. FETCH DATA ---
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
          setEvents([]); 
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [wilayah, territoryName]);

  // --- 2. LOGIKA TANGGAL (RANGE) ---
  const formatEventDate = (startStr, endStr) => {
    if (!startStr) return '-';
    const startDate = new Date(startStr);
    const endDate = endStr ? new Date(endStr) : null;
    const optionsFull = { day: 'numeric', month: 'long', year: 'numeric' };

    if (!endDate || startDate.toDateString() === endDate.toDateString()) {
      return startDate.toLocaleDateString('id-ID', optionsFull);
    }

    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startDay = startDate.getDate();

    if (startYear !== endYear) {
      return `${startDate.toLocaleDateString('id-ID', optionsFull)} - ${endDate.toLocaleDateString('id-ID', optionsFull)}`;
    }
    if (startMonth !== endMonth) {
      const startDayMonth = startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' });
      return `${startDayMonth} - ${endDate.toLocaleDateString('id-ID', optionsFull)}`;
    }
    return `${startDay} - ${endDate.toLocaleDateString('id-ID', optionsFull)}`;
  };

  const imageUrl = (path) => path ? `https://api.artatix.co.id/${path}` : null;

  return (
    <div 
      className="min-h-screen pb-20 font-sans text-gray-900"
      style={{
        backgroundColor: '#fffbeb',
        backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)',
        backgroundSize: '24px 24px'
      }}
    >
      
      {/* --- HEADER HERO SECTION --- */}
      <div className="relative w-full bg-black border-b-4 border-black pt-24 pb-12 mb-10 overflow-hidden">
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
         
         <div className="container mx-auto px-4 relative z-10 text-center">
             <div className="inline-block bg-[#facc15] border-2 border-black px-4 py-1 font-bold mb-4 transform -rotate-2 shadow-[4px_4px_0px_0px_white]">
                JELAJAH WILAYAH
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-[4px_4px_0_#ef4444]">
                {territoryName}
             </h1>
         </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Tombol Kembali */}
        <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-bold uppercase border-b-2 border-black hover:bg-black hover:text-white transition-all px-2 py-1">
                <FaArrowLeft /> Kembali ke Beranda
            </Link>
        </div>

        {/* --- CONTENT STATE --- */}
        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-white border-4 border-black h-[400px] animate-pulse relative">
                      <div className="h-48 bg-gray-200 border-b-4 border-black"></div>
                      <div className="p-4 space-y-3">
                          <div className="h-6 bg-gray-200 w-3/4"></div>
                          <div className="h-4 bg-gray-200 w-1/2"></div>
                          <div className="h-10 bg-gray-200 w-full mt-4"></div>
                      </div>
                  </div>
              ))}
           </div>
        ) : error ? (
           <div className="text-center py-20 bg-white border-4 border-black shadow-[8px_8px_0px_0px_black]">
               <h3 className="text-2xl font-black text-red-600 mb-2">ERROR TERJADI</h3>
               <p className="font-bold">{error}</p>
           </div>
        ) : events.length === 0 ? (
           <div className="text-center py-20 bg-white border-4 border-dashed border-black">
               <FaSadTear className="text-6xl mx-auto mb-4 text-gray-400" />
               <h3 className="text-2xl font-black uppercase mb-2">Belum Ada Event</h3>
               <p className="font-medium text-gray-600">
                   Sepertinya belum ada event seru di wilayah <span className="font-bold">{territoryName}</span> saat ini.
               </p>
               <Link to="/" className="mt-6 inline-block bg-black text-white px-6 py-3 font-bold uppercase shadow-[4px_4px_0px_0px_#facc15] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                   Cari Wilayah Lain
               </Link>
           </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {events.map((event) => (
               <div key={event.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                  <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_black] h-full">
                     <EventCard
                       key={event.id}
                       title={event.name}
                       date={formatEventDate(event.dateStart, event.dateEnd)}
                       location={`${event.city}, ${event.province}`}
                       imageUrl={imageUrl(event.image)}
                       lowestPrice={event.lowestPrice}
                       dateEnd={event.dateEnd}
                       timeEnd={event.timeEnd}
                       slug={event.slug}
                     />
                  </div>
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}