import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const originalImages = [
  { src: '/assets/img/1 (1).png', alt: 'Image 1' },
  { src: '/assets/img/1 (2).png', alt: 'Image 2' },
  { src: '/assets/img/1 (3).png', alt: 'Image 3' },
  { src: '/assets/img/1 (2).png', alt: 'Image 4' },
  { src: '/assets/img/1 (1).png', alt: 'Image 5' },
];

export default function HeroBanner() {
  const images = [
    originalImages[originalImages.length - 2],
    originalImages[originalImages.length - 1],
    ...originalImages,
    originalImages[0],
    originalImages[1],
  ];

  const imagesLength = images.length;
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef(null);
  const TRANSITION_DURATION = 1000;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slideWidth = isMobile ? 100 : 50;

  const nextSlide = useCallback(() => {
    if (currentIndex >= imagesLength - 2) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, imagesLength]);

  const prevSlide = useCallback(() => {
    if (currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  }, [currentIndex]);

  useEffect(() => {
    const transitionTimeout = setTimeout(() => {
      if (currentIndex === images.length - 2) {
        setIsTransitioning(false);
        setCurrentIndex(2);
      } else if (currentIndex === 1) {
        setIsTransitioning(false);
        setCurrentIndex(images.length - 3);
      }
    }, TRANSITION_DURATION);
    return () => clearTimeout(transitionTimeout);
  }, [currentIndex, images.length]);

  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 3000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const realIndex = (currentIndex - 2 + originalImages.length) % originalImages.length;

  const handleDotClick = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index + 2);
  };

  return (
    <section className="bg-[#F5F3FF] py-4 md:py-8 my-5 pt-20">
      <div
        className="max-w-7xl mx-auto relative"
        onMouseEnter={() => clearInterval(intervalRef.current)}
      >
        <div id="img-carousel" className="overflow-hidden px-0 md:px-4 relative group">
          <div
            className="flex"
            style={{
              transform: `translateX(-${currentIndex * slideWidth}%)`,
              transition: isTransitioning ? `transform ${TRANSITION_DURATION}ms ease-in-out` : 'none',
            }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 px-2 flex items-center justify-center"
                style={{ width: `${slideWidth}%` }}
              >
                {/* UBAH: bg-gray-50 -> bg-white (Agar gambar lebih kontras & bersih) */}
                <div className="w-full h-56 md:h-72 bg-white rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden shadow-sm border border-purple-100">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tombol Previous */}
          <button
            onClick={prevSlide}
            // UBAH: text-[#1C6EA4] -> text-[#6D28D9] (Ungu)
            // UBAH: hover:bg-white -> hover:bg-[#FFD028] (Kuning Tiket)
            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-[#6D28D9] rounded-full shadow-lg hover:bg-[#FFD028] hover:text-[#6D28D9] flex items-center justify-center border border-purple-100 backdrop-blur-sm transition-all"
            style={{ width: isMobile ? 36 : 48, height: isMobile ? 36 : 48 }}
          >
            <FaChevronLeft size={isMobile ? 16 : 24} />
          </button>

          {/* Tombol Next */}
          <button
            onClick={nextSlide}
            // UBAH: text-[#1C6EA4] -> text-[#6D28D9] (Ungu)
            // UBAH: hover:bg-white -> hover:bg-[#FFD028] (Kuning Tiket)
            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-[#6D28D9] rounded-full shadow-lg hover:bg-[#FFD028] hover:text-[#6D28D9] flex items-center justify-center border border-purple-100 backdrop-blur-sm transition-all"
            style={{ width: isMobile ? 36 : 48, height: isMobile ? 36 : 48 }}
          >
            <FaChevronRight size={isMobile ? 16 : 24} />
          </button>
        </div>

        {/* --- DOTS INDICATORS --- */}
        <div className="flex justify-center items-center gap-2 mt-4 md:mt-6">
          {originalImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              // UBAH LOGIC WARNA:
              // Aktif: bg-[#6D28D9] (Ungu Utama)
              // Tidak Aktif: bg-purple-200 hover:bg-[#EC4899] (Pink saat hover)
              className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                realIndex === idx 
                  ? 'w-8 bg-[#6D28D9]' 
                  : 'w-2 bg-purple-200 hover:bg-[#EC4899]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}