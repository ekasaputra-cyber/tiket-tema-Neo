import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaHistory, 
  FaCalendarAlt, 
  FaHashtag, 
  FaSpinner, 
  FaExclamationCircle,
  FaSearch
} from 'react-icons/fa';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State untuk Filter Aktif (Default: 'all')
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

  // === LOGIKA FILTER ===
  const getFilteredTransactions = () => {
    if (activeFilter === 'all') return transactions;

    return transactions.filter((trx) => {
      const status = trx.status.toLowerCase();

      if (activeFilter === 'success') {
        // Kategori "Dibayar"
        return status === 'success' || status === 'paid';
      } 
      
      if (activeFilter === 'pending') {
        // Kategori "Belum Dibayar"
        return status === 'pending' || status === 'waiting_payment';
      } 
      
      if (activeFilter === 'failed') {
        // Kategori "Dibatalkan" (Gagal / Kadaluarsa / Batal)
        return status === 'failed' || status === 'expired' || status === 'cancelled';
      }

      return false;
    });
  };

  const filteredData = getFilteredTransactions();

  // Opsi Filter untuk UI
  const filterTabs = [
    { id: 'all', label: 'Semua' },
    { id: 'success', label: 'Dibayar' },
    { id: 'pending', label: 'Belum Dibayar' },
    { id: 'failed', label: 'Dibatalkan' },
  ];

  // Helper Formatter
  const formatRupiah = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'success': case 'paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'failed': case 'expired': case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // === RENDER LOADING & ERROR ===
  if (loading) return <div className="flex justify-center p-10"><FaSpinner className="animate-spin text-2xl text-[#154D71]" /></div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#154D71]">Riwayat Transaksi</h1>
        <p className="text-gray-500 text-sm md:text-base mt-1">Daftar semua pembelian tiket Anda</p>
      </div>

      {/* === FILTER TABS === */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-4 scrollbar-hide">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              activeFilter === tab.id
                ? 'bg-[#154D71] text-white border-[#154D71] shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* === EMPTY STATE (Jika data kosong setelah difilter) === */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            {activeFilter === 'all' ? <FaHistory className="h-6 w-6 text-gray-400" /> : <FaSearch className="h-6 w-6 text-gray-400" />}
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            {activeFilter === 'all' ? 'Belum Ada Transaksi' : 'Tidak Ada Data'}
          </h3>
          <p className="text-gray-500 mt-2 text-sm">
            {activeFilter === 'all' 
              ? 'Anda belum melakukan pembelian apapun.' 
              : `Tidak ditemukan transaksi dengan status "${filterTabs.find(t => t.id === activeFilter)?.label}".`}
          </p>
        </div>
      ) : (
        /* === LIST TRANSAKSI === */
        <div className="space-y-4">
          {filteredData.map((trx) => (
            <div 
              key={trx.id} 
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
 
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wide rounded-md border ${getStatusColor(trx.status)}`}>
                      {trx.status}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center">
                      <FaHashtag className="w-3 h-3 mr-0.5" /> {trx.orderId}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">
                    {trx.event?.name || 'Nama Event Tidak Tersedia'}
                  </h3>
                  
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaCalendarAlt className="w-3.5 h-3.5 mr-2 text-gray-400" />
                    {formatDate(trx.date)}
                  </div>
                </div>

                {/* Bagian Kanan (Harga & Tombol) */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                  <div className="text-right mb-0 md:mb-2">
                    <p className="text-xs text-gray-500 mb-0.5">Total Pembayaran</p>
                    <p className="text-[#154D71] font-bold text-lg">
                      {formatRupiah(trx.grandTotal)}
                    </p>
                  </div>
                  
                  {trx.status.toLowerCase() === 'pending' ? (
                    <button className="px-4 py-1.5 bg-[#E85434] text-white text-sm font-bold rounded-lg hover:bg-[#d04629] transition">
                      Bayar Sekarang
                    </button>
                  ) : (
                    <button className="text-sm font-medium text-[#154D71] hover:underline hover:text-[#0f3a55]">
                      Lihat Detail &rarr;
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}