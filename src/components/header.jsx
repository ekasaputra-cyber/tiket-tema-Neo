import React, { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState(null);

  // Fungsi cek status login
  const checkLoginStatus = async () => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token); // Ubah jadi boolean true/false

    if (token) {
      try {
        const res = await fetch('https://api.artatix.co.id/api/v1/customer/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.message === 'success') {
          setProfile(data.data);
        }
      } catch (error) {
        console.error("Gagal memuat profil", error);
      }
    } else {
      setProfile(null);
    }
  };

  useEffect(() => {
    // 1. Cek saat pertama load
    checkLoginStatus();

    // 2. Pasang 'telinga' untuk mendengar teriakan 'auth-update' dari LoginCard
    const handleAuthUpdate = () => {
        console.log("Header mendengar login berhasil!"); // Debugging
        checkLoginStatus();
    };
    
    window.addEventListener('auth-update', handleAuthUpdate);

    // Bersihkan listener saat komponen dicopot
    return () => window.removeEventListener('auth-update', handleAuthUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsLoggedIn(false);
    setProfile(null);
    window.location.href = '/masuk';
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#3b82f6] border-b-4 border-black">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            
            {/* LOGO */}
            <div className="flex items-center">
              <a href="/" className="text-2xl md:text-3xl font-black text-[#facc15] tracking-tighter mr-8 transition-transform hover:-rotate-2" 
                 style={{ textShadow: '2px 2px 0px #000', WebkitTextStroke: '1px black' }}>
                BELISENANG
              </a>
              <nav className="hidden md:flex space-x-6">
                <a href="/jelajah" className="text-white font-bold text-lg hover:text-[#facc15] transition-colors shadow-black drop-shadow-md">Jelajah</a>
                <a href="/tentang" className="text-white font-bold text-lg hover:text-[#facc15] transition-colors shadow-black drop-shadow-md">Tentang</a>
              </nav>
            </div>

            {/* SEARCH */}
            <div className="hidden md:flex flex-1 mx-4 max-w-lg">
              <div className="flex items-center w-full bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:shadow-none focus-within:translate-x-[4px] focus-within:translate-y-[4px] transition-all duration-200">
                <div className="pl-3 pr-2">🔎</div>
                <input type="text" placeholder="Cari event seru..." className="w-full bg-transparent py-2 outline-none text-black font-bold placeholder-gray-500 uppercase text-sm" />
              </div>
            </div>

            {/* TOMBOL DESKTOP */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex space-x-3 items-center">
                {isLoggedIn ? (
                  <a href="/profil" className="bg-[#f472b6] text-black border-2 border-black font-bold px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2">
                      👤 {profile ? profile.name?.split(' ')[0] : 'Akun'}
                  </a>
                ) : (
                  <>
                    <a href="/masuk" className="bg-[#ef4444] text-white border-2 border-black font-bold px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">MASUK</a>
                    <a href="/daftar" className="bg-[#facc15] text-black border-2 border-black font-bold px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">DAFTAR</a>
                  </>
                )}
              </div>
              <button className="md:hidden text-white bg-black border-2 border-white p-2 shadow-[3px_3px_0px_0px_#facc15]" onClick={() => setIsMenuOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsMenuOpen(false)}></div>
          <div className="relative w-[80%] max-w-[300px] bg-[#fef3c7] h-full border-l-4 border-black shadow-[-10px_0_20px_rgba(0,0,0,0.5)] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
              <span className="text-2xl font-black text-black">MENU</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-3xl font-bold hover:text-red-600">✕</button>
            </div>
            <nav className="flex flex-col space-y-4">
               <a href="/" className="text-xl font-bold border-2 border-black bg-white p-3 shadow-[4px_4px_0px_0px_black] text-center">BERANDA</a>
               <a href="/event" className="text-xl font-bold border-2 border-black bg-[#a855f7] text-white p-3 shadow-[4px_4px_0px_0px_black] text-center">EVENT</a>
            </nav>
            <div className="mt-auto space-y-3">
                {isLoggedIn ? (
                    <>
                      {/* --- DISINI PERBAIKAN CSS-NYA --- */}
                      {/* HAPUS 'block', biarkan 'flex' */}
                      <a href="/profil" className="w-full bg-[#f472b6] text-black border-2 border-black font-bold p-3 shadow-[4px_4px_0px_0px_black] flex items-center justify-center gap-2">
                        👤 {profile ? `Halo, ${profile.name.split(' ')[0]}` : 'Akun Saya'}
                      </a>
                      <button onClick={handleLogout} className="w-full bg-[#ef4444] text-white border-2 border-black font-bold p-3 shadow-[4px_4px_0px_0px_black]">KELUAR</button>
                    </>
                ) : (
                    <>
                    <a href="/masuk" className="block text-center w-full bg-[#3b82f6] text-white border-2 border-black font-bold p-3 shadow-[4px_4px_0px_0px_black]">MASUK</a>
                    <a href="/daftar" className="block text-center w-full bg-[#facc15] text-black border-2 border-black font-bold p-3 shadow-[4px_4px_0px_0px_black]">DAFTAR</a>
                    </>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}