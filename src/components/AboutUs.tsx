import React, { useState, useEffect } from 'react';

// --- Request Service Cards component (moved above AboutUs to avoid runtime reference errors) ---
export const RequestServiceCards: React.FC<{ defaultService?: string }> = ({ defaultService }) => {
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const name = form.get('name') || '';
    const service = form.get('service') || defaultService || 'Geotechnical & Concrete Services';
    // TODO: wire to backend API
    alert(`Request for ${service} submitted by ${name}`);
    (e.currentTarget as HTMLFormElement).reset();
    setShowModal(false);
  };

  return (
    <>
      <section className="mt-8 mb-16">
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-gray-900">Request a Service</h3>
          <p className="text-gray-600">Contact us for our geotechnical and concrete services.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-teal-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 flex-none rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-2xl font-bold">
                G
              </div>
              <div>
                <h4 className="text-2xl font-semibold text-gray-900">Geotechnical & Concrete Services</h4>
                <p className="text-gray-600">In-situ investigations, foundation support and concrete testing.</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Request This Service
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Request Geotechnical Services</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="service" value={defaultService ?? "Geotechnical & Concrete Services"} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input name="phone" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Details</label>
                <textarea name="message" rows={3} placeholder="Please describe your project requirements..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

type Hour = { id: string; day: string; hours: string; status: 'open' | 'closed' };

const AboutUs: React.FC = () => {
  const [workingHours, setWorkingHours] = useState<Hour[]>([
    { id: 'monday', day: 'Monday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { id: 'tuesday', day: 'Tuesday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { id: 'wednesday', day: 'Wednesday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { id: 'thursday', day: 'Thursday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { id: 'friday', day: 'Friday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { id: 'saturday', day: 'Saturday', hours: '10:00 AM - 4:00 PM', status: 'open' },
    { id: 'sunday', day: 'Sunday', hours: 'Closed', status: 'closed' },
  ]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('https://glowac-api.onrender.com/tus', { headers: { Accept: 'application/json' } });
        if (!mounted) return;
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (!Array.isArray(data)) return;
        const mapped: Hour[] = data.map((r: any) => ({
          id: String(r.id ?? Math.random()),
          day: typeof r.day === 'string' ? r.day : '',
          hours: typeof r.hours === 'string' ? r.hours : '',
          status: (typeof r.status === 'string' && r.status.toLowerCase() === 'closed') ? 'closed' : 'open',
        }));
        if (mounted && mapped.length) setWorkingHours(mapped);
      } catch (err) {
        console.debug('AboutUs: failed to load working hours from API', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section id="about" className="pt-0 pb-20 relative mt-12 md:mt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100 rounded-full opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-30"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="w-full lg:max-w-[calc(56rem)] mx-auto">
        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left: Company description */}
          <div className="space-y-6">
            <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Our Commitment to Excellence
            </h3>
            <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed text-justify">
              GLOWAC is committed to building strong relationships with clients by providing exceptional customer service, the highest quality legally defensible data.
            </p>
            <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed text-justify">
              Besides training, experience and knowledge of the GLOWAC team members, their values are merged to reflect the following criteria for business success.
            </p>
            
            {/* CTA Button */}
            <div className="pt-6">
              <button className="inline-flex items-center px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Learn More About Us
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Working Hours Timeline */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Working Hours</h3>
            <div className="space-y-4">
              {workingHours.map((schedule, index) => (
                <div 
                  key={schedule.day}
                  className={`flex justify-between items-center p-4 rounded-lg transition-all duration-300 hover:transform hover:scale-105 ${
                    schedule.status === 'open' 
                      ? 'bg-teal-50 border-l-4 border-teal-500 hover:bg-teal-100' 
                      : 'bg-gray-50 border-l-4 border-gray-400 hover:bg-gray-100'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      schedule.status === 'open' ? 'bg-teal-500 animate-pulse' : 'bg-gray-400'
                    }`}></div>
                    <span className="font-semibold text-gray-900">{schedule.day}</span>
                  </div>
                  <span className={`font-medium ${
                    schedule.status === 'open' ? 'text-teal-600' : 'text-gray-500'
                  }`}>
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Current Status */}
            <div className="mt-6 p-4 bg-teal-500 text-white rounded-lg text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="font-semibold">Currently Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-teal-200 p-8 md:p-12 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Facts & Figures</h3>
            <div className="w-20 h-1 bg-teal-500 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="group bg-white border-2 border-teal-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
              <div className="text-5xl lg:text-6xl font-bold text-teal-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                43
              </div>
              <p className="text-lg font-semibold text-gray-700">Clients</p>
            </div>
            <div className="group bg-white border-2 border-teal-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
              <div className="text-5xl lg:text-6xl font-bold text-teal-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                143
              </div>
              <p className="text-lg font-semibold text-gray-700">Projects Completed</p>
            </div>
            <div className="group bg-white border-2 border-teal-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
              <div className="text-5xl lg:text-6xl font-bold text-teal-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                52
              </div>
              <p className="text-lg font-semibold text-gray-700">Team Members</p>
            </div>
            <div className="group bg-white border-2 border-teal-300 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center">
              <div className="text-5xl lg:text-6xl font-bold text-teal-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                200+
              </div>
              <p className="text-lg font-semibold text-gray-700">Tests We Conduct</p>
            </div>
          </div>
        </div>

        {/* What We Do — Prominent section with big cards */}
        <div className="mt-12 text-center">
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">What We Do</h3>
          <div className="w-24 h-1 bg-teal-500 mx-auto mb-8"></div>

            <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-1 md:grid-cols-3 px-4">
            {/* Card 1: Geotechnical & Concrete Services */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-teal-100 flex flex-col items-center">
              <svg className="w-24 h-24 text-teal-600 mb-6" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect x="8" y="32" width="48" height="20" rx="2" fill="currentColor" opacity="0.12" />
                <path d="M12 32V18a2 2 0 012-2h8v16H12z" fill="currentColor" opacity="0.18" />
                <path d="M34 12h6v8h-6zM20 12h6v8h-6z" fill="currentColor" />
                <path d="M8 54h48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              </svg>
              <h4 className="text-2xl font-semibold text-gray-900 mb-2 text-center">Geotechnical & Concrete Services</h4>
              <p className="text-gray-700 text-justify">In-situ investigations, foundation design support, and concrete testing to ensure durable, safe structures.</p>
            </div>

            {/* Card 2: Topographical Surveying */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-teal-100 flex flex-col items-center">
              <svg className="w-24 h-24 text-teal-600 mb-6" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M8 20l12-6 12 6 12-6 12 6v26l-12 6-12-6-12 6L8 46V20z" fill="currentColor" opacity="0.14" />
                <circle cx="32" cy="30" r="6" fill="currentColor" />
                <path d="M32 18v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h4 className="text-2xl font-semibold text-gray-900 mb-2 text-center">Topographical Surveying</h4>
              <p className="text-gray-700 text-justify">High-precision land surveys, contour mapping and site layout services to guide design and construction.</p>
            </div>

            {/* Card 3: Environmental Impact Assessment */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-teal-100 flex flex-col items-center">
              <svg className="w-24 h-24 text-teal-600 mb-6" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M32 8c8 0 14 6 14 14 0 11-14 22-14 22s-14-11-14-22c0-8 6-14 14-14z" fill="currentColor" opacity="0.16" />
                <path d="M24 34c2-6 8-10 12-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M40 42c0 4-6 6-8 6s-8-2-8-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h4 className="text-2xl font-semibold text-gray-900 mb-2 text-center">Environmental Impact Assessment</h4>
              <p className="text-gray-700 text-justify">Comprehensive EIA studies and mitigation planning to minimise project environmental footprint.</p>
            </div>
          </div>

          {/* (Stats block moved later) */}

          {/* Why Choose Us section (moved here after stats) */}
          <div className="mt-8 mb-8 text-center">
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">Why Choose Us</h3>
            <div className="w-24 h-1 bg-teal-500 mx-auto mb-6"></div>
            <p className="max-w-4xl mx-auto text-gray-700 text-xl sm:text-2xl leading-relaxed text-justify">
              We combine deep technical expertise with a commitment to client success — delivering reliable, timely, and cost-effective geotechnical solutions tailored to your project's needs.
            </p>
          </div>

          {/* Additional Stats section (placed under Why Choose Us) */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-teal-200 p-8 md:p-12 mt-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
              <div className="group flex-1">
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform duration-300">100%</div>
                <p className="text-gray-700 font-medium">Client Satisfaction</p>
              </div>

              <div className="hidden md:flex items-center px-6"><div className="h-24 md:h-28 w-[2px] bg-black/90 rounded"></div></div>

              <div className="group flex-1">
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <p className="text-gray-700 font-medium">Customer Support</p>
              </div>

              <div className="hidden md:flex items-center px-6"><div className="h-24 md:h-28 w-[2px] bg-black/90 rounded"></div></div>

              <div className="group flex-1">
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform duration-300">∞</div>
                <p className="text-gray-700 font-medium">Commitment to Quality</p>
              </div>
            </div>
          </div>

          {/* Request Service section removed from About page — moved to Services page */}
        </div>

        
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
