"use client";

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Jika di Next.js, ganti ke 'next/link'
import { MdArrowForward } from "react-icons/md";
import HomeCard from './CardHome';
import { compactDecrypt } from 'jose'; // Pastikan sudah npm install jose

export default function EventSlider() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const STORAGE_URL = 'https://api.artatix.co.id/';
  const SEE_ALL_LINK = '/jelajah';

  // Kunci dekripsi yang kita temukan dari source code Artatix
  const SECRET_KEY = new TextEncoder().encode("yJKCGitfzd8LFMEhOua76ttCLLxLJ6Dr");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.artatix.co.id/api/v1/customer/event?page=1`);
        const json = await response.json();

        if (json?.data?.data) {
          const rawData = json.data.data;

          // 1. CEK: Jika data berupa string (JWE Terenkripsi)
          if (typeof rawData === 'string' && rawData.startsWith('eyJ')) {
            try {
              const { plaintext } = await compactDecrypt(rawData, SECRET_KEY);
              const decodedString = new TextDecoder().decode(plaintext);
              const decryptedJSON = JSON.parse(decodedString);

              // 2. LOGIKA PENTING: Ambil array dari properti .data milik hasil dekripsi
              const arrayEvents = decryptedJSON?.data || [];
              setEvents(Array.isArray(arrayEvents) ? arrayEvents : []);
            } catch (decError) {
              console.error("Gagal Dekripsi:", decError);
              setEvents([]);
            }
          } 
          // 3. FALLBACK: Jika data sudah berupa Array (Tidak terenkripsi)
          else {
            setEvents(Array.isArray(rawData) ? rawData : []);
          }
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatEventDate = (startStr, endStr) => {
    if (!startStr) return '-';
    const startDate = new Date(startStr);
    const endDate = endStr ? new Date(endStr) : null;
    const optionsFull = { day: 'numeric', month: 'long', year: 'numeric' };

    if (!endDate || startDate.toDateString() === endDate.toDateString()) {
      return startDate.toLocaleDateString('id-ID', optionsFull);
    }
    const startDay = startDate.getDate();
    return `${startDay} - ${endDate.toLocaleDateString('id-ID', optionsFull)}`;
  };

  return (
    <div className="container mx-auto max-w-6xl my-16 border-4 border-black bg-[#e0f2fe] p-6 shadow-[8px_8px_0px_0px_black] rounded-sm font-sans">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-black text-black uppercase italic transform -skew-x-6">
            <span className="bg-[#facc15] px-2 border-2 border-black">Event</span> Terdekat
        </h1>
        
        <Link 
            to={SEE_ALL_LINK} 
            className="bg-black text-white font-bold px-6 py-2 border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-all flex items-center gap-2 shadow-[4px_4px_0px_0px_#ef4444]"
        >
            LIHAT SEMUA
            <MdArrowForward size={22} />
        </Link>
      </div>

      {/* --- LOADING STATE --- */}
      {loading && (
         <div className="flex space-x-4 overflow-hidden">
             {[1, 2, 3].map((n) => (
                 <div key={n} className="min-w-[280px] h-72 bg-white border-4 border-black animate-pulse flex items-center justify-center">
                    <span className="font-bold text-gray-300 text-4xl">LOADING...</span>
                 </div>
             ))}
         </div>
      )}

      {/* --- SLIDER CONTENT --- */}
      {!loading && Array.isArray(events) && events.length > 0 && (
        <div className="flex overflow-x-auto pb-6 gap-6 scrollbar-hide snap-x">
          {events.map((item, index) => (
            <div key={`${item.id}-${index}`} className="min-w-[280px] md:min-w-[320px] snap-center transform hover:-translate-y-2 transition-transform duration-300">
              <div className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white h-full mt-2">
                  <HomeCard
                    title={item.name}
                    slug={item.slug}
                    date={formatEventDate(item.dateStart, item.dateEnd)}
                    imageUrl={item.image ? `${STORAGE_URL}${item.image}` : null}
                    lowestPrice={item.lowestPrice}
                    location={item.city || item.province || item.location}
                    dateEnd={item.dateEnd}
                    timeEnd={item.timeEnd}
                  />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- EMPTY STATE --- */}
      {!loading && (!Array.isArray(events) || events.length === 0) && (
        <div className="text-center py-12 bg-white border-2 border-black border-dashed">
          <p className="text-black font-bold text-xl uppercase">Belum ada event, nanti balik lagi ya!</p>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}