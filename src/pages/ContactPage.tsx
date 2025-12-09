import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <main className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 mb-4">Reach out to GLOWAC using the details below or send us a message using the form.</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <p className="text-gray-700">Address: Rwanda - Kigali City 24 KG 607 St</p>
              <p className="text-gray-700">Phone: +250 788 764 432</p>
              <p className="text-gray-700">Email: info@glowac.rw</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
              <h3 className="font-semibold mb-3">Send us a message</h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows={5} />
                </div>
                <div>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-md">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactPage;
