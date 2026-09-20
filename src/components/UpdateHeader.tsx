import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

type IconName = 'dashboard' | 'about' | 'services' | 'messages' | 'external';

const Icon: React.FC<{ name: IconName }> = ({ name }) => {
  const paths: Record<IconName, React.ReactNode> = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    about: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    services: (
      <>
        <path d="M12 2 3 7l9 5 9-5-9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 17 9 5 9-5" />
      </>
    ),
    messages: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
        <path d="M8 9h8M8 13h5" />
      </>
    ),
    external: (
      <>
        <path d="M15 3h6v6" />
        <path d="m10 14 11-11" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </>
    ),
  };

  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};

const navigation: Array<{ label: string; description: string; to: string; icon: IconName }> = [
  { label: 'Dashboard', description: 'Home content', to: '/update', icon: 'dashboard' },
  { label: 'About', description: 'Company information', to: '/update/aboutupdate', icon: 'about' },
  { label: 'Services', description: 'Service catalogue', to: '/update/serviceupdate', icon: 'services' },
  { label: 'Messages', description: 'Inbox and requests', to: '/update/messageupdate', icon: 'messages' },
];

const UpdateHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuOpen]);

  const isActive = (to: string) => {
    if (to === '/update') {
      return pathname === '/update' || pathname === '/update/' || pathname === '/update/homeupdate';
    }
    return pathname === to;
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-emerald-200 bg-emerald-50 px-4 shadow-sm lg:hidden">
        <Link to="/update" className="flex items-center gap-3" aria-label="GLOWAC dashboard">
          <img src="/logo.png" alt="" className="h-9 w-9 rounded-lg object-contain" />
          <div>
            <p className="text-sm font-bold tracking-wide text-emerald-950">GLOWAC</p>
            <p className="text-xs text-emerald-700">Admin dashboard</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-200 bg-white text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-emerald-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-emerald-800 bg-gradient-to-b from-emerald-900 via-green-900 to-emerald-950 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Update dashboard navigation"
      >
        <div className="flex h-20 items-center justify-between border-b border-emerald-800/80 bg-emerald-950/20 px-5">
          <Link to="/update" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
              <img src="/logo.png" alt="" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold tracking-wide">GLOWAC</p>
              <p className="truncate text-xs text-emerald-200/75">Content management</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-emerald-200 transition hover:bg-emerald-800 hover:text-white lg:hidden"
            aria-label="Close navigation menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300/60">Menu</p>
          <div className="space-y-1.5">
            {navigation.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                    active
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 ring-1 ring-lime-300/20'
                      : 'text-emerald-50/80 hover:bg-emerald-800/70 hover:text-white'
                  }`}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? 'bg-white/15' : 'bg-emerald-950/35 group-hover:bg-emerald-700/70'}`}>
                    <Icon name={item.icon} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className={`truncate text-xs ${active ? 'text-emerald-50/80' : 'text-emerald-200/50 group-hover:text-emerald-100/70'}`}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-emerald-800/80 bg-emerald-950/20 p-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-emerald-100/80 transition hover:bg-emerald-800/70 hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-950/40">
              <Icon name="external" />
            </span>
            View public website
          </a>
          <p className="mt-4 px-3 text-[11px] text-emerald-300/40">GLOWAC Admin · 2026</p>
        </div>
      </aside>
    </>
  );
};

export default UpdateHeader;
