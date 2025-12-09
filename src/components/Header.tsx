import React, { useState } from 'react';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/#home', label: 'HOME' },
    { href: '/#about', label: 'ABOUT US' },
    { href: '/#services', label: 'SERVICES' },
    { href: '/#gallery', label: 'GALLERY' },
    { href: '/#contact', label: 'CONTACT US' },
  ];

  return (
    <header className="sticky top-0 z-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="mx-[10%] w-[80%] bg-white/95 rounded-xl shadow-xl backdrop-blur-md px-4 py-3">
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Brand */}
            <div className="flex items-center">
              <a href="/#home" className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-teal-500 transform rotate-45 rounded-sm"></div>
                  <div className="absolute top-1 left-1 w-8 h-8 bg-gray-300 transform rotate-45 rounded-sm"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-800 tracking-wide">LUMEN LTD</span>
                  <span className="text-xs text-gray-500 tracking-widest">WE BUILD LEGACIES FOR AGES</span>
                </div>
              </a>
            </div>

            {/* Centered nav */}
            <div className="flex justify-center">
              <nav aria-label="Primary navigation" className="hidden lg:flex lg:items-center lg:space-x-6 w-full justify-center">
                {links.map(link => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="text-gray-700 hover:text-teal-600 text-sm font-medium tracking-wide transition-colors duration-200 text-center inline-flex items-center gap-2"
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
                        {link.label === 'SERVICES' && (
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6a2 2 0 01-2 2h-3l-2 3-2-3H6a2 2 0 01-2-2V8" />
                          </svg>
                        )}
                        {link.label === 'GALLERY' && (
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                            <rect x="3" y="3" width="18" height="14" rx="2" ry="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 21l2-3 2 3 2-3 4 3" />
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
                    ))}
              </nav>
            </div>

            {/* Actions & mobile toggle */}
            <div className="flex items-center justify-end">
              <button
                onClick={() => setOpen(v => !v)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
              {links.map(link => (
                  <a 
                    key={link.href} 
                    href={link.href} 
                    className="px-3 py-3 text-gray-300 hover:text-teal-400 hover:bg-gray-800/50 rounded-md text-sm font-medium tracking-wide transition-colors duration-200 flex items-center gap-2"
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
                    {link.label === 'SERVICES' && (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6a2 2 0 01-2 2h-3l-2 3-2-3H6a2 2 0 01-2-2V8" />
                      </svg>
                    )}
                    {link.label === 'GALLERY' && (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                        <rect x="3" y="3" width="18" height="14" rx="2" ry="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 21l2-3 2 3 2-3 4 3" />
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
                ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
