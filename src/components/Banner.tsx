import React, { useEffect, useRef, useState, useMemo } from 'react';

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

type ApiBanner = {
  id: number;
  highlight_tag: string;
  title: string;
  description: string;
  image_mime: string;
  image_preview_url: string;
};

const Banner: React.FC<{ slides?: typeof slidesData; admin?: boolean }> = ({ slides = slidesData, admin = false }) => {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [blur, setBlur] = useState(2);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const hoverRef = useRef(false);
  const loadedUrlsRef = useRef<Record<string, boolean>>({});

  // API banners
  const [apiBanners, setApiBanners] = useState<ApiBanner[] | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // imageStatus per slide
  const [imageStatus, setImageStatus] = useState<(boolean | undefined)[]>(() => new Array(slides.length).fill(undefined));

  // admin form state
  const [highlightTag, setHighlightTag] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  

  // Fetch API banners on mount
  useEffect(() => {
    let mounted = true;
    setApiLoading(true);
    fetch('https://glowac-api.onrender.com/banners')
      .then(res => res.json())
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) {
          setApiBanners(data as ApiBanner[]);
          setCurrent(0);
        }
      })
      .catch(() => setApiError('Failed to fetch banners'))
      .finally(() => { if (mounted) setApiLoading(false); });
    return () => { mounted = false; };
  }, []);

  // Build slidesToRender from apiBanners if available and memoize it
  const slidesToRender = useMemo(() => {
    if (apiBanners && apiBanners.length > 0) {
      return apiBanners.map(b => ({ image: b.image_preview_url, title: b.title, subtitle: '', highlight: b.highlight_tag, description: b.description, cta: '' }));
    }
    return [];
  }, [apiBanners]);

  // interval that advances slides. declared after slidesToRender so we can safely reference its length
  useEffect(() => {
    const start = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(() => {
        const len = slidesToRender.length;
        if (len <= 0) return; // guard against modulo by zero
        if (!hoverRef.current && playing) {
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrent((v) => {
              if (typeof v !== 'number' || Number.isNaN(v)) return 0;
              return (v + 1) % len;
            });
            setIsTransitioning(false);
          }, 300);
        }
      }, 5000);
    };
    start();
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [playing, apiBanners, slidesToRender.length]);

  // (Render decisions for public view are handled after hooks to preserve hook order)

  // preload images and update imageStatus
  useEffect(() => {
    // Only run when slidesToRender changes (memoized above). Track already loaded URLs
    let mounted = true;
    setImageStatus(new Array(slidesToRender.length).fill(undefined));
    const loaded = loadedUrlsRef.current;

    slidesToRender.forEach((s, i) => {
      const url = s.image;
      if (loaded[url] === true) {
        // If we've already successfully loaded this URL before, mark as loaded
        setImageStatus(prev => {
          const copy = prev.slice();
          copy[i] = true;
          return copy;
        });
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (!mounted) return;
        loaded[url] = true;
        setImageStatus(prev => {
          const copy = prev.slice();
          copy[i] = true;
          return copy;
        });
      };
      img.onerror = () => {
        if (!mounted) return;
        loaded[url] = false;
        setImageStatus(prev => {
          const copy = prev.slice();
          copy[i] = false;
          return copy;
        });
      };
      img.src = url;
    });
    return () => { mounted = false; };
  }, [slidesToRender]);

  const allFailed = imageStatus.length === slidesToRender.length && imageStatus.every(v => v === false);
  const isLoading = imageStatus.length === slidesToRender.length && imageStatus.some(v => v === undefined) && !allFailed;
  if (allFailed) return null;

  // Public view behavior: show spinner while API is loading; hide section if no banners returned or fetch failed
  if (!admin) {
    if (apiLoading) {
      return (
        <section className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white py-20 lg:py-28 overflow-hidden border-t border-gray-200 min-h-[70vh] mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center">
                <h2 className="text-4xl sm:text-5xl font-extrabold tracking-widest uppercase drop-shadow-lg">GLOWAC</h2>
                <div className="mt-2 h-1 w-28 bg-white/30 rounded-full" />
              </div>

              <svg className="animate-spin h-20 w-20 text-emerald-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>

              <div className="text-center">
                <p className="mt-2 text-lg sm:text-xl font-medium text-white/95">Loading</p>
                <div className="mt-1 text-white/80">
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse delay-75">.</span>
                  <span className="animate-pulse delay-150">.</span>
                </div>
                <p className="mt-3 text-white/80">Preparing images and visuals — this may take a moment.</p>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (!apiBanners || apiBanners.length === 0) return null;
  }

  const onMouseEnter = () => { hoverRef.current = true; };
  const onMouseLeave = () => { hoverRef.current = false; };

  const nextSlide = () => {
    const len = slidesToRender.length;
    if (len <= 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((v) => {
        if (typeof v !== 'number' || Number.isNaN(v)) return 0;
        return (v + 1) % len;
      });
      setIsTransitioning(false);
    }, 300);
  };

  const prevSlide = () => {
    const len = slidesToRender.length;
    if (len <= 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((v) => {
        if (typeof v !== 'number' || Number.isNaN(v)) return 0;
        return (v - 1 + len) % len;
      });
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

  // Admin actions
  async function refreshBanners() {
    setApiLoading(true);
    try {
      const res = await fetch('https://glowac-api.onrender.com/banners');
      const data = await res.json();
      console.debug('refreshBanners: fetched', data);
      if (Array.isArray(data)) setApiBanners(data as ApiBanner[]);
      } catch (err) {
        console.error('refreshBanners failed', err);
        setApiError('Failed to refresh banners');
    } finally {
      setApiLoading(false);
    }
  }

  async function handleCreateOrUpdate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!titleInput.trim() || !descriptionInput.trim() || !highlightTag.trim()) return;
    setActionLoading(true);
    try {
      const fd = new FormData();
      fd.append('highlight_tag', highlightTag);
      fd.append('title', titleInput);
      fd.append('description', descriptionInput);
      if (imageFile) fd.append('image', imageFile, imageFile.name);

      const url = editingId ? `https://glowac-api.onrender.com/banners/${editingId}` : 'https://glowac-api.onrender.com/banners';
      const method = editingId ? 'PUT' : 'POST';
      console.debug('handleCreateOrUpdate: submitting', { url, method, editingId, titleInput, descriptionInput, highlightTag, imageFile });
      const res = await fetch(url, { method, body: fd, headers: { Accept: 'application/json' } });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        console.error('handleCreateOrUpdate failed', res.status, txt);
        throw new Error(`Failed: ${res.status} ${txt}`);
      }
      // parse response body (server returns the updated/created banner)
      const returned = await res.json().catch(() => null);
      console.debug('handleCreateOrUpdate: response', returned);
      // optimistically update apiBanners so the admin list reflects the change immediately
      if (returned && typeof returned === 'object') {
        setApiBanners(prev => {
          if (!prev) return prev;
          const exists = prev.some(p => p.id === returned.id);
          if (exists) return prev.map(p => (p.id === returned.id ? returned : p));
          return [returned as ApiBanner, ...prev];
        });
      }
      await refreshBanners();
      // reset form
      setEditingId(null);
      setTitleInput('');
      setDescriptionInput('');
      setHighlightTag('');
      setImageFile(null);
    } catch (err) {
      console.error('handleCreateOrUpdate error', err);
      setApiError(String(err) || 'Failed to save banner');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleEdit(b: ApiBanner) {
    console.debug('handleEdit: loading banner into form', b);
    setEditingId(b.id);
    setTitleInput(b.title ?? '');
    setDescriptionInput(b.description ?? '');
    setHighlightTag(b.highlight_tag ?? '');
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this banner?')) return;
    setActionLoading(true);
    try {
      console.debug('handleDelete: deleting', id);
      const res = await fetch(`https://glowac-api.onrender.com/banners/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        console.error('handleDelete failed', res.status, txt);
        throw new Error(`Failed to delete: ${res.status} ${txt}`);
      }
      await refreshBanners();
    } catch {
      setApiError('Failed to delete banner');
    } finally {
      setActionLoading(false);
    }
  }

  // Create a small loading UI while preloading
  if (isLoading) {
    return (
      <section className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white py-20 lg:py-28 overflow-hidden border-t border-gray-200 min-h-[70vh] mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-widest uppercase drop-shadow-lg">GLOWAC</h2>
              <div className="mt-2 h-1 w-28 bg-white/30 rounded-full" />
            </div>

            <svg className="animate-spin h-20 w-20 text-emerald-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>

            <div className="text-center">
              <p className="mt-2 text-lg sm:text-xl font-medium text-white/95">Loading</p>
              <div className="mt-1 text-white/80">
                <span className="animate-pulse">.</span>
                <span className="animate-pulse delay-75">.</span>
                <span className="animate-pulse delay-150">.</span>
              </div>
              <p className="mt-3 text-white/80">Preparing images and visuals — this may take a moment.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section 
        className="relative bg-transparent text-gray-900 py-20 lg:py-28 overflow-hidden border-t border-gray-200 min-h-[70vh] mt-0"
        onMouseEnter={() => { hoverRef.current = true; }}
        onMouseLeave={() => { hoverRef.current = false; }}
      >
        <div className="absolute inset-0 min-h-[70vh]">
          {slidesToRender.map((slide, i) => {
            const imgLoaded = imageStatus[i];
            const backgroundStyle = imgLoaded === false
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : `url(${slide.image})`;
            return (
              <div
                key={slide.image + i}
                data-slide-index={i}
                aria-hidden={current !== i}
                className={`absolute inset-0 bg-center bg-cover transition-all duration-500 ease-out will-change-transform ${isTransitioning ? 'blur-sm scale-110' : ''}`}
                style={{
                  backgroundImage: backgroundStyle,
                  backgroundColor: '#1f2937',
                  opacity: current === i ? 1 : 0,
                  transform: current === i ? 'scale(1.1) rotate(0.5deg)' : 'scale(1.0) rotate(0deg)',
                  filter: `blur(${blur}px) brightness(${current === i ? 0.8 : 0.6}) contrast(1.2)`,
                  zIndex: current === i ? 2 : 1,
                }}
              />
            );
          })}
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 transform translate-y-8' : 'opacity-100 transform translate-y-0'}`}>
              <div className="mb-4">
                <span className={`inline-block px-4 py-2 bg-teal-500/20 text-teal-300 text-sm font-semibold rounded-full border border-teal-300/30 backdrop-blur-sm transition-all duration-300 delay-100 ${current !== undefined ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {slidesToRender[current]?.highlight}
                </span>
              </div>
              
              <h1 className={`text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 transition-all duration-300 delay-150 ${current !== undefined ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className={`block text-white drop-shadow-2xl transform transition-transform duration-700 ${isTransitioning ? '-translate-x-8 opacity-0' : 'translate-x-0 opacity-100'}`}>
                  {slidesToRender[current]?.title}
                </span>
                <span className={`block text-white drop-shadow-2xl transform transition-transform duration-700 ${isTransitioning ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'}`}>
                  {slidesToRender[current]?.subtitle}
                </span>
              </h1>

              <p className={`mt-6 text-xl sm:text-2xl text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-lg transition-all duration-300 delay-200 ${current !== undefined ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                {slidesToRender[current]?.description}
              </p>
            </div>

            <div className="mt-12 flex justify-center gap-4">
              {slidesToRender.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i+1}`}
                  onClick={() => goToSlide(i)}
                  className={`relative w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 ${current === i ? 'bg-white shadow-lg ring-2 ring-white/50' : 'bg-white/40 hover:bg-white/70'}`}
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

      {admin && (
        <section className="max-w-4xl mx-auto my-8 p-4 bg-white border rounded">
          <h3 className="font-semibold mb-4">Banner Management</h3>
          {apiError && <div className="text-red-600 mb-2">{apiError}</div>}
          <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 gap-3">
            <input className="border px-3 py-2 rounded" placeholder="Highlight tag" value={highlightTag} onChange={e => setHighlightTag(e.target.value)} />
            <input className="border px-3 py-2 rounded" placeholder="Title" value={titleInput} onChange={e => setTitleInput(e.target.value)} />
            <textarea className="border px-3 py-2 rounded" placeholder="Description" rows={3} value={descriptionInput} onChange={e => setDescriptionInput(e.target.value)} />
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
            <div className="flex gap-2">
              <button type="submit" className="px-3 py-1 bg-teal-600 text-white rounded" disabled={actionLoading}>{editingId ? 'Update' : 'Create'}</button>
              <button type="button" className="px-3 py-1 border rounded" onClick={() => { setEditingId(null); setTitleInput(''); setDescriptionInput(''); setHighlightTag(''); setImageFile(null); }}>Reset</button>
              <button type="button" className="px-3 py-1 border rounded" onClick={() => refreshBanners()}>{apiLoading ? 'Refreshing...' : 'Refresh'}</button>
            </div>
          </form>

          <div className="mt-4 space-y-2">
            <h4 className="font-medium">Existing banners</h4>
            {apiLoading && <div className="text-sm text-gray-500">Loading...</div>}
            {apiBanners && apiBanners.length === 0 && <div className="text-sm text-gray-500">No banners.</div>}
            {apiBanners && apiBanners.map(b => (
              <div key={b.id} className="flex items-center gap-3 border p-2 rounded">
                <img src={b.image_preview_url} alt={b.title} className="w-24 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{b.title}</div>
                  <div className="text-xs text-gray-500">{b.highlight_tag}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded" onClick={() => handleEdit(b)}>Edit</button>
                  <button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded" onClick={() => handleDelete(b.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default Banner;
