import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false); // desktop dropdown
  const [geoOpen, setGeoOpen] = useState(false); // desktop nested
  const [otherOpen, setOtherOpen] = useState(false); // desktop nested
  const [selectedService, setSelectedService] = useState<string | null>(null); // which group is open on the right
  const hoverTimeout = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  type MainService = { id: number; service_name: string };
  type SubService = { id: number; main_service_id: number; service_name: string; description?: string };

  const [mainServices, setMainServices] = useState<MainService[]>([]);
  const [currentSubServices, setCurrentSubServices] = useState<SubService[]>([]);
  const [currentMainId, setCurrentMainId] = useState<number | null>(null);
  const subServicesCache = useRef<Record<number, SubService[]>>({});
  // Track which mobile main service is open (by id), not just true/false
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false); // mobile submenu open
  const [mobileSelectedMain, setMobileSelectedMain] = useState<number | null>(null);

  const links = [
    { href: '/', label: 'HOME' },
    { href: '/about', label: 'ABOUT US' },
    { href: '/services', label: 'SERVICES' },
    { href: '/contact', label: 'CONTACT US' },
  ];

  const location = useLocation();
  // detect when we're on a specific service detail route like /services/geotechnical/service1
  const locPath = location.pathname.replace(/(^\/|\/$)/g, '');
  const locSegments = locPath.split('/');
  const isServiceDetail = locSegments[0] === 'services' && locSegments.length > 1 && locSegments.slice(1).join('/') !== '';

  // auto-close menus when route changes (close header on navigation)
  useEffect(() => {
    setOpen(false);
    setMobileServicesOpen(false);
    setServicesOpen(false);
    setSelectedService(null);
  }, [location.pathname]);

  // when mobile menu opens, show services submenu by default
  useEffect(() => {
    if (open) setMobileServicesOpen(true);
    else setMobileServicesOpen(false);
  }, [open]);

  // close dropdown when clicking outside (ref wraps the button + menu)
  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!dropdownRef.current) return;
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setServicesOpen(false);
        setSelectedService(null);
      }
    }

    if (servicesOpen) {
      document.addEventListener('mousedown', handleDocClick);
    }

    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [servicesOpen]);

  // load main services on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('https://glowac-api.onrender.com/main-services', { headers: { accept: 'application/json' } });
        if (!mounted) return;
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        setMainServices(data.map((r: any) => ({ id: Number(r.id), service_name: String(r.service_name ?? '') })));
      } catch (err) {
        console.debug('Header: failed to load main services', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-0 py-0">
        <div className="w-full lg:max-w-[calc(56rem)] mx-auto">
          {/* bg-black and text-white only on mobile (lg:hidden), keep original on desktop */}
          <div className="border-2 border-teal-300 rounded-none shadow-xl backdrop-blur-md py-0 bg-white lg:bg-gray-200 lg:text-black">
          <div className="px-0 py-0">
          <div className="grid grid-cols-3 items-stretch gap-4 h-20 md:h-24 lg:h-16">
            

            {/* Left: logo only */}
              <div className="flex items-center justify-center px-3 h-full overflow-hidden">
              <Link to="/" className="flex items-center h-full w-full overflow-hidden">
                <img src="/logo.png" alt="GLOWAC logo" className="h-full w-40 object-contain block" />
              </Link>
            </div>

            {/* Middle: navigation (centered on desktop) */}
            <div className="flex items-center justify-center h-full">
              <nav aria-label="Primary navigation" className="hidden lg:flex lg:items-center lg:space-x-6 h-full">
                {links.map(link => {
                  if (link.label === 'SERVICES') {
                    // When viewing a specific service, hide/disable the dropdown and render a simple link
                    if (isServiceDetail) {
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          className="text-gray-600 hover:text-teal-400 text-base font-medium tracking-wide transition-colors duration-200 inline-flex items-center gap-2 whitespace-nowrap"
                        >
                          <span>{link.label}</span>
                        </Link>
                      );
                    }
                    return (
                      <div ref={dropdownRef} key={link.href} className="relative">
                        <button
                          onClick={() => setServicesOpen(v => !v)}
                          aria-haspopup="true"
                          aria-expanded={servicesOpen}
                          className="text-gray-600 hover:text-teal-400 text-base font-medium tracking-wide transition-colors duration-200 inline-flex items-center gap-2 whitespace-nowrap"
                        >
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6a2 2 0 01-2 2h-3l-2 3-2-3H6a2 2 0 01-2-2V8" />
                          </svg>
                          <span>{link.label}</span>
                          <svg className="w-3 h-3 ml-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.352a.75.75 0 011.14.98l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                          </svg>
                        </button>

                          <div className={`absolute right-0 mt-2 bg-transparent z-50 ${servicesOpen ? 'block' : 'hidden'}`}>
                            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                              {/* Left: vertical list */}
                              <div className="w-72 pr-2">
                                <ul className="flex flex-col">
                                  {mainServices.map((m) => (
                                    <li key={m.id} className="last:border-b-0 relative group">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          // toggle selection
                                          const asSelected = selectedService === String(m.id) ? null : String(m.id);
                                          setSelectedService(asSelected);
                                          setCurrentMainId(asSelected ? m.id : null);
                                          // load sub-services (cached)
                                          if (asSelected) {
                                            if (subServicesCache.current[m.id]) {
                                              setCurrentSubServices(subServicesCache.current[m.id]);
                                            } else {
                                              (async () => {
                                                try {
                                                  const res = await fetch(`https://glowac-api.onrender.com/sub-services/by-main/${m.id}`, { headers: { Accept: 'application/json' } });
                                                  if (!res.ok) return;
                                                  const data = await res.json();
                                                  if (!Array.isArray(data)) return;
                                                  const mapped = data.map((r: any) => ({ id: Number(r.id), main_service_id: Number(r.main_service_id ?? m.id), service_name: String(r.service_name ?? ''), description: typeof r.description === 'string' ? r.description : undefined }));
                                                  subServicesCache.current[m.id] = mapped;
                                                  setCurrentSubServices(mapped);
                                                } catch (err) {
                                                  console.debug('Failed to load sub-services', err);
                                                }
                                              })();
                                            }
                                          } else {
                                            setCurrentSubServices([]);
                                          }
                                        }}
                                        className={`w-full text-left block px-4 py-2 text-teal-800 hover:bg-teal-50 transition-colors duration-150 ${selectedService === String(m.id) ? 'bg-teal-50 font-semibold' : 'font-medium text-teal-700'}`}
                                      >
                                        {m.service_name}
                                      </button>

                                      {selectedService === String(m.id) && (
                                        <ul className="absolute left-full top-0 bg-white border border-gray-200 shadow-lg rounded-md w-64 z-40">
                                          {currentSubServices.map((s) => {
                                            const mainSlug = m.service_name.toLowerCase().replace(/\s+/g, '-');
                                            const subSlug = s.service_name.toLowerCase().replace(/\s+/g, '-');
                                            const href = `/services/${mainSlug}/${subSlug}`;
                                            return (
                                              <li key={s.id} className="border-b last:border-b-0">
                                                <Link
                                                  to={href}
                                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                                                >
                                                  {s.service_name}
                                                </Link>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>


                            </div>
                          </div>
                      </div>
                    );
                  }

                  // default link
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-gray-600 hover:text-teal-400 text-base font-medium tracking-wide transition-colors duration-200 inline-flex items-center gap-2 whitespace-nowrap"
                    >
                      {/* Icon + label */}
                      {link.label === 'HOME' && (
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z" />
                        </svg>
                      )}
                      {link.label === 'ABOUT US' && (
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                        </svg>
                      )}
                      {link.label === 'CONTACT US' && (
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1118 0z" />
                          <circle cx="12" cy="10" r="2" />
                        </svg>
                      )}
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: mobile toggle only */}
            <div className="flex items-center justify-end h-full">
              {/* Only show toggle on mobile */}
              <button
                onClick={() => setOpen(v => !v)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-controls="mobile-menu"
                aria-expanded={open}
                aria-label={open ? 'Close menu' : 'Open menu'}
                style={{ display: 'block' }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  {open ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  )}
                </svg>
              </button>
            </div>

            
          </div>
          </div>
        </div>
      </div>
    </div>

      {/* Mobile Navigation Panel */}
      {/* Only mobile menu gets black bg and white text */}
      <div id="mobile-menu" className={`${open ? 'block' : 'hidden'} lg:hidden bg-white border-t border-gray-200`}>
        <div className="px-4 pt-4 pb-6 space-y-2">
          <div className="mx-auto w-[95%]">
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {links.map(link => {
                if (link.label === 'SERVICES') {
                  // On a specific service detail page hide the mobile dropdown and show a simple link
                  if (isServiceDetail) {
                    return (
                      <Link key={link.href} to={link.href} onClick={() => setOpen(false)} className="px-3 py-3 text-gray-700 hover:text-teal-400 hover:bg-gray-100 rounded-md text-base font-medium tracking-wide transition-colors duration-200 flex items-center gap-2 whitespace-nowrap">
                        <span>{link.label}</span>
                      </Link>
                    );
                  }
                  return (
                    <div key={link.href} className="flex flex-col">
                      <button
                        onClick={() => setMobileServicesOpen(v => !v)}
                        className="w-full flex items-center justify-between px-3 py-3 text-gray-700 hover:text-teal-400 hover:bg-gray-100 rounded-md text-base font-medium tracking-wide transition-colors duration-200"
                        aria-expanded={mobileServicesOpen}
                        aria-controls="mobile-services-submenu"
                      >
                        <span className="flex items-center gap-0">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6a2 2 0 01-2 2h-3l-2 3-2-3H6a2 2 0 01-2-2V8" />
                          </svg>
                          <span>{link.label}</span>
                        </span>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${mobileServicesOpen ? 'rotate-180' : 'rotate-0'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.352a.75.75 0 011.14.98l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>

                      <div id="mobile-services-submenu" className={`${mobileServicesOpen ? 'block' : 'hidden'} pl-6 mt-1 flex flex-col gap-1` }>
                        {mainServices.length === 0 ? (
                          <div className="p-3 border rounded text-center text-sm text-gray-500">Loading...</div>
                        ) : (
                          mainServices.map(m => {
                            const slug = m.service_name.toLowerCase().replace(/\s+/g, '-');
                            return (
                              <div key={m.id} className="flex flex-col">
                                <button
                                  onClick={async () => {
                                    if (mobileSelectedMain === m.id) {
                                      setMobileSelectedMain(null);
                                      return;
                                    }
                                    setMobileSelectedMain(m.id);
                                    if (!subServicesCache.current[m.id]) {
                                      try {
                                        const res = await fetch(`https://glowac-api.onrender.com/sub-services/by-main/${m.id}`, { headers: { Accept: 'application/json' } });
                                        if (!res.ok) return;
                                        const data = await res.json();
                                        if (!Array.isArray(data)) return;
                                        const mapped = data.map((r: any) => ({ id: Number(r.id), main_service_id: Number(r.main_service_id ?? m.id), service_name: String(r.service_name ?? ''), description: typeof r.description === 'string' ? r.description : undefined }));
                                        subServicesCache.current[m.id] = mapped;
                                      } catch (err) {
                                        console.debug('Header: failed to load mobile sub-services', err);
                                      }
                                    }
                                  }}
                                  className="w-full text-left px-3 py-2 text-gray-700 hover:text-teal-400 hover:bg-gray-100 rounded-md font-medium"
                                >
                                  {m.service_name}
                                </button>

                                {mobileSelectedMain === m.id && (
                                  <div className="pl-4 mt-1 flex flex-col gap-1">
                                    {(!subServicesCache.current[m.id] || subServicesCache.current[m.id].length === 0) ? (
                                      <div className="px-3 py-2 text-sm text-gray-500">No sub-services found</div>
                                    ) : (
                                      subServicesCache.current[m.id].map(s => (
                                        <Link key={s.id} to={`/services/${slug}/${s.service_name.toLowerCase().replace(/\s+/g,'-')}`} onClick={() => setOpen(false)} className="px-3 py-2 text-gray-700 hover:text-teal-400 hover:bg-gray-100 rounded-md text-sm">{s.service_name}</Link>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link 
                    key={link.href} 
                    to={link.href} 
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 text-gray-700 hover:text-teal-400 hover:bg-gray-100 rounded-md text-base font-medium tracking-wide transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                  >
                    {/* mobile icons */}
                    {link.label === 'HOME' && (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z" />
                      </svg>
                    )}
                    {link.label === 'ABOUT US' && (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                      </svg>
                    )}
                    {link.label === 'CONTACT US' && (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1118 0z" />
                        <circle cx="12" cy="10" r="2" />
                      </svg>
                    )}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
