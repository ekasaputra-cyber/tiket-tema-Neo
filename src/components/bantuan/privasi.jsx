import React from 'react';

const PrivacySection = () => {
  const sections = [
    { title: "1. Data yang Kami Kumpulkan", content: "BeliSenang.com mengumpulkan data pribadi seperti nama, email, dan nomor telepon saat Anda mendaftar atau melakukan pembelian tiket untuk memastikan transaksi aman." },
    { title: "2. Penggunaan Informasi", content: "Informasi Anda digunakan untuk memproses pesanan, mengirimkan e-ticket, serta memberikan update seputar event yang Anda minati di platform kami." },
    { title: "3. Keamanan Data", content: "Kami menggunakan enkripsi standar industri untuk melindungi data Anda. Kami tidak akan pernah menjual data pribadi Anda kepada pihak ketiga manapun." }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">

      <div className="space-y-8 bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0px_0px_black]">
        {sections.map((sec, i) => (
          <div key={i} className="border-b-2 border-dashed border-black pb-6 last:border-0 last:pb-0">
            <h3 className="text-xl md:text-2xl font-black uppercase mb-3">{sec.title}</h3>
            <p className="font-bold text-gray-700 leading-relaxed italic">"{sec.content}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacySection;