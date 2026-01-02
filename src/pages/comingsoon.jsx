import React from 'react';
import { Link } from 'react-router-dom';
import { HiHome } from "react-icons/hi2";

export default function ComingSoonPage() {
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden relative p-6"
      style={{
        backgroundColor: '#fffbeb',
        backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* MARQUEE DECORATION (ATAS) */}
      <div className="absolute top-12 -rotate-2 w-[110%] bg-black py-2 border-y-4 border-black hidden md:block">
        <div className="whitespace-nowrap animate-marquee flex gap-10">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-[#facc15] font-black text-xl uppercase tracking-widest">
              UNDER CONSTRUCTION ★ BELISENANG.COM ★ 2026 LAUNCHING ★ 
            </span>
          ))}
        </div>
      </div>

      {/* BOX UTAMA */}
      <div className="relative z-10 bg-white border-4 border-black p-10 md:p-16 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-xl">
        
        {/* TEKS UTAMA */}
        <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter mb-4 leading-none">
          COMING <br /> 
          <span className="text-[#ef4444] drop-shadow-[3px_3px_0px_black]">SOON</span>
        </h1>

        {/* TEKS SUB */}
        <p className="text-lg md:text-xl font-bold text-black mb-10 uppercase tracking-tight italic">
          We are working on our website
        </p>

        {/* TOMBOL KEMBALI */}
        <Link 
          to="/" 
          className="
            inline-flex items-center gap-3 
            bg-[#3b82f6] text-white font-black text-lg uppercase 
            px-8 py-4 border-4 border-black 
            shadow-[6px_6px_0px_0px_black] 
            hover:shadow-none hover:translate-x-1 hover:translate-y-1 
            transition-all duration-200 w-full md:w-auto justify-center
          "
        >
          <HiHome size={24} /> Kembali ke Halaman Utama
        </Link>
      </div>

      {/* MARQUEE DECORATION (BAWAH) */}
      <div className="absolute bottom-12 rotate-2 w-[110%] bg-[#ef4444] py-2 border-y-4 border-black hidden md:block">
        <div className="whitespace-nowrap animate-marquee-reverse flex gap-10">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-white font-black text-xl uppercase tracking-widest">
              WE ARE COMING ★ PREPARE YOURSELF ★ BELISENANG ★ 
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee 25s linear infinite reverse;
        }
      `}</style>
    </div>
  );
}