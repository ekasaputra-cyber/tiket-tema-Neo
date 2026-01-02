import React from 'react';

const SyaratSection = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_black] overflow-hidden">
        <div className="bg-black text-white p-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter italic">Ketentuan Pengguna</h2>
        </div>
        
        <div className="p-8 md:p-12 space-y-8">
          <section>
            <div className="inline-block bg-[#facc15] border-2 border-black px-3 py-1 font-black text-sm mb-4 transform -rotate-2">UMUM</div>
            <p className="font-bold leading-relaxed">Dengan mengakses BeliSenang.com, Anda setuju untuk mematuhi semua aturan yang berlaku. Kami berhak membatalkan tiket jika ditemukan indikasi kecurangan atau penggunaan bot.</p>
          </section>

          <section>
            <div className="inline-block bg-[#3b82f6] text-white border-2 border-black px-3 py-1 font-black text-sm mb-4 transform rotate-1">PEMBELIAN & REFUND</div>
            <ul className="list-none space-y-3">
              {["Tiket yang sudah dibeli tidak dapat ditukar kecuali event dibatalkan.", 
                "E-Ticket akan dikirim otomatis ke email terdaftar.", 
                "Satu akun maksimal hanya boleh membeli 4 tiket per event."].map((text, i) => (
                <li key={i} className="flex gap-3 items-start font-bold">
                  <span className="text-red-600">★</span> {text}
                </li>
              ))}
            </ul>
          </section>

          <div className="bg-gray-100 border-2 border-black p-4 font-black text-xs text-center uppercase tracking-widest">
            Pelajari lebih lanjut dengan menghubungi tim kami.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyaratSection;