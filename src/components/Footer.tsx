import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* About Us Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">About Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-emerald-200 hover:text-white transition-colors duration-300">
                  Historical Background
                </a>
              </li>
              <li>
                <a href="#" className="text-emerald-200 hover:text-white transition-colors duration-300">
                  Mission Vision Values
                </a>
              </li>
              <li>
                <a href="#" className="text-emerald-200 hover:text-white transition-colors duration-300">
                  Our Laboratory
                </a>
              </li>
              <li>
                <a href="#" className="text-emerald-200 hover:text-white transition-colors duration-300">
                  Why Choosing Us!
                </a>
              </li>
              <li>
                <a href="/update" className="text-emerald-200 hover:text-white transition-colors duration-300">
                  Update (admin)
                </a>
              </li>
            </ul>
          </div>

          {/* Services Section (populated from API) */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Services</h3>
            <ServiceList />
          </div>

          {/* Contacts Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Contacts</h3>
            <div className="space-y-3">
              <p className="text-emerald-200">
                Avenue des Poids Lourds, KN7 ROAD, DR71, Muhima, Nyarugenge
              </p>
              <p className="text-teal-200">
                Phone: +250 788 764 432
              </p>
              <p className="text-emerald-200">
                Email: info@glowac.rw
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section (horizontal line only) */}
        <div className="border-t border-emerald-600 pt-8" />

      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/250788764432"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
            <path fill="currentColor" d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 .02 5.35.02 12c0 2.11.56 4.09 1.62 5.84L0 24l6.41-1.69A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.22-3.48-8.52zM12 21.5c-1.33 0-2.63-.33-3.77-.98l-.27-.16L4 21l1-3.98-.17-.28A8.5 8.5 0 013.5 12 8.5 8.5 0 1121.5 12 8.5 8.5 0 0112 21.5z" />
            <path fill="currentColor" d="M17.3 14.1c-.3-.15-1.79-.88-2.07-.98-.27-.1-.47-.15-.67.15s-.77.98-.94 1.18c-.17.2-.33.22-.62.07-1.68-.84-2.78-1.5-3.9-3.36-.29-.46.29-.43.82-1.43.09-.17.05-.31-.03-.46-.08-.15-.67-1.59-.92-2.18-.24-.57-.48-.49-.66-.5-.17-.01-.37-.01-.57-.01s-.46.07-.7.33c-.24.26-.93.9-.93 2.2 0 1.3.95 2.55 1.08 2.73.13.18 1.86 3.02 4.52 4.23 1.88.82 2.33.86 3.17.72.51-.09 1.79-.73 2.04-1.44.25-.71.25-1.32.18-1.45-.07-.13-.27-.2-.57-.35z" />
          </svg>
        </a>
      </div>
      </div>
    </footer>
  );
};

export default Footer;

// Services list component (fetches main services from API)
const ServiceList: React.FC = () => {
  interface Service { id: number | string; name: string; slug?: string }
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('https://glowac-api.onrender.com/main-services', { headers: { accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) {
          const mapped = data.map((d: any) => ({ id: d.id ?? d._id ?? d.slug ?? '', name: d.name ?? d.title ?? 'Service', slug: d.slug }));
          setServices(mapped);
        } else {
          setServices([]);
        }
      })
      .catch(() => {
        if (mounted) setServices([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <ul className="space-y-3">
        {[1, 2, 3].map((n) => (
          <li key={n} className="animate-pulse">
            <div className="h-4 bg-emerald-600/30 rounded w-3/4" />
          </li>
        ))}
      </ul>
    );
  }

  if (services.length === 0) {
    return <p className="text-emerald-200">No services available.</p>;
  }

  return (
    <ul className="space-y-3">
      {services.map((s) => (
        <li key={String(s.id)}>
          <a href={`/services/${s.id}`} className="text-emerald-200 hover:text-white transition-colors duration-300">
            {s.name}
          </a>
        </li>
      ))}
    </ul>
  );
};