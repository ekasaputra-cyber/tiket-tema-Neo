import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiClock, 
  HiCalendarDays, 
  HiHashtag, 
  HiArrowPath,
  HiMagnifyingGlass,
  HiChevronRight,
  HiCreditCard
} from 'react-icons/hi2';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/masuk');
        return;
      }

      try {
        const res = await fetch('https://api.artatix.co.id/api/v1/customer/transaction', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) throw new Error('Gagal memuat riwayat transaksi');
        const json = await res.json();
        
        if (json.message === 'success') {
          setTransactions(json.data);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Terjadi kesalahan saat memuat data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [navigate]);

  const getFilteredTransactions = () => {
    if (activeFilter === 'all') return transactions;
    return transactions.filter((trx) => {
      const status = trx.status.toLowerCase();
      if (activeFilter === 'success') return status === 'success' || status === 'paid';
      if (activeFilter === 'pending') return status === 'pending' || status === 'waiting_payment';
      if (activeFilter === 'failed') return status === 'failed' || status === 'expired' || status === 'cancelled';
      return false;
    });
  };

  const filteredData = getFilteredTransactions();

  const filterTabs = [
    { id: 'all', label: 'SEMUA' },
    { id: 'success', label: 'DIBAYAR' },
    { id: 'pending', label: 'PENDING' },
    { id: 'failed', label: 'BATAL' },
  ];

  const formatRupiah = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'success': case 'paid': return { color: 'bg-[#4ade80]', label: 'DIBAYAR' };
      case 'pending': case 'waiting_payment': return { color: 'bg-[#facc15]', label: 'PENDING' };
      case 'failed': case 'expired': case 'cancelled': return { color: 'bg-[#ef4444]', label: 'GAGAL' };
      default: return { color: 'bg-gray-300', label: status.toUpperCase() };
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20">
      <HiArrowPath className="animate-spin text-4xl text-[#3b82f6] stroke-2" />
      <p className="font-black mt-4 uppercase text-[10px] tracking-widest italic opacity-50">Narik Data...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-1 md:px-0">
      {/* HEADER - Disesuaikan ukuran mobile */}
      <div className="mb-8 relative">
        <h1 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter italic leading-none">
          Riwayat <span className="text-[#3b82f6] drop-shadow-[2px_2px_0px_black] md:drop-shadow-[3px_3px_0px_black]">Transaksi</span>
        </h1>
        <p className="text-gray-600 font-bold text-[10px] md:text-sm uppercase mt-2 tracking-widest">Lacak pembelian bahagiamu</p>
      </div>

      {/* === FILTER TABS - Mobile: Horizontal Scroll agar hemat tempat === */}
      <div className="flex overflow-x-auto gap-3 mb-8 pb-2 scrollbar-hide">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`
              whitespace-nowrap px-5 py-2 border-[3px] md:border-4 border-black font-black text-[10px] md:text-sm uppercase tracking-tighter transition-all
              shadow-[3px_3px_0px_0px_black] md:shadow-[4px_4px_0px_0px_black]
              ${activeFilter === tab.id ? 'bg-[#facc15] shadow-none translate-x-0.5 translate-y-0.5' : 'bg-white opacity-60'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* === EMPTY STATE === */}
      {filteredData.length === 0 ? (
        <div className="bg-white border-[3px] md:border-4 border-black p-10 md:p-12 shadow-[8px_8px_0px_0px_black] flex flex-col items-center text-center">
          <HiClock className="text-6xl text-gray-200 mb-4 rotate-[-12deg]" />
          <h3 className="text-xl font-black uppercase mb-1">Kantong Kosong!</h3>
          <p className="font-bold text-gray-400 mb-6 uppercase text-[10px] tracking-tight">
             Belum ada transaksi di sini.
          </p>
          <button onClick={() => navigate('/jelajah')} className="bg-[#ef4444] text-white border-[3px] border-black px-6 py-2 font-black uppercase text-xs shadow-[4px_4px_0px_0px_black] flex items-center gap-2">
            <HiMagnifyingGlass /> Cari Event
          </button>
        </div>
      ) : (
        <div className="space-y-8 md:space-y-6">
          {filteredData.map((trx) => {
            const status = getStatusBadge(trx.status);
            return (
              <div 
                key={trx.id} 
                className="group relative bg-white border-[3px] md:border-4 border-black p-5 md:p-6 shadow-[6px_6px_0px_0px_black] md:shadow-[12px_12px_0px_0px_black] active:translate-y-0.5 active:shadow-none transition-all duration-200"
              >
                {/* Floating Order ID - Lebih kecil di Mobile */}
                <div className="absolute -top-3 right-2 md:-top-4 md:right-4 bg-black text-white px-2 py-0.5 font-black text-[8px] md:text-[10px] border-2 border-black flex items-center gap-1 shadow-[2px_2px_0px_0px_#3b82f6] md:shadow-[4px_4px_0px_0px_#3b82f6]">
                   <HiHashtag /> {trx.orderId}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mt-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-0.5 text-[9px] font-black uppercase border-2 border-black shadow-[2px_2px_0px_0px_black] ${status.color}`}>
                        {status.label}
                      </span>
                      <div className="flex items-center text-gray-400 font-bold text-[10px] uppercase tracking-widest italic">
                        <HiCalendarDays className="mr-1 text-sm text-[#ef4444]" /> {formatDate(trx.date)}
                      </div>
                    </div>
                    
                    <h3 className="font-black text-black text-lg md:text-2xl uppercase tracking-tighter leading-tight group-hover:text-[#3b82f6] transition-colors">
                      {trx.event?.name || 'EVENT TIDAK DIKETAHUI'}
                    </h3>
                  </div>

                  {/* Pricing & CTA - Layout Horizontal di Mobile */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t-[3px] md:border-t-0 md:border-l-4 border-dashed border-black pt-4 md:pt-0 md:pl-10">
                    <div className="text-left md:text-right">
                      <p className="text-[8px] md:text-[10px] font-black uppercase opacity-40 mb-0.5 tracking-widest leading-none">Total</p>
                      <p className="text-black font-black text-xl md:text-2xl italic drop-shadow-[1.5px_1.5px_0px_#facc15]">
                        {formatRupiah(trx.grandTotal)}
                      </p>
                    </div>
                    
                    {trx.status.toLowerCase() === 'pending' || trx.status.toLowerCase() === 'waiting_payment' ? (
                      <button className="bg-[#ef4444] text-white px-4 py-2 border-[3px] border-black font-black uppercase text-[10px] shadow-[3px_3px_0px_0px_black] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1">
                        <HiCreditCard /> BAYAR
                      </button>
                    ) : (
                      <button className="font-black text-[10px] md:text-xs uppercase tracking-tighter flex items-center gap-1 hover:underline decoration-[3px] md:decoration-4 decoration-[#facc15] underline-offset-4">
                        DETAIL <HiChevronRight className="stroke-[3px]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}