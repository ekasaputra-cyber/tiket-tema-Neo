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
        {/* UBAH: text-gray-800 -> text-[#4C1D95] (Ungu Gelap Footer) */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#4C1D95]">
            Event Terdekat
        </h1>
        
        <Link 
            to={SEE_ALL_LINK} 
            state={{ startPage: 2, autoScroll: true }} 
            // UBAH: text-blue-600 -> text-[#EC4899] (Pink)
            // UBAH: hover:text-blue-800 -> hover:text-[#6D28D9] (Ungu Header)
            className="text-[#EC4899] hover:text-[#6D28D9] font-bold text-sm flex items-center group transition-colors"
        >
            Lihat Semua
            {/* Ikon panah ikut berubah warna sesuai parent */}
            <span className="ml-1 transition-transform group-hover:translate-x-1">
                <MdArrowForward size={20} />
            </span>
        </Link>
      </div>

      {/* --- LOADING STATE --- */}
      {loading && (
         <div className="flex space-x-4 overflow-hidden px-4 md:px-0">
             {[1, 2, 3].map((n) => (
                 // UBAH: bg-gray-200 -> bg-purple-100 (Skeleton nuansa ungu)
                 <div key={n} className="min-w-[280px] h-64 bg-purple-100 rounded-lg animate-pulse"></div>
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
        // UBAH: Text gray -> Text purple-400 & Border ungu tipis
        <div className="text-center py-10 bg-white rounded-lg border border-purple-100 mx-4 md:mx-0">
          <p className="text-purple-400 font-medium">Belum ada event tersedia saat ini.</p>
        </div>
      )}

      {/* Style khusus untuk menghilangkan scrollbar default browser */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}