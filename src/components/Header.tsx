import React, { useState } from 'react';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { href: '/#home', label: 'HOME' },
    { href: '/#about', label: 'ABOUT US' },
    { href: '/#services', label: 'SERVICES' },
    { href: '/#contact', label: 'CONTACT US' },
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
              <nav aria-label="Primary navigation" className="hidden lg:flex lg:items-center lg:space-x-6">
                {links.map(link => (
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
                    {link.label === 'SERVICES' && (
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6a2 2 0 01-2 2h-3l-2 3-2-3H6a2 2 0 01-2-2V8" />
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
              {links.map(link => (
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
                    {link.label === 'SERVICES' && (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 8v6a2 2 0 01-2 2h-3l-2 3-2-3H6a2 2 0 01-2-2V8" />
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
