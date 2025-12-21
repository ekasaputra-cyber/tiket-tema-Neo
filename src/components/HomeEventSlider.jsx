import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowForward } from "react-icons/md";
import HomeCard from './CardHome';

export default function EventSlider() {
  // --- STATE MANAGEMENT ---
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- CONFIG ---
  const STORAGE_URL = 'https://api.artatix.co.id/';
  const SEE_ALL_LINK = '/events'; 

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.artatix.co.id/api/v1/customer/event?page=1`);
        const json = await response.json();
        
        if (json?.data?.data) {
          setEvents(json.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // --- HELPER ---
  const formatDateIndo = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto max-w-6xl my-8">
      {/* --- HEADER SECTION --- */}
      <div className="flex justify-between items-center mb-6 px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Event Terdekat
        </h1>
        
        <Link 
            to={SEE_ALL_LINK} 
            state={{ startPage: 2, autoScroll: true }} 
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center group"
        >
            Lihat Semua
            <span className="ml-1 transition-transform group-hover:translate-x-1">
                <MdArrowForward size={20} />
            </span>
        </Link>
      </div>

      {/* --- LOADING STATE --- */}
      {loading && (
         <div className="flex space-x-4 overflow-hidden px-4 md:px-0">
             {[1, 2, 3].map((n) => (
                 <div key={n} className="min-w-[280px] h-64 bg-gray-200 rounded-lg animate-pulse"></div>
             ))}
         </div>
      )}

      {/* --- SLIDER CONTENT --- */}
      {!loading && events.length > 0 && (
        <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide snap-x px-4 md:px-0">
          {events.map((item, index) => (
            <div key={`${item.id}-${index}`} className="min-w-[280px] md:min-w-[320px] snap-center">
              <HomeCard
                title={item.name}
                slug={item.slug}
                date={formatDateIndo(item.dateStart)}
                imageUrl={item.image ? `${STORAGE_URL}${item.image}` : null}
                lowestPrice={item.lowestPrice}
                location={item.city || item.province || item.location}
                dateEnd={item.dateEnd}
                timeEnd={item.timeEnd}
              />
            </div>
          ))}
        </div>
      )}

      {/* --- EMPTY STATE --- */}
      {!loading && events.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm mx-4 md:mx-0">
          <p className="text-gray-500">Belum ada event tersedia saat ini.</p>
        </div>
      )}

      {/* Style khusus untuk komponen ini saja */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}