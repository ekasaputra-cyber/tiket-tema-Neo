import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaYoutube, FaFacebookF } from 'react-icons/fa';

export default function Footer() {
  const socialLinks = [
    { icon: <FaInstagram />, href: "https://instagram.com", label: "Instagram", color: "bg-[#f472b6]" }, // Pink
    { icon: <FaTwitter />, href: "https://twitter.com", label: "Twitter", color: "bg-[#3b82f6]" }, // Biru
    { icon: <FaYoutube />, href: "https://youtube.com", label: "Youtube", color: "bg-[#ef4444]" }, // Merah
    { icon: <FaFacebookF />, href: "https://facebook.com", label: "Facebook", color: "bg-[#1d4ed8]" }, // Biru Tua
  ];

  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t-8 border-[#facc15] mt-16 font-mono">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          
          <div className="space-y-4">
             <div className="flex items-center gap-2">
              <h2 className="text-3xl font-black tracking-tighter text-white bg-[#ef4444] px-2 py-1 transform -rotate-2 border-2 border-white">
                BELISENANG
              </h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pr-4 font-bold">
              Platform tiket konser paling seru, paling berwarna, dan paling gampang di Indonesia!
            </p>
          </div>

          <div>
            <h5 className="font-black text-xl mb-6 text-[#facc15] uppercase border-b-2 border-[#facc15] inline-block">Event Seru</h5>
            <ul className="space-y-3 font-bold text-sm">
              <li><Link to="/konser" className="hover:text-[#f472b6] hover:translate-x-2 transition-all inline-block">► MUSIK</Link></li>
              <li><Link to="/festival" className="hover:text-[#f472b6] hover:translate-x-2 transition-all inline-block">► FESTIVAL</Link></li>
              <li><Link to="/standup" className="hover:text-[#f472b6] hover:translate-x-2 transition-all inline-block">► COMEDY</Link></li>
              <li><Link to="/teater" className="hover:text-[#f472b6] hover:translate-x-2 transition-all inline-block">► SENI</Link></li>
            </ul>
          </div>

          <div>
             <h5 className="font-black text-xl mb-6 text-[#10b981] uppercase border-b-2 border-[#10b981] inline-block">Bantuan</h5>
            <ul className="space-y-3 font-bold text-sm">
              <li><Link to="/faq" className="hover:text-[#10b981] hover:translate-x-2 transition-all inline-block">► FAQ</Link></li>
              <li><Link to="/kontak" className="hover:text-[#10b981] hover:translate-x-2 transition-all inline-block">► Kontak</Link></li>
              <li><Link to="/privasi" className="hover:text-[#10b981] hover:translate-x-2 transition-all inline-block">► Privasi</Link></li>
              <li><Link to="/syarat" className="hover:text-[#10b981] hover:translate-x-2 transition-all inline-block">► Syarat</Link></li>
            </ul>
          </div>

          {/* Social Media Blocks */}
          <div>
             <h5 className="font-black text-xl mb-6 text-[#3b82f6] uppercase border-b-2 border-[#3b82f6] inline-block">Ikuti Kami</h5>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href} 
                  target="_blank" 
                  rel="noreferrer"
                  className={`w-12 h-12 flex items-center justify-center text-black border-2 border-white 
                    ${social.color} 
                    shadow-[4px_4px_0px_0px_white] 
                    hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] 
                    transition-all`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

         <div className="pt-8 border-t-2 border-gray-800 text-center">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Belisenang Corp. Let's Party!
          </p>
        </div>
      </div>
    </footer>
  );
}