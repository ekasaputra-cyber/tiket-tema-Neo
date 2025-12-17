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
  // Menambahkan clone di awal dan akhir untuk efek infinite loop
  const images = [
    originalImages[originalImages.length - 2],
    originalImages[originalImages.length - 1],
    ...originalImages,
    originalImages[0],
    originalImages[1],
  ];

  const imagesLength = images.length;
  const [currentIndex, setCurrentIndex] = useState(2); // Mulai dari index 2 (gambar asli pertama)
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  // State untuk mendeteksi layar mobile
  const [isMobile, setIsMobile] = useState(false);
  
  const intervalRef = useRef(null);
  const TRANSITION_DURATION = 1000;

  // Cek ukuran layar saat load dan resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

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

  // Infinite loop reset logic
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

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // --- LOGIC DOTS ---
  // Menghitung index asli (0-4) dari currentIndex yang mengandung clone
  // Rumus: (currentIndex - 2) modulo total asli. 
  // Ditambah length agar tidak negatif saat transisi mundur.
  const realIndex = (currentIndex - 2 + originalImages.length) % originalImages.length;

  // Fungsi jika user klik dot secara langsung
  const handleDotClick = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index + 2); // +2 karena ada 2 clone di depan
  };

  return (
    <section className="bg-gray-50 py-4 md:py-8 my-5 pt-20">
      <div
        className="max-w-7xl mx-auto relative"
        onMouseEnter={() => clearInterval(intervalRef.current)}
        onMouseLeave={() => {
          // Restart interval logic (optional, but good for UX consistency)
        }}
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
                <div className="w-full h-56 md:h-72 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden shadow-sm">
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
            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-[#1C6EA4] rounded-full shadow-lg hover:bg-white flex items-center justify-center border border-gray-100 backdrop-blur-sm transition-all"
            style={{ width: isMobile ? 36 : 48, height: isMobile ? 36 : 48 }}
          >
            <FaChevronLeft size={isMobile ? 16 : 24} />
          </button>

          {/* Tombol Next */}
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-[#1C6EA4] rounded-full shadow-lg hover:bg-white flex items-center justify-center border border-gray-100 backdrop-blur-sm transition-all"
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
              // Logic class: Jika aktif width w-8 (panjang), jika tidak w-2 (bulat kecil)
              className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                realIndex === idx 
                  ? 'w-8 bg-[#1C6EA4]' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}