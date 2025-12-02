import React, { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Beranda', href: '/' },
    { name: 'Jelajah', href: '/jelajah' },
    { name: 'Tentang', href: '/tentang' },
    { name: 'Hubungi Kami', href: '/kontak' },
  ];

  return (
    <header className="px-4 md:px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center">

        <div className="text-xl font-bold text-gray-800">Tiket</div>

        {/* MenDes */}
        <nav className="hidden md:flex space-x-5">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-700 hover:text-gray-900 font-medium transition"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Bhs */}
        <div className="hidden md:flex items-center space-x-2">
          <span className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 font-medium bg-gray-50">
            ID
          </span>
          <a
            href="/masuk"
            className="px-4 py-1.5 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition"
          >
            Masuk
          </a>
        </div>

        {/* Hamburger mobile*/}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* MobMen */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4">
          <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 font-medium py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="flex items-center pt-2 space-x-2">
              <span className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 font-medium bg-gray-50">
                ID
              </span>
              <a
                href="/masuk"
                className="px-3 py-1.5 bg-black text-white rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Masuk
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}