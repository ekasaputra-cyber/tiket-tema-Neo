// src/components/evnCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function EventCard({ 
  title, 
  date, 
  location, // <--- Props baru ditambahkan
  imageUrl, 
  lowestPrice, 
  dateEnd, 
  timeEnd, 
  slug
}) {

  // --- LOGIC: Cek Expired ---
  const isExpired = React.useMemo(() => {
    if (!dateEnd) return false;
    const timePart = timeEnd || '23:59:59';
    const dateTimeString = `${dateEnd}T${timePart}`;
    const endTime = new Date(dateTimeString);
    const now = new Date();
    return endTime < now;
  }, [dateEnd, timeEnd]);

  // --- LOGIC: Handle Click ---
  const handleClick = (e) => {
    if (isExpired) e.preventDefault();
  };

  // --- LOGIC: Format Harga ---
  const formatPrice = (price) => {
    if (!price || price === 0 || price === "0") return 'GRATIS';
    return `Rp${parseInt(price).toLocaleString('id-ID')}`;
  };

  return (
    <Link
      to={`/event/${slug}`}
      onClick={handleClick}
      className={`group block relative w-full h-full transition-all duration-200
        border-2 border-black overflow-hidden
        ${isExpired 
          ? 'bg-gray-100 opacity-80 cursor-not-allowed grayscale' 
          : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] cursor-pointer'
        }`}
    >
      {/* 1. BAGIAN GAMBAR */}
      <div className="relative aspect-[1062/427] border-b-2 border-black bg-gray-200 overflow-hidden">
        <img
          src={imageUrl || "https://placehold.co/1062x427/eee/999?text=loading..."}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "https://placehold.co/1062x427/eee/999?text=Image+Error";
          }}
          loading="lazy"
        />

        {/* Overlay Badge jika Expired */}
        {isExpired && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <div className="bg-red-600 text-white font-black text-xl px-4 py-2 border-2 border-white transform -rotate-6 uppercase tracking-widest shadow-lg">
              Berakhir
            </div>
          </div>
        )}

        {/* Badge Kategori */}
        {!isExpired && (
            <div className="absolute top-0 right-0 bg-[#facc15] border-l-2 border-b-2 border-black px-3 py-1 font-bold text-xs uppercase tracking-wider">
                Event
            </div>
        )}
      </div>

      {/* 2. BAGIAN KONTEN */}
      <div className="p-4 flex flex-col h-[calc(100%-aspect-[1062/427])]">
        
        {/* Judul */}
        <h3 className={`font-black text-lg leading-tight line-clamp-2 min-h-[44px] mb-4 uppercase ${
            isExpired ? 'text-gray-500' : 'text-black group-hover:underline decoration-2 underline-offset-2'
          }`}>
          {title}
        </h3>

        {/* Info Group: Tanggal & Lokasi */}
        <div className="flex flex-col gap-3 mb-4">
            
            {/* Tanggal */}
            <div className="border-l-4 border-gray-300 pl-3">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tanggal</span>
                    <span className={`text-sm font-bold ${isExpired ? 'text-gray-400' : 'text-gray-800'}`}>
                        {date}
                    </span>
                </div>
            </div>

            {/* Lokasi (BARU) */}
            <div className="border-l-4 border-gray-300 pl-3">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Lokasi</span>
                    <span className={`text-sm font-bold line-clamp-1 ${isExpired ? 'text-gray-400' : 'text-gray-800'}`}>
                        {location || 'Lokasi Belum Tersedia'}
                    </span>
                </div>
            </div>

        </div>

        {/* Harga */}
        <div className="mt-auto pt-3 border-t-2 border-dashed border-gray-300 flex justify-between items-end">
            <div>
                 <span className="text-[10px] font-bold text-gray-500 uppercase">Mulai Dari</span>
            </div>
            <div className={`px-2 py-1 font-black text-lg border-2 ${
                 isExpired 
                 ? 'border-gray-400 text-gray-400 line-through' 
                 : 'border-black bg-[#bfdbfe] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            }`}>
                {formatPrice(lowestPrice)}
            </div>
        </div>
      </div>
    </Link>
  );
}