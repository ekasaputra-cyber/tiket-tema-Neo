import React, { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // Container Utama: Sticky agar menempel di atas saat scroll
    <header className="sticky top-0 z-50 px-2 mt-2 mx-2">
      <div className="bg-[#154D71] rounded-2xl px-4 md:px-6 py-2 shadow-lg">
        <div className="flex items-center justify-between">
          
          {/* BAGIAN KIRI: Logo & Navigasi Desktop */}
          <div className="flex items-center">
            {/* <a href="/"> */}
              {/* Logo */}
              {/* <img 
                src="/logo.png" 
                alt="logo" 
                className="h-8 w-auto mr-6 rounded bg-white/10" // added bg-white/10 if logo is transparent
              /> */}
            {/* </a> */}
            <a href="/" className="text-xl font-bold text-white mr-6">BeliSenang.com</a>
            
            {/* Menu Desktop (Hidden di Mobile) */}
            <nav className="hidden md:flex space-x-6">
              <a href="/jelajah" className="text-white font-medium text-lg hover:text-[#FFD600] transition">Jelajah</a>
              <a href="/tentang" className="text-white font-medium text-lg hover:text-[#FFD600] transition">Tentang</a>
            </nav>
          </div>

          {/* BAGIAN TENGAH: Search Bar (Hidden di Mobile) */}
          <div className="hidden md:flex flex-1 mx-4 max-w-lg">
            <div className="flex items-center w-full bg-white rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#FFD600]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
              <input 
                type="text" 
                placeholder="Cari event di sini ..." 
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400" 
              />
            </div>
          </div>

          {/* BAGIAN KANAN: Tombol Aksi & Hamburger */}
          <div className="flex items-center gap-3">
            
            {/* Tombol Desktop (Hidden di Mobile) */}
            <div className="hidden md:flex space-x-3">
              <a href="/masuk" className="bg-[#FFD600] text-black font-semibold px-6 py-2 rounded-md text-lg hover:bg-yellow-400 transition">
                Masuk
              </a>
              <a href="/daftar" className="bg-[#FFD600] text-black font-semibold px-6 py-2 rounded-md text-lg hover:bg-yellow-400 transition">
                Daftar
              </a>
            </div>

            {/* Tombol Hamburger (Mobile Only) */}
            <button
              className="md:hidden text-white focus:outline-none p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {/* Muncul jika isMenuOpen = true */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20 flex flex-col space-y-4 pb-2">
            
            {/* Search Bar Mobile */}
            <div className="flex items-center w-full bg-white rounded-lg px-3 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
              <input type="text" placeholder="Cari event..." className="w-full bg-transparent outline-none text-gray-700" />
            </div>

            {/* Menu Links */}
            <div className="flex flex-col space-y-2">
              <a href="/event" className="text-white font-medium text-lg hover:bg-white/10 px-2 py-1 rounded">Event</a>
              <a href="/atraksi" className="text-white font-medium text-lg hover:bg-white/10 px-2 py-1 rounded">Atraksi</a>
            </div>

            {/* Tombol Mobile */}
            <div className="flex flex-col space-y-2">
              <a href="/masuk" className="bg-[#FFD600] text-center text-black font-semibold px-6 py-2 rounded-md hover:bg-yellow-400">
                Masuk
              </a>
              <a href="/daftar" className="border-2 border-[#FFD600] text-center text-[#FFD600] font-semibold px-6 py-2 rounded-md hover:bg-[#FFD600] hover:text-black transition">
                Daftar
              </a>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}