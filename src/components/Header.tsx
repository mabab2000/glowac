import React, { useState } from 'react';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false); // desktop dropdown
  const [geoOpen, setGeoOpen] = useState(false); // desktop nested
  const [otherOpen, setOtherOpen] = useState(false); // desktop nested
  const [selectedService, setSelectedService] = useState('Geotechnical'); // Keep existing line

  const serviceGroups: { [key: string]: { title: string; href: string; desc?: string }[] } = {
    'Geotechnical': [
      { title: 'Geotechnical Service 1', href: '/services/geotechnical/service1', desc: 'Soil analysis and testing.' },
      { title: 'Geotechnical Service 2', href: '/services/geotechnical/service2', desc: 'Foundation studies.' },
    ],
    'Other Service': [
      { title: 'Other Service 1', href: '/services/other/service1', desc: 'Consulting services.' },
      { title: 'Other Service 2', href: '/services/other/service2', desc: 'Site inspection.' },
    ],
  };
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false); // mobile submenu

  const links = [
    { href: '/#home', label: 'HOME' },
    { href: '/about', label: 'ABOUT US' },
    { href: '/services', label: 'SERVICES' },
    { href: '/contact', label: 'CONTACT US' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full lg:max-w-4xl mx-auto bg-white border-2 border-teal-300 rounded-xl shadow-xl backdrop-blur-md px-4 py-3">
          <div className="grid grid-cols-3 items-center gap-4">
            

            {/* Left: logo only */}
            <div className="flex items-center">
              <a href="/#home" className="flex items-center">
                <img src="/logo.png" alt="Lumen LTD logo" className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain" />
              </a>
            </div>

            {/* Middle (spacer) */}
            <div />

            {/* Right: navigation + mobile toggle */}
            <div className="flex items-center justify-end">
              <nav aria-label="Primary navigation" className="hidden lg:flex lg:items-center lg:space-x-6 mb-0 self-end">
                {links.map(link => {
                  if (link.label === 'SERVICES') {
                    return (
                      <div key={link.href} className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
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
                                  {Object.entries(serviceGroups).map(([group, items]) => (
                                    <li key={group} className="last:border-b-0 relative group">
                                      <a
                                        href={group === 'Geotechnical' ? '/services/geotechnical' : '/services/other'}
                                        onMouseEnter={() => setSelectedService(group)}
                                        className={`block px-4 py-2 text-teal-800 hover:bg-teal-50 transition-colors duration-150 ${selectedService === group ? 'bg-teal-50 font-semibold' : 'font-medium text-teal-700'}`}
                                      >
                                        {group}
                                      </a>

                                      <ul className="hidden group-hover:block absolute left-full top-0 bg-white border border-gray-200 shadow-lg rounded-md ml-1 w-64 z-10">
                                        {items.map((s) => (
                                          <li key={s.href} className="border-b last:border-b-0">
                                            <a
                                              href={s.href}
                                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                                            >
                                              {s.title}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
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
                    <a
                      key={link.href}
                      href={link.href}
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
                    </a>
                  );
                })}
              </nav>

              <button
                onClick={() => setOpen(v => !v)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-controls="mobile-menu"
                aria-expanded={open}
                aria-label={open ? 'Close menu' : 'Open menu'}
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

      {/* Mobile Navigation Panel */}
      <div id="mobile-menu" className={`${open ? 'block' : 'hidden'} lg:hidden bg-gray-900/95 border-t border-gray-700`}>
        <div className="px-4 pt-4 pb-6 space-y-2">
          <div className="mx-auto w-[95%]">
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {links.map(link => {
                if (link.label === 'SERVICES') {
                  return (
                    <div key={link.href} className="flex flex-col">
                      <button
                        onClick={() => setMobileServicesOpen(v => !v)}
                        className="w-full flex items-center justify-between px-3 py-3 text-gray-300 hover:text-teal-400 hover:bg-gray-800/50 rounded-md text-base font-medium tracking-wide transition-colors duration-200"
                        aria-expanded={mobileServicesOpen}
                        aria-controls="mobile-services-submenu"
                      >
                        <span className="flex items-center gap-2">
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
                        <a href="/services/geotechnical" className="px-3 py-2 text-gray-300 hover:text-teal-400 hover:bg-gray-800/50 rounded-md">Geotechnical</a>
                        <a href="/services/other" className="px-3 py-2 text-gray-300 hover:text-teal-400 hover:bg-gray-800/50 rounded-md">Other Service</a>
                      </div>
                    </div>
                  );
                }

                return (
                  <a 
                    key={link.href} 
                    href={link.href} 
                    className="px-3 py-3 text-gray-300 hover:text-teal-400 hover:bg-gray-800/50 rounded-md text-base font-medium tracking-wide transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
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
                  </a>
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
