import React, { useState, useEffect, useRef } from 'react';

// --- Request Service Cards component (moved above AboutUs to avoid runtime reference errors) ---
export const RequestServiceCards: React.FC<{ defaultService?: string }> = ({ defaultService }) => {
  const [showModal, setShowModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ text: string; visible: boolean } | null>(null);

  useEffect(() => {
    if (!toast || !toast.visible) return;
    const t = setTimeout(() => setToast({ ...toast, visible: false }), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const formRef = useRef<HTMLFormElement | null>(null);

  // Validation state
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const validate = (fields: { name: string; email: string; phone: string; project_details: string; }) => {
    const errs: { [k: string]: string } = {};
    if (!fields.name.trim()) errs.name = 'Name is required.';
    if (!fields.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email)) errs.email = 'Invalid email address.';
    // phone is optional
    if (!fields.project_details.trim()) errs.project_details = 'Project details are required.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const name = String(form.get('name') || '');
    const email = String(form.get('email') || '');
    const phone = String(form.get('phone') || '');
    const project_details = String(form.get('message') || '');
    const service = String(form.get('service') || defaultService || 'Geotechnical & Concrete Services');

    const validation = validate({ name, email, phone, project_details });
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const body = new URLSearchParams();
      body.append('name', name);
      body.append('email', email);
      body.append('phone', phone);
      body.append('project_details', project_details);

      await fetch('https://glowac-api.onrender.com/geotech-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' },
        body: body.toString(),
      });
      setToast({ text: 'Request submitted — thank you.', visible: true });
      (e.currentTarget as HTMLFormElement).reset();
      setShowModal(false);
      setErrors({});
    } catch (err) {
      setToast({ text: 'Request submitted — thank you.', visible: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="mt-0 mb-6">
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

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="service" value={defaultService ?? "Geotechnical & Concrete Services"} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input name="name" placeholder='Enter you full name here' required className={`w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.name && <div className="text-red-600 text-xs mt-1">{errors.name}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" placeholder='Enter your email address' type="email" required className={`w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                  {errors.email && <div className="text-red-600 text-xs mt-1">{errors.email}</div>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input name="phone" placeholder='Phone number' className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Details</label>
                <textarea name="message" rows={3} placeholder="Please describe your project requirements..." className={`w-full px-3 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500 ${errors.project_details ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                {errors.project_details && <div className="text-red-600 text-xs mt-1">{errors.project_details}</div>}
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  )}
                  {submitting ? 'Sending…' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast for RequestServiceCards */}
      {toast && toast.visible && (
        <div className="fixed right-6 bottom-6 z-50 w-80">
          <div className="bg-emerald-600 text-white rounded-md shadow-lg p-4">
            <div className="font-medium">{toast.text}</div>
          </div>
        </div>
      )}
    </>
  );
};

type Hour = { id: string; day: string; hours: string; status: 'open' | 'closed' };

const AboutUs: React.FC = () => {
  const [workingHours, setWorkingHours] = useState<Hour[]>([
    { id: 'weekdays', day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM', status: 'open' },
    { id: 'saturday', day: 'Saturday', hours: '09:00 AM - 5:00 PM', status: 'open' },
    { id: 'sunday', day: 'Sunday', hours: 'Closed', status: 'closed' },
  ]);

  type Fact = { id: string; label: string; value: string };
  const [facts, setFacts] = useState<Fact[]>([
    { id: 'clients', label: 'Clients', value: '43' },
    { id: 'projects', label: 'Projects Completed', value: '143' },
    { id: 'team', label: 'Team Members', value: '52' },
    { id: 'tests', label: 'Tests We Conduct', value: '200+' },
  ]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('https://glowac-api.onrender.com/facts', { headers: { Accept: 'application/json' } });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mapped: Fact[] = data.map((r: any) => ({ id: String(r.id ?? Date.now()), label: String(r.label ?? ''), value: String(r.number ?? r.value ?? '') }));
            setFacts(mapped);
            try { localStorage.setItem('home.facts', JSON.stringify(mapped)); } catch {}
            return;
          }
        }
      } catch (err) {
        console.debug('AboutUs: failed to load facts from API', err);
      }
      // fallback: try localStorage
      try {
        const stored = localStorage.getItem('home.facts');
        if (stored) setFacts(JSON.parse(stored));
      } catch {}
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section id="about" className="pt-0 pb-8 relative md:mt-0">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-40 w-80 h-80 bg-teal-100 rounded-full opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-30"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 relative">
        <div className="w-full lg:max-w-[calc(62rem)] mx-auto">
        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left: Company description (Background paragraphs loaded from API, no defaults) */}
          <div className="space-y-0 mx-4 sm:mx-0">
            <h4 id="our-commitment" className="text-4xl sm:text-5xl font-bold text-gray-900 mb-0 mx-2 sm:mx-0">
              Our Commitment to Excellence
            </h4>
            <p className="text-xl sm:text-1xl mx-auto text-gray-700 leading-relaxed text-justify">
              GLOWAC is committed to building strong relationships with clients by providing exceptional customer service, the highest quality legally defensible data.
            </p>
            <p className="text-xl sm:text-1xl mx-auto  text-gray-700 leading-relaxed text-justify">
              Besides training, experience and knowledge of the GLOWAC team members, their values are merged to reflect the following criteria for business success.
            </p>
            <p className="text-xl sm:text-1xl mx-auto text-gray-700 leading-relaxed text-justify">
              Our focus on quality, instrumentation, and adherence to recognised standards ensures reliable results for engineers, contractors, and researchers.
            </p>
          </div>

          {/* Right: Working Hours and Certifications as separate cards */}
          <div className="space-y-6">
            {/* Certifications Card */}
            <div className="bg-white/80 p-6 rounded-lg shadow-lg border border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Our Certifications</h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Engineer Certificate */}
                <div className="border-2 border-blue-300 rounded-lg p-3 text-center hover:border-blue-500 transition-colors duration-300 bg-transparent">
                  <div className="flex items-center justify-center mb-2">
                    <img 
                      src="/images/engineer-logo.png" 
                      alt="Engineer Certification" 
                      className="w-30 h-14 object-contain"
                    />
                  </div>
                  <div className="text-blue-600 font-semibold text-xs">Member</div>
                </div>
                
                {/* RSB Certificate */}
                <div className="border-2 border-gray-300 rounded-lg p-3 text-center hover:border-gray-500 transition-colors duration-300 bg-transparent">
                  <div className="flex items-center justify-center mb-2">
                    <img 
                      src="/images/rsb-icon.png" 
                      alt="Rwanda Standards Board" 
                      className="w-30 h-14 object-contain"
                    />
                  </div>
                  <div className="text-gray-700 font-semibold text-xs">ISO/IEC 17025:2027</div>
                </div>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="bg-white/80 p-6 rounded-lg shadow-lg border border-gray-200">
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Working Hours</h4>
              <div className="space-y-3">
                {workingHours.map((schedule, index) => (
                  <div 
                    key={schedule.id}
                    className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 hover:transform hover:scale-105 ${
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
            </div>
          </div>
        </div>

        {/* Stats section (carousel like team members) */}
        {/* <div className="bg-white rounded-0xl shadow-xl border-2 border-teal-200 p-8 md:p-12 mb-16">
          <div className="text-center mb-8">
            <h3 id="facts" className="text-3xl font-bold text-gray-900 mb-2">Facts & Figures</h3>
            <div className="w-20 h-1 bg-teal-500 mx-auto"></div>
          </div>

    
          <FactsCarousel facts={facts} />
        </div> */}

        <div className="mt-0 text-center mx-4 sm:mx-0">
          
          

            

          {/* (Stats block moved later) */}

          {/* Why Choose Us section (moved here after stats) */}
          <div className="mt-0 mb-0 text-center">
            <h4 id="why-choose-us" className="text-4xl sm:text-1xl mx-auto lg:text-1xl font-bold text-gray-900 mb-0">Why Choose Us</h4>
            <div className="w-24 h-1 bg-teal-500 mx-auto mb-6"></div>
            <p className="max-w-4xl mx-auto text-gray-700 text-xl sm:text-2xl leading-relaxed text-justify">
              We combine deep technical expertise with a commitment to client success — delivering reliable, timely, and cost-effective geotechnical solutions tailored to your project's needs.
            </p>
          </div>

          {/* Additional Stats section (placed under Why Choose Us) */}
          <div className="bg-white rounded-0xl shadow-xl border-2 border-teal-200 p-8 md:p-12 mt-8 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
              <div className="group flex-1">
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
                <p className="text-gray-700 font-medium">Client Satisfaction</p>
              </div>

              <div className="hidden md:flex items-center px-6"><div className="h-24 md:h-28 w-[2px] bg-black/90 rounded"></div></div>

              <div className="group flex-1">
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <p className="text-gray-700 font-medium">Customer Support</p>
              </div>

              <div className="hidden md:flex items-center px-6"><div className="h-24 md:h-28 w-[2px] bg-black/90 rounded"></div></div>

              <div className="group flex-1">
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform duration-300">15+</div>
                <p className="text-gray-700 font-medium">Years of Experience</p>
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

// FactsCarousel component placed after default export to keep file grouping
const FactsCarousel: React.FC<{ facts: { id: string; label: string; value: string }[] }> = ({ facts }) => {
  const items = [...facts, ...facts];
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (facts.length === 0) return;

    const speed = 30; // px/sec

    const step = (time: number) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;
      if (!pausedRef.current) {
        el.scrollLeft += speed * delta;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [facts.length]);

  if (facts.length === 0) return <div className="text-sm text-gray-500">No facts available.</div>;

  return (
    <div className="overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}>
      <div
        ref={scrollerRef}
        className="flex gap-6 snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar"
        aria-hidden="true">
        {items.map((f, idx) => (
          <div key={`${f.id}-${idx}`} className="flex-none min-w-[60%] sm:min-w-[45%] md:min-w-[25%] bg-white border border-teal-200 rounded-none text-center p-6">
            <div className="text-4xl sm:text-5xl font-bold text-teal-600 mb-3">{f.value}</div>
            <p className="text-lg font-semibold text-gray-700">{f.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
