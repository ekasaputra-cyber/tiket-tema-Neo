import React, { useState, useEffect } from 'react';
import {  HiCheckBadge, HiOutlineFaceSmile, HiArrowSmallRight } from "react-icons/hi2"; // Perbaikan nama ikon
import HomeCard from './CardHome';

export default function RekomendasiSlider() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const STORAGE_URL = 'https://api.artatix.co.id/';

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.artatix.co.id/api/v1/customer/event?page=1`);
        const json = await response.json();
        if (json?.data?.data) setEvents(json.data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

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

  return (
    <div className="container mx-auto max-w-6xl my-8 md:my-16 border-[3px] md:border-4 border-black bg-[#ffedd5] p-4 md:p-6 shadow-[6px_6px_0px_0px_black] md:shadow-[10px_10px_0px_0px_black] rounded-sm relative overflow-hidden">
      
      {/* Background Watermark */}
      <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 opacity-5 pointer-events-none select-none">
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-black -rotate-3">EDITOR PICK</h2>
      </div>

      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4 relative z-10">
        <div className="flex flex-col w-full">
          <h1 className="text-2xl md:text-5xl font-black text-black uppercase tracking-tighter transform -skew-x-6 flex items-center gap-2">
            <span className="bg-[#f43f5e] text-white px-3 py-0.5 border-[3px] border-black shadow-[3px_3px_0px_0px_black] md:shadow-[4px_4px_0px_0px_black] flex items-center gap-2">
              REKOMENDASI
            </span>
          </h1>
          <p className="font-bold text-[10px] md:text-sm text-black/60 mt-3 flex items-center gap-1 uppercase tracking-widest">
            <HiCheckBadge className="text-blue-600 text-base" /> Pilihan Terbaik BeliSenang
          </p>
        </div>
        
        <div className="absolute right-0 top-0 md:relative">
            <div className="bg-white border-2 border-black rounded-sm px-3 py-2 flex flex-col items-center justify-center text-center shadow-[3px_3px_0px_0px_black] rotate-3 hover:rotate-0 transition-transform">
                <span className="text-[10px] md:text-xs font-black leading-tight uppercase">Wajib Nonton!</span>
            </div>
        </div>
      </div>

      {/* --- LOADING STATE --- */}
      {loading && (
         <div className="flex space-x-6 overflow-hidden">
             {[1, 2, 3].map((n) => (
                 <div key={n} className="w-[240px] md:w-[320px] h-[380px] flex-shrink-0 bg-white/50 border-[3px] border-black animate-pulse p-4">
                    <div className="w-full h-44 bg-white mb-4 border-2 border-black/10"></div>
                    <div className="w-full h-6 bg-white mb-2"></div>
                    <div className="w-1/2 h-6 bg-white"></div>
                 </div>
             ))}
         </div>
      )}

      {/* --- SLIDER CONTENT --- */}
      {!loading && events.length > 0 && (
        <div className="flex overflow-x-auto py-4 md:py-6 gap-5 md:gap-8 scrollbar-hide snap-x relative z-10 items-stretch">
          {events.map((item, index) => (
            <div key={`${item.id}-${index}`} className="w-[240px] md:w-[320px] flex-shrink-0 snap-center group">
              <div className="relative h-full transform transition-all duration-300 md:group-hover:translate-x-1 md:group-hover:translate-y-1">
                
                <div className="absolute -top-2 -left-2 z-20 bg-black text-white text-[8px] md:text-[10px] font-black px-2 md:px-3 py-1 border-2 border-black transform -rotate-3 uppercase flex items-center gap-1">
                   TOP CHOICE
                </div>
                
                <div className="border-[3px] md:border-4 border-black shadow-[4px_4px_0px_0px_black] md:shadow-[8px_8px_0px_0px_black] bg-white h-full flex flex-col">
                    <HomeCard
                      title={item.name}
                      slug={item.slug}
                      date={formatEventDate(item.dateStart, item.dateEnd)}
                      imageUrl={item.image ? `${STORAGE_URL}${item.image}` : null}
                      lowestPrice={item.lowestPrice}
                      location={item.city || item.province || item.location}
                      dateEnd={item.dateEnd}
                      timeEnd={item.timeEnd}
                    />
                </div>
              </div>
            </div>
          ))}
          <div className="w-1 flex-shrink-0"></div>
        </div>
      )}

      {/* --- EMPTY STATE --- */}
      {!loading && events.length === 0 && (
        <div className="text-center py-16 bg-white/40 border-[3px] border-black border-dashed flex flex-col items-center mx-2">
          <HiOutlineFaceSmile className="text-6xl mb-3 opacity-20" /> {/* Perbaikan di sini */}
          <p className="text-black font-black text-xl uppercase italic">Belum Ada Pilihan Editor!</p>
          <button className="mt-4 bg-white border-2 border-black px-4 py-1 font-bold text-xs shadow-[3px_3px_0px_0px_black] flex items-center gap-2 uppercase">
            Cek Event Lain <HiArrowSmallRight />
          </button>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}