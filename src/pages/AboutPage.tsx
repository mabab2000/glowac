import React, { useState, useEffect, useRef } from 'react';
// AboutPreview removed from this page to avoid empty placeholder card

const InteractivePolicy: React.FC = () => {
  const [tab, setTab] = useState<'values' | 'mission' | 'version'>('values');

  return (
    <div>
      <div className="flex gap-2 mb-4" role="tablist" aria-label="Policy sections">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'values'}
          onClick={() => setTab('values')}
          className={`px-4 py-2 rounded-none ${tab === 'values' ? 'bg-emerald-600 text-white' : 'bg-white border border-emerald-200 text-emerald-700'}`}>
          Core Values
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === 'mission'}
          onClick={() => setTab('mission')}
          className={`px-4 py-2 rounded-none ${tab === 'mission' ? 'bg-emerald-600 text-white' : 'bg-white border border-emerald-200 text-emerald-700'}`}>
          Mission
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === 'version'}
          onClick={() => setTab('version')}
          className={`px-4 py-2 rounded-none ${tab === 'version' ? 'bg-emerald-600 text-white' : 'bg-white border border-emerald-200 text-emerald-700'}`}>
          Vision
        </button>
      </div>

      <div className="p-6 border border-emerald-200 rounded-none bg-white text-justify">
        {tab === 'values' && (
          <div className="text-gray-800">
            <ul className="list-disc pl-5 space-y-2">
              <li className="font-semibold">We comply with ISO/IEC 17025:2017 and pursue continual improvement of our management system through third‑party assessments, internal audits, management reviews, and an effective corrective action process.</li>
              <li className="font-semibold">We maintain a proactive, customer‑focused approach to ensure our testing consistently meets or exceeds customer requirements in a safe and timely manner.</li>
              <li className="font-semibold">We uphold good laboratory and professional practices to ensure dependable, high‑quality testing services.</li>
              <li className="font-semibold">All tests and services are performed in accordance with recognized standardized methods and/or specific customer requirements.</li>
              <li className="font-semibold">Top management demonstrates commitment to developing, implementing, and continually improving the management system, and formally endorses this Quality Policy and the Quality Manual.</li>
              <li className="font-semibold">This policy applies to all personnel and activities at GLOWAC Laboratory.</li>
            </ul>
          </div>
        )}

        {tab === 'mission' && (
          <div className="text-gray-800">
            <p className="leading-relaxed font-semibold">
              Glowac Laboratory's mission is to deliver accurate, reliable, and timely testing services that support safe and sustainable construction and engineering projects. We prioritize customer needs, continual improvement, and adherence to recognized standards so our results are defensible and trusted.
            </p>
          </div>
        )}

        {tab === 'version' && (
          <div className="text-gray-800">
            <p className="font-semibold leading-relaxed">
              To be the leading geotechnical and environmental laboratory, recognized for excellence in testing services, innovative solutions, and unwavering commitment to quality and customer satisfaction.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const AboutPage: React.FC = () => {
  return (
    <main className="pt-28">
      {/* Full-bleed dashed area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-emerald-100 rounded-none text-center p-12">
          <h1 className="text-3xl font-bold text-emerald-600 mb-4">About Us</h1>
          <div className="w-20 h-1 bg-emerald-600 mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Background section */}
        <section className="mt-12">
          <div className="w-full lg:max-w-[calc(56rem)] mx-auto">
            <div className="p-8 rounded-none shadow-sm text-justify">
            <h2 className="text-2xl font-semibold text-emerald-700 mb-3">Background</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                GLOWAC Laboratory has been providing geotechnical and materials testing services with a focus on dependable, accurate results and strong customer service for over two decades. Our laboratory combines experienced personnel with modern equipment and standardized methods to support construction, engineering and research projects across the region.
              </p>
              <p>
                Founded with the vision of delivering reliable geotechnical solutions, GLOWAC has grown to become a trusted partner for engineers, contractors, and developers throughout the industry. Our comprehensive testing capabilities encompass soil mechanics, concrete testing, aggregate analysis, and specialized materials evaluation, ensuring that every project receives the precise technical support it requires.
              </p>
              <p>
                Our state-of-the-art laboratory facility is equipped with cutting-edge instrumentation and maintained to the highest standards. We continuously invest in advanced testing equipment and technology to stay at the forefront of geotechnical testing methodologies. This commitment to technological excellence enables us to provide faster turnaround times without compromising the accuracy and reliability of our results.
              </p>
             
            </div>
            </div>
          </div>
        </section>

        {/* Quality Policy card */}
        {/* Interactive Core Values / Mission / Version section (not cards) */}
        <section className="mt-8">
          <div className="w-full lg:max-w-[calc(56rem)] mx-auto">
            <InteractivePolicy />
          </div>
        </section>

        {/* Environmental Lab section */}
        <section className="mt-12">
          <div className="w-full lg:max-w-[calc(56rem)] mx-auto">
            <div className="p-8 rounded-none border border-emerald-200 bg-emerald-50">
              <h2 className="text-2xl font-semibold text-emerald-700 mb-6 text-center">ENVIRONMENTAL LAB</h2>
              
              <div className="mb-6">
                <ImageGallery />
              </div>
              
              <div className="text-gray-800 text-justify space-y-4">
                <p className="font-semibold leading-relaxed">
                  Glowac's purpose built environmental labs pride itself in continuously innovating and driving value for customers by embracing state of the art technologies.
                </p>
                <p className="font-semibold leading-relaxed">
                  Our environmental laboratories provide a comprehensive range of soil, aggregate, concrete and water testing services for a variety of industry sectors from our specialist testing facilities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Our Team section */}
        <section className="mt-12">
          <div className="w-full lg:max-w-[calc(56rem)] mx-auto">
            <div className="p-8 rounded-none">
              <h2 className="text-2xl font-semibold text-emerald-700 mb-8 text-center">CONTACT OUR TEAM</h2>
              
                {/* Auto-scrolling team carousel */}
                <TeamCarousel />
                <div className="mt-8 text-center">
                <p className="text-gray-700 font-medium">
                  For general inquiries: <span className="text-emerald-700">info@glowac.com</span> | <span className="text-emerald-700">(555) 123-4500</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;

// Auto-scrolling team carousel component (continuous single-direction infinite scroll)
const TeamCarousel: React.FC = () => {
  const members = [
    { name: 'Dr. Sarah Johnson', title: 'Laboratory Director', phone: '(555) 123-4567', email: 'sarah.johnson@glowac.com', img: '/images/image4.jpg' },
    { name: 'Mike Rodriguez', title: 'Senior Geotechnical Engineer', phone: '(555) 123-4568', email: 'mike.rodriguez@glowac.com', img: '/images/image5.jpg' },
    { name: 'Jennifer Chen', title: 'Environmental Testing Manager', phone: '(555) 123-4569', email: 'jennifer.chen@glowac.com', img: '/images/image6.jpg' },
    { name: 'David Kim', title: 'Quality Assurance Manager', phone: '(555) 123-4570', email: 'david.kim@glowac.com', img: '/images/image1.jpg' },
    { name: 'Lisa Thompson', title: 'Field Operations Coordinator', phone: '(555) 123-4571', email: 'lisa.thompson@glowac.com', img: '/images/image2.jpg' },
  ];

  // Duplicate items for seamless infinite scrolling
  const items = [...members, ...members];
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const speed = 40; // pixels per second

    const step = (time: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = time;
      if (!pausedRef.current) {
        el.scrollLeft += speed * delta;
        // when we've scrolled past the first half (original items), reset
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}>
      <div
        ref={scrollerRef}
        className="flex gap-6 snap-x snap-mandatory overflow-x-auto scroll-smooth pointer-events-none touch-none no-scrollbar"
        aria-hidden="true">
        {items.map((m, idx) => (
          <div key={`${m.email}-${idx}`} className="flex-none min-w-[80%] sm:min-w-[50%] lg:min-w-[33.333%] bg-white border border-emerald-200 rounded-none text-center overflow-hidden pointer-events-auto">
            <img src={m.img} alt={m.name} className="w-full h-48 object-cover border-b border-emerald-300" />
            <div className="p-6">
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">{m.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{m.title}</p>
              <div className="space-y-1 text-sm">
                <p className="font-medium">📞 {m.phone}</p>
                <p className="font-medium">✉️ {m.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Environmental Lab image gallery (one large image at a time with controls)
const ImageGallery: React.FC = () => {
  const images = ['/images/image1.jpg', '/images/image2.jpg', '/images/image3.jpg'];
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-none border border-emerald-300">
        <img src={images[index]} alt={`Environmental ${index + 1}`} className="w-full h-[60vh] md:h-screen object-cover" />
      </div>

      <button
        aria-label="Previous"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-emerald-700 p-2 rounded-full shadow">
        ‹
      </button>

      <button
        aria-label="Next"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-emerald-700 p-2 rounded-full shadow">
        ›
      </button>

      <div className="mt-4 flex justify-center space-x-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${i === index ? 'bg-emerald-700' : 'bg-emerald-300'}`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
