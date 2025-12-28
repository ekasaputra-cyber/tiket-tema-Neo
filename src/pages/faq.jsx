// src/pages/faq.jsx
import React from 'react';
import FaqSection from '../components/FaqSection'; 
import EventBanner from '../components/Cta'; 

export default function FAQ() {
  return (
    <div 
      className="min-h-screen pb-20 overflow-x-hidden"
      style={{
        backgroundColor: '#fffbeb',
        backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)',
        backgroundSize: '24px 24px'
      }}
    >

      {/* Komponen Utama */}
      <div className="relative z-10 pt-10"> {/* Tambah padding-top agar tidak terlalu mepet atas */}
        <FaqSection />
      </div>

      {/* Reuse Banner CTA di bawah */}
      <div className="mt-20 relative z-10">
        <EventBanner />
      </div>

    </div>
  );
}