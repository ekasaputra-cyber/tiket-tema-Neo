// src/components/PaymentStatus.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function PaymentStatus() {
  const { orderId } = useParams();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://api.artatix.co.id/api/v1/customer/transaction/${orderId}`);
        if (!res.ok) throw new Error('Gagal memuat status');
        const data = await res.json();
        if (data.message === 'success') {
          setStatus(data.data);
        } else {
          throw new Error('Data tidak valid');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchStatus();
  }, [orderId]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-600">Memeriksa status pembayaran...</p>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-600">⚠️ {error || 'Status pembayaran tidak ditemukan'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  // Format harga
  const formatPrice = (price) => `Rp${parseInt(price).toLocaleString('id-ID')}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold">Status Pembayaran</h1>
        <div className="mt-4 flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            status.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            status.status === 'paid' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {status.status.toUpperCase()}
          </span>
          {status.status === 'paid' && (
            <span className="text-green-600 font-semibold">✔️ Sukses</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kiri: Detail Transaksi */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Detail Transaksi</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>ID Pesanan</span>
              <span className="font-mono">{status.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span>{status.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Bayar</span>
              <span className="font-bold">{formatPrice(status.grandTotal)}</span>
            </div>
            {status.expiredAt && (
              <div className="flex justify-between">
                <span>Batas Waktu</span>
                <span>{new Date(status.expiredAt).toLocaleString('id-ID')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Kanan: Event & Tiket */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Event</h2>
          <div className="space-y-3">
            <div>
              <p className="font-medium">{status.event?.name}</p>
              <p className="text-gray-600 mt-1">
                {new Date(status.event?.dateStart).toLocaleDateString('id-ID')} • {status.event?.timeStart} – {status.event?.timeEnd}
              </p>
              <p className="text-gray-600 mt-1">{status.event?.location}, {status.event?.city}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-medium">Tiket</h3>
              {status.tickets?.map((t, idx) => (
                <div key={idx} className="mt-2">
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-gray-600">x{t.qty}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => window.location.href = `/event/${status.event?.widgetSlug}`}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          ← Kembali ke Event
        </button>
        {status.status === 'pending' && (
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Perbarui Status
          </button>
        )}
      </div>
    </div>
  );
}