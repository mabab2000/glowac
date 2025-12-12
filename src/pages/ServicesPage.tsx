import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RequestServiceCards } from '../components/AboutUs';

const ServicesPage: React.FC = () => {
  const location = useLocation();
  // state for dynamic services/tests
  type MainService = { id: number; service_name: string };
  type SubService = { id: number; main_service_id: number; service_name: string; description?: string };
  type ServiceTest = { id: number; main_service_id: number; sub_service_id: number; test_name: string; description?: string };

  const [mainServices, setMainServices] = useState<MainService[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [tests, setTests] = useState<ServiceTest[]>([]);
  const [serviceTitle, setServiceTitle] = useState<string | null>(null);
  const [serviceDescription, setServiceDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // build key from the path after /services/
  const path = location.pathname.replace(/(^\/|\/$)/g, ''); // trim slashes
  // pathSegments[0] should be 'services'
  const pathSegments = path.split('/');
  const mainSlug = pathSegments.length > 1 ? pathSegments[1] : '';
  const subSlug = pathSegments.length > 2 ? pathSegments[2] : '';

  // utility slugify
  const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

  // Load main services once on mount (used for menu and resolving slugs)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('https://glowac-api.onrender.com/main-services', { headers: { accept: 'application/json' } });
        if (!mounted) return;
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        setMainServices(data.map((r: any) => ({ id: Number(r.id), service_name: String(r.service_name ?? '') })));
      } catch (err) {
        console.debug('ServicesPage: failed to fetch main services', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Resolve and load sub-service details + tests when the path changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      setServiceTitle(null);
      setServiceDescription(null);
      setSubServices([]);
      setTests([]);

      // if no main or sub slug, nothing special
      if (!mainSlug) return;

      setLoading(true);
      try {
        // find main id by slug (if mainServices already loaded)
        let mainId: number | null = null;
        if (mainServices.length) {
          const found = mainServices.find(m => slugify(m.service_name) === mainSlug);
          if (found) mainId = found.id;
        }
        // if not found yet, try fetching main-services synchronously
        if (mainId === null) {
          const resMain = await fetch('https://glowac-api.onrender.com/main-services', { headers: { accept: 'application/json' } });
          if (resMain.ok) {
            const data = await resMain.json();
            if (Array.isArray(data)) {
              const mapped = data.map((r: any) => ({ id: Number(r.id), service_name: String(r.service_name ?? '') }));
              if (!mounted) return;
              setMainServices(mapped);
              const f = mapped.find(m => slugify(m.service_name) === mainSlug);
              if (f) mainId = f.id;
            }
          }
        }

        if (!mainId) {
          // no main id resolved; nothing more to do
          return;
        }

        // fetch sub-services for this main
        const res = await fetch(`https://glowac-api.onrender.com/sub-services/by-main/${mainId}`, { headers: { accept: 'application/json' } });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mapped: SubService[] = data.map((r: any) => ({ id: Number(r.id), main_service_id: Number(r.main_service_id ?? mainId), service_name: String(r.service_name ?? ''), description: typeof r.description === 'string' ? r.description : undefined }));
            setSubServices(mapped);
            // if subSlug provided, find the sub-service
            if (subSlug) {
              const found = mapped.find(s => slugify(s.service_name) === subSlug);
              if (found) {
                setServiceTitle(found.service_name);
                setServiceDescription(found.description ?? null);
                // fetch tests for this sub-service
                const tRes = await fetch(`https://glowac-api.onrender.com/service-tests/by-sub/${found.id}`, { headers: { accept: 'application/json' } });
                if (!mounted) return;
                if (tRes.ok) {
                  const tData = await tRes.json();
                  if (Array.isArray(tData)) {
                    const mappedTests: ServiceTest[] = tData.map((r: any) => ({ id: Number(r.id), main_service_id: Number(r.main_service_id ?? mainId), sub_service_id: Number(r.sub_service_id ?? found.id), test_name: String(r.test_name ?? ''), description: typeof r.description === 'string' ? r.description : undefined }));
                    setTests(mappedTests);
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('ServicesPage load error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [location.pathname, mainSlug, subSlug, mainServices]);
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

              {/* Service description and tests */}
              <div className="mt-6 p-8 bg-white rounded-none border border-emerald-200 text-justify">
                {serviceDescription && <p className="text-gray-700 mb-4">{serviceDescription}</p>}

                <h2 className="text-xl font-semibold text-emerald-600 mb-3">Tests & Procedures</h2>

                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div>
                    {tests.length === 0 ? (
                      <div className="text-sm text-gray-500">No tests found for this sub-service.</div>
                    ) : (
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {tests.map(t => (
                          <li key={t.id} className="">
                            <div className="font-semibold">{t.test_name}</div>
                            {(t.description && String(t.description).trim().toLowerCase() !== 'string') && (
                              <div className="text-sm text-gray-600">{t.description}</div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* No sub-service selected */
            <section className="mt-12">
              <div className="w-full lg:max-w-[calc(56rem)] mx-auto">
                <div className="bg-emerald-100 rounded-none text-center p-12">
                  <h1 className="text-3xl font-bold text-emerald-600 mb-4">Services</h1>
                  <div className="w-20 h-1 bg-emerald-600 mx-auto" />
                </div>

                <div className="mt-6 p-8 bg-white rounded-none border border-emerald-200 text-justify">
                  <p className="text-gray-700 mb-4">
                    Select a sub-service from the Services menu to view available tests and procedures.
                  </p>
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
