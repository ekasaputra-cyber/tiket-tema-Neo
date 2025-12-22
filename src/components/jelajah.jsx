// src/components/ExploreEvents.jsx
import React, { useState, useEffect } from 'react';
import EventCard from './evnCard'; // Import komponen card yang sudah dibuat

export default function ExploreEvents() {
  // --- STATE ---
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const STORAGE_URL = 'https://api.artatix.co.id/';

  // --- FETCH DATA ---
  const fetchEvents = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.artatix.co.id/api/v1/customer/event?page=${pageNumber}&limit=8`);
      const json = await res.json();

      if (json.message === 'success') {
        const newData = json.data.data;
        const nextPage = json.data.nextPage;

        setEvents((prevEvents) => {
          if (pageNumber === 1) return newData;
          return [...prevEvents, ...newData];
        });

        setHasMore(nextPage !== null);
      }
    } catch (error) {
      console.error("Gagal mengambil event:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  // --- HELPER FORMATTER ---
  // Kita format tanggal di sini sebelum dikirim ke props card
  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getImageUrl = (path) => {
    return path ? `${STORAGE_URL}${path}` : null;
  };

  return (
    <section className="py-16 bg-[#fffbeb] relative overflow-hidden">
      
      {/* Dekorasi Background */}
      <div className="absolute top-10 right-0 w-32 h-32 bg-[#facc15] rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 w-40 h-40 bg-[#f472b6] rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter mb-4" 
              style={{ textShadow: '4px 4px 0px #000' }}>
            JELAJAH <span className="text-[#3b82f6] bg-black px-2">SERU</span>
          </h2>
          <p className="font-bold text-gray-600 text-lg max-w-2xl mx-auto border-2 border-black p-2 bg-white shadow-[4px_4px_0px_0px_black] transform -rotate-1">
            Temukan event musik, festival, dan hiburan paling hits di kotamu!
          </p>
        </div>

        {/* GRID EVENT - MENGGUNAKAN EVENT CARD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {events.map((item, index) => (
            <EventCard
              key={`${item.id}-${index}`}
              title={item.name}
              date={formatDate(item.dateStart)}
              // Menggabungkan lokasi dan kota agar lebih lengkap
              location={`${item.location}, ${item.city}`} 
              imageUrl={getImageUrl(item.image)}
              lowestPrice={item.lowestPrice}
              slug={item.slug}
            />
          ))}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
             {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 bg-gray-200 animate-pulse rounded-xl"></div>
             ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && events.length === 0 && (
          <div className="text-center py-20 border-4 border-black border-dashed bg-white mt-8">
            <h3 className="text-2xl font-black text-gray-400 uppercase">Belum ada event nih...</h3>
          </div>
        )}

        {/* TOMBOL LOAD MORE */}
        {hasMore && !loading && events.length > 0 && (
          <div className="mt-16 text-center">
            <button 
              onClick={handleLoadMore}
              className="relative inline-block group focus:outline-none"
            >
              <span className="absolute inset-0 transition-transform translate-x-2 translate-y-2 bg-black group-hover:translate-y-0 group-hover:translate-x-0"></span>
              <span className="relative inline-block px-8 py-4 text-xl font-black uppercase tracking-widest bg-[#facc15] border-4 border-black active:translate-y-1 cursor-pointer">
                MUAT LEBIH BANYAK +
              </span>
            </button>
          </div>
        )}
        
        {/* END OF RESULTS */}
        {!hasMore && events.length > 0 && (
           <div className="mt-12 text-center">
              <span className="bg-black text-white px-4 py-2 font-bold transform -rotate-2 inline-block border-2 border-white shadow-lg">
                end of results
              </span>
           </div>
        )}

      </div>
    </section>
  );
}