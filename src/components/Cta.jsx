import React from 'react';
// Menggunakan 'fa6' agar konsisten dengan halaman About & FAQ
import { FaBullhorn, FaStar, FaRocket, FaBolt } from "react-icons/fa6";

const EventBanner = () => {
  return (
    <div className="w-full flex justify-center py-10 px-4 md:py-16 bg-white">
      {/* CONTAINER UTAMA */}
      <div className="relative w-full max-w-6xl bg-[#facc15] border-4 border-black p-8 sm:p-12 md:p-16 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        
        <FaBolt className="absolute -top-4 -left-4 text-[#f472b6] text-8xl md:text-9xl rotate-12 drop-shadow-[4px_4px_0_#000] z-0 opacity-80" />
        
        <FaStar className="absolute top-10 right-10 text-white/40 rotate-12 z-0 animate-pulse" size={80} />
        <FaStar className="absolute bottom-10 left-10 text-white/40 -rotate-12 z-0" size={60} />

        <div className="relative z-10 flex flex-col items-center">
          
          <div className="mb-6 bg-white p-4 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_black] rotate-6 transform hover:rotate-12 transition-transform duration-300">
             <FaBullhorn size={40} className="text-[#ef4444]" />
          </div>

          {/* HEADING */}
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 text-black leading-tight uppercase tracking-tight">
            Punya Event Seru? <br className="hidden md:block" />
            <span className="inline-block mt-2 md:mt-4 bg-[#ef4444] text-white px-4 py-1 border-4 border-black transform -rotate-2 shadow-[4px_4px_0px_0px_black]">
              DAFTARKAN SEKARANG!
            </span>
          </h2>

          {/* SUBTEXT */}
          <p className="text-black font-bold text-base sm:text-lg md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed bg-white/50 p-2 md:p-0 rounded-lg md:bg-transparent border-2 border-black md:border-none">
            Jangan biarkan eventmu sepi! Gabung bersama kami dan jangkau ribuan penikmat hiburan di seluruh Indonesia.
          </p>

          <button className="
            group
            w-full sm:w-auto 
            bg-[#3b82f6] hover:bg-[#2563eb] 
            text-white font-black text-lg md:text-2xl uppercase tracking-wider
            py-4 px-8 md:px-12 
            border-4 border-black 
            shadow-[6px_6px_0px_0px_black] 
            hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] 
            transition-all duration-200
            flex items-center justify-center gap-3
          ">
            Mulai Buat Event 
            <FaRocket className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default EventBanner;