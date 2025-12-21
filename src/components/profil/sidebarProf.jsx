import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaTicketAlt, FaHistory, FaSignOutAlt } from 'react-icons/fa';

export default function ProfileSidebar({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/masuk';
  };

  // Helper untuk mengecek menu aktif
  const isActive = (path) => location.pathname === path;
  const activeClass = "bg-[#154D71]/10 text-[#154D71] font-medium";
  const inactiveClass = "text-gray-600 hover:bg-gray-50 hover:text-[#154D71]";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:sticky md:top-24">
      
      {/* User Info Header */}
      <div className="p-6 border-b border-gray-100 flex items-center md:block">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/30 overflow-hidden bg-white flex items-center justify-center">
            {user.photoProfile ? (
                <img 
                src={`https://api.artatix.co.id/${user.photoProfile}`} 
                alt="Profil" 
                className="w-full h-full object-cover" 
                />
            ) : (
                <span className="text-3xl font-bold text-[#154D71]">
                {user.name?.charAt(0).toUpperCase()}
                </span>
            )}
        </div>
        <div className="ml-4 md:ml-0 md:mt-4">
          <p className="font-bold text-gray-800 truncate">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email || 'email@example.com'}</p>
        </div>
      </div>

      {/* Menu Navigasi */}
      <nav className="p-3 space-y-1">
        <button 
          onClick={() => navigate('/profil')}
          className={`w-full flex items-center px-4 py-3 rounded-xl transition ${isActive('/profil') ? activeClass : inactiveClass}`}
        >
          <FaUser className="h-5 w-5 mr-3" />
          Profil Saya
        </button>

        <button 
          onClick={() => navigate('/profil/tiket')}
          className={`w-full flex items-center px-4 py-3 rounded-xl transition ${isActive('/profil/tiket') ? activeClass : inactiveClass}`}
        >
          <FaTicketAlt className="h-5 w-5 mr-3" />
          Tiket Saya
        </button>

        <button 
          onClick={() => navigate('/profil/transaksi')}
          className={`w-full flex items-center px-4 py-3 rounded-xl transition ${isActive('/profil/transaksi') ? activeClass : inactiveClass}`}
        >
          <FaHistory className="h-5 w-5 mr-3" />
          Riwayat Transaksi
        </button>
      </nav>

      {/* Logout */}
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
  );
}