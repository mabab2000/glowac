import React, { useState, useEffect, useRef } from 'react';
// AboutPreview removed from this page to avoid empty placeholder card



const InteractivePolicy: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold text-green-700"> Corevalues, Mission and Vision</h3>

      <div className="p-6 border border-emerald-200 rounded-none bg-white">
        <h4 className="text-xl font-semibold mb-2 text-gray-700">Core Values</h4>
        <div className="text-gray-500 text-justify">
          <ul className="list-disc pl-5 space-y-2">
            <li className="font-medium">We comply with ISO/IEC 17025:2017 and pursue continual improvement of our management system through third‑party assessments, internal audits, management reviews, and an effective corrective action process.</li>
            <li className="font-medium">We maintain a proactive, customer‑focused approach to ensure our testing consistently meets or exceeds customer requirements in a safe and timely manner.</li>
            <li className="font-medium">We uphold good laboratory and professional practices to ensure dependable, high‑quality testing services.</li>
            <li className="font-medium">All tests and services are performed in accordance with recognized standardized methods and/or specific customer requirements.</li>
            <li className="font-medium">Top management demonstrates commitment to developing, implementing, and continually improving the management system, and formally endorses this Quality Policy and the Quality Manual.</li>
            <li className="font-medium">This policy applies to all personnel and activities at GLOWAC Laboratory.</li>
          </ul>
        </div>
      </div>

      <div className="p-6 border border-emerald-200 rounded-none bg-white">
        <h4 className="text-xl font-semibold mb-2 text-gray-700">Mission</h4>
        <div className="text-gray-500 text-justify">
          <p className="leading-relaxed font-medium">
            Glowac Laboratory's mission is to deliver accurate, reliable, and timely testing services that support safe and sustainable construction and engineering projects. We prioritize customer needs, continual improvement, and adherence to recognized standards so our results are defensible and trusted.
          </p>
        </div>
      </div>

      <div className="p-6 border border-emerald-200 rounded-none bg-white">
        <h4 className="text-xl font-semibold mb-2 text-gray-700">Vision</h4>
        <div className="text-gray-500 text-justify">
          <p className="font-medium leading-relaxed">
            To be the leading geotechnical and environmental laboratory, recognized for excellence in testing services, innovative solutions, and unwavering commitment to quality and customer satisfaction.
          </p>
        </div>
      </div>
    </div>
  );
};

// CEO Card component (renders API-backed CEO data)
const CEOCard: React.FC = () => {
  const [ceo, setCeo] = useState({ name: 'Dr. John Smith', title: 'Chief Executive Officer', email: 'ceo@glowac.com', img: '/images/image3.jpg', desc: 'Head of the GLOWAC team — overseeing laboratory operations, quality, and strategic direction.' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('https://glowac-api.onrender.com/ceo', { headers: { accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          setCeo({
            name: item.name || 'Dr. John Smith',
            title: item.title || 'Chief Executive Officer',
            email: item.email || 'ceo@glowac.com',
            img: item.image_url || '/images/image3.jpg',
            desc: item.short_description || 'Head of the GLOWAC team — overseeing laboratory operations, quality, and strategic direction.'
          });
        }
      })
      .catch(() => {
        // keep fallback defaults
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

    return (
      <div className="mb-8 -mx-4 sm:mx-0 px-4 sm:px-0">
      <div className="bg-white border border-emerald-200 overflow-hidden rounded-none flex flex-col md:flex-row items-stretch">
        {loading ? (
          <div className="w-full flex flex-col md:flex-row items-stretch gap-4 md:gap-6 p-4 md:p-6">
            <div className="w-full md:w-2/5 flex-shrink-0">
              <div className="w-full h-56 md:h-full bg-gray-200 animate-pulse" />
            </div>
            <div className="p-4 md:w-3/5 text-left">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-3 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-36 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full md:w-2/5 flex-shrink-0">
              <img src={ceo.img} alt={`CEO - ${ceo.name}`} className="w-full h-56 md:h-full object-cover" />
            </div>
            <div className="p-6 md:p-8 md:w-3/5 text-left flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-emerald-700">{ceo.name}</h3>
              <p className="text-emerald-600 font-semibold mt-1">{ceo.title}</p>
              <p className="text-gray-600 text-justify mt-3">{ceo.desc}</p>
              <div className="mt-6 flex items-center gap-3">
               
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AboutPage: React.FC = () => {
  const [aboutTitle, setAboutTitle] = useState<string>('About Us');
  const [backgrounds, setBackgrounds] = useState<{ id: number; paragraph: string }[]>([]);
  const [bgLoading, setBgLoading] = useState(true);
  useEffect(() => {
    const v = localStorage.getItem('about.headerTitle');
    if (v) setAboutTitle(v);
    let mounted = true;
    setBgLoading(true);
    fetch('https://glowac-api.onrender.com/background', { headers: { accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) setBackgrounds(data);
      })
      .catch(() => {
        // keep fallback static text on error
      })
      .finally(() => { if (mounted) setBgLoading(false); });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="pt-24 max-w-[62rem] mx-auto">
      {/* Full-bleed dashed area */}
      <div className="max-w-[62rem] mx-auto px-0 sm:px-4 lg:px-8">
        <div className="w-full lg:max-w-4xl mx-auto">
            <div className="bg-emerald-100 rounded-none text-center p-3 mt-0">
            <h1 className="text-3xl font-bold text-emerald-600 mb-2">{aboutTitle}</h1>
            <div className="w-20 h-1 bg-emerald-600 mx-auto" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 mt-0">
        {/* Background section */}
        <section className="mt-0">
          <div className="w-full lg:max-w-[calc(62rem)] mx-auto">
            <div className="p-8 rounded-none shadow-sm text-justify">
            <h2 className="text-2xl font-semibold text-bold-700 mb-3">Background</h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              {bgLoading ? (
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-6 bg-gray-200 rounded w-5/6 animate-pulse" />
                </div>
              ) : (backgrounds.length > 0 ? (
                backgrounds.map((b) => (
                  <p key={b.id} className="break-words">{b.paragraph}</p>
                ))
              ) : (
                <p>No background information available at this time.</p>
              ))}
            </div>
            </div>
          </div>
        </section>

        {/* Quality Policy card */}
        {/* Interactive Core Values / Mission / Version section (not cards) */}
        <section className="mt-2">
          <div className="w-full lg:max-w-[calc(62rem)] mx-auto">
            <InteractivePolicy />
          </div>
        </section>

        {/* Environmental Lab section */}
        <section className="mt-12 sm:w-full">
          <div className="w-full mx-0 px-4 sm:w-full lg:mx-auto lg:px-0 lg:max-w-[calc(62rem)]">
            <div className="p-6 lg:p-8 rounded-none border sm:w-full border-emerald-200 bg-white shadow-sm">
              <h2 className="text-2xl font-semibold text-emerald-700 mb-6 text-center">ENVIRONMENTAL LAB</h2>
              
              <div className="mb-6">
                <ImageGallery />
              </div>
              
             
            </div>
          </div>
        </section>

        {/* Contact Our Team section */}
        <section className="mt-6">
          <div className="w-full mx-0 px-4 lg:mx-auto lg:px-0 lg:max-w-[calc(62rem)]">
            <div className="p-6 lg:p-8 rounded-none">
                  <h2 className="text-4xl font-bold mb-8 text-center">CONTACT OUR TEAM</h2>

                          <CEOCard />

                    {/* Auto-scrolling team carousel */}
                    <TeamCarousel />
                    <div className="mt-8 text-center">
                    <p className="text-gray-700 font-medium">
                      For general inquiries: <span className="text-emerald-700">info@glowac.com</span> | <span className="text-emerald-700">+250 788 764 432</span>
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
interface TeamMember {
  name: string;
  title: string;
  phone: string;
  email: string;
  img: string;
}

const TeamCarousel: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoadingMembers(true);
    fetch('https://glowac-api.onrender.com/members', { headers: { accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) {
          const mapped = data.map((m: any) => ({
            name: m.name || '',
            title: m.title || '',
            phone: m.short_description || '',
            email: m.email || '',
            img: m.image_url || '/images/image4.jpg',
          }));
          setMembers(mapped);
        } else {
          setMembers([]);
        }
      })
      .catch(() => {
        // on error, show empty list (no default data)
        if (mounted) setMembers([]);
      })
      .finally(() => {
        if (mounted) setLoadingMembers(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Duplicate items for seamless infinite scrolling
  const items = [...members, ...members];
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (members.length === 0) return; // don't start animation for empty list

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
  }, [members.length]);

  if (loadingMembers) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className=" border border-emerald-200 rounded-none p-4 animate-pulse">
            <div className="w-full h-4 mb-4" />
            <div className="h-6 bg-gray-200 w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return <p className="text-sm text-gray-500">No team members available.</p>;
  }

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
            <img src={m.img} alt={m.name} className="w-48 h-48 object-cover border-b border-emerald-300 mx-auto" />
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
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('https://glowac-api.onrender.com/gallery', { headers: { accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data) && data.length > 0) {
          const urls = data.map((d: any) => d.image_preview_url).filter(Boolean);
          setImages(urls);
          setIndex(0);
        }
      })
      .catch(() => {
        // fallback to local images on error
        if (mounted) setImages(['/images/image1.jpg', '/images/image2.jpg', '/images/image3.jpg']);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const prev = () => setIndex((i) => (i - 1 + (images.length || 1)) % (images.length || 1));
  const next = () => setIndex((i) => (i + 1) % (images.length || 1));

  const loadingDataUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" stroke="%2382cfd1" stroke-width="5" fill="none" stroke-linecap="round"/><g><path d="M25 5 A20 20 0 0 1 45 25" stroke="%23338a7b" stroke-width="5" fill="none" stroke-linecap="round"/></g><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/></svg>';

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-none border border-emerald-300">
        {loading ? (
          <div className="w-full h-[60vh] md:h-screen flex items-center justify-center bg-emerald-50">
            <img src={loadingDataUrl} alt="loading" className="w-20 h-20" />
          </div>
        ) : (
          <img src={images[index]} alt={`Environmental ${index + 1}`} className="w-full h-[60vh] md:h-screen object-cover" />
        )}
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
        {(images.length > 0 ? images : ['/images/image1.jpg', '/images/image2.jpg', '/images/image3.jpg']).map((_, i) => (
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
