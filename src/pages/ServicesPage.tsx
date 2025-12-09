import React from 'react';

const ServicesPage: React.FC = () => {
  const services = [
    { title: 'Geotechnical Service 1', desc: 'Soil analysis and testing.' },
    { title: 'Geotechnical Service 2', desc: 'Foundation studies.' },
    { title: 'Other Service 1', desc: 'Consulting services.' },
    { title: 'Other Service 2', desc: 'Site inspection.' },
  ];

  return (
    <main className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:max-w-4xl mx-auto">
          <p className="text-lg text-gray-700 mb-8">We provide a range of geotechnical and consulting services to support your projects.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s) => (
              <div key={s.title} className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ServicesPage;
