// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  // Ambil token dari localStorage
  const token = localStorage.getItem('auth_token');
  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('https://api.artatix.co.id/api/v1/customer/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Gagal memuat profil');

        const data = await res.json();
        if (data.message === 'success') {
          setProfile(data.data);
          setFormData({
            name: data.data.name || '',
            email: data.data.email || '',
            phoneNumber: data.data.phoneNumber || ''
          });
        } else {
          throw new Error(data.message || 'Data tidak valid');
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://api.artatix.co.id/api/v1/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.message === 'success') {
        setProfile(data.data);
        setIsEditing(false);
        alert('Profil berhasil diperbarui!');
      } else {
        setError(data.message || 'Gagal menyimpan perubahan');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Gagal menyimpan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Memuat profil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Error: {error || 'Profil tidak ditemukan'}</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Kembali ke Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-md p-6">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
            {profile.name?.charAt(0) || 'G'}
          </div>
          <div className="ml-3">
            <p className="font-semibold text-gray-800">{profile.email}</p>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>

        <nav className="space-y-2">
          <button
            className="w-full flex items-center px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a4 4 0 014 4h0a4 4 0 01-4 4h0a4 4 0 01-4-4h0a4 4 0 014-4z" />
            </svg>
            Profil
          </button>

          <button
            className="w-full flex items-center px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 14h.01M18 14h.01M15 11h3M12 11h.01M9 11h.01M7 21h10v-2a3 3 0 005.356-2.87l-2.26-2.26A3 3 0 0015.356 9h-6.716a3 3 0 00-2.87l-2.26 2.26A3 3 0 007 14v2" />
            </svg>
            Tiket Transaksi
          </button>

          <button
            className="w-full flex items-center px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h-2m-2 0H9M9 20V4m2 0V16M17 4m-2 4h2m2-4h2" />
            </svg>
            Tiket Personal
          </button>

          <button
            className="w-full flex items-center px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9M5 11V9m2 2a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z" />
            </svg>
            Transaksi
          </button>
        </nav>

        <div className="mt-8 pt-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-5.356-2.87l-2.26-2.26A3 3 0 0111 16v1c4.083 0 7.5-3.417 7.5-7.5S15.083 4 11 4c-1.761 0-3.204.672-4.204 1.672-1 .995-1.328 2.167-1.204 3.356L9 10.5M15 13.5H9" />
            </svg>
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-grow p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Profil</h1>

        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Gambar Profil */}
        <div className="flex items-center mb-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden">
            {profile.photoProfile ? (
              <img
                src={`https://api.artatix.co.id/${profile.photoProfile}`}
                alt="Foto Profil"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            
            <div
              className={`absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-600 bg-gray-200 ${
                profile.photoProfile ? 'hidden' : 'flex'
              }`}
            >
              {profile.fullname?.charAt(0) || profile.email?.charAt(0) || 'G'}
            </div>
          </div>

          <div className="ml-4">
            <p className="text-sm text-gray-600">Gambar Profil</p>
            <div className="flex space-x-2 mt-2">
              <button className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                Ganti Foto
              </button>
              <button className="px-4 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100">
                Hapus Foto
              </button>
            </div>
          </div>
        </div>

          {/* Form Edit Profil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg ${
                  isEditing ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none' : 'bg-gray-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg ${
                  isEditing ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none' : 'bg-gray-50'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  +62
                </span>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber.replace(/^62/, '')}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData(prev => ({ ...prev, phoneNumber: `62${value}` }));
                  }}
                  disabled={!isEditing}
                  className={`block w-full min-w-0 flex-1 rounded-r-md border border-gray-300 px-3 py-2 ${
                    isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:outline-none' : 'bg-gray-50'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="mr-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg text-white ${
                    loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              >
                Edit Profil
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}