import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiTicket, 
  HiCalendarDays, 
  HiMapPin, 
  HiQrCode, 
  HiArrowPath, 
  HiExclamationTriangle,
  HiMagnifyingGlass
} from 'react-icons/hi2';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]); 
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1, 
    nextPage: null
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); 
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const fetchTickets = async (page = 1, isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    else setLoadingMore(true);

    setError('');

    // ============================================================
    // BAGIAN 1: KODE API ASLI (DIKOMENTARI)
    // ============================================================
    /*
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      navigate('/masuk');
      return;
    }

    try {
      const url = `https://api.artatix.co.id/api/v1/customer/transaction/ticket?event=active&ticket=transaction&page=${page}&limit=4`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Gagal memuat tiket');

      const json = await res.json();

      if (json.message === 'success') {
        const resultData = json.data; 
        
        if (isLoadMore) {
          setTickets(prev => [...prev, ...resultData.data]);
        } else {
          setTickets(resultData.data);
        }

        setPagination({
          currentPage: resultData.currentPage,
          totalPages: resultData.totalPages,
          nextPage: resultData.nextPage
        });
      } else {
        setError(json.message || 'Gagal mengambil data');
      }

    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Terjadi kesalahan koneksi saat memuat tiket.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
    */

    // ============================================================
    // BAGIAN 2: DATA DUMMY (1 AKTIF, 1 TIDAK AKTIF)
    // ============================================================
    try {
      const dummyData = [
        {
          id: "TRX-ACT-001",
          eventName: "Sound of Downtown 2025",
          eventDate: "2025-09-12T18:30:00.000Z", // Masa Depan
          venueName: "Lapangan Rampal, Malang",
          quantity: 2,
          status: "active" // Status Aktif
        },
        {
          id: "TRX-EXP-002",
          eventName: "Java Jazz Festival 2024",
          eventDate: "2024-05-25T20:00:00.000Z", // Masa Lalu
          venueName: "JIExpo Kemayoran, Jakarta",
          quantity: 1,
          status: "inactive" // Status Tidak Aktif / Selesai
        }
      ];

      setTimeout(() => {
        if (isLoadMore) {
          setTickets(prev => [...prev, ...dummyData]);
        } else {
          setTickets(dummyData);
        }
        
        setLoading(false);
        setLoadingMore(false);
      }, 1000);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    fetchTickets(pagination.currentPage + 1, true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // Helper untuk warna status
  const getStatusBadge = (status) => {
    if (status === 'active') {
      return { class: 'bg-green-100 text-green-700 border-green-200', text: 'Aktif' };
    }
    return { class: 'bg-gray-100 text-gray-500 border-gray-200', text: 'Selesai' };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <HiArrowPath className="animate-spin text-5xl text-[#3b82f6] mb-4 stroke-2" />
        <p className="font-black uppercase tracking-widest italic">Mencari Tiket Kamu...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-1 md:px-0">
      {/* HEADER - Ukuran Font disesuaikan untuk HP */}
      <div className="mb-8 md:mb-10 relative">
        <h1 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter italic leading-none">
          Tiket <span className="text-[#ef4444] drop-shadow-[2px_2px_0px_black] md:drop-shadow-[3px_3px_0px_black]">Saya</span>
        </h1>
        <p className="text-gray-600 font-bold text-[10px] md:text-sm uppercase mt-2 tracking-widest">Akses kebahagiaanmu di sini</p>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white border-[3px] md:border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_black] md:shadow-[12px_12px_0px_0px_black] text-center">
          <HiTicket className="mx-auto text-6xl text-gray-200 mb-4 rotate-12" />
          <h3 className="text-xl font-black uppercase mb-2">Belum ada tiket!</h3>
          <button 
            onClick={() => navigate('/jelajah')}
            className="bg-[#facc15] border-[3px] border-black px-6 py-2 font-black uppercase shadow-[4px_4px_0px_0px_black] flex items-center gap-2 mx-auto text-sm"
          >
            <HiMagnifyingGlass /> Cari Event
          </button>
        </div>
      ) : (
        <div className="space-y-10 md:space-y-8">
          {tickets.map((ticket, index) => {
            const isActive = ticket.status === 'active';
            return (
              <div 
                key={index} 
                className={`
                  relative flex flex-col md:flex-row border-[3px] md:border-4 border-black bg-white
                  shadow-[6px_6px_0px_0px_black] md:shadow-[12px_12px_0px_0px_black]
                  transition-all group
                  ${!isActive ? 'grayscale opacity-60 scale-[0.98]' : 'hover:-translate-y-1'}
                `}
              >
                {/* STATUS STICKER - Lebih kecil di mobile */}
                <div className={`
                  absolute -top-3 -left-2 md:-top-4 md:-left-4 z-20 px-3 md:px-4 py-1 font-black uppercase text-[9px] md:text-xs border-2 border-black shadow-[2px_2px_0px_0px_black]
                  ${isActive ? 'bg-[#4ade80] rotate-[-2deg]' : 'bg-gray-400 rotate-0'}
                `}>
                  {isActive ? 'READY! 🔥' : 'SELESAI'}
                </div>

                {/* BAGIAN INFO (ATAS/KIRI) */}
                <div className="flex-1 p-5 md:p-8 flex flex-col justify-center border-b-[3px] md:border-b-0 md:border-r-4 border-dashed border-black bg-white relative">
                  
                  {/* Dekorasi Lubang Tiket - Muncul di kanan-kiri garis putus-putus pada Mobile */}
                  <div className="absolute -left-[14px] -bottom-[14px] md:-right-[14px] md:-top-[14px] w-6 h-6 bg-[#fffbeb] border-[3px] md:border-4 border-black rounded-full z-10"></div>
                  <div className="absolute -right-[14px] -bottom-[14px] w-6 h-6 bg-[#fffbeb] border-[3px] md:border-4 border-black rounded-full z-10"></div>

                  <div className="flex flex-col gap-0.5 mb-4">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">ID: {ticket.id}</span>
                    <h2 className="text-xl md:text-4xl font-black text-black uppercase tracking-tighter leading-tight group-hover:text-[#3b82f6] transition-colors">
                      {ticket.eventName}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                    <div className="flex items-center gap-3 bg-[#fffbeb] border-2 border-black p-2 shadow-[2px_2px_0px_0px_black]">
                      <HiCalendarDays className="text-xl text-[#ef4444]" />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase opacity-50">Waktu</span>
                        <span className="font-black text-[10px] uppercase">{formatDate(ticket.eventDate)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-[#fffbeb] border-2 border-black p-2 shadow-[2px_2px_0px_0px_black]">
                      <HiMapPin className="text-xl text-[#3b82f6]" />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase opacity-50">Lokasi</span>
                        <span className="font-black text-[10px] uppercase truncate max-w-[180px]">{ticket.venueName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BAGIAN AKSI (BAWAH/KANAN) */}
                <div className={`
                  md:w-64 p-5 md:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center gap-4
                  ${isActive ? 'bg-[#fefce8]' : 'bg-gray-50'}
                `}>
                  <div className="text-left md:text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-0.5">Quantity</p>
                    <p className="text-2xl md:text-4xl font-black italic drop-shadow-[1.5px_1.5px_0px_#facc15] leading-none">{ticket.quantity} PX</p>
                  </div>

                  <button 
                    disabled={!isActive}
                    className={`
                      w-auto md:w-full py-3 px-5 md:py-4 md:px-6 border-[3px] md:border-4 border-black font-black uppercase text-[10px] md:text-sm flex items-center justify-center gap-2 transition-all
                      ${isActive 
                        ? 'bg-[#3b82f6] text-white shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                    `}
                  >
                    <HiQrCode className="text-lg md:text-2xl" /> {isActive ? 'E-TIKET' : 'EXPIRED'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LOAD MORE - Full width di mobile */}
      {!loading && tickets.length > 0 && (
        <div className="mt-12 flex justify-center pb-10">
          <button 
            onClick={() => fetchTickets(1, true)}
            disabled={loadingMore}
            className="w-full md:w-auto bg-white border-[3px] md:border-4 border-black px-10 py-4 font-black uppercase italic shadow-[6px_6px_0px_0px_black] active:bg-[#facc15] transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-sm"
          >
            {loadingMore ? 'LOADING...' : <><HiArrowPath className="text-lg" /> MUAT LAGI</>}
          </button>
        </div>
      )}
    </div>
  );
}