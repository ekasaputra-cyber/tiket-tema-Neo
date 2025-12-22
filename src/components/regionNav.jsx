import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from "react-icons/fa";

const REGION_GROUPS = [
  'SUMATERA', 'JABODETABEK', 'JAWA BARAT', 'DIY-JATENG',
  'JAWA TIMUR', 'KALIMANTAN', 'SULAWESI', 'INDONESIA TIMUR',
];

// Palet warna untuk tombol (Looping)
const COLORS = [
    'bg-[#ef4444]', // Merah
    'bg-[#facc15]', // Kuning
    'bg-[#3b82f6]', // Biru
    'bg-[#10b981]', // Hijau
    'bg-[#f472b6]', // Pink
    'bg-[#a855f7]', // Ungu
];

const toSlug = (name) => name.toLowerCase().replace(/\s+/g, '-');

export default function RegionNav() {
  return (
    <div className="relative py-16 bg-white"> 
      
      <div className="text-center px-4">
        {/* JUDUL: Tipografi Besar & Berat */}
        <h1 className="text-3xl md:text-5xl font-black text-black mb-12 uppercase tracking-tight relative inline-block">
          Cari Kotamu
          {/* Garis bawah dekoratif */}
          <span className="absolute -bottom-2 left-0 w-full h-4 bg-[#facc15] -z-10 transform -rotate-1 border-2 border-black"></span>
        </h1>

        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {REGION_GROUPS.map((region, index) => {
            const btnColor = COLORS[index % COLORS.length];
            // Rotasi acak sedikit agar terlihat natural
            const rotation = index % 2 === 0 ? '-rotate-2' : 'rotate-2';

            return (
              <Link
                key={index}
                to={`/jelajah/${toSlug(region)}`}
                className={`
                  relative group
                  flex items-center justify-center
                  px-6 py-4
                  ${btnColor}
                  border-4 border-black
                  shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]
                  hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px]
                  transition-all duration-200
                  transform ${rotation} hover:rotate-0 hover:z-10
                  w-[45%] md:w-auto md:min-w-[180px]
                `}
              >
                <span className="font-black text-black text-lg md:text-xl uppercase tracking-wider flex items-center gap-2">
                   {region}
                </span>
                
                {/* Efek kilau putih di pojok (Glaze) */}
                <div className="absolute top-1 left-2 w-3 h-3 bg-white rounded-full opacity-50"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}