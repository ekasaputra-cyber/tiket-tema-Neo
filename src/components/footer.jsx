import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-10 px-4 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-bold text-gray-800 mb-3">Tiket</h4>
          <p className="text-gray-600 text-sm">
            Platform pencarian event terdekat di Indonesia.
          </p>
        </div>
        <div>
          <h5 className="font-semibold text-gray-800 mb-2">Navigasi</h5>
          <ul className="space-y-1 text-gray-600 text-sm">
            <li><a href="/" className="hover:underline">Beranda</a></li>
            <li><a href="/jelajah" className="hover:underline">Jelajah</a></li>
            <li><a href="/tentang" className="hover:underline">Tentang</a></li>
            <li><a href="/kontak" className="hover:underline">Hubungi Kami</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-gray-800 mb-2">Legal</h5>
          <ul className="space-y-1 text-gray-600 text-sm">
            <li><a href="/syarat" className="hover:underline">Syarat & Ketentuan</a></li>
            <li><a href="/privasi" className="hover:underline">Kebijakan Privasi</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-gray-800 mb-2">Ikuti Kami</h5>
          <p className="text-gray-600 text-sm">Instagram • Twitter • TikTok</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Tiket. Semua hak dilindungi.
      </div>
    </footer>
  );
}