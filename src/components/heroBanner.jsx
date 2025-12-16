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
  
  // State untuk mendeteksi layar mobile
  const [isMobile, setIsMobile] = useState(false);
  
  const intervalRef = useRef(null);
  const TRANSITION_DURATION = 1000;

  // Cek ukuran layar saat load dan resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px adalah breakpoint md di Tailwind
    };

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Tentukan lebar slide berdasarkan device
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

  // Infinite loop reset
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

  return (
    <section className="bg-white py-4 md:py-8 my-5 pt-20">
      <div
        className="max-w-7xl mx-auto relative"
        onMouseEnter={() => clearInterval(intervalRef.current)}
        onMouseLeave={() => {
          intervalRef.current = setInterval(() => nextSlide(), 3000);
        }}
      >
        <div id="img-carousel" className="overflow-hidden px-0 md:px-4 relative group">
          <div
            className="flex"
            style={{
              // Gunakan slideWidth dinamis (100% atau 50%)
              transform: `translateX(-${currentIndex * slideWidth}%)`,
              transition: isTransitioning ? `transform ${TRANSITION_DURATION}ms ease-in-out` : 'none',
            }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 px-2 flex items-center justify-center"
                // Lebar item dinamis
                style={{ width: `${slideWidth}%` }}
              >
                {/* Tinggi responsive: h-56 di mobile, h-72 di desktop */}
                <div className="w-full h-56 md:h-72 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tombol Navigasi - Dibuat sedikit lebih kecil di mobile */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-[#1C6EA4] rounded-full shadow-lg hover:bg-white flex items-center justify-center border border-gray-100 backdrop-blur-sm"
            style={{ width: isMobile ? 36 : 48, height: isMobile ? 36 : 48 }}
          >
            <FaChevronLeft size={isMobile ? 16 : 24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-[#1C6EA4] rounded-full shadow-lg hover:bg-white flex items-center justify-center border border-gray-100 backdrop-blur-sm"
            style={{ width: isMobile ? 36 : 48, height: isMobile ? 36 : 48 }}
          >
            <FaChevronRight size={isMobile ? 16 : 24} />
          </button>
        </div>
      </div>
    </section>
  );
}