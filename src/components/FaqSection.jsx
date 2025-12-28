// src/components/FaqSection.jsx
import React, { useState, useEffect } from 'react';
// Import icons dari react-icons/fa6
import { 
  FaChevronDown, 
  FaRegEnvelope, 
  FaTicket, 
  FaUserGroup, 
  FaCircleInfo,
  FaCircleQuestion
} from "react-icons/fa6";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);

  const getIcon = (index) => {
    const icons = [
      <FaRegEnvelope />, 
      <FaTicket />,      
      <FaUserGroup />,   
      <FaCircleInfo />   
    ];
    // Jika data lebih dari 4, dia akan looping icon-nya
    return icons[index % icons.length];
  };

  useEffect(() => {
    // Simulasi data dari API
    const dataDariApi = [
      {
        id: 1,
        question: "Apa Maksud Email Paid & Expired?",
        answer: `
          <p class="mb-2">Ada dua jenis email yang mungkin kamu terima:</p>
          <ul class="list-none space-y-2">
            <li class="bg-white border-2 border-black p-2 rounded-md flex items-start gap-2">
              <div><span class="font-black text-green-600">EMAIL PAID:</span> Bukti pembayaran sah.</div>
            </li>
            <li class="bg-white border-2 border-black p-2 rounded-md flex items-start gap-2">
              <div><span class="font-black text-red-600">EMAIL EXPIRED:</span> Batal otomatis karena telat bayar.</div>
            </li>
          </ul>
        `
      },
      {
        id: 2,
        question: "Syarat & Lokasi Penukaran Tiket",
        answer: `
          <p class="mb-2">Cek <strong>Instagram resmi</strong> untuk lokasi pasnya.</p>
          <p class="font-bold">Wajib bawa:</p>
          <ul class="list-disc list-inside pl-2 font-semibold">
            <li>E-Tiket Asli</li>
            <li>Identitas Diri (KTP/SIM)</li>
          </ul>
        `
      },
      {
        id: 3,
        question: "Beli Banyak Tiket, Data Pemesan Gimana?",
        answer: "Data pemesan bisa <strong>disamakan</strong> (satu nama) atau <strong>dibedakan</strong> sesuai kebutuhan teman-temanmu."
      },
      {
        id: 4,
        question: "Info Rundown & Detail Acara",
        answer: "Silakan hubungi atau cek media sosial <strong>pihak penyelenggara</strong> secara langsung ya!"
      }
    ];

    setFaqData(dataDariApi);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Judul Section dengan Icon */}
      <div className="mb-10 text-center relative">
        <div className="inline-block relative">
            {/* Icon Dekorasi di pojok */}
            <FaCircleQuestion className="absolute -top-6 -right-8 text-5xl text-[#facc15] drop-shadow-[2px_2px_0_#000] animate-bounce" />
            
            <h2 className="text-4xl md:text-6xl font-black uppercase text-black mb-4 drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)]">
            Pusat <span className="text-[#ef4444]">Bantuan</span>
            </h2>
        </div>
        <p className="text-lg font-bold text-gray-700 bg-white inline-block px-4 py-1 border-2 border-black transform -rotate-2">
          Baca ini dulu sebelum tanya admin!
        </p>
      </div>

      {/* List Pertanyaan */}
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div 
            key={item.id}
            className={`border-4 border-black bg-white transition-all duration-300 ${openIndex === index ? 'shadow-[8px_8px_0px_0px_#000]' : 'shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1'}`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left px-4 md:px-6 py-4 flex justify-between items-center font-black uppercase hover:bg-yellow-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                {/* Icon Kategori (Kiri) */}
                <div className={`text-2xl md:text-3xl p-2 border-2 border-black rounded-full transition-colors ${openIndex === index ? 'bg-black text-[#facc15]' : 'bg-[#e0f2fe] text-black group-hover:bg-[#facc15]'}`}>
                    {getIcon(index)}
                </div>
                
                {/* Teks Pertanyaan */}
                <span className="text-lg md:text-2xl">{item.question}</span>
              </div>

              {/* Icon Panah (Kanan) */}
              <span className={`transform transition-transform duration-300 ml-4 ${openIndex === index ? 'rotate-180' : ''}`}>
                <FaChevronDown className="text-2xl" />
              </span>
            </button>
            
            {/* Konten Jawaban */}
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100 border-t-4 border-black' : 'max-h-0 opacity-0'
              }`}
            >
              <div 
                className="p-6 bg-[#fffbeb] text-lg font-medium leading-relaxed text-slate-800 prose prose-slate max-w-none prose-p:my-2 prose-ul:my-2"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}