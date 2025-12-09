import React, { useEffect, useRef, useState } from 'react';

const slidesData = [
  {
    image: '/images/image1.jpg',
    title: 'BUILDING DREAMS',
    subtitle: 'INTO REALITY',
    highlight: 'SINCE 1998',
    description: 'Transforming visions into architectural masterpieces with precision and excellence.',
    cta: 'Start Your Project'
  },
  {
    image: '/images/image2.jpg',
    title: 'INNOVATIVE DESIGN',
    subtitle: 'MEETS FUNCTIONALITY',
    highlight: 'AWARD WINNING',
    description: 'Creating spaces that inspire and endure with cutting-edge construction techniques.',
    cta: 'View Our Work'
  },
  {
    image: '/images/image3.jpg',
    title: 'SUSTAINABLE CONSTRUCTION',
    subtitle: 'FOR THE FUTURE',
    highlight: 'ECO FRIENDLY',
    description: 'Building environmentally conscious structures that preserve our planet for generations.',
    cta: 'Learn More'
  },
  {
    image: '/images/image4.jpg',
    title: 'LUXURY REDEFINED',
    subtitle: 'IN EVERY DETAIL',
    highlight: 'PREMIUM QUALITY',
    description: 'Crafting exceptional living spaces with unmatched attention to detail and luxury.',
    cta: 'Explore Luxury'
  },
  {
    image: '/images/image5.jpg',
    title: 'COMMERCIAL EXCELLENCE',
    subtitle: 'THAT INSPIRES',
    highlight: 'BUSINESS FOCUSED',
    description: 'Designing commercial spaces that enhance productivity and reflect your brand values.',
    cta: 'Get Quote'
  },
];

const Banner: React.FC<{ slides?: typeof slidesData }> = ({ slides = slidesData }) => {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [blur, setBlur] = useState(2); // px
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    const start = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        if (!hoverRef.current && playing) {
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrent((v) => (v + 1) % slides.length);
            setIsTransitioning(false);
          }, 300);
        }
      }, 5000); // Increased to 5 seconds for better viewing
    };
    start();
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [slides.length, playing]);

  const onMouseEnter = () => { hoverRef.current = true; };
  const onMouseLeave = () => { hoverRef.current = false; };

  const nextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((v) => (v + 1) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((v) => (v - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    if (index !== current) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  return (
    <section 
      className="relative bg-transparent text-gray-900 py-20 lg:py-28 overflow-hidden border-t border-gray-200 min-h-[70vh] mt-20"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* slides */}
      <div className="absolute inset-0 min-h-[70vh]">
        {slides.map((slide, i) => (
          <div
            key={slide.image + i}
            data-slide-index={i}
            aria-hidden={current !== i}
            className={`absolute inset-0 bg-center bg-cover transition-all duration-500 ease-out will-change-transform ${
              isTransitioning ? 'blur-sm scale-110' : ''
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundColor: '#1f2937',
              opacity: current === i ? 1 : 0,
              transform: current === i ? 'scale(1.1) rotate(0.5deg)' : 'scale(1.0) rotate(0deg)',
              filter: `blur(${blur}px) brightness(${current === i ? 0.8 : 0.6}) contrast(1.2)`,
              zIndex: current === i ? 2 : 1,
            }}
            onError={(e) => {
              const target = e.target as HTMLElement;
              target.style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }}
          />
        ))}
        
        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 z-10"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-200 z-10"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {/* subtle overlay to darken content for readability */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />
      </div>

      {/* controls (top-right) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* content centered */}
        <div className="text-center relative z-10">
          <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
            <div className="mb-4">
              <span className={`inline-block px-4 py-2 bg-teal-500/20 text-teal-300 text-sm font-semibold rounded-full border border-teal-300/30 backdrop-blur-sm transition-all duration-300 delay-100 ${
                current !== undefined ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {slides[current]?.highlight}
              </span>
            </div>
            
            <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 transition-all duration-300 delay-150 ${
              current !== undefined ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <span className={`block text-white drop-shadow-2xl transform transition-transform duration-700 ${isTransitioning ? '-translate-x-8 opacity-0' : 'translate-x-0 opacity-100'}`}>
                {slides[current]?.title}
              </span>
              <span className={`block text-white drop-shadow-2xl transform transition-transform duration-700 ${isTransitioning ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'}`}>
                {slides[current]?.subtitle}
              </span>
            </h1>

            <p className={`mt-6 text-xl sm:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-lg transition-all duration-300 delay-200 ${
              current !== undefined ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              {slides[current]?.description}
            </p>
          </div>

          {/* indicators */}
          <div className="mt-12 flex justify-center gap-4">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i+1}`}
                onClick={() => goToSlide(i)}
                className={`relative w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 ${
                  current === i ? 'bg-white shadow-lg ring-2 ring-white/50' : 'bg-white/40 hover:bg-white/70'
                }`}
              >
                {current === i && (
                  <span className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;