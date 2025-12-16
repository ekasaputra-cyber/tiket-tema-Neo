// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Import ikon dari react-icons/fa (Font Awesome 5)
import { 
  FaSpinner, 
  FaExclamationCircle, 
  FaUser, 
  FaTicketAlt, 
  FaHistory, 
  FaSignOutAlt, 
  FaCamera, 
  FaEnvelope, 
  FaEdit 
} from 'react-icons/fa';

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
  const token = localStorage.getItem('auth_token');

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate('/masuk');
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
        navigate('/masuk');
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
    window.location.href = '/masuk'; 
  };

  if (loading && !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          {/* ICON LOADING */}
          <FaSpinner className="animate-spin h-10 w-10 text-[#154D71] mb-4" />
          <p className="text-gray-600 font-medium">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm">
          {/* ICON ERROR */}
          <div className="flex justify-center mb-4">
            <FaExclamationCircle className="h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-600 mb-6">{error || 'Profil tidak ditemukan'}</p>
          <button onClick={() => navigate('/masuk')} className="w-full px-4 py-2 bg-[#154D71] text-white rounded-lg">
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          
          {/* === SIDEBAR === */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:sticky md:top-24">
              
              {/* User Info Sidebar */}
              <div className="p-6 border-b border-gray-100 flex items-center md:block">
                <div className="w-14 h-14 bg-[#154D71] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md shrink-0">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4 md:ml-0 md:mt-4">
                  <p className="font-bold text-gray-800 truncate">{profile.name}</p>
                  <p className="text-xs text-gray-500 truncate">{profile.email}</p>
                </div>
              </div>

              {/* Menu Navigasi */}
              <nav className="p-3 space-y-1">
                <button className="w-full flex items-center px-4 py-3 bg-[#154D71]/10 text-[#154D71] font-medium rounded-xl transition">
                  <FaUser className="h-5 w-5 mr-3" />
                  Profil Saya
                </button>
                <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#154D71] rounded-xl transition">
                  <FaTicketAlt className="h-5 w-5 mr-3" />
                  Tiket Saya
                </button>
                <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#154D71] rounded-xl transition">
                  <FaHistory className="h-5 w-5 mr-3" />
                  Riwayat Transaksi
                </button>
              </nav>

              <div className="p-3 mt-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-xl transition"
                >
                  <FaSignOutAlt className="h-5 w-5 mr-3" />
                  Keluar
                </button>
              </div>
            </div>
          </div>

          {/* === CONTENT AREA === */}
          <div className="flex-1">
            
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-[#154D71]">Pengaturan Akun</h1>
              <p className="text-gray-500 text-sm md:text-base mt-1">Kelola informasi profil dan keamanan akun Anda</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Banner Area */}
              <div className="bg-gradient-to-r from-[#154D71] to-[#1e6b9c] p-6 md:p-8 text-white flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/30 overflow-hidden bg-white">
                    {profile.photoProfile ? (
                      <img
                        src={`https://api.artatix.co.id/${profile.photoProfile}`}
                        alt="Profil"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-3xl font-bold text-[#154D71] bg-gray-100 ${profile.photoProfile ? 'hidden' : 'flex'}`}>
                      {profile.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  {/* Tombol Ganti Foto (Kamera) */}
                  <button className="absolute bottom-0 right-0 bg-[#FFD600] text-[#154D71] p-2 rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center">
                    <FaCamera className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-bold">{profile.name}</h2>
                  <p className="text-blue-100 text-sm md:text-base">{profile.email}</p>
                </div>
              </div>

              {/* Form Area */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  
                  {/* Nama */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-[#154D71] bg-white' 
                            : 'border-transparent bg-gray-50 text-gray-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-[#154D71] bg-white' 
                            : 'border-transparent bg-gray-50 text-gray-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Telepon */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon</label>
                    <div className="flex">
                      <span className={`inline-flex items-center px-3 rounded-l-xl border border-r-0 text-gray-500 ${isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-transparent'}`}>+62</span>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber.replace(/^62/, '')}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setFormData(prev => ({ ...prev, phoneNumber: `62${value}` }));
                        }}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-r-xl border transition-all ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-2 focus:ring-[#154D71] bg-white' 
                            : 'border-transparent bg-gray-50 text-gray-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                  {isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">Batal</button>
                      <button onClick={handleSave} disabled={loading} className="px-8 py-2.5 rounded-xl bg-[#154D71] text-white font-bold hover:bg-[#0f3a55]">
                        {loading ? '...' : 'Simpan'}
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="flex items-center px-8 py-2.5 rounded-xl bg-[#FFD600] text-[#154D71] font-bold hover:bg-yellow-400 transition transform active:scale-95">
                      <FaEdit className="h-5 w-5 mr-2" />
                      Edit Profil
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}