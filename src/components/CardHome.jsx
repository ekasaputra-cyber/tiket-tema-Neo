import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn, MdCalendarToday } from "react-icons/md"; 

export default function HomeCard({ title, date, location, imageUrl, lowestPrice, dateEnd, timeEnd, slug }) {

  // 1. Logika Cek Expired
  const isExpired = useMemo(() => {
    if (!dateEnd) return false;
    const timePart = timeEnd || '23:59:59';
    const dateTimeString = `${dateEnd}T${timePart}`;
    
    const endTime = new Date(dateTimeString);
    const now = new Date();

    return endTime < now;
  }, [dateEnd, timeEnd]);

  const isClickable = !isExpired;

  // 2. Format Rupiah
  const formattedPrice = useMemo(() => {
    const price = parseFloat(lowestPrice);
    if (isNaN(price) || price === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(price);
  }, [lowestPrice]);

  return (
    <Link
      to={isClickable ? `/event/${slug}` : '#'}
      className={`block h-full transition-all duration-300 overflow-hidden shadow-md hover:shadow-xl group ${
        isExpired ? 'cursor-not-allowed opacity-75 grayscale' : 'cursor-pointer bg-white'
      }`}
      onClick={(e) => !isClickable && e.preventDefault()}
    >
      <div className={`flex flex-col h-full ${isExpired ? 'bg-gray-200' : 'bg-white'}`}>
        
        {/* --- IMAGE SECTION --- */}
        <div className="aspect-[1062/427] overflow-hidden relative bg-gray-100">
          <img
            src={imageUrl || "https://placehold.co/600x400?text=No+Image"}
            alt={title}
            loading="lazy"
            
            // PERUBAHAN DISINI:
            // object-fill = Paksa gambar memenuhi seluruh kotak 16:9.
            // Hasil: Tidak ada space kosong, Tidak ada bagian yang terpotong.
            // Konsekuensi: Gambar akan gepeng/tertarik jika aslinya bukan 16:9.
            className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
            
            onError={(e) => {
              e.target.src = "https://placehold.co/600x400?text=Image+Error";
            }}
          />
          
          {/* Badge Lokasi (Sudah diperbaiki dengan w-fit) */}
          {location && (
            <div className="absolute bottom-2 left-2 w-fit max-w-[calc(100%-1rem)] bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1.5 rounded-lg flex items-center gap-1.5">
              <MdLocationOn className="text-red-400 shrink-0" size={14} />
              <span className="truncate">{location}</span>
            </div>
          )}
        </div>

        {/* --- CONTENT SECTION --- */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Judul */}
          <h3 className={`font-bold text-lg mb-2 line-clamp-2 leading-snug ${isExpired ? 'text-gray-500' : 'text-gray-800'}`}>
            {title}
          </h3>

          {/* Tanggal dengan Icon */}
          <div className={`text-sm mb-4 flex items-center gap-2 ${isExpired ? 'text-gray-400' : 'text-gray-500'}`}>
            <MdCalendarToday size={14} className="shrink-0" />
            <span>{date}</span>
          </div>

          {/* Harga (Selalu di bawah) */}
          <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs text-gray-400">Mulai dari</span>
            <span className={`font-bold text-lg ${isExpired ? 'text-gray-500' : 'text-green-600'}`}>
              {formattedPrice}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}