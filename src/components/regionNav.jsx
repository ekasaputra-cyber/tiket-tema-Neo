import React, { useState, useEffect } from 'react';

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

export default function RegionNav() {
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch('https://api.artatix.co.id/api/v1/province');
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          console.log('✅ Provinsi berhasil dimuat:', json.data);
        }
      } catch (err) {
        console.warn('⚠️ Gagal memuat provinsi:', err);
      }
    };

    fetchProvinces();
  }, []);

  const toSlug = (name) => name.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="text-center py-16 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10">
        Temukan Event Menarik di Kotamu!
      </h1>
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {REGION_GROUPS.map((region, index) => (
          <a
            key={index}
            href={`/jelajah?wilayah=${toSlug(region)}`}
            className="px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-800 cursor-pointer transition min-w-[140px] md:min-w-[160px]"
          >
            {region}
          </a>
        ))}
      </div>
    </div>
  );
}