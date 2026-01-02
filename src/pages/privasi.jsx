import React from 'react';
import PrivacySection from '../components/bantuan/privasi'; // Pastikan path benar
import { HiShieldCheck } from "react-icons/hi2";

export default function PrivasiPage() {
  return (
    <div 
      className="min-h-screen py-20 px-4 md:px-8"
      style={{
        backgroundColor: '#fffbeb',
        backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)',
        backgroundSize: '24px 24px'
      }}
    >
      <div className="container mx-auto max-w-5xl">
        
        {/* HEADER HALAMAN */}
        <div className="mb-16 text-center md:text-left">
          <div className="inline-block bg-[#3b82f6] text-white border-4 border-black px-4 py-1 font-black text-sm uppercase tracking-widest mb-4 shadow-[4px_4px_0px_0px_black] transform -rotate-1">
             Legal & Trust
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none italic transform -skew-x-6">
            Kebijakan <span className="text-[#ef4444] drop-shadow-[3px_3px_0px_black]">Privasi</span>
          </h1>
          <div className="flex items-center gap-2 mt-6 font-bold text-lg text-black/60 justify-center md:justify-start">
            <HiShieldCheck className="text-green-600 text-2xl" /> 
            <span>Privasi Anda adalah prioritas nomor satu kami.</span>
          </div>
        </div>

        {/* RENDERING KOMPONEN PRIVACY SECTION */}
        <div className="relative z-10">
           <PrivacySection />
        </div>

        {/* FOOTER INFORMASI TAMBAHAN */}
        <div className="mt-20 p-8 border-4 border-black border-dashed bg-white/50 text-center">
          <p className="font-bold text-black max-w-2xl mx-auto leading-tight">
            Punya pertanyaan lebih lanjut mengenai bagaimana kami mengelola data Anda? 
            Hubungi tim kepatuhan kami melalui <span className="underline decoration-4 decoration-[#facc15] cursor-pointer">legal@belisenang.com</span>
          </p>
        </div>

      </div>
    </div>
  );
}