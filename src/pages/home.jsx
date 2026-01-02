import React from 'react';
import HeroBanner from '../components/heroBanner';
import RegionNav from '../components/regionNav';
import EventSlider from '../components/HomeEventSlider';
import NewsSection from '../components/BeritaHome';
import EventBanner from '../components/Cta';
import Rekomendasi from '../components/HomeRekomendasi';
import Terlaris from '../components/HomeTerlaris';

export default function Home() {
  return (
    <div 
      className="min-h-screen pb-20 overflow-x-hidden"
      style={{
        backgroundColor: '#fffbeb',
        backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)',
        backgroundSize: '24px 24px'
      }}
    >
      
      {/* 1. Hero Banner */}
      <div className="relative z-10">
        <HeroBanner />
      </div>

      {/* Marquee Separator */}
      <div className="w-full bg-black py-3 border-y-4 border-white transform -rotate-1 shadow-lg relative z-20 my-4 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee flex gap-8">
           {[...Array(10)].map((_, i) => (
              <span key={i} className="text-[#facc15] font-black text-xl md:text-2xl uppercase tracking-widest">
                ★ BELI TIKET ★ NONTON KONSER ★ HEALING EVENT ★ SERU-SERUAN 
              </span>
           ))}
        </div>
      </div>

      <div className="mt-12 relative z-10">
        <Rekomendasi />
      </div>

      {/* Region Navigation */}
      <div className="relative z-10 -mt-2">
        <RegionNav />
      </div>

      <div className="mt-12 relative z-10">
        <Terlaris />
      </div>

      {/* 3. Event Slider */}
      <div className="mt-12 relative z-10">
         <div className="container mx-auto max-w-6xl relative">
            <div className="absolute -top-6 -left-6 bg-[#ef4444] text-white font-bold px-4 py-1 transform -rotate-6 border-2 border-black shadow-[4px_4px_0px_0px_black] hidden md:block">
               LAGI HYPE NIH!
            </div>
         </div>
        <EventSlider />
      </div>

      {/* 4. NEWS SECTION */}
      <div className="relative z-10 bg-[#e0f2fe] py-4 md:py-8 border-y-4 border-black my-16 transform skew-y-1">
         <div className="transform -skew-y-1">
            <NewsSection />
         </div>
      </div>

      {/* 5. CTA Banner */}
      <div className="mt-10 mb-10 relative z-10">
        <EventBanner />
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
        }
      `}</style>

    </div>
  );
}