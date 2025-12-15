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
  const intervalRef = useRef(null);

  const TRANSITION_DURATION = 1000;
// eslint-disable-next-line react-hooks/exhaustive-deps
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
    <section className="bg-white py-8 my-5 pt-20">
      <div
        className="max-w-7xl mx-auto relative"
        onMouseEnter={() => clearInterval(intervalRef.current)}
        onMouseLeave={() => {
          intervalRef.current = setInterval(() => nextSlide(), 3000);
        }}
      >
        <div id="img-carousel" className="overflow-hidden px-4 relative">
          <div
            className="flex"
            style={{
              transform: `translateX(-${currentIndex * 50}%)`,
              transition: isTransitioning ? `transform ${TRANSITION_DURATION}ms ease-in-out` : 'none',
            }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 px-2 flex items-center justify-center"
                style={{ width: '50%' }}
              >
                <div className="w-full h-72 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white text-[#1C6EA4] rounded-full shadow-lg hover:bg-gray-100 flex items-center justify-center border border-gray-100"
            style={{ width: 48, height: 48 }}
          >
            <FaChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white text-[#1C6EA4] rounded-full shadow-lg hover:bg-gray-100 flex items-center justify-center border border-gray-100"
            style={{ width: 48, height: 48 }}
          >
            <FaChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}