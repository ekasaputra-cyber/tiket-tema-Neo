import React, { useState, useEffect, useRef, useCallback } from 'react';
import HomeCard from '../components/CardHome'; // Pastikan path ini benar sesuai struktur folder Anda
import RegionNav from '../components/regionNav';

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // --- REFS FOR INFINITE SCROLL ---
  const observer = useRef();

  // --- CONFIG ---
  const STORAGE_URL = 'https://api.artatix.co.id/';

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchEvents = async () => {
      // Jika sudah tidak ada data lagi, hentikan fetch
      if (!hasMore) return;

      setLoading(true);
      try {
        const response = await fetch(`https://api.artatix.co.id/api/v1/customer/event?page=${page}`);
        const json = await response.json();
        
        if (json?.data?.data) {
          const newEvents = json.data.data;
          
          // Gabungkan data lama + data baru
          setEvents(prevEvents => {
            return [...prevEvents, ...newEvents];
          });

          // Cek apakah halaman selanjutnya (nextPage) null
          // Jika null atau array kosong, berarti data sudah habis
          if (json.data.nextPage === null || newEvents.length === 0) {
            setHasMore(false);
          }
        } else {
          // Jika struktur JSON tidak sesuai atau error
          setHasMore(false);
        }
      } catch (error) {
        console.error("Gagal mengambil data event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    
    // PERBAIKAN: Menambahkan 'hasMore' ke dependency array agar warning hilang
  }, [page, hasMore]); 


  // --- 2. OBSERVER (SENSOR SCROLL) ---
  const lastEventElementRef = useCallback(node => {
    if (loading) return; // Jangan trigger jika sedang loading
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      // Jika elemen terakhir terlihat di layar DAN masih ada data
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1); // Tambah halaman -> Trigger useEffect
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);


  // --- HELPER: FORMAT TANGGAL ---
  const formatDateIndo = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="">
          <RegionNav />
        </div>
      <div className="container mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Event Terdekat</h1>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((item, index) => {
            // Logic: Cek apakah ini kartu terakhir di list
            if (events.length === index + 1) {
              return (
                // Pasang REF di sini untuk trigger load page berikutnya
                <div ref={lastEventElementRef} key={`${item.id}-${index}`}>
                  <HomeCard
                    title={item.name}
                    slug={item.slug}
                    date={formatDateIndo(item.dateStart)}
                    imageUrl={item.image ? `${STORAGE_URL}${item.image}` : null}
                    lowestPrice={item.lowestPrice}
                    location={item.city || item.province || item.location}
                    dateEnd={item.dateEnd}
                    timeEnd={item.timeEnd}
                  />
                </div>
              );
            } else {
              return (
                <HomeCard
                  key={`${item.id}-${index}`}
                  title={item.name}
                  slug={item.slug}
                  date={formatDateIndo(item.dateStart)}
                  imageUrl={item.image ? `${STORAGE_URL}${item.image}` : null}
                  lowestPrice={item.lowestPrice}
                  location={item.city || item.province || item.location}
                  dateEnd={item.dateEnd}
                  timeEnd={item.timeEnd}
                />
              );
            }
          })}
        </div>

        {/* LOADING STATE (Spinner di bawah) */}
        {loading && (
          <div className="py-8 text-center flex flex-col items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
             <p className="text-gray-500 text-sm">Memuat event lainnya...</p>
          </div>
        )}

        {/* END OF DATA MESSAGE */}
        {!hasMore && events.length > 0 && (
           <p className="text-center text-gray-400 mt-10 text-sm italic">
             Semua event sudah ditampilkan.
           </p>
        )}

        {/* EMPTY STATE */}
        {!loading && events.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Belum ada event tersedia saat ini.</p>
          </div>
        )}

      </div>
    </div>
  );
}