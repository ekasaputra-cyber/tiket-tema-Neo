import React from 'react';
import { FaBullhorn, FaStar, FaBolt, FaArrowRight } from "react-icons/fa6";

const EventBanner = () => {
  return (
    /* Wrapper dibuat transparan agar tidak menabrak background dotted di Home */
    <div className="w-full flex justify-center py-12 md:py-20 px-4">
      
      {/* CONTAINER UTAMA */}
      <div className="relative w-full max-w-6xl bg-[#facc15] border-[3px] md:border-4 border-black p-8 sm:p-12 md:p-16 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden rounded-sm">
        
        {/* Dekorasi Ikon Melayang */}
        <FaBolt className="absolute -top-4 -left-4 text-[#f472b6] text-6xl md:text-9xl rotate-12 drop-shadow-[3px_3px_0_#000] z-0 opacity-90" />
        
        <FaStar className="absolute top-10 right-10 text-white/40 rotate-12 z-0 animate-pulse hidden sm:block" size={80} />
        <FaStar className="absolute bottom-10 left-10 text-white/40 -rotate-12 z-0 hidden sm:block" size={60} />

        <div className="relative z-10 flex flex-col items-center">
          
          {/* Badge Pengumuman */}
          <div className="mb-6 bg-white p-4 rounded-full border-[3px] md:border-4 border-black shadow-[4px_4px_0px_0px_black] rotate-6 transform hover:rotate-0 transition-transform duration-300">
             <FaBullhorn size={32} className="text-[#ef4444] md:w-10 md:h-10" />
          </div>

          {/* HEADING - Dibuat lebih punchy untuk 2026 */}
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-black mb-6 text-black leading-tight uppercase tracking-tighter">
            Punya Event Seru? <br className="hidden md:block" />
            <span className="inline-block mt-3 md:mt-5 bg-[#ef4444] text-white px-6 py-2 border-[3px] md:border-4 border-black transform -rotate-1 shadow-[4px_4px_0px_0px_black] hover:rotate-0 transition-transform">
              DAFTARKAN SEKARANG!
            </span>
          </h2>

          {/* SUBTEXT - Memasukkan Nama Brand */}
          <p className="text-black font-bold text-sm sm:text-lg md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed italic opacity-90">
            "Jangan biarkan eventmu sepi! Gabung bersama <span className="underline decoration-4 decoration-white">BeliSenang</span> dan jangkau ribuan penikmat hiburan di seluruh Indonesia."
          </p>

          {/* BUTTON - Dengan gaya Neo-Brutalist yang lebih kuat */}
          <button className="
            group
            w-full sm:w-auto 
            bg-[#3b82f6] 
            text-white font-black text-lg md:text-2xl uppercase tracking-tighter
            py-4 px-10 md:px-14 
            border-[3px] md:border-4 border-black 
            shadow-[6px_6px_0px_0px_black] 
            hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] 
            active:bg-[#1d4ed8]
            transition-all duration-200
            flex items-center justify-center gap-3
          ">
            Mulai Buat Event <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
          
          {/* Footer kecil di dalam Banner */}
          <p className="mt-6 text-[10px] md:text-xs font-black uppercase tracking-widest opacity-50">
             Support 24/7 • Aman & Terpercaya
          </p>
        </div>

      </div>
    </div>
  );
};

export default EventBanner;