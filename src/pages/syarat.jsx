import React from 'react';
import SyaratSection from '../components/bantuan/syarat';
import { HiDocumentText, HiShieldExclamation } from "react-icons/hi2";

export default function SyaratPage() {
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
          <div className="inline-block bg-[#facc15] text-black border-4 border-black px-4 py-1 font-black text-sm uppercase tracking-widest mb-4 shadow-[4px_4px_0px_0px_black] rotate-2 hover:rotate-0 transition-transform cursor-default">
             User Agreement
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none italic transform -skew-x-6">
            Syarat & <br className="md:hidden" />
            <span className="text-[#3b82f6] drop-shadow-[3px_3px_0px_black]">Ketentuan</span>
          </h1>

          <div className="flex items-center gap-3 mt-8 font-bold text-lg text-black/70 justify-center md:justify-start">
            <div className="bg-black text-white p-2 border-2 border-black shadow-[3px_3px_0px_0px_#ef4444]">
              <HiDocumentText className="text-2xl" />
            </div>
            <p className="max-w-md leading-tight text-sm md:text-base">
              Mohon baca aturan main di <span className="text-black font-black italic">BeliSenang.com</span> sebelum bertransaksi.
            </p>
          </div>
        </div>

        {/* RENDERING KOMPONEN SYARAT SECTION */}
        <div className="relative z-10">
           <SyaratSection />
        </div>

        {/* NOTIFIKASI PENTING */}
        <div className="mt-12 bg-rose-100 border-4 border-black p-6 shadow-[8px_8px_0px_0px_black] flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white p-4 border-2 border-black rotate-6 shadow-[4px_4px_0px_0px_black]">
            <HiShieldExclamation className="text-4xl text-rose-600" />
          </div>
          <div>
            <h4 className="font-black uppercase text-xl mb-1">Penting untuk Diketahui!</h4>
            <p className="font-bold text-sm leading-snug">
              Kami berhak memperbarui syarat ini sewaktu-waktu. Pastikan Anda mengecek halaman ini secara berkala untuk mendapatkan informasi terbaru dari tim kami.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}