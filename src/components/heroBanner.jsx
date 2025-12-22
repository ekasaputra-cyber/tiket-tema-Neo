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
  const TRANSITION_DURATION = 800; // Lebih cepat sedikit agar snappy

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
    const interval = setInterval(() => nextSlide(), 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const realIndex = (currentIndex - 2 + originalImages.length) % originalImages.length;
  const handleDotClick = (index) => {
    setIsTransitioning(true);
    setCurrentIndex(index + 2);
  };

  return (
    // Background Cream/Kuning Pucat dengan Border Atas Bawah
    <section className="bg-[#fffbeb] py-10 border-b-4 border-black">
      <div
        className="max-w-7xl mx-auto relative px-4"
        onMouseEnter={() => clearInterval(intervalRef.current)}
      >
        {/* FRAME GAMBAR: Border Tebal + Shadow Keras */}
        <div id="img-carousel" className="overflow-hidden relative border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm">
          <div
            className="flex"
            style={{
              transform: `translateX(-${currentIndex * slideWidth}%)`,
              transition: isTransitioning ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)` : 'none',
            }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 flex items-center justify-center border-r-4 border-black bg-white"
                style={{ width: `${slideWidth}%` }}
              >
                <div className="w-full h-56 md:h-[350px] flex items-center justify-center overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
                  />
                  {/* Overlay Pattern Dot (Opsional untuk efek retro) */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dot-noise-light-grey.png')] opacity-20 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Tombol Previous (KOTAK) */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#facc15] text-black border-y-4 border-r-4 border-black w-12 h-16 flex items-center justify-center hover:bg-white hover:pl-2 transition-all"
          >
            <FaChevronLeft size={24} />
          </button>

          {/* Tombol Next (KOTAK) */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-[#facc15] text-black border-y-4 border-l-4 border-black w-12 h-16 flex items-center justify-center hover:bg-white hover:pr-2 transition-all"
          >
            <FaChevronRight size={24} />
          </button>
        </div>

        {/* DOTS: Kotak-kotak Retro */}
        <div className="flex justify-center items-center gap-4 mt-8">
          {originalImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`h-4 w-4 border-2 border-black transition-all duration-200 ${
                realIndex === idx 
                  ? 'bg-[#ef4444] translate-y-[-4px] shadow-[2px_2px_0px_0px_black]' 
                  : 'bg-white hover:bg-gray-200'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}