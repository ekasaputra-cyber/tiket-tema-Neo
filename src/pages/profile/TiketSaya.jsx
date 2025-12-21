import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaTicketAlt, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaQrcode, 
  FaSpinner, 
  FaExclamationCircle 
} from 'react-icons/fa';

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
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <FaSpinner className="animate-spin h-8 w-8 text-[#154D71] mb-2" />
        <p className="text-gray-500">Memuat tiket Anda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
        <FaExclamationCircle className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-gray-600">{error}</p>
        <button onClick={() => fetchTickets(1)} className="mt-4 px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">Coba Lagi</button>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <>
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#154D71]">Tiket Saya</h1>
          <p className="text-gray-500 text-sm md:text-base mt-1">Daftar tiket event aktif yang Anda miliki</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center min-h-[350px]">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FaTicketAlt className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Belum Ada Tiket Aktif</h3>
          <p className="text-gray-500 max-w-sm mt-2 mb-6">
            Anda belum memiliki tiket untuk event mendatang. Yuk cari event seru sekarang!
          </p>
          <button onClick={() => navigate('/jelajah')} className="px-6 py-2.5 bg-[#154D71] text-white rounded-xl font-bold hover:bg-[#0f3a55] transition">
            Jelajah Event
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#154D71]">Tiket Saya</h1>
        <p className="text-gray-500 text-sm md:text-base mt-1">Kelola tiket event yang akan datang</p>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket, index) => {
          const statusInfo = getStatusBadge(ticket.status);
          const isActive = ticket.status === 'active';

          return (
            <div 
              key={index} 
              className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row group relative ${!isActive ? 'opacity-75 grayscale-[0.5]' : ''}`}
            >
              {/* Bagian Kiri: Garis Warna (Biru jika aktif, Abu jika mati) */}
              <div className={`hidden md:flex w-2 ${isActive ? 'bg-[#154D71]' : 'bg-gray-400'}`}></div>

              {/* Bagian Tengah: Info Event */}
              <div className="p-5 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase border ${statusInfo.class}`}>
                    {statusInfo.text}
                  </span>
                  <span className="text-xs text-gray-400">ID: {ticket.id || '-'}</span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 group-hover:text-[#154D71] transition-colors">
                  {ticket.eventName || 'Nama Event'} 
                </h3>

                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaCalendarAlt className="w-4 h-4 mr-2 text-[#E85434]" />
                    {formatDate(ticket.eventDate || ticket.date)}
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-[#E85434]" />
                    {ticket.venueName || 'Lokasi Event'}
                  </div>
                </div>
              </div>

              {/* Bagian Kanan: Garis putus-putus & Tombol */}
              <div className="relative border-t md:border-t-0 md:border-l border-dashed border-gray-300 bg-gray-50 p-5 flex flex-col items-center justify-center min-w-[180px]">
                
                {/* Lingkaran Dekorasi */}
                <div className="absolute w-4 h-4 bg-gray-50 rounded-full -top-2 -left-2 z-10"></div>
                <div className="absolute w-4 h-4 bg-gray-50 rounded-full -top-2 -right-2 md:top-auto md:-bottom-2 md:right-auto md:-left-2 z-10"></div>

                <div className="text-center mb-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Jumlah Tiket</p>
                  <p className={`text-xl font-bold ${isActive ? 'text-[#154D71]' : 'text-gray-600'}`}>{ticket.quantity || 1} Tiket</p>
                </div>

                <button 
                  disabled={!isActive}
                  className={`flex items-center justify-center w-full px-4 py-2 text-white text-sm font-bold rounded-lg transition transform shadow-md 
                    ${isActive 
                      ? 'bg-[#154D71] hover:bg-[#0f3a55] hover:-translate-y-0.5 shadow-blue-900/10' 
                      : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  <FaQrcode className="mr-2" />
                  {isActive ? 'E-Ticket' : 'Expired'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOMBOL LOAD MORE */}
      <div className="mt-6 text-center">
        <button
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 hover:text-[#154D71] transition disabled:opacity-50"
        >
          {loadingMore ? (
            <span className="flex items-center">
              <FaSpinner className="animate-spin mr-2" /> Memuat...
            </span>
          ) : (
            'Muat Lebih Banyak'
          )}
        </button>
      </div>
    </>
  );
}