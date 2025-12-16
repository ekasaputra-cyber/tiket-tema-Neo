import React from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from './heroBanner';

const REGION_GROUPS = [
  'SUMATERA',
  'JABODETABEK',
  'JAWA BARAT',
  'DIY-JATENG',
  'JAWA TIMUR',
  'KALIMANTAN',
  'SULAWESI',
  'INDONESIA TIMUR',
];

const toSlug = (name) => name.toLowerCase().replace(/\s+/g, '-');

export default function RegionNav() {
  return (
    <div>
      {/* Container Hero Banner */}
      <div>
        <HeroBanner />
      </div>

      {/* Container Region Buttons */}
      <div className="text-center py-8 px-4 md:py-16">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-10">
          Temukan Event Menarik di Kotamu!
        </h1>

        {/* Mobile: Grid 2 Kolom (grid-cols-2) agar rapi
           Desktop: Flex Wrap agar terpusat dinamis
        */}
        <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center md:gap-6 max-w-5xl mx-auto">
          {REGION_GROUPS.map((region, index) => (
            <Link
              key={index}
              to={`/jelajah/${toSlug(region)}`}
              className="
                flex items-center justify-center
                px-4 py-3 md:px-6 md:py-4 
                bg-gray-100 hover:bg-gray-200 
                rounded-lg 
                font-semibold text-gray-800 
                text-sm md:text-base
                cursor-pointer transition 
                w-full md:w-auto md:min-w-[160px]
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