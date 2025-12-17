import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from "react-icons/fa"; // Import Icon Peta

const REGION_GROUPS = [
  'SUMATERA', 'JABODETABEK', 'JAWA BARAT', 'DIY-JATENG',
  'JAWA TIMUR', 'KALIMANTAN', 'SULAWESI', 'INDONESIA TIMUR',
];

const toSlug = (name) => name.toLowerCase().replace(/\s+/g, '-');

export default function RegionNav() {
  return (
    <div className="relative pt-10"> {/* Beri padding top agar icon tidak kepotong */}
      
      {/* --- GARIS DENGAN ICON DI TENGAH --- */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-center">
          {/* Garis Kiri */}
          <div className="h-[2px] w-full bg-gray-200 max-w-xs md:max-w-sm"></div>
          
          {/* Icon di Tengah */}
          <div className="mx-4 text-red-400 bg-gray-50 p-2 rounded-full border border-gray-100 shadow-sm">
             <FaMapMarkerAlt size={20} />
          </div>

          {/* Garis Kanan */}
          <div className="h-[2px] w-full bg-gray-200 max-w-xs md:max-w-sm"></div>
      </div>

      <div className="text-center pb-16 px-4 pt-6">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-8 md:mb-10">
          Temukan Event Menarik di Kotamu!
        </h1>

        <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center md:gap-6 max-w-5xl mx-auto">
          {REGION_GROUPS.map((region, index) => (
            <Link
              key={index}
              to={`/jelajah/${toSlug(region)}`}
              className="
                flex items-center justify-center
                px-4 py-3 md:px-6 md:py-4 
                bg-gray-100 hover:bg-white
                border border-transparent hover:border-gray-200
                hover:shadow-lg hover:-translate-y-1
                rounded-xl
                font-semibold text-gray-700 hover:text-blue-600
                text-sm md:text-base
                cursor-pointer transition-all duration-300
                w-full md:w-auto md:min-w-[160px]
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