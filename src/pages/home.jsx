import React from 'react';
import HeroBanner from '../components/heroBanner';
import RegionNav from '../components/regionNav';
import EventSlider from '../components/HomeEventSlider';
import EventBanner from '../components/Cta';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      
      {/* 1. Hero Banner (Carousel Gambar) */}
      <div>
        <HeroBanner />
      </div>

      {/* 2. Event Slider (Carousel Event) */}
      <EventSlider />

      {/* 3. Region Navigation (Pilihan Kota/Wilayah) */}
      <div className="mt-8">
        <RegionNav />
      </div>

      <EventBanner />

    </div>
  );
}