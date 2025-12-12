import React, { useEffect, useState } from 'react';

// LocalStorage key for big editor
const STORAGE_KEY = 'services.list';

// Types
type Service = {
  id: string;
  name: string;
  description: string;
  tests: string[];
};

type SubService = {
  id: number;
  main_service_id: number;
  service_name: string;
  description: string;
};

type ServiceTest = {
  id: number;
  sub_service_id: number;
  test_name: string;
  description: string;
};

type ApiService = { id: number; service_name: string };

function normalizeService(input: Partial<Service>, index: number): Service {
  const id = input.id ?? `service-${index}`;
  const name = (input.name ?? 'Untitled').toString();
  const description = (input.description ?? '').toString();
  const testsSource = input.tests;
  const tests = Array.isArray(testsSource)
    ? testsSource.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
    : [];
  return { id, name, description, tests };
}

const ServiceUpdate: React.FC = () => {
  // API-backed main services
  const [apiServices, setApiServices] = useState<ApiService[]>([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sub-services
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [subServiceLoading, setSubServiceLoading] = useState(false);
  const [subServiceError, setSubServiceError] = useState<string | null>(null);
  const [newSubServiceName, setNewSubServiceName] = useState('');
  const [newSubServiceDesc, setNewSubServiceDesc] = useState('');
  const [selectedMainServiceId, setSelectedMainServiceId] = useState<number | null>(null);

  // Selected sub-service + tests
  const [selectedSubService, setSelectedSubService] = useState<SubService | null>(null);
  const [serviceTests, setServiceTests] = useState<ServiceTest[]>([]);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [newTestName, setNewTestName] = useState('');
  const [newTestDesc, setNewTestDesc] = useState('');
  const [editTestId, setEditTestId] = useState<number | null>(null);
  const [editTestName, setEditTestName] = useState('');
  const [editTestDesc, setEditTestDesc] = useState('');

  // Local big editor
  const [services, setServices] = useState<Service[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editTests, setEditTests] = useState<string[]>([]);
  const [testInput, setTestInput] = useState('');

  // Load main services on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('https://glowac-api.onrender.com/main-services')
      .then(res => res.json())
      .then((data) => {
        if (!mounted) return;
        setApiServices(Array.isArray(data) ? data : []);
      })
      .catch(() => setError('Failed to fetch services'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  // Fetch sub-services when a main is selected
  useEffect(() => {
    if (!selectedMainServiceId) {
      setSubServices([]);
      setSelectedSubService(null);
      return;
    }
    setSubServiceLoading(true);
    fetch(`https://glowac-api.onrender.com/sub-services/by-main/${selectedMainServiceId}`)
      .then(res => res.json())
      .then((data) => setSubServices(Array.isArray(data) ? data : []))
      .catch(() => setSubServiceError('Failed to fetch sub-services'))
      .finally(() => setSubServiceLoading(false));
  }, [selectedMainServiceId]);

  // Fetch tests when a sub-service is selected
  useEffect(() => {
    if (!selectedSubService) {
      setServiceTests([]);
      return;
    }
    setTestLoading(true);
    fetch(`https://glowac-api.onrender.com/service-tests/by-sub/${selectedSubService.id}`)
      .then(res => res.json())
      .then((data) => setServiceTests(Array.isArray(data) ? data : []))
      .catch(() => setTestError('Failed to fetch tests'))
      .finally(() => setTestLoading(false));
  }, [selectedSubService]);

  // Local storage load for big editor
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setServices(parsed.map((s, i) => normalizeService(s, i)));
        }
      } else {
        const seed: Service[] = [
          { id: 'soil-testing', name: 'Soil Testing', description: 'A comprehensive range of soil testing services.', tests: ['Moisture content', 'Liquid Limit'] },
          { id: 'concrete-testing', name: 'Concrete Testing', description: 'Professional concrete testing services.', tests: ['Compressive strength'] },
        ];
        setServices(seed.map((s, i) => normalizeService(s, i)));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      }
    } catch (err) {
      setServices([]);
    }
  }, []);

  function persist(list: Service[]) {
    const normalized = list.map((item, index) => normalizeService(item, index));
    setServices(normalized);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }

  // API actions
  async function handleAddNewApiService(e: React.FormEvent) {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://glowac-api.onrender.com/main-services', {
        method: 'POST',
        headers: { 'accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `service_name=${encodeURIComponent(newServiceName.trim())}`,
      });
      const data = await res.json();
      setApiServices(prev => [...prev, data]);
      setNewServiceName('');
    } catch (err) {
      setError('Failed to add service');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSubService(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMainServiceId) return;
    if (!newSubServiceName.trim()) return;
    setSubServiceLoading(true);
    setSubServiceError(null);
    try {
      const res = await fetch(`https://glowac-api.onrender.com/sub-services/by-main/${selectedMainServiceId}`, {
        method: 'POST',
        headers: { accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `service_name=${encodeURIComponent(newSubServiceName.trim())}&description=${encodeURIComponent(newSubServiceDesc.trim())}`,
      });
      const data = await res.json();
      setSubServices(prev => [...prev, data]);
      setNewSubServiceName('');
      setNewSubServiceDesc('');
    } catch {
      setSubServiceError('Failed to add sub-service');
    } finally {
      setSubServiceLoading(false);
    }
  }

  async function handleAddTest(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSubService) return;
    if (!newTestName.trim()) return;
    setTestLoading(true);
    setTestError(null);
    try {
      const res = await fetch('https://glowac-api.onrender.com/service-tests', {
        method: 'POST',
        headers: { accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `sub_service_id=${encodeURIComponent(String(selectedSubService.id))}&test_name=${encodeURIComponent(newTestName.trim())}&description=${encodeURIComponent(newTestDesc.trim())}`,
      });
      const data = await res.json();
      setServiceTests(prev => [...prev, data]);
      setNewTestName('');
      setNewTestDesc('');
    } catch {
      setTestError('Failed to add test');
    } finally {
      setTestLoading(false);
    }
  }

  function handleEditTest(t: ServiceTest) {
    setEditTestId(t.id);
    setEditTestName(t.test_name);
    setEditTestDesc(t.description);
  }

  async function handleUpdateTest(e: React.FormEvent) {
    e.preventDefault();
    if (!editTestId || !selectedSubService) return;
    setTestLoading(true);
    try {
      const res = await fetch(`https://glowac-api.onrender.com/service-tests/${editTestId}`, {
        method: 'PUT',
        headers: { accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `sub_service_id=${encodeURIComponent(String(selectedSubService.id))}&test_name=${encodeURIComponent(editTestName.trim())}&description=${encodeURIComponent(editTestDesc.trim())}`,
      });
      const updated = await res.json();
      setServiceTests(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditTestId(null);
      setEditTestName('');
      setEditTestDesc('');
    } catch {
      setTestError('Failed to update test');
    } finally {
      setTestLoading(false);
    }
  }

  async function handleDeleteTest(id: number) {
    if (!window.confirm('Delete this test?')) return;
    setTestLoading(true);
    try {
      await fetch(`https://glowac-api.onrender.com/service-tests/${id}`, { method: 'DELETE' });
      setServiceTests(prev => prev.filter(p => p.id !== id));
    } catch {
      setTestError('Failed to delete test');
    } finally {
      setTestLoading(false);
    }
  }

  // Local editor actions
  function handleAddNew() {
    const id = Date.now().toString();
    const newService: Service = { id, name: 'New Service', description: '', tests: [] };
    const next = [...services, newService];
    persist(next);
    selectService(newService);
  }

  function handleDelete(id: string) {
    if (!window.confirm('Delete this service?')) return;
    persist(services.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function selectService(s: Service) {
    setSelectedId(s.id);
    setEditName(s.name);
    setEditDesc(s.description);
    setEditTests(Array.isArray(s.tests) ? s.tests : []);
  }

  function saveService() {
    if (!selectedId) return;
    const sanitizedTests = editTests.filter(t => t.trim().length > 0);
    const next = services.map(s => s.id === selectedId ? { ...s, name: editName.trim() || s.name, description: editDesc.trim(), tests: sanitizedTests } : s);
    persist(next);
    alert('Service saved!');
  }

  function addTest() {
    if (!testInput.trim()) return;
    setEditTests([...editTests, testInput.trim()]);
    setTestInput('');
  }

  function deleteTest(idx: number) {
    setEditTests(editTests.filter((_, i) => i !== idx));
  }

  const selectedService = services.find(s => s.id === selectedId) ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Service Management Card (API-backed) */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white border rounded p-4">
          <h3 className="font-semibold mb-4">Service Management</h3>
          <form onSubmit={handleAddNewApiService} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newServiceName}
              onChange={e => setNewServiceName(e.target.value)}
              className="flex-1 border px-3 py-2 rounded"
              placeholder="Add new service name"
              disabled={loading}
            />
            <button type="submit" className="px-3 py-1 bg-teal-600 text-white rounded text-sm" disabled={loading}>Add</button>
          </form>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <div className="space-y-2">
            {loading ? (
              <div className="p-3 border rounded text-center text-sm text-gray-500">Loading...</div>
            ) : apiServices.length === 0 ? (
              <div className="p-3 border rounded text-center text-sm text-gray-500">No services found.</div>
            ) : (
              apiServices.map(s => (
                <div
                  key={s.id}
                  className={`p-3 border rounded cursor-pointer hover:bg-gray-100 ${selectedMainServiceId === s.id ? 'bg-teal-50 border-teal-500' : 'bg-gray-50'}`}
                  onClick={() => setSelectedMainServiceId(s.id)}
                >
                  <div className="font-medium text-sm">{s.service_name}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sub-service Management Card */}
        <div className="bg-white border rounded p-4">
          <h3 className="font-semibold mb-4">Sub-Service Management</h3>
          {!selectedMainServiceId ? (
            <div className="text-gray-500 text-sm">Select a main service to view and add sub-services.</div>
          ) : (
            <>
              <form onSubmit={handleAddSubService} className="space-y-2 mb-4">
                <input
                  type="text"
                  value={newSubServiceName}
                  onChange={e => setNewSubServiceName(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Sub-service name"
                  disabled={subServiceLoading}
                />
                <textarea
                  value={newSubServiceDesc}
                  onChange={e => setNewSubServiceDesc(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Description"
                  rows={2}
                  disabled={subServiceLoading}
                />
                <button type="submit" className="px-3 py-1 bg-teal-600 text-white rounded text-sm" disabled={subServiceLoading}>Add Sub-Service</button>
              </form>
              {subServiceError && <div className="text-red-600 text-sm mb-2">{subServiceError}</div>}
              <div className="space-y-2">
                {subServiceLoading ? (
                  <div className="p-3 border rounded text-center text-sm text-gray-500">Loading...</div>
                ) : subServices.length === 0 ? (
                  <div className="p-3 border rounded text-center text-sm text-gray-500">No sub-services found.</div>
                ) : (
                  subServices.map(s => (
                    <div
                      key={s.id}
                      className={`p-3 border rounded bg-gray-50 cursor-pointer ${selectedSubService && selectedSubService.id === s.id ? 'border-teal-500 bg-teal-50' : ''}`}
                      onClick={() => setSelectedSubService(s)}
                    >
                      <div className="font-medium text-sm">{s.service_name}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.description}</div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right: Sub-Service Test Management */}
      <div className="lg:col-span-2">
        {selectedSubService ? (
          <div className="bg-white border rounded p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Tests for: {selectedSubService.service_name}</h3>
            </div>
            <form onSubmit={editTestId ? handleUpdateTest : handleAddTest} className="flex flex-col md:flex-row gap-2 mb-4">
              <input
                type="text"
                value={editTestId ? editTestName : newTestName}
                onChange={e => editTestId ? setEditTestName(e.target.value) : setNewTestName(e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
                placeholder="Test name"
                disabled={testLoading}
              />
              <input
                type="text"
                value={editTestId ? editTestDesc : newTestDesc}
                onChange={e => editTestId ? setEditTestDesc(e.target.value) : setNewTestDesc(e.target.value)}
                className="flex-1 border px-3 py-2 rounded"
                placeholder="Description"
                disabled={testLoading}
              />
              <button type="submit" className="px-3 py-1 bg-teal-600 text-white rounded text-sm" disabled={testLoading}>
                {editTestId ? 'Update' : 'Add'}
              </button>
              {editTestId && (
                <button type="button" className="px-3 py-1 border rounded text-sm" onClick={() => { setEditTestId(null); setEditTestName(''); setEditTestDesc(''); }}>Cancel</button>
              )}
            </form>
            {testError && <div className="text-red-600 text-sm mb-2">{testError}</div>}
            <ul className="space-y-2">
              {testLoading ? (
                <li className="p-3 border rounded text-center text-sm text-gray-500">Loading...</li>
              ) : serviceTests.length === 0 ? (
                <li className="p-3 border rounded text-center text-sm text-gray-500">No tests defined yet.</li>
              ) : (
                serviceTests.map(t => (
                  <li key={t.id} className="flex flex-col md:flex-row md:items-center justify-between border p-2 rounded gap-2">
                    <div>
                      <div className="text-sm font-medium">{t.test_name}</div>
                      <div className="text-xs text-gray-500">{t.description}</div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded" onClick={() => handleEditTest(t)}>Edit</button>
                      <button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded" onClick={() => handleDeleteTest(t.id)}>Delete</button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        ) : (
          <div className="bg-white border rounded p-6 text-center text-gray-500">
            Select a sub-service from the list to view and manage its tests.
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceUpdate;
