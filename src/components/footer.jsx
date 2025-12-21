import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaYoutube, FaFacebookF, FaMusic } from 'react-icons/fa';

export default function Footer() {
  const socialLinks = [
    { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram" },
    { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter" },
    { icon: <FaYoutube />, href: "https://youtube.com", label: "Youtube" },
    { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook" },
  ];

  return (
    <footer className="bg-[#0e3b6b] text-white pt-16 pb-8 px-4 mt-16 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          <div className="space-y-4">
             {/* ... kode logo ... */}
             <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-wide">belisenang</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed pr-4">
              Platform tiket konser dan event musik terbesar di Indonesia. Temukan pengalaman musik yang tak terlupakan.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-lg mb-4 text-white">Event</h5>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li><Link to="/konser" className="hover:text-yellow-400 hover:translate-x-1 transition-all inline-block">Konser Musik</Link></li>
              <li><Link to="/festival" className="hover:text-yellow-400 hover:translate-x-1 transition-all inline-block">Festival</Link></li>
              <li><Link to="/standup" className="hover:text-yellow-400 hover:translate-x-1 transition-all inline-block">Stand-up Comedy</Link></li>
              <li><Link to="/teater" className="hover:text-yellow-400 hover:translate-x-1 transition-all inline-block">Teater & Drama</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-lg mb-4 text-white">Bantuan</h5>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li><Link to="/faq" className="hover:text-yellow-400 hover:translate-x-1 transition-all inline-block">FAQ</Link></li>
              <li><Link to="/kontak" className="hover:text-yellow-400 hover:translate-x-1 transition-all inline-block">Hubungi Kami</Link></li>
              <li><Link to="/privasi" className="hover:text-yellow-400 hover:translate-x-1 transition-all inline-block">Kebijakan Privasi</Link></li>
              <li><Link to="/syarat" className="hover:text-yellow-400 hover:translate-x-1 transition-all inline-block">Syarat & Ketentuan</Link></li>
            </ul>
          </div>

          {/* Ikuti Kami */}
          <div>
            <h5 className="font-bold text-lg mb-4 text-white">Ikuti Kami</h5>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href} 
                  target="_blank" 
                  rel="noreferrer" // Penting untuk keamanan link eksternal
                  className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-yellow-400 hover:text-[#0e3b6b] transition-all duration-300 hover:-translate-y-1"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

         <div className="pt-8 border-t border-slate-600/50 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} belisenang. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}