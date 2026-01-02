import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  HiUser, 
  HiTicket, 
  HiClock, 
  HiArrowLeftOnRectangle 
} from 'react-icons/hi2';

export default function ProfileSidebar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/masuk';
  };

  const isActive = (path) => location.pathname === path;

  // Class untuk Menu Desktop (Vertikal)
  const getDesktopClass = (path) => {
    const base = "w-full flex items-center px-4 py-4 border-4 border-black font-black uppercase text-sm tracking-tighter transition-all mb-3 ";
    return isActive(path) 
      ? base + "bg-[#facc15] shadow-none translate-x-1 translate-y-1" 
      : base + "bg-white shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1";
  };

  // Class untuk Menu Mobile (Horizontal)
  const getMobileClass = (path) => {
    const base = "flex-shrink-0 flex items-center gap-2 px-4 py-2 border-[3px] border-black font-black uppercase text-[10px] tracking-tighter transition-all ";
    return isActive(path)
      ? base + "bg-[#facc15] shadow-none translate-y-0.5"
      : base + "bg-white shadow-[3px_3px_0px_0px_black]";
  };

  return (
    <div className="md:sticky md:top-24 space-y-6">
      
      {/* 1. PROFILE CARD (Responsive) */}
      <div className="bg-[#3b82f6] border-[3px] md:border-4 border-black p-4 md:p-6 shadow-[6px_6px_0px_0px_black] md:shadow-[8px_8px_0px_0px_black] relative overflow-hidden">
        <div className="flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-6 relative z-10">
          {/* Avatar */}
          <div className="w-14 h-14 md:w-28 md:h-28 bg-white border-[3px] md:border-4 border-black shadow-[3px_3px_0px_0px_black] md:shadow-[4px_4px_0px_0px_black] overflow-hidden flex items-center justify-center">
            {user?.photoProfile ? (
              <img src={`https://api.artatix.co.id/${user.photoProfile}`} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              <HiUser className="text-3xl md:text-6xl text-gray-200" />
            )}
          </div>
          {/* Text */}
          <div className="text-left md:text-center">
            <h3 className="text-lg md:text-xl font-black text-white uppercase leading-none drop-shadow-[2px_2px_0px_black] truncate max-w-[150px] md:max-w-none">
              {user?.name || 'USER'}
            </h3>
            <p className="text-[10px] md:text-xs font-bold text-white/80 mt-1 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* 2. MENU NAVIGASI MOBILE (Horizontal Scroll - Muncul Hanya di HP) */}
      <div className="md:hidden flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
        <button onClick={() => navigate('/profil')} className={getMobileClass('/profil')}>
          <HiUser className="text-base" /> Profil
        </button>
        <button onClick={() => navigate('/profil/tiket')} className={getMobileClass('/profil/tiket')}>
          <HiTicket className="text-base" /> Tiket
        </button>
        <button onClick={() => navigate('/profil/transaksi')} className={getMobileClass('/profil/transaksi')}>
          <HiClock className="text-base" /> Transaksi
        </button>
        <button onClick={handleLogout} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-[3px] border-black bg-red-500 text-white font-black uppercase text-[10px] shadow-[3px_3px_0px_0px_black]">
          <HiArrowLeftOnRectangle className="text-base" /> Keluar
        </button>
      </div>

      {/* 3. MENU NAVIGASI DESKTOP (Muncul Hanya di Desktop) */}
      <nav className="hidden md:flex flex-col">
        <button onClick={() => navigate('/profil')} className={getDesktopClass('/profil')}>
          <HiUser className="text-xl mr-3" /> Profil Saya
        </button>
        <button onClick={() => navigate('/profil/tiket')} className={getDesktopClass('/profil/tiket')}>
          <HiTicket className="text-xl mr-3" /> Tiket Saya
        </button>
        <button onClick={() => navigate('/profil/transaksi')} className={getDesktopClass('/profil/transaksi')}>
          <HiClock className="text-xl mr-3" /> Riwayat Transaksi
        </button>
        <div className="pt-4 mt-2 border-t-4 border-black border-dotted">
          <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-4 bg-[#ef4444] text-white border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            <HiArrowLeftOnRectangle className="text-xl mr-3" /> Keluar Akun
          </button>
        </div>
      </nav>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}