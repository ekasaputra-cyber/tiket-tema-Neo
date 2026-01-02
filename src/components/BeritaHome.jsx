import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';

// Mock Data Berita (Nanti bisa diganti fetch API)
const newsData = [
  {
    id: 1,
    title: "RESMI: BeliSenang.com Jadi Exclusive Ticketing Partner Konser Reuni 2026!",
    date: "02 Jan 2026",
    category: "BIG NEWS",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop", 
    color: "bg-[#facc15]",
    isFeatured: true // Berita utama lebih besar
  },
  {
    id: 2,
    title: "Tips War Tiket Tanpa Galau di Aplikasi BeliSenang",
    date: "01 Jan 2026",
    category: "GUIDE",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop",
    color: "bg-[#4ade80]",
    isFeatured: false
  },
  {
    id: 3,
    title: "Fitur 'Senang-Pay' Rilis! Bayar Tiket Bisa Dicicil 0%",
    date: "28 Des 2025",
    category: "PRODUCT",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop",
    color: "bg-[#3b82f6]",
    isFeatured: false
  }
];

export default function NewsSection() {
  return (
    <div className="container mx-auto max-w-6xl px-4 my-16">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b-4 border-black pb-4">
        <div className="relative">
            {/* Dekorasi kotak di belakang judul */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#10b981] border-2 border-black -z-10 rounded-full"></div>
            
            <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter transform rotate-1">
              Pojok <span className="text-white bg-black px-2">Berita</span>
            </h2>
            <p className="font-bold text-gray-600 mt-2 text-lg">Update terbaru seputar dunia event & musik.</p>
        </div>

        <Link to="/berita" className="hidden md:flex items-center gap-2 font-black text-lg hover:underline decoration-4 decoration-[#ef4444] underline-offset-4 transition-all">
            BACA SEMUA <FaArrowRight />
        </Link>
      </div>

      {/* --- GRID BERITA --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {newsData.map((item, index) => (
          <div 
            key={item.id} 
            className="group relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 flex flex-col h-full"
          >
            {/* IMAGE WRAPPER */}
            <div className="relative h-48 overflow-hidden border-b-4 border-black bg-gray-200">
               {/* Badge Kategori */}
               <span className={`absolute top-2 left-2 ${item.color} text-black font-black text-xs px-3 py-1 border-2 border-black uppercase tracking-wider shadow-[2px_2px_0px_0px_black] z-10`}>
                 {item.category}
               </span>
               
               <img 
                 src={item.image} 
                 alt={item.title} 
                 className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-500 grayscale group-hover:grayscale-0"
               />
            </div>

            {/* CONTENT */}
            <div className="p-5 flex flex-col flex-grow">
               <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-3 border-b-2 border-gray-100 pb-2 border-dashed">
                  <FaCalendarAlt /> {item.date}
               </div>
               
               <h3 className="text-xl font-black text-black leading-tight mb-4 group-hover:text-[#ef4444] transition-colors line-clamp-2">
                 {item.title}
               </h3>

               <div className="mt-auto pt-4">
                 <Link 
                    to={`/berita/${item.id}`} 
                    className="inline-flex items-center justify-between w-full font-bold bg-black text-white px-4 py-2 border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors"
                 >
                    BACA
                    <FaArrowRight />
                 </Link>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Button Mobile Only */}
      <div className="mt-8 text-center md:hidden">
         <Link to="/berita" className="inline-block bg-[#ef4444] text-white font-black px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_black]">
            LIHAT SEMUA BERITA
         </Link>
      </div>

    </div>
  );
}