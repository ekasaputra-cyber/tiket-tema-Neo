import React, { useState, useEffect } from 'react';
import { HiFire, HiTrendingUp } from "react-icons/hi";
import HomeCard from './CardHome';

export default function EventTerlaris() {
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
    <div className="container mx-auto max-w-6xl my-8 md:my-16 border-[3px] md:border-4 border-black bg-[#fefce8] p-4 md:p-6 shadow-[6px_6px_0px_0px_black] md:shadow-[10px_10px_0px_0px_black] rounded-sm relative overflow-hidden">
      
      <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 opacity-5 pointer-events-none select-none">
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-black">BEST SELLER</h2>
      </div>

      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4 relative z-10">
        <div className="flex flex-col w-full">
          <h1 className="text-2xl md:text-5xl font-black text-black uppercase tracking-tighter transform -rotate-1 flex items-center gap-2">
              TERLARIS <span className="text-[#f59e0b] drop-shadow-[1.5px_1.5px_0px_black] md:drop-shadow-[2px_2px_0px_black] flex items-center">MANIS <HiFire className="text-red-600 animate-pulse ml-1" /></span>
          </h1>
          <p className="font-bold text-[10px] md:text-sm bg-black text-white inline-block px-2 py-0.5 md:py-1 mt-2 self-start transform rotate-1">
            TIKET PALING DICARI WARGA BELISENANG!
          </p>
        </div>
        
        <div className="absolute right-0 top-0 md:relative animate-bounce">
            <div className="bg-[#fbbf24] border-2 border-black rounded-full w-16 h-16 md:w-24 md:h-24 flex flex-col items-center justify-center text-center p-1 md:p-2 shadow-[3px_3px_0px_0px_black] md:shadow-[4px_4px_0px_0px_black] -rotate-12">
                <HiTrendingUp className="text-lg md:text-2xl mb-0.5" />
                <span className="text-[7px] md:text-[9px] font-black leading-tight uppercase">CEK SEBELUM HABIS!</span>
            </div>
        </div>
      </div>

      {/* --- SLIDER CONTENT --- */}
      {!loading && events.length > 0 && (
        <div className="flex overflow-x-auto py-4 md:py-6 gap-5 md:gap-8 scrollbar-hide snap-x relative z-10 items-stretch">
          {events.map((item, index) => (
            <div key={`${item.id}-${index}`} className="w-[240px] md:w-[320px] flex-shrink-0 snap-center group">
              <div className="relative h-full transform transition-all duration-300 md:group-hover:scale-[1.02]">
                
                {/* Badge Trending */}
                <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 z-20 bg-red-600 text-white text-[8px] md:text-[10px] font-black px-2 md:px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_black] md:shadow-[3px_3px_0px_0px_black] transform rotate-12 group-hover:rotate-0 transition-transform uppercase flex items-center gap-1">
                   <HiTrendingUp /> Trending
                </div>
                
                <div className="border-[3px] md:border-4 border-black shadow-[4px_4px_0px_0px_black] md:shadow-[6px_6px_0px_0px_black] bg-white h-full md:group-hover:shadow-[10px_10px_0px_0px_#fbbf24] flex flex-col">
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

      {/* --- LOADING & EMPTY STATE (Disesuaikan border & font) --- */}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}