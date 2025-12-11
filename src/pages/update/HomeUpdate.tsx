import React, { useEffect, useMemo, useState } from 'react';

type Fact = { id: string; label: string; value: string };

type BannerSlide = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  highlight: string;
  description: string;
  cta: string;
};

const BANNER_STORAGE_KEY = 'home.bannerSlides';
const LEGACY_BANNER_KEY = 'home.slides';
const WORKING_HOURS_KEY = 'home.workingHours';

const DEFAULT_BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'banner-1',
    image: '/images/image1.jpg',
    title: 'BUILDING DREAMS',
    subtitle: 'INTO REALITY',
    highlight: 'SINCE 1998',
    description: 'Transforming visions into architectural masterpieces with precision and excellence.',
    cta: 'Start Your Project',
  },
  {
    id: 'banner-2',
    image: '/images/image2.jpg',
    title: 'INNOVATIVE DESIGN',
    subtitle: 'MEETS FUNCTIONALITY',
    highlight: 'AWARD WINNING',
    description: 'Creating spaces that inspire and endure with cutting-edge construction techniques.',
    cta: 'View Our Work',
  },
  {
    id: 'banner-3',
    image: '/images/image3.jpg',
    title: 'SUSTAINABLE CONSTRUCTION',
    subtitle: 'FOR THE FUTURE',
    highlight: 'ECO FRIENDLY',
    description: 'Building environmentally conscious structures that preserve our planet for generations.',
    cta: 'Learn More',
  },
];

const createEmptyBannerSlide = (id: string): BannerSlide => ({
  id,
  image: '',
  title: '',
  subtitle: '',
  highlight: '',
  description: '',
  cta: '',
});

const createEmptyWorkingHour = (id: string): WorkingHour => ({
  id,
  day: '',
  hours: '',
  status: 'open',
});

const normalizeBannerSlide = (raw: any, index: number): BannerSlide => {
  if (typeof raw === 'string') {
    return {
      ...createEmptyBannerSlide(`banner-${index}`),
      image: raw,
    };
  }

  const idCandidate = typeof raw?.id === 'string' && raw.id.trim().length > 0 ? raw.id.trim() : `banner-${index}`;

  return {
    id: idCandidate,
    image: typeof raw?.image === 'string' ? raw.image : '',
    title: typeof raw?.title === 'string' ? raw.title : '',
    subtitle: typeof raw?.subtitle === 'string' ? raw.subtitle : '',
    highlight: typeof raw?.highlight === 'string' ? raw.highlight : '',
    description: typeof raw?.description === 'string' ? raw.description : '',
    cta: typeof raw?.cta === 'string' ? raw.cta : '',
  };
};

type WorkingHour = {
  id: string;
  day: string;
  hours: string;
  status: 'open' | 'closed';
};

const DEFAULT_WORKING_HOURS: WorkingHour[] = [
  { id: 'monday', day: 'Monday', hours: '9:00 AM - 6:00 PM', status: 'open' },
  { id: 'tuesday', day: 'Tuesday', hours: '9:00 AM - 6:00 PM', status: 'open' },
  { id: 'wednesday', day: 'Wednesday', hours: '9:00 AM - 6:00 PM', status: 'open' },
  { id: 'thursday', day: 'Thursday', hours: '9:00 AM - 6:00 PM', status: 'open' },
  { id: 'friday', day: 'Friday', hours: '9:00 AM - 6:00 PM', status: 'open' },
  { id: 'saturday', day: 'Saturday', hours: '10:00 AM - 4:00 PM', status: 'open' },
  { id: 'sunday', day: 'Sunday', hours: 'Closed', status: 'closed' },
];

const normalizeWorkingHour = (raw: any, index: number): WorkingHour => {
  const safeString = (value: unknown, fallback = ''): string => (typeof value === 'string' ? value : fallback);
  const idCandidate = safeString(raw?.id, `working-hour-${index}`);
  const day = safeString(raw?.day, `Day ${index + 1}`);
  const hours = safeString(raw?.hours, '');
  const statusCandidate = safeString(raw?.status, 'open');
  const status = statusCandidate === 'closed' ? 'closed' : 'open';
  return { id: idCandidate, day, hours, status };
};

const normalizeWorkingHours = (raw: unknown): WorkingHour[] => {
  if (!Array.isArray(raw)) return DEFAULT_WORKING_HOURS;
  return raw.map((item, index) => normalizeWorkingHour(item, index));
};

const HomeUpdate: React.FC = () => {
  // Slideshow
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([]);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
  const [slideImage, setSlideImage] = useState('');
  const [slideHighlight, setSlideHighlight] = useState('');
  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideDescription, setSlideDescription] = useState('');
  const [slideCta, setSlideCta] = useState('');

  // Facts & Figures
  const [facts, setFacts] = useState<Fact[]>([]);
  const [factLabel, setFactLabel] = useState('');
  const [factValue, setFactValue] = useState('');

  // Why Choose Us (bullets)
  const [why, setWhy] = useState<string[]>([]);
  const [whyInput, setWhyInput] = useState('');

  // Working hours
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [workingDayInput, setWorkingDayInput] = useState('');
  const [workingHoursInput, setWorkingHoursInput] = useState('');
  const [workingStatusInput, setWorkingStatusInput] = useState<'open' | 'closed'>('open');

  const persistBannerSlides = (list: BannerSlide[]) => {
    const normalized = list.map((item, index) => normalizeBannerSlide(item, index));
    setBannerSlides(normalized);
    localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(normalized));
  };

  const loadSlideIntoForm = (slide: BannerSlide | null) => {
    if (!slide) {
      setSlideImage('');
      setSlideHighlight('');
      setSlideTitle('');
      setSlideSubtitle('');
      setSlideDescription('');
      setSlideCta('');
      return;
    }

    setSlideImage(slide.image);
    setSlideHighlight(slide.highlight);
    setSlideTitle(slide.title);
    setSlideSubtitle(slide.subtitle);
    setSlideDescription(slide.description);
    setSlideCta(slide.cta);
  };

  useEffect(() => {
    const resolveBannerSlides = (): BannerSlide[] => {
      try {
        const raw = localStorage.getItem(BANNER_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed.map((item, index) => normalizeBannerSlide(item, index));
          }
        }
      } catch {
        // swallow
      }

      try {
        const legacy = localStorage.getItem(LEGACY_BANNER_KEY);
        if (legacy) {
          const parsedLegacy = JSON.parse(legacy);
          if (Array.isArray(parsedLegacy)) {
            return parsedLegacy.map((item, index) => normalizeBannerSlide(item, index));
          }
        }
      } catch {
        // swallow
      }

      return DEFAULT_BANNER_SLIDES.map((item, index) => normalizeBannerSlide(item, index));
    };

    const initialSlides = resolveBannerSlides();
    setBannerSlides(initialSlides);
    localStorage.setItem(BANNER_STORAGE_KEY, JSON.stringify(initialSlides));

    if (initialSlides.length > 0) {
      setSelectedSlideId(initialSlides[0].id);
      loadSlideIntoForm(initialSlides[0]);
    } else {
      setSelectedSlideId(null);
      loadSlideIntoForm(null);
    }

    try {
      const f = localStorage.getItem('home.facts');
      setFacts(f ? JSON.parse(f) : []);
    } catch { setFacts([]); }

    try {
      const w = localStorage.getItem('home.why');
      setWhy(w ? JSON.parse(w) : []);
    } catch { setWhy([]); }

    try {
      const stored = localStorage.getItem(WORKING_HOURS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const normalized = normalizeWorkingHours(parsed);
        setWorkingHours(normalized);
        localStorage.setItem(WORKING_HOURS_KEY, JSON.stringify(normalized));
      } else {
        setWorkingHours(DEFAULT_WORKING_HOURS);
        localStorage.setItem(WORKING_HOURS_KEY, JSON.stringify(DEFAULT_WORKING_HOURS));
      }
    } catch {
      setWorkingHours(DEFAULT_WORKING_HOURS);
      localStorage.setItem(WORKING_HOURS_KEY, JSON.stringify(DEFAULT_WORKING_HOURS));
    }
  }, []);

  const persistFacts = (list: Fact[]) => {
    setFacts(list);
    localStorage.setItem('home.facts', JSON.stringify(list));
  };

  const persistWhy = (list: string[]) => {
    setWhy(list);
    localStorage.setItem('home.why', JSON.stringify(list));
  };

  const persistWorkingHours = (list: WorkingHour[]) => {
    const normalized = list.map((item, index) => normalizeWorkingHour(item, index));
    setWorkingHours(normalized);
    localStorage.setItem(WORKING_HOURS_KEY, JSON.stringify(normalized));
  };

  // Banner slide actions
  const handleSelectSlide = (slide: BannerSlide) => {
    setSelectedSlideId(slide.id);
    loadSlideIntoForm(slide);
  };

  const handleAddSlide = () => {
    const id = `banner-${Date.now()}`;
    const nextSlide = createEmptyBannerSlide(id);
    const nextSlides = [...bannerSlides, nextSlide];
    persistBannerSlides(nextSlides);
    handleSelectSlide(nextSlide);
    alert('New banner slide created. Fill in the details and click "Save Slide" to publish.');
  };

  const handleDeleteSlide = (id: string) => {
    if (!window.confirm('Delete this banner slide?')) return;
    const nextSlides = bannerSlides.filter(slide => slide.id !== id);
    persistBannerSlides(nextSlides);
    if (selectedSlideId === id) {
      const fallback = nextSlides[0] ?? null;
      setSelectedSlideId(fallback?.id ?? null);
      loadSlideIntoForm(fallback);
    }
  };

  const handleMoveSlide = (id: string, direction: -1 | 1) => {
    const index = bannerSlides.findIndex(slide => slide.id === id);
    if (index === -1) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= bannerSlides.length) return;
    const copy = bannerSlides.slice();
    [copy[index], copy[targetIndex]] = [copy[targetIndex], copy[index]];
    persistBannerSlides(copy);
    if (selectedSlideId === id) {
      const updated = copy.find(slide => slide.id === id) ?? null;
      loadSlideIntoForm(updated);
    }
  };

  const handleClearSlides = () => {
    if (!window.confirm('Clear all banner slides?')) return;
    localStorage.removeItem(BANNER_STORAGE_KEY);
    setBannerSlides([]);
    setSelectedSlideId(null);
    loadSlideIntoForm(null);
  };

  const selectedSlide = useMemo(() => bannerSlides.find(slide => slide.id === selectedSlideId) ?? null, [bannerSlides, selectedSlideId]);

  const handleSaveSlide = () => {
    if (!selectedSlideId) return;
    const trimmedTitle = slideTitle.trim();
    const trimmedSubtitle = slideSubtitle.trim();
    const trimmedHighlight = slideHighlight.trim();
    const trimmedDescription = slideDescription.trim();
    const trimmedCta = slideCta.trim();
    const trimmedImage = slideImage.trim();

    const updatedSlides = bannerSlides.map(slide => 
      slide.id === selectedSlideId
        ? {
            ...slide,
            title: trimmedTitle,
            subtitle: trimmedSubtitle,
            highlight: trimmedHighlight,
            description: trimmedDescription,
            cta: trimmedCta,
            image: trimmedImage,
          }
        : slide
    );

    persistBannerSlides(updatedSlides);
    const saved = updatedSlides.find(slide => slide.id === selectedSlideId) ?? null;
    loadSlideIntoForm(saved);
    alert('Banner slide saved.');
  };

  const handleResetSlide = () => {
    if (selectedSlide) {
      loadSlideIntoForm(selectedSlide);
    }
  };

  // Working hours actions
  const handleWorkingHourChange = (id: string, field: 'day' | 'hours' | 'status', value: string) => {
    persistWorkingHours(
      workingHours.map(entry =>
        entry.id === id
          ? {
              ...entry,
              [field]: field === 'status' ? (value === 'closed' ? 'closed' : 'open') : value,
            }
          : entry,
      ),
    );
  };

  const handleAddWorkingHour = () => {
    const day = workingDayInput.trim();
    const hours = workingHoursInput.trim();
    if (!day || !hours) return;
    const newEntry: WorkingHour = {
      id: `working-hour-${Date.now()}`,
      day,
      hours,
      status: workingStatusInput,
    };
    persistWorkingHours([...workingHours, newEntry]);
    setWorkingDayInput('');
    setWorkingHoursInput('');
    setWorkingStatusInput('open');
  };

  const handleDeleteWorkingHour = (id: string) => {
    if (!window.confirm('Remove this working hours entry?')) return;
    persistWorkingHours(workingHours.filter(entry => entry.id !== id));
  };

  const handleResetWorkingHours = () => {
    if (!window.confirm('Reset working hours to the default schedule?')) return;
    persistWorkingHours(DEFAULT_WORKING_HOURS);
    setWorkingDayInput('');
    setWorkingHoursInput('');
    setWorkingStatusInput('open');
  };

  // Facts actions
  const addFact = () => {
    if (!factLabel.trim() || !factValue.trim()) return;
    const id = Date.now().toString();
    persistFacts([...facts, { id, label: factLabel.trim(), value: factValue.trim() }]);
    setFactLabel('');
    setFactValue('');
  };

  const deleteFact = (id: string) => {
    persistFacts(facts.filter(f => f.id !== id));
  };

  const clearFacts = () => {
    localStorage.removeItem('home.facts');
    setFacts([]);
  };

  const updateFact = (id: string, label: string, value: string) => {
    persistFacts(facts.map(f => f.id === id ? { ...f, label, value } : f));
  };

  // Why actions
  const addWhy = () => {
    const v = whyInput.trim();
    if (!v) return;
    persistWhy([...why, v]);
    setWhyInput('');
  };

  const deleteWhy = (idx: number) => {
    const next = why.filter((_, i) => i !== idx);
    persistWhy(next);
  };

  const clearWhy = () => {
    localStorage.removeItem('home.why');
    setWhy([]);
  };

  return (
    <div className="space-y-8">
      <section className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Banner Slides</h2>
            <p className="text-sm text-gray-600">Manage the content that appears on the public homepage banner. Provide an image, highlight tag, headline, and supporting description for each slide.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={handleAddSlide} className="px-4 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700">Add Slide</button>
            <button onClick={handleClearSlides} className="px-4 py-2 border rounded-md shadow-sm hover:bg-gray-50" disabled={bannerSlides.length === 0}>Clear All</button>
            <span className="text-sm text-gray-500">Total: {bannerSlides.length}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2 space-y-3">
            {bannerSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`flex items-center gap-3 border rounded-xl p-3 transition-colors cursor-pointer ${selectedSlideId === slide.id ? 'border-teal-500 bg-teal-50' : 'hover:bg-gray-50'}`}
                onClick={() => handleSelectSlide(slide)}
              >
                <img
                  src={slide.image || '/placeholder.png'}
                  alt={slide.title || `slide-${index + 1}`}
                  className="w-24 h-16 object-cover rounded border"
                  onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{slide.title || 'Untitled Slide'}</div>
                  <div className="text-xs text-gray-600 truncate">{slide.description || 'No description set'}</div>
                  <div className="text-xs text-gray-500 truncate">Highlight: {slide.highlight || '—'}</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={e => { e.stopPropagation(); handleMoveSlide(slide.id, -1); }}
                    className="px-2 py-1 border rounded"
                    disabled={index === 0}
                  >
                    ↑
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleMoveSlide(slide.id, 1); }}
                    className="px-2 py-1 border rounded"
                    disabled={index === bannerSlides.length - 1}
                  >
                    ↓
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleDeleteSlide(slide.id); }}
                    className="px-2 py-1 border rounded text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {bannerSlides.length === 0 && (
              <div className="border border-dashed rounded-xl p-6 text-center text-sm text-gray-500">
                No slides configured. Click "Add Slide" to create the first banner entry.
              </div>
            )}
          </div>

          <div className="lg:flex-1">
            {selectedSlideId && selectedSlide ? (
              <div className="space-y-4 border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Slide Details</h3>
                  <span className="text-xs text-gray-500">ID: {selectedSlideId}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">Image URL</label>
                    <input
                      className="w-full border px-3 py-2 rounded"
                      value={slideImage}
                      onChange={e => setSlideImage(e.target.value)}
                      placeholder="https://.../image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Highlight Tag</label>
                    <input
                      className="w-full border px-3 py-2 rounded"
                      value={slideHighlight}
                      onChange={e => setSlideHighlight(e.target.value)}
                      placeholder="E.g. ECO FRIENDLY"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">Title</label>
                    <input
                      className="w-full border px-3 py-2 rounded"
                      value={slideTitle}
                      onChange={e => setSlideTitle(e.target.value)}
                      placeholder="Main headline"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full border px-3 py-2 rounded"
                      rows={4}
                      value={slideDescription}
                      onChange={e => setSlideDescription(e.target.value)}
                      placeholder="Supporting copy shown beneath the titles"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-end">
                  <button onClick={handleSaveSlide} className="px-4 py-2 bg-emerald-600 text-white rounded-md shadow-sm hover:bg-emerald-700">Save Slide</button>
                  <button onClick={handleResetSlide} className="px-4 py-2 border rounded-md shadow-sm hover:bg-gray-50">Reset Changes</button>
                </div>
              </div>
            ) : (
              <div className="border border-dashed rounded-2xl p-6 text-center text-sm text-gray-500">
                Select a slide from the list to edit its content.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Working Hours</h2>
            <p className="text-sm text-gray-600">Maintain the weekly schedule that appears on the public homepage. Update days, hours, and open/closed status.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleResetWorkingHours} className="px-4 py-2 border rounded-md shadow-sm hover:bg-gray-50">Reset to Default</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-3 bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-4">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Day (e.g. Monday)"
            value={workingDayInput}
            onChange={e => setWorkingDayInput(e.target.value)}
          />
          <input
            className="border px-3 py-2 rounded"
            placeholder="Hours (e.g. 9:00 AM - 6:00 PM)"
            value={workingHoursInput}
            onChange={e => setWorkingHoursInput(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded"
            value={workingStatusInput}
            onChange={e => setWorkingStatusInput(e.target.value === 'closed' ? 'closed' : 'open')}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <button
            onClick={handleAddWorkingHour}
            className="px-4 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700"
            disabled={!workingDayInput.trim() || !workingHoursInput.trim()}
          >
            Add Entry
          </button>
        </div>

        <div className="space-y-3">
          {workingHours.map(entry => (
            <div key={entry.id} className="flex flex-col md:flex-row md:items-center gap-3 border border-gray-200 rounded-2xl p-4">
              <div className="w-full md:w-48">
                <label className="block text-xs font-medium text-gray-600 mb-1">Day</label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={entry.day}
                  onChange={e => handleWorkingHourChange(entry.id, 'day', e.target.value)}
                />
              </div>
              <div className="w-full md:flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Hours</label>
                <input
                  className="w-full border px-3 py-2 rounded"
                  value={entry.hours}
                  onChange={e => handleWorkingHourChange(entry.id, 'hours', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select
                    className="border px-3 py-2 rounded"
                    value={entry.status}
                    onChange={e => handleWorkingHourChange(entry.id, 'status', e.target.value)}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <button onClick={() => handleDeleteWorkingHour(entry.id)} className="mt-5 px-3 py-2 border rounded text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {workingHours.length === 0 && (
            <div className="border border-dashed rounded-2xl p-6 text-center text-sm text-gray-500">
              No working hours configured. Add a new entry above.
            </div>
          )}
        </div>
      </section>

      <section className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Facts & Figures</h2>
            <p className="text-sm text-gray-600">Control the statistics that appear on the homepage highlights panel.</p>
          </div>
          <button onClick={clearFacts} className="px-4 py-2 border rounded-md shadow-sm hover:bg-gray-50">Clear All</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="border px-3 py-2 rounded" placeholder="Label (e.g. Projects)" value={factLabel} onChange={e => setFactLabel(e.target.value)} />
          <input className="border px-3 py-2 rounded" placeholder="Number (e.g. 120)" value={factValue} onChange={e => setFactValue(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={addFact} className="px-3 py-1 bg-teal-600 text-white rounded">Add</button>
          </div>
        </div>

        <div className="space-y-3">
          {facts.map(f => (
            <div key={f.id} className="flex flex-col md:flex-row md:items-center gap-3 border border-gray-200 rounded-2xl p-4">
              <input className="w-full md:flex-1 border px-3 py-2 rounded" value={f.label} onChange={e => updateFact(f.id, e.target.value, f.value)} placeholder="Label" />
              <input className="w-full md:w-40 border px-3 py-2 rounded" value={f.value} onChange={e => updateFact(f.id, f.label, e.target.value)} placeholder="Value" />
              <button onClick={() => deleteFact(f.id)} className="px-3 py-2 border rounded text-red-600 hover:bg-red-50">Delete</button>
            </div>
          ))}
          {facts.length === 0 && <div className="text-sm text-gray-500">No facts defined.</div>}
        </div>
      </section>

      <section className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Why Choose Us</h2>
            <p className="text-sm text-gray-600">Edit the bullet points that communicate your core advantages.</p>
          </div>
          <button onClick={clearWhy} className="px-4 py-2 border rounded-md shadow-sm hover:bg-gray-50">Clear All</button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input className="flex-1 border px-3 py-2 rounded" placeholder="Short bullet" value={whyInput} onChange={e => setWhyInput(e.target.value)} />
          <button onClick={addWhy} className="px-4 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700">Add</button>
        </div>

        <ol className="list-decimal list-inside space-y-3">
          {why.map((w, idx) => (
            <li key={idx} className="flex items-start justify-between gap-3 border border-gray-200 rounded-2xl p-4">
              <div className="flex-1 text-sm text-gray-800">{w}</div>
              <button onClick={() => deleteWhy(idx)} className="px-3 py-2 border rounded text-red-600 hover:bg-red-50">Delete</button>
            </li>
          ))}
          {why.length === 0 && <div className="text-sm text-gray-500">No items defined.</div>}
        </ol>
      </section>
    </div>
  );
};

export default HomeUpdate;
