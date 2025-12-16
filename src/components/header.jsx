import React, { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* === HEADER UTAMA (Sticky) === */}
      <header className="sticky top-0 z-40 w-full bg-[#154D71] shadow-lg">
        {/* Gunakan container untuk membatasi lebar konten di dalam header */}
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            
            {/* BAGIAN KIRI: Logo & Navigasi Desktop */}
            <div className="flex items-center">
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
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open navigation menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* === MOBILE SIDEBAR MENU (Overlay & Drawer) === */}
      
      {/* 1. Overlay Hitam (Backdrop) */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* 2. Sliding Drawer (Muncul dari Kanan) */}
      <div 
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 flex flex-col h-full">
          
          {/* Header Sidebar (Logo & Close Button) */}
          <div className="flex items-center justify-between mb-8 border-b pb-4">
            <span className="text-xl font-bold text-[#154D71]">BeliSenang</span>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-500 hover:text-red-500 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar Mobile */}
          <div className="mb-6">
            <div className="flex items-center w-full bg-gray-100 rounded-lg px-3 py-3 border focus-within:ring-2 focus-within:ring-[#154D71]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
              <input type="text" placeholder="Cari event..." className="w-full bg-transparent outline-none text-gray-700" />
            </div>
          </div>

          {/* Menu Links */}
          <nav className="flex flex-col space-y-4 mb-8">
            <a href="/" className="text-gray-700 font-medium text-lg hover:text-[#154D71]">Beranda</a>
            <a href="/event" className="text-gray-700 font-medium text-lg hover:text-[#154D71]">Event</a>
            <a href="/tentang" className="text-gray-700 font-medium text-lg hover:text-[#154D71]">Tentang</a>
          </nav>

          {/* Tombol Aksi Mobile */}
          <div className="mt-auto flex flex-col space-y-3">
            <a href="/masuk" className="bg-[#154D71] text-white text-center font-semibold px-6 py-3 rounded-xl hover:bg-[#0f3a55] transition">
              Masuk
            </a>
            <a href="/daftar" className="border-2 border-[#154D71] text-[#154D71] text-center font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition">
              Daftar
            </a>
          </div>
        </div>
      </div>
    </>
  );
}