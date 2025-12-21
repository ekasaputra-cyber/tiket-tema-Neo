import React from 'react';

const EventBanner = () => {
  return (
    <div className="w-full flex justify-center py-6 px-4 md:py-10 bg-gray-50">
      {/* PERUBAHAN CONTAINER:
        1. p-6 (mobile) -> sm:p-10 (tablet) -> md:p-16 (desktop)
        2. rounded-xl (mobile) -> rounded-2xl (desktop)
      */}
      <div className="w-full max-w-6xl bg-white border border-gray-200 rounded-xl md:rounded-2xl p-6 sm:p-10 md:p-16 text-center shadow-sm">
        
        {/* Heading */}
        {/* text-2xl (mobile) -> text-3xl (tablet) -> text-4xl (desktop) */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-[#1B3C59] leading-tight">
          Punya Event? Daftarkan <span className="text-[#E85434] inline-block">Sekarang!</span>
        </h2>

        {/* Subtext */}
        {/* text-sm (mobile) -> text-base (tablet) -> text-lg (desktop) */}
        <p className="text-gray-500 text-sm sm:text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
          Bergabunglah dengan kami dan daftarkan event Anda untuk menarik lebih banyak audiens!
        </p>

        {/* Button */}
        {/* w-full (mobile) -> w-auto (tablet ke atas) */}
        <button className="w-full sm:w-auto bg-[#E85434] hover:bg-[#d04629] text-white font-bold py-3 px-6 md:px-8 rounded-lg shadow-lg shadow-orange-200 transition-all duration-300 transform hover:-translate-y-1">
          Daftarkan Event Anda
        </button>

      </div>
    </div>
  );
};

export default EventBanner;