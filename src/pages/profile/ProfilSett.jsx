import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaCamera, FaUser, FaEnvelope, FaEdit, FaSpinner } from 'react-icons/fa';

export default function ProfileSettings() {
  const { user, setUser } = useOutletContext(); // Ambil data dari Layout
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  
  // State form lokal
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });

  // Sinkronisasi data user ke form saat halaman dimuat
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('auth_token');
    setLoadingSave(true);
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
        setUser(data.data); // Update data di Layout/Sidebar
        setIsEditing(false);
        alert('Profil berhasil diperbarui!');
      } else {
        alert(data.message || 'Gagal update');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSave(false);
    }
  };

  if (!user) return <div className="p-8 text-center">Memuat Form...</div>;

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#154D71]">Pengaturan Akun</h1>
        <p className="text-gray-500 text-sm md:text-base mt-1">Kelola informasi profil dan keamanan akun Anda</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Banner Area */}
        <div className="bg-gradient-to-r from-[#154D71] to-[#1e6b9c] p-6 md:p-8 text-white flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/30 overflow-hidden bg-white flex items-center justify-center">
              {user.photoProfile ? (
                 <img src={`https://api.artatix.co.id/${user.photoProfile}`} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                 <span className="text-3xl font-bold text-[#154D71]">{user.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <button className="absolute bottom-0 right-0 bg-[#FFD600] text-[#154D71] p-2 rounded-full shadow-lg hover:scale-110 transition">
              <FaCamera className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold">{user.name}</h2>
            <p className="text-blue-100 text-sm md:text-base">{user.email}</p>
          </div>
        </div>

        {/* Form Area */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${isEditing ? 'border-gray-300 focus:ring-2 focus:ring-[#154D71]' : 'border-transparent bg-gray-50'}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 bg-gray-50 text-gray-500">+62</span>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber.replace(/^62/, '')}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: `62${e.target.value.replace(/\D/g, '')}` }))}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-r-xl border transition-all ${isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'}`}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">Batal</button>
                <button onClick={handleSave} disabled={loadingSave} className="px-8 py-2.5 rounded-xl bg-[#154D71] text-white font-bold hover:bg-[#0f3a55]">
                  {loadingSave ? '...' : 'Simpan'}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="flex items-center px-8 py-2.5 rounded-xl bg-[#FFD600] text-[#154D71] font-bold hover:bg-yellow-400 transition">
                <FaEdit className="h-5 w-5 mr-2" />
                Edit Profil
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}