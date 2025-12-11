import React, { useEffect, useState } from 'react';

type Service = {
  id: string;
  name: string;
  description: string;
  tests: string[];
};

const STORAGE_KEY = 'services.list';

function normalizeService(input: any, index: number): Service {
  const idCandidate = input?.id;
  const id = typeof idCandidate === 'string' && idCandidate.trim().length > 0
    ? idCandidate
    : `service-${index}`;

  const nameCandidate = input?.name;
  const name = typeof nameCandidate === 'string' && nameCandidate.trim().length > 0
    ? nameCandidate
    : 'Untitled Service';

  const descriptionCandidate = input?.description;
  const description = typeof descriptionCandidate === 'string'
    ? descriptionCandidate
    : '';

  const testsSource = input?.tests;
  const tests = Array.isArray(testsSource)
    ? testsSource.filter((t: unknown): t is string => typeof t === 'string' && t.trim().length > 0)
    : [];

  return { id, name, description, tests };
}

const ServiceUpdate: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Form fields for editing
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editTests, setEditTests] = useState<string[]>([]);
  const [testInput, setTestInput] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((item, index) => normalizeService(item, index));
          setServices(normalized);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        } else {
          setServices([]);
        }
      } else {
        // seed with sensible defaults
        const seed: Service[] = [
          { 
            id: 'soil-testing', 
            name: 'Soil Testing',
            description: 'A comprehensive range of soil testing services is provided for a variety of industry sectors from our specialist environmental testing facilities.',
            tests: ['Moisture content', 'Liquid Limit', 'Plastic Limit & Plastic Index', 'Particle Density Determination', 'Bulk Density for Undisturbed samples']
          },
          { 
            id: 'concrete-testing', 
            name: 'Concrete Testing',
            description: 'Professional concrete testing services ensuring quality and compliance.',
            tests: ['Compressive strength', 'Slump test', 'Air content']
          },
        ];
        const normalizedSeed = seed.map((item, index) => normalizeService(item, index));
        setServices(normalizedSeed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedSeed));
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
    if (selectedId === id) {
      setSelectedId(null);
    }
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
    const next = services.map(s => 
      s.id === selectedId 
        ? { ...s, name: editName.trim() || s.name, description: editDesc.trim(), tests: sanitizedTests }
        : s
    );
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

  const selectedService = services.find(s => s.id === selectedId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Service List */}
      <div className="lg:col-span-1">
        <div className="bg-white border rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Services</h3>
            <button onClick={handleAddNew} className="px-3 py-1 bg-teal-600 text-white rounded text-sm">Add New</button>
          </div>
          <div className="space-y-2">
            {services.length === 0 && (
              <div className="p-3 border rounded text-center text-sm text-gray-500">
                No services stored yet. Click "Add New" to create one.
              </div>
            )}
            {services.map(s => (
              <div 
                key={s.id} 
                className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${selectedId === s.id ? 'bg-teal-50 border-teal-500' : ''}`}
                onClick={() => selectService(s)}
              >
                <div className="font-medium text-sm">{s.name}</div>
                <div className="text-xs text-gray-500 mt-1">{(s.tests ?? []).length} tests</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Service Editor */}
      <div className="lg:col-span-2">
        {selectedService ? (
          <div className="bg-white border rounded p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Edit Service</h3>
              <div className="flex gap-2">
                <button onClick={saveService} className="px-4 py-2 bg-emerald-600 text-white rounded">Save</button>
                <button onClick={() => handleDelete(selectedService.id)} className="px-4 py-2 border rounded text-red-600">Delete</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Service Name</label>
              <input 
                value={editName} 
                onChange={e => setEditName(e.target.value)} 
                className="w-full border px-3 py-2 rounded" 
                placeholder="e.g. Soil Testing" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea 
                value={editDesc} 
                onChange={e => setEditDesc(e.target.value)} 
                rows={3} 
                className="w-full border px-3 py-2 rounded" 
                placeholder="Brief service description" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tests / Features Provided</label>
              <div className="flex gap-2 mb-3">
                <input 
                  value={testInput} 
                  onChange={e => setTestInput(e.target.value)} 
                  className="flex-1 border px-3 py-2 rounded" 
                  placeholder="Add a test or feature" 
                  onKeyPress={e => e.key === 'Enter' && addTest()}
                />
                <button onClick={addTest} className="px-3 py-1 bg-teal-600 text-white rounded">Add</button>
              </div>
              <ul className="space-y-2">
                {editTests.map((t, idx) => (
                  <li key={idx} className="flex justify-between items-center border p-2 rounded">
                    <span className="text-sm">{t}</span>
                    <button onClick={() => deleteTest(idx)} className="text-red-600 text-sm">Delete</button>
                  </li>
                ))}
                {editTests.length === 0 && <div className="text-sm text-gray-500">No tests defined yet.</div>}
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-white border rounded p-6 text-center text-gray-500">
            Select a service from the list to edit, or click "Add New" to create one.
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceUpdate;
