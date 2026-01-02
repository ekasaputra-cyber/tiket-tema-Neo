// Contoh penggunaan di file Page
import React from 'react';
import KontakSection from '../components/bantuan/kontak';

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-[#fffbeb] py-20 px-4">
      <div className="container mx-auto max-w-6xl">
         <h1 className="text-5xl md:text-7xl font-black uppercase mb-12 italic tracking-tighter">
            Mari <span className="text-[#ef4444]">Bicara!</span>
         </h1>
         <KontakSection />
      </div>
    </div>
  );
}