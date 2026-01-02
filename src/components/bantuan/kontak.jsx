import React from 'react';
import { HiEnvelope, HiPhone, HiMapPin, HiChatBubbleLeftRight } from "react-icons/hi2"; 
import { FaInstagram, FaWhatsapp, FaLinkedin } from "react-icons/fa6";

const KontakSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* Kolom Info Kontak */}
      <div className="md:col-span-5 space-y-6">
        <div className="bg-[#facc15] border-4 border-black p-6 shadow-[8px_8px_0px_0px_black]">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
            Hubungi Kami <HiChatBubbleLeftRight />
          </h2>
          <p className="font-bold leading-tight mb-6 italic">
            Ada pertanyaan seputar tiket atau ingin kolaborasi event? Tim BeliSenang siap bantu!
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_black]">
              {/* Gunakan HiEnvelope di sini */}
              <HiEnvelope className="text-2xl text-blue-600" />
              <span className="font-bold text-sm">support@belisenang.com</span>
            </div>
            <div className="flex items-center gap-4 bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_black]">
              <HiPhone className="text-2xl text-green-600" />
              <span className="font-bold text-sm">+62 812-XXXX-XXXX</span>
            </div>
            <div className="flex items-start gap-4 bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_black]">
              <HiMapPin className="text-3xl text-red-600" />
              <span className="font-bold text-sm leading-tight">Gedung Lantai 5, <br/>Kota Malang, Jawa Timur</span>
            </div>
          </div>
        </div>

        {/* Media Sosial */}
        <div className="flex gap-4">
          {[<FaInstagram />, <FaWhatsapp />, <FaLinkedin />].map((icon, i) => (
            <button key={i} className="bg-white border-4 border-black p-4 text-2xl shadow-[6px_6px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:bg-bs-yellow">
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Kolom Form */}
      <div className="md:col-span-7 bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_black]">
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="font-black uppercase text-xs tracking-widest">Nama Lengkap</label>
              <input type="text" className="w-full border-2 border-black p-3 font-bold focus:bg-yellow-50 outline-none shadow-[2px_2px_0px_0px_black] focus:shadow-none transition-all" placeholder="Anto Wijaya" />
            </div>
            <div className="space-y-2">
              <label className="font-black uppercase text-xs tracking-widest">Email</label>
              <input type="email" className="w-full border-2 border-black p-3 font-bold focus:bg-yellow-50 outline-none shadow-[2px_2px_0px_0px_black] focus:shadow-none transition-all" placeholder="email@kamu.com" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-black uppercase text-xs tracking-widest">Pesan</label>
            <textarea rows="4" className="w-full border-2 border-black p-3 font-bold focus:bg-yellow-50 outline-none shadow-[2px_2px_0px_0px_black] focus:shadow-none transition-all" placeholder="Tuliskan pesanmu di sini..."></textarea>
          </div>
          <button className="w-full bg-[#3b82f6] text-white font-black uppercase py-4 border-4 border-black shadow-[6px_6px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
            Kirim Pesan Sekarang
          </button>
        </form>
      </div>
    </div>
  );
};

export default KontakSection;