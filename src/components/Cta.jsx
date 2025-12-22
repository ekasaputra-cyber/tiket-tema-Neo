import React from 'react';
import { FaBullhorn, FaStar } from 'react-icons/fa';

const EventBanner = () => {
  return (
    <div className="w-full flex justify-center py-10 px-4 md:py-16 bg-white">
      {/* CONTAINER UTAMA:
        - bg-[#facc15] (Kuning Terang)
        - border-4 border-black (Garis tebal)
        - shadow-[12px_12px...] (Bayangan hitam pekat & jauh)
      */}
      <div className="relative w-full max-w-6xl bg-[#facc15] border-4 border-black p-8 sm:p-12 md:p-16 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* --- DEKORASI BACKGROUND (Elemen Pemanis) --- */}
        {/* Lingkaran Pink di pojok */}
        <div className="absolute -top-6 -left-6 w-24 h-24 md:w-32 md:h-32 bg-[#f472b6] rounded-full border-4 border-black z-0"></div>
        {/* Bintang Putih samar */}
        <FaStar className="absolute top-10 right-10 text-white/40 rotate-12 z-0" size={80} />
        <FaStar className="absolute bottom-10 left-10 text-white/40 -rotate-12 z-0" size={60} />

        {/* --- KONTEN UTAMA (Z-Index harus lebih tinggi dari dekorasi) --- */}
        <div className="relative z-10 flex flex-col items-center">
          
          {/* ICON MEGAPHONE: Dalam lingkaran putih */}
          <div className="mb-6 bg-white p-4 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_black] rotate-6 transform hover:rotate-12 transition-transform duration-300">
             <FaBullhorn size={40} className="text-[#ef4444]" />
          </div>

          {/* HEADING: Font besar, hitam, dengan highlight */}
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 text-black leading-tight uppercase tracking-tight">
            Punya Event Seru? <br className="hidden md:block" />
            <span className="inline-block mt-2 md:mt-4 bg-[#ef4444] text-white px-4 py-1 border-4 border-black transform -rotate-2 shadow-[4px_4px_0px_0px_black]">
              DAFTARKAN SEKARANG!
            </span>
          </h2>

          {/* SUBTEXT: Font tebal dan jelas */}
          <p className="text-black font-bold text-base sm:text-lg md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed bg-white/50 p-2 md:p-0 rounded-lg md:bg-transparent border-2 border-black md:border-none">
            Jangan biarkan eventmu sepi! Gabung bersama kami dan jangkau ribuan penikmat hiburan di seluruh Indonesia.
          </p>

          {/* BUTTON: Biru Kontras, Kotak, Shadow Keras */}
          <button className="
            w-full sm:w-auto 
            bg-[#3b82f6] hover:bg-[#2563eb] 
            text-white font-black text-lg md:text-2xl uppercase tracking-wider
            py-4 px-8 md:px-12 
            border-4 border-black 
            shadow-[6px_6px_0px_0px_black] 
            hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] 
            transition-all duration-200
            rounded-none
          ">
            Mulai Buat Event 🚀
          </button>
        </div>

      </div>
    </div>
  );
};

export default EventBanner;