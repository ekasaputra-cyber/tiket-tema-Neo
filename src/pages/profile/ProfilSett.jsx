import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { HiCamera, HiUser, HiEnvelope, HiPencilSquare, HiCheck } from 'react-icons/hi2';

export default function ProfileSettings() {
  const { user, setUser } = useOutletContext(); 
  const [isEditing, setIsEditing] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });

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
        setUser(data.data);
        setIsEditing(false);
        alert('Profil Berhasil Diupdate! 🔥');
      } else {
        alert(data.message || 'Gagal update');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSave(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_black]">
        <p className="font-black animate-pulse uppercase text-xs tracking-widest">Memuat Data...</p>
      </div>
    );
  }

  return (
    <>
      {/* JUDUL HALAMAN - Ukuran lebih proporsional di mobile */}
      <div className="mb-6 md:mb-8 relative px-1">
        <h1 className="text-2xl md:text-4xl font-black text-black uppercase tracking-tighter italic">
          Pengaturan <span className="text-[#3b82f6] drop-shadow-[2px_2px_0px_black]">Akun</span>
        </h1>
        <p className="text-gray-600 font-bold text-[10px] md:text-sm uppercase mt-1 tracking-widest">Identitas digital BeliSenang</p>
      </div>

      <div className="bg-white border-[3px] md:border-4 border-black shadow-[8px_8px_0px_0px_black] md:shadow-[12px_12px_0px_0px_black] overflow-hidden">
        
        {/* Banner Area - Padding dikurangi di mobile (p-6) */}
        <div className="bg-[#3b82f6] border-b-[3px] md:border-b-4 border-black p-6 md:p-10 flex flex-col md:flex-row items-center gap-5 md:gap-8 relative">
          <div className="relative group">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-white border-[3px] md:border-4 border-black shadow-[4px_4px_0px_0px_black] md:shadow-[6px_6px_0px_0px_black] overflow-hidden flex items-center justify-center relative z-10">
              {user?.photoProfile ? (
                 <img src={`https://api.artatix.co.id/${user.photoProfile}`} alt="Profil" className="w-full h-full object-cover" />
              ) : (
                 <HiUser className="text-4xl md:text-6xl text-gray-200" />
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 bg-[#facc15] text-black p-2 md:p-3 border-2 border-black shadow-[2px_2px_0px_0px_black] md:shadow-[3px_3px_0px_0px_black] z-20 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all">
              <HiCamera className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>

          <div className="text-center md:text-left text-white drop-shadow-[1.5px_1.5px_0px_black] md:drop-shadow-[2px_2px_0px_black]">
            <h2 className="text-xl md:text-4xl font-black uppercase tracking-tighter italic leading-tight">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1 justify-center md:justify-start opacity-90">
                <HiEnvelope className="text-xs" />
                <p className="font-bold text-[10px] md:text-base tracking-tight">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Form Area - Padding mobile p-5 */}
        <div className="p-5 md:p-10 bg-[#fffbeb]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-black/50"><HiUser /></div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-11 pr-4 py-3 md:py-4 border-[3px] md:border-4 border-black font-bold uppercase text-sm md:text-base transition-all ${isEditing ? 'bg-white shadow-[4px_4px_0px_0px_black] focus:shadow-none focus:translate-x-0.5 focus:translate-y-0.5' : 'bg-gray-100 opacity-60'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-black/50"><HiEnvelope /></div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-11 pr-4 py-3 md:py-4 border-[3px] md:border-4 border-black font-bold text-sm md:text-base transition-all ${isEditing ? 'bg-white shadow-[4px_4px_0px_0px_black]' : 'bg-gray-100 opacity-60'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black">WhatsApp</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 md:px-4 border-[3px] md:border-4 border-r-0 border-black bg-black text-white font-black text-xs md:text-base">+62</span>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber.replace(/^62/, '')}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: `62${e.target.value.replace(/\D/g, '')}` }))}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 md:py-4 border-[3px] md:border-4 border-black font-bold text-sm md:text-base transition-all ${isEditing ? 'bg-white shadow-[4px_4px_0px_0px_black]' : 'bg-gray-100 opacity-60'}`}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons - Di mobile menjadi Full Width Stacked */}
          <div className="mt-10 flex flex-col md:flex-row justify-end gap-3 border-t-[3px] md:border-t-4 border-black pt-8 border-dashed">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="w-full md:w-auto px-8 py-3 border-[3px] md:border-4 border-black font-black uppercase text-xs hover:bg-gray-100 active:bg-gray-200 transition-all">
                  BATAL
                </button>
                <button onClick={handleSave} disabled={loadingSave} className="w-full md:w-auto px-10 py-3 bg-[#10b981] text-white border-[3px] md:border-4 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2">
                  {loadingSave ? '...' : <><HiCheck className="text-lg" /> SIMPAN</>}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-[#facc15] text-black border-[3px] md:border-4 border-black font-black uppercase text-sm shadow-[6px_6px_0px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                <HiPencilSquare className="text-xl" /> Edit Profil
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}