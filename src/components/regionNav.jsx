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

<div className="">
  <div className="">
    <HeroBanner />
  </div>
    <div className="text-center py-16 px-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10">
        Temukan Event Menarik di Kotamu!
      </h1>
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {REGION_GROUPS.map((region, index) => (
          <Link
            key={index}
            to={`/jelajah/${toSlug(region)}`}
            className="px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-800 cursor-pointer transition min-w-[140px] md:min-w-[160px]"
          >
            {region}
          </Link>
        ))}
      </div>
    </div>
</div>
  );
}