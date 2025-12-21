import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from "react-icons/fa";

const REGION_GROUPS = [
  'SUMATERA', 'JABODETABEK', 'JAWA BARAT', 'DIY-JATENG',
  'JAWA TIMUR', 'KALIMANTAN', 'SULAWESI', 'INDONESIA TIMUR',
];

const toSlug = (name) => name.toLowerCase().replace(/\s+/g, '-');

export default function RegionNav() {
  return (
    <div className="relative pt-10 mt-8">
      
      {/* --- GARIS DENGAN ICON DI TENGAH --- */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-center">
          {/* Garis Kiri: Ubah bg-gray-200 -> bg-purple-200 */}
          <div className="h-[2px] w-full bg-purple-200 max-w-xs md:max-w-sm rounded-full"></div>
          
          {/* Icon di Tengah: Putih dengan Border Ungu & Icon Pink */}
          <div className="mx-4 text-[#EC4899] bg-white p-3 rounded-full border-2 border-purple-100 shadow-md z-10">
             <FaMapMarkerAlt size={20} />
          </div>

          {/* Garis Kanan: Ubah bg-gray-200 -> bg-purple-200 */}
          <div className="h-[2px] w-full bg-purple-200 max-w-xs md:max-w-sm rounded-full"></div>
      </div>

      <div className="text-center pb-16 px-4 pt-6">
        {/* Judul: Ubah gray-800 -> text-[#4C1D95] (Ungu Gelap) */}
        <h1 className="text-xl md:text-3xl font-bold text-[#4C1D95] mb-8 md:mb-10">
          Temukan Event Menarik di Kotamu!
        </h1>

        <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-center md:gap-6 max-w-5xl mx-auto">
          {REGION_GROUPS.map((region, index) => (
            <Link
              key={index}
              to={`/jelajah/${toSlug(region)}`}
              // UBAH STYLE TOMBOL:
              // Base: Putih, Border Ungu Muda, Teks Ungu
              // Hover: Background Kuning (#FFD028), Teks Ungu Gelap, Shadow
              className="
                flex items-center justify-center
                px-4 py-3 md:px-6 md:py-3
                bg-white hover:bg-[#FFD028]
                border-2 border-purple-100 hover:border-[#FFD028]
                text-[#6D28D9] hover:text-[#4C1D95]
                font-bold
                rounded-2xl
                shadow-sm hover:shadow-lg hover:-translate-y-1
                text-sm md:text-base
                cursor-pointer transition-all duration-300
                w-full md:w-auto md:min-w-[150px]
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