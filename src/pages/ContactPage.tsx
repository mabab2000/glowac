import React, { useState, useEffect } from 'react';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ text: string; visible: boolean } | null>(null);

  useEffect(() => {
    if (!toast || !toast.visible) return;
    const t = setTimeout(() => setToast({ ...toast, visible: false }), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const body = new URLSearchParams();
      body.append('name', name);
      body.append('email', email);
      body.append('message', message);

      const res = await fetch('https://glowac-api.onrender.com/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', accept: 'application/json' },
        body: body.toString(),
      });
      const data = await res.json();
      if (res.ok) {
        const text = data?.message || 'Message sent successfully.';
        setToast({ text, visible: true });
        setName('');
        setEmail('');
        setMessage('');
      } else {
        const text = data?.message || 'Failed to send message.';
        setToast({ text, visible: true });
      }
    } catch (err) {
      setToast({ text: 'Network error — please try again.', visible: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:max-w-[calc(56rem)] mx-auto">

          {/* Title banner (matches About/Services style) */}
          <div className="bg-emerald-100 rounded-none text-center p-8 mb-8 dashed-bg">
            <h1 className="text-3xl font-bold text-emerald-600 mb-2">Contact Us</h1>
            <div className="w-20 h-1 bg-emerald-600 mx-auto" />
            <p className="max-w-2xl mx-auto text-gray-700 mt-4">Reach out to GLOWAC using the details below or send us a message using the form — we're here to help.</p>
          </div>

          {/* Grid: map (spans 2 cols on large screens) + right column for contact cards/form */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Map */}
            <div className="lg:col-span-2 rounded-xl overflow-hidden shadow border border-gray-200 h-64 sm:h-80 md:h-96 lg:h-[420px]">
              <iframe
                title="GLOWAC location map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15950.123456789!2d30.1044!3d-1.9706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwNTgnMTQuMiJTIDMwwrAwNicxNS44IkU!5e1!3m2!1sen!2srw!4v1234567890"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Right column: contact cards (form moved below to span full width) */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
                <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
                <p className="text-gray-700">Address: Avenue des Poids Lourds, KN7 ROAD, DR71, Muhima, Nyarugenge</p>
                <p className="text-gray-700">Phone: <a className="text-teal-600" href="tel:+250788764432">+250 788 764 432</a></p>
                <p className="text-gray-700">Email: <a className="text-teal-600" href="mailto:info@glowac.rw">info@glowac.rw</a></p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
                <h3 className="text-xl font-semibold mb-3">Working Hours</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Mon–Fri: 9:00 AM – 6:00 PM</li>
                  <li>Saturday: 10:00 AM – 4:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
              {/* form moved below to be full-width */}
            </div>
          </div>

          {/* Full-width message form card */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow border border-gray-200">
            <h3 className="text-xl font-semibold mb-3">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Briefly describe your project or question..." className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows={6} />
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-teal-600 text-white rounded-md disabled:opacity-50">
                  {submitting ? 'Sending…' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          {/* Toast */}
          {toast && toast.visible && (
            <div className="fixed right-6 bottom-6 z-50 w-80">
              <div className="bg-emerald-600 text-white rounded-md shadow-lg p-4">
                <div className="font-medium">{toast.text}</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
};

export default ContactPage;
