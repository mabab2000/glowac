import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RequestServiceCards } from '../components/AboutUs';

const ServicesPage: React.FC = () => {
  const location = useLocation();
  // map URL subpaths to service titles
  const serviceTitleMap: Record<string, string> = {
    'geotechnical/service1': 'Geotechnical Service 1',
    'geotechnical/service2': 'Geotechnical Service 2',
    'other/service1': 'Other Service 1',
    'other/service2': 'Other Service 2',
  };

  // build key from the path after /services/
  const path = location.pathname.replace(/(^\/|\/$)/g, ''); // trim slashes
  // pathSegments[0] should be 'services'
  const pathSegments = path.split('/');
  const subpath = pathSegments.length > 1 ? pathSegments.slice(1).join('/') : '';
  const serviceTitle = serviceTitleMap[subpath] || null;
  // when viewing a specific service, scroll page to bottom (show footer) on mount
  useEffect(() => {
    if (serviceTitle) {
      // delay slightly to allow layout to settle
      const t = setTimeout(() => {
        try {
          const height = document.documentElement.scrollHeight || document.body.scrollHeight;
          window.scrollTo({ top: height, left: 0, behavior: 'auto' });
        } catch (e) {
          // ignore
        }
      }, 50);
      return () => clearTimeout(t);
    }
  }, [serviceTitle]);
  return (
    <main className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:max-w-4xl mx-auto">
          {serviceTitle ? (
            <div className="mb-8">
              <div className="bg-emerald-100 rounded-none text-center p-8">
                <h1 className="text-3xl font-bold text-emerald-600 mb-2">{serviceTitle}</h1>
                <div className="w-20 h-1 bg-emerald-600 mx-auto" />
              </div>
            </div>
          ) : (
            /* Soil Testing service detail */
            <section className="mt-12">
            <div className="w-full lg:max-w-[calc(56rem)] mx-auto">
              <div className="bg-emerald-100 rounded-none text-center p-12">
                <h1 className="text-3xl font-bold text-emerald-600 mb-4">Soil Testing</h1>
                <div className="w-20 h-1 bg-emerald-600 mx-auto" />
              </div>

              <div className="mt-6 p-8 bg-white rounded-none border border-emerald-200 text-justify">
                <p className="text-gray-700 mb-4">
                  A comprehensive range of soil testing services is provided for a variety of industry sectors from our specialist environmental testing facilities.
                </p>

                <p className="text-gray-700 font-semibold mb-3">Glowac Laboratory provides the following soil tests:</p>

                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Moisture content</li>
                  <li>Liquid Limit</li>
                  <li>Plastic Limit &amp; Plastic Index</li>
                  <li>Particle Density Determination - Pyknometer</li>
                  <li>Bulk Density for Undisturbed samples</li>
                  <li>Relative Density / Specific Gravity</li>
                  <li>Particle Size Distribution - Wet sieving</li>
                  <li>Particle Size Distribution - Hydrometer Method</li>
                  <li>Compaction tests - Standard Proctor</li>
                  <li>Compaction test - Modified Proctor</li>
                  <li>CBR test - Soaked</li>
                  <li>CBR Test - Unsoaked</li>
                  <li>In situ CBR</li>
                </ul>
              </div>
            </div>
            </section>
          )}
        </div>

        {/* Request Service form — moved here from About page */}
        <div className="w-full lg:max-w-4xl mx-auto mt-8 px-4">
          <RequestServiceCards defaultService={serviceTitle ?? undefined} />
        </div>
      </div>
    </main>
  );
};

export default ServicesPage;
