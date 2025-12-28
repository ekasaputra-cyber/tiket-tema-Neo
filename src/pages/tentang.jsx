// src/pages/about.jsx
import React from 'react';
import EventBanner from '../components/Cta';
// Import Icon dari react-icons/fa6
import { FaFaceGrinSquint, FaPalette, FaBolt } from "react-icons/fa6";

export default function About() {
  return (
    <div 
      className="min-h-screen pb-20 overflow-x-hidden font-sans"
      style={{
        backgroundColor: '#fffbeb',
        backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)',
        backgroundSize: '24px 24px'
      }}
    >
      
      {/* 1. Header Section */}
      <div className="relative z-10 mb-16">
        <div className="bg-[#ef4444] border-b-4 border-black py-12 transform -skew-y-3 origin-top-left shadow-[0px_10px_0px_0px_#000]">
          <div className="container mx-auto px-4 transform skew-y-3 text-center">
             <span className="inline-block bg-black text-[#facc15] px-4 py-1 font-bold text-sm uppercase mb-4 transform -rotate-2">
                Dibalik Layar
             </span>
            <h1 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
              Siapa Kita?
            </h1>
          </div>
        </div>
      </div>

      {/* 2. Hero Statement */}
      <div className="container mx-auto px-4 max-w-5xl relative z-20 mb-20">
        <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_#000] text-center transform rotate-1 hover:rotate-0 transition-transform duration-300">
          <h2 className="text-3xl md:text-5xl font-black leading-tight text-black uppercase">
            Platform tiket konser
            <span className="block mt-2">
                <span className="relative inline-block px-2 mr-2">
                    <span className="absolute inset-0 bg-[#facc15] transform -skew-x-12 border-2 border-black"></span>
                    <span className="relative z-10">Paling Seru,</span>
                </span>
                <span className="relative inline-block px-2 mr-2">
                    <span className="absolute inset-0 bg-[#ef4444] transform skew-x-12 border-2 border-black"></span>
                    <span className="relative z-10 text-white">Paling Berwarna,</span>
                </span>
            </span>
            <span className="block mt-4">
                 dan 
                 <span className="relative inline-block px-4 ml-2">
                    <span className="absolute inset-0 bg-[#e0f2fe] transform -rotate-2 border-2 border-black"></span>
                    <span className="relative z-10">Paling Gampang</span>
                </span>
            </span>
            di Indonesia!
          </h2>
          <p className="text-xl font-bold mt-8 text-gray-800 max-w-3xl mx-auto">
            Kami hadir buat nge-hapus drama pas beli tiket. Hidup udah ribet, beli tiket konser idola jangan dibikin ribet lagi!
          </p>
        </div>
      </div>

      {/* 3. Three Pillars (Icon Update) */}
      <div className="container mx-auto px-4 max-w-6xl relative z-20 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: SERU - Icon: FaFaceGrinSquint */}
            <div className="bg-[#facc15] border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform hover:-translate-y-2 transition-all">
                <div className="mb-6 flex justify-start">
                    {/* Icon Container */}
                    <div className="bg-black text-[#facc15] p-3 border-2 border-white rounded-full">
                        <FaFaceGrinSquint className="text-5xl" />
                    </div>
                </div>
                <h3 className="text-3xl font-black uppercase mb-3">#1 Paling Seru</h3>
                <p className="text-lg font-bold leading-relaxed">
                    Anti ribet, full senyum! Kita kurasi event-event paling *hype* biar hidup lo makin menyala. Nonton konser itu harusnya happy dari awal beli tiket.
                </p>
            </div>

            {/* Card 2: BERWARNA - Icon: FaPalette */}
            <div className="bg-[#ef4444] border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform hover:-translate-y-2 transition-all text-white">
                 <div className="mb-6 flex justify-start">
                    <div className="bg-white text-[#ef4444] p-3 border-2 border-black rounded-full">
                        <FaPalette className="text-5xl" />
                    </div>
                </div>
                <h3 className="text-3xl font-black uppercase mb-3">#2 Paling Berwarna</h3>
                <p className="text-lg font-bold leading-relaxed">
                    Dari pop, rock, indie, sampai dangdut koplo. Semua genre, semua warna musik punya rumah di sini. Kita merayakan keberagaman selera musik Indonesia!
                </p>
            </div>

            {/* Card 3: GAMPANG - Icon: FaBolt */}
            <div className="bg-[#e0f2fe] border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] transform hover:-translate-y-2 transition-all">
                 <div className="mb-6 flex justify-start">
                    <div className="bg-black text-[#e0f2fe] p-3 border-2 border-white rounded-full">
                        <FaBolt className="text-5xl" />
                    </div>
                </div>
                <h3 className="text-3xl font-black uppercase mb-3">#3 Paling Gampang</h3>
                <p className="text-lg font-bold leading-relaxed">
                    Sat-set wat-wet! Sistem kami dirancang buat jempol yang gak sabaran. Pilih event, bayar pake QRIS/VA, tiket langsung masuk email. Semudah itu.
                </p>
            </div>
        </div>
      </div>

      {/* 4. Marquee Penutup */}
      <div className="w-full bg-black py-3 border-y-4 border-white transform rotate-1 shadow-lg relative z-20 my-10 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee flex gap-8">
           {[...Array(5)].map((_, i) => (
             <span key={i} className="text-white font-black text-xl md:text-2xl uppercase tracking-widest">
                JOIN THE FESTIVITY ★ JANGAN SAMPAI KEHABISAN ★ URIP IKU MAMPIR NGOPI & NONTON KONSER ★
             </span>
           ))}
        </div>
      </div>

      {/* 5. CTA Banner */}
      <div className="mt-10 relative z-10">
        <EventBanner />
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 15s linear infinite;
        }
      `}</style>

    </div>
  );
}