import React from 'react';
import { Link } from 'react-router-dom';
// import HeroBanner from './heroBanner'; // Hapus jika tidak dipakai

const REGION_GROUPS = [
  'SUMATERA', 'JABODETABEK', 'JAWA BARAT', 'DIY-JATENG',
  'JAWA TIMUR', 'KALIMANTAN', 'SULAWESI', 'INDONESIA TIMUR',
];

const toSlug = (name) => name.toLowerCase().replace(/\s+/g, '-');

export default function RegionNav() {
  return (
    <div className="relative w-full">
      {/* --- DESAIN BORDER ELEGANT (Gradient Line) --- */}
      {/* Garis ini transparan di ujung, abu-abu di tengah */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      
      <div className="text-center py-10 px-4 md:py-16 bg-gray-50/50">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">
          Temukan Event Menarik di Kotamu!
        </h1>
        <p className="text-gray-500 text-sm md:text-base mb-8 md:mb-10">
            Jelajahi keseruan di berbagai wilayah Indonesia
        </p>

        <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center md:gap-4 max-w-5xl mx-auto">
          {REGION_GROUPS.map((region, index) => (
            <Link
              key={index}
              to={`/jelajah/${toSlug(region)}`}
              className="
                flex items-center justify-center
                px-4 py-3 md:px-6 md:py-3
                bg-white hover:bg-blue-600 hover:text-white
                border border-gray-100 hover:border-blue-600
                shadow-sm hover:shadow-md
                rounded-full
                font-medium text-gray-600 
                text-sm md:text-base
                cursor-pointer transition-all duration-300
                w-full md:w-auto md:min-w-[140px]
                active:scale-95
              "
            >
              {region}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}