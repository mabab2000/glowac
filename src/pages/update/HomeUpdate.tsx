import React, { useEffect, useMemo, useState, useRef } from 'react';

type Fact = { id: string; label: string; value: string };

type BannerSlide = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  highlight: string;
  description: string;
  apiId?: number | null;
  cta: string;
};

const HomeUpdate: React.FC = () => {
  // Modal state for adding new banner
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBanner, setNewBanner] = useState({
    highlight: '',
    title: '',
    description: '',
    imageFile: null as File | null,
  });
  const [addModalError, setAddModalError] = useState<string | null>(null);
  const addImageInputRef = useRef<HTMLInputElement>(null);


// Removed localStorage keys for banners
const WORKING_HOURS_KEY = 'home.workingHours';

// Removed default hardcoded banner slides

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
  // Only used for mapping API banners
  const idCandidate = typeof raw?.id === 'string' && raw.id.trim().length > 0 ? raw.id.trim() : `banner-${index}`;
  return {
    id: idCandidate,
    image: typeof raw?.image === 'string' ? raw.image : '',
    title: typeof raw?.title === 'string' ? raw.title : '',
    subtitle: typeof raw?.subtitle === 'string' ? raw.subtitle : '',
    highlight: typeof raw?.highlight === 'string' ? raw.highlight : '',
    description: typeof raw?.description === 'string' ? raw.description : '',
    cta: typeof raw?.cta === 'string' ? raw.cta : '',
    apiId: raw?.apiId,
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

  // Banner slides (API only)
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([]);
  type ApiBanner = {
    id: number;
    highlight_tag: string;
    title: string;
    description: string;
    image_mime: string;
    image_preview_url: string;
  };
  const [apiBanners, setApiBanners] = useState<ApiBanner[] | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [slideImageFile, setSlideImageFile] = useState<File | null>(null);
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

  // Only update state, no localStorage
  const persistBannerSlides = (list: BannerSlide[]) => {
    setBannerSlides(list);
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
    // On mount, load banners from API
    const load = async () => {
      setApiLoading(true);
      setApiError(null);
      try {
        const res = await fetch('https://glowac-api.onrender.com/banners');
        const data = await res.json();
        if (Array.isArray(data)) {
          // Map API banners to BannerSlide
          const mapped = data.map((b: any, i: number) => normalizeBannerSlide({
            id: `api-banner-${b.id}`,
            image: b.image_preview_url,
            title: b.title,
            subtitle: '',
            highlight: b.highlight_tag,
            description: b.description,
            cta: '',
            apiId: b.id,
          }, i));
          setBannerSlides(mapped);
          if (mapped.length > 0) {
            setSelectedSlideId(mapped[0].id);
            loadSlideIntoForm(mapped[0]);
          } else {
            setSelectedSlideId(null);
            loadSlideIntoForm(null);
          }
        }
      } catch {
        setApiError('Failed to fetch banners from API');
      } finally {
        setApiLoading(false);
      }
    };
    load();
    // Facts: try load from API `/facts`, fallback to localStorage
    (async () => {
      try {
        const res = await fetch('https://glowac-api.onrender.com/facts', { headers: { Accept: 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mapped: Fact[] = data.map((r: any) => ({ id: String(r.id ?? Date.now()), label: String(r.label ?? ''), value: String(r.number ?? '') }));
            setFacts(mapped);
            try { localStorage.setItem('home.facts', JSON.stringify(mapped)); } catch {}
            return;
          }
        }
      } catch (err) {
        console.debug('Failed to load facts from API, falling back to localStorage', err);
      }
      try {
        const f = localStorage.getItem('home.facts');
        setFacts(f ? JSON.parse(f) : []);
      } catch { setFacts([]); }
    })();
    try {
      const w = localStorage.getItem('home.why');
      setWhy(w ? JSON.parse(w) : []);
    } catch { setWhy([]); }
    // Load working hours from API `/tus`. If API fails, fall back to localStorage/defaults.
    (async () => {
      try {
        const res = await fetch('https://glowac-api.onrender.com/tus');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mapped: WorkingHour[] = data.map((r: any, i: number) => ({
            id: String(r.id ?? `working-hour-${i}`),
            day: typeof r.day === 'string' ? r.day : `Day ${i + 1}`,
            hours: typeof r.hours === 'string' ? r.hours : '',
            status: ((typeof r.status === 'string' && r.status.toLowerCase() === 'closed') ? 'closed' : 'open') as 'open' | 'closed',
          }));
            setWorkingHours(mapped.length ? mapped : DEFAULT_WORKING_HOURS);
            // cache for offline fallback
            try { localStorage.setItem(WORKING_HOURS_KEY, JSON.stringify(mapped)); } catch {}
          } else {
            // fallback to localStorage/defaults
            const stored = localStorage.getItem(WORKING_HOURS_KEY);
            if (stored) setWorkingHours(normalizeWorkingHours(JSON.parse(stored)));
            else { setWorkingHours(DEFAULT_WORKING_HOURS); localStorage.setItem(WORKING_HOURS_KEY, JSON.stringify(DEFAULT_WORKING_HOURS)); }
          }
        } else {
          throw new Error('API returned non-ok');
        }
      } catch (err) {
        // fallback to localStorage/defaults
        try {
          const stored = localStorage.getItem(WORKING_HOURS_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            const normalized = normalizeWorkingHours(parsed);
            setWorkingHours(normalized);
          } else {
            setWorkingHours(DEFAULT_WORKING_HOURS);
            localStorage.setItem(WORKING_HOURS_KEY, JSON.stringify(DEFAULT_WORKING_HOURS));
          }
        } catch {
          setWorkingHours(DEFAULT_WORKING_HOURS);
          try { localStorage.setItem(WORKING_HOURS_KEY, JSON.stringify(DEFAULT_WORKING_HOURS)); } catch {}
        }
      }
    })();
  }, []);

  // Fetch API banners helper
  const fetchApiBanners = async () => {
    setApiLoading(true);
    setApiError(null);
    try {
      const res = await fetch('https://glowac-api.onrender.com/banners');
      const data = await res.json();
      if (Array.isArray(data)) setApiBanners(data as ApiBanner[]);
    } catch (err) {
      setApiError('Failed to fetch banners from API');
    } finally {
      setApiLoading(false);
    }
  };

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
    try { localStorage.setItem(WORKING_HOURS_KEY, JSON.stringify(normalized)); } catch {}
  };

  // Banner slide actions
  const handleSelectSlide = (slide: BannerSlide) => {
    setSelectedSlideId(slide.id);
    loadSlideIntoForm(slide);
  };

  

  const handleDeleteSlide = (id: string) => {
    if (!window.confirm('Delete this banner slide?')) return;
    const slide = bannerSlides.find(s => s.id === id);
    if (slide && slide.apiId) {
      // If slide is from API, delete from API
      handleDeleteFromApi();
    } else {
      // Only local (unsaved) slide
      const nextSlides = bannerSlides.filter(slide => slide.id !== id);
      persistBannerSlides(nextSlides);
      if (selectedSlideId === id) {
        const fallback = nextSlides[0] ?? null;
        setSelectedSlideId(fallback?.id ?? null);
        loadSlideIntoForm(fallback);
      }
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
    setBannerSlides([]);
    setSelectedSlideId(null);
    loadSlideIntoForm(null);
  };

  const selectedSlide = useMemo(() => bannerSlides.find(slide => slide.id === selectedSlideId) ?? null, [bannerSlides, selectedSlideId]);

  // Save slide locally (for editing before publishing)
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
    alert('Banner slide saved locally. Click "Publish to API" to create/update.');
  };

  // Publish selected slide to API (POST or PUT). Uses FormData and optional file upload.
  const handlePublishToApi = async () => {
    if (!selectedSlideId) return alert('Select a slide first');
    const slide = bannerSlides.find(s => s.id === selectedSlideId);
    if (!slide) return;
    setApiError(null);
    setApiLoading(true);
    try {
      const fd = new FormData();
      // Use current form state values when publishing so edits are actually sent
      const payloadHighlight = (slideHighlight ?? '').trim() || slide.highlight || '';
      const payloadTitle = (slideTitle ?? '').trim() || slide.title || '';
      const payloadDescription = (slideDescription ?? '').trim() || slide.description || '';
      fd.append('highlight_tag', payloadHighlight);
      fd.append('title', payloadTitle);
      fd.append('description', payloadDescription);
      if (slide.apiId) {
        // Update: allow image to be optional, but prefer image file uploaded via the form
        if (slideImageFile) {
          fd.append('image', slideImageFile, slideImageFile.name);
        } else if (slideImage && slideImage.startsWith('http')) {
          // If the form's Image URL field was left with a URL, try to fetch and forward it
          try {
            const response = await fetch(slideImage);
            const blob = await response.blob();
            const urlParts = slideImage.split('/');
            const filename = urlParts[urlParts.length - 1] || 'image.jpg';
            fd.append('image', blob, filename);
          } catch (err) {
            // ignore and continue without image
            console.debug('Could not fetch provided image URL to forward:', err);
          }
        }
        const res = await fetch(`https://glowac-api.onrender.com/banners/${slide.apiId}`, {
          method: 'PUT',
          body: fd,
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error('Failed to update banner');
        const updated = await res.json();
        // update the local slide with returned values from server
        persistBannerSlides(bannerSlides.map(s => s.id === slide.id ? {
          ...s,
          apiId: updated.id ?? s.apiId,
          image: updated.image_preview_url ?? s.image,
          title: typeof updated.title === 'string' ? updated.title : payloadTitle,
          highlight: typeof updated.highlight_tag === 'string' ? updated.highlight_tag : payloadHighlight,
          description: typeof updated.description === 'string' ? updated.description : payloadDescription,
        } : s));
        alert('Banner updated on API');
      } else {
        // Create: require image file for new slide
        // For create, prefer an uploaded file; if the user provided an Image URL we could try to fetch it,
        // but server may require a file; keep the existing behavior requiring a file upload.
        if (!slideImageFile) {
          alert('Please select an image file to create a new banner.');
          setApiLoading(false);
          return;
        }
        fd.append('image', slideImageFile, slideImageFile.name);
        const res = await fetch('https://glowac-api.onrender.com/banners', { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('Failed to create banner');
        const created = await res.json();
        persistBannerSlides(bannerSlides.map(s => s.id === slide.id ? {
          ...s,
          apiId: created.id,
          image: created.image_preview_url ?? s.image,
          title: typeof created.title === 'string' ? created.title : payloadTitle,
          highlight: typeof created.highlight_tag === 'string' ? created.highlight_tag : payloadHighlight,
          description: typeof created.description === 'string' ? created.description : payloadDescription,
        } : s));
        alert('Banner created on API');
      }
      await fetchApiBanners();
    } catch (err) {
      console.error(err);
      setApiError('Failed to publish to API');
    } finally {
      setApiLoading(false);
    }
  };

  const handleDeleteFromApi = async () => {
    if (!selectedSlideId) return alert('Select a slide first');
    const slide = bannerSlides.find(s => s.id === selectedSlideId);
    if (!slide || !slide.apiId) return alert('This slide is not published to API');
    if (!window.confirm('Delete this banner from API?')) return;
    setApiLoading(true);
    try {
      const res = await fetch(`https://glowac-api.onrender.com/banners/${slide.apiId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      // clear apiId
      persistBannerSlides(bannerSlides.map(s => s.id === slide.id ? { ...s, apiId: undefined } : s));
      await fetchApiBanners();
      alert('Deleted from API');
    } catch (err) {
      console.error(err);
      setApiError('Failed to delete from API');
    } finally {
      setApiLoading(false);
    }
  };

  // Reload banners from API
  const handleLoadFromApi = async () => {
    setApiLoading(true);
    setApiError(null);
    try {
      const res = await fetch('https://glowac-api.onrender.com/banners');
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map((b: any, i: number) => normalizeBannerSlide({
          id: `api-banner-${b.id}`,
          image: b.image_preview_url,
          title: b.title,
          subtitle: '',
          highlight: b.highlight_tag,
          description: b.description,
          cta: '',
          apiId: b.id,
        }, i));
        persistBannerSlides(mapped);
        if (mapped.length > 0) {
          setSelectedSlideId(mapped[0].id);
          loadSlideIntoForm(mapped[0]);
        }
      }
    } catch {
      setApiError('Failed to fetch banners from API');
    } finally {
      setApiLoading(false);
    }
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
    // POST to API `/tus` using x-www-form-urlencoded
    (async () => {
      setApiLoading(true);
      setApiError(null);
      try {
        const body = new URLSearchParams();
        body.append('day', day);
        body.append('hours', hours);
        body.append('status', workingStatusInput === 'closed' ? 'Closed' : 'Open');
        const res = await fetch('https://glowac-api.onrender.com/tus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
          body: body.toString(),
        });
        if (!res.ok) throw new Error('Failed to add working hours');
        const created = await res.json();
        // refresh list from API
        const ref = await fetch('https://glowac-api.onrender.com/tus');
        if (ref.ok) {
          const data = await ref.json();
          if (Array.isArray(data)) {
            const mapped: WorkingHour[] = data.map((r: any, i: number) => ({
              id: String(r.id ?? `working-hour-${i}`),
              day: typeof r.day === 'string' ? r.day : `Day ${i + 1}`,
              hours: typeof r.hours === 'string' ? r.hours : '',
              status: ((typeof r.status === 'string' && r.status.toLowerCase() === 'closed') ? 'closed' : 'open') as 'open' | 'closed',
            }));
            persistWorkingHours(mapped);
          }
        }
        setWorkingDayInput('');
        setWorkingHoursInput('');
        setWorkingStatusInput('open');
      } catch (err) {
        console.error('Failed to add working hour', err);
        setApiError('Failed to add working hour');
      } finally {
        setApiLoading(false);
      }
    })();
  };

  const handleDeleteWorkingHour = (id: string) => {
    if (!window.confirm('Remove this working hours entry?')) return;
    (async () => {
      setApiLoading(true);
      setApiError(null);
      try {
        // try deleting via API; if API does not support it, fallback to local removal
        const res = await fetch(`https://glowac-api.onrender.com/tus/${id}`, { method: 'DELETE' });
        if (res.ok) {
          // refresh list
          const ref = await fetch('https://glowac-api.onrender.com/tus');
          if (ref.ok) {
            const data = await ref.json();
            if (Array.isArray(data)) {
              const mapped: WorkingHour[] = data.map((r: any, i: number) => ({
                id: String(r.id ?? `working-hour-${i}`),
                day: typeof r.day === 'string' ? r.day : `Day ${i + 1}`,
                hours: typeof r.hours === 'string' ? r.hours : '',
                status: (typeof r.status === 'string' && r.status.toLowerCase() === 'closed') ? 'closed' : 'open',
              }));
              persistWorkingHours(mapped);
            }
          }
        } else {
          // fallback local removal
          persistWorkingHours(workingHours.filter(entry => entry.id !== id));
        }
      } catch (err) {
        console.error('Failed to delete working hour via API, falling back', err);
        persistWorkingHours(workingHours.filter(entry => entry.id !== id));
      } finally {
        setApiLoading(false);
      }
    })();
  };

  // Update an existing working hour (PUT to /tus/{id}) if it's from the API
  const handleUpdateWorkingHour = async (id: string) => {
    const entry = workingHours.find(e => e.id === id);
    if (!entry) return;
    // If id is not numeric (local-only), just persist locally
    if (!/^\d+$/.test(id)) {
      persistWorkingHours(workingHours.map(e => e.id === id ? entry : e));
      return;
    }

    setApiLoading(true);
    setApiError(null);
    try {
      const body = new URLSearchParams();
      body.append('day', entry.day);
      body.append('hours', entry.hours);
      // send status as 'closed' or 'Open' to match server examples
      body.append('status', entry.status === 'closed' ? 'closed' : 'Open');

      const res = await fetch(`https://glowac-api.onrender.com/tus/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body: body.toString(),
      });
      if (!res.ok) throw new Error('Failed to update working hour');
      const updated = await res.json();
      // update local state with server response
      const mapped = workingHours.map(e => e.id === id ? {
        id: String(updated.id ?? id),
        day: typeof updated.day === 'string' ? updated.day : e.day,
        hours: typeof updated.hours === 'string' ? updated.hours : e.hours,
        status: ((typeof updated.status === 'string' && updated.status.toLowerCase() === 'closed') ? 'closed' : 'open') as 'open' | 'closed',
      } : e);
      persistWorkingHours(mapped);
    } catch (err) {
      console.error('Failed to update working hour', err);
      setApiError('Failed to update working hour');
    } finally {
      setApiLoading(false);
    }
  };

 

  // Facts actions
  const addFact = () => {
    const label = factLabel.trim();
    const numberRaw = factValue.trim();
    if (!label || !numberRaw) return;
    // POST to API /facts using x-www-form-urlencoded
    (async () => {
      setApiLoading(true);
      setApiError(null);
      try {
        const body = new URLSearchParams();
        body.append('label', label);
        // try convert to number if possible
        const num = Number(numberRaw);
        body.append('number', Number.isNaN(num) ? numberRaw : String(num));
        body.append('status', 'Visible');
        const res = await fetch('https://glowac-api.onrender.com/facts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
          body: body.toString(),
        });
        if (!res.ok) throw new Error('Failed to create fact');
        // refresh from API
        const ref = await fetch('https://glowac-api.onrender.com/facts', { headers: { Accept: 'application/json' } });
        if (ref.ok) {
          const data = await ref.json();
          if (Array.isArray(data)) {
            const mapped: Fact[] = data.map((r: any) => ({ id: String(r.id ?? Date.now()), label: String(r.label ?? ''), value: String(r.number ?? '') }));
            setFacts(mapped);
            try { localStorage.setItem('home.facts', JSON.stringify(mapped)); } catch {}
          }
        }
        setFactLabel('');
        setFactValue('');
      } catch (err) {
        console.error('Failed to add fact', err);
        setApiError('Failed to add fact');
        // fallback to local add
        const id = Date.now().toString();
        persistFacts([...facts, { id, label, value: numberRaw }]);
        setFactLabel('');
        setFactValue('');
      } finally {
        setApiLoading(false);
      }
    })();
  };

  const deleteFact = (id: string) => {
    // attempt API delete, fall back to local removal
    (async () => {
      setApiLoading(true);
      setApiError(null);
      try {
        // if id looks numeric, call API
        if (/^\d+$/.test(id)) {
          const res = await fetch(`https://glowac-api.onrender.com/facts/${id}`, { method: 'DELETE' });
          if (res.ok) {
            const ref = await fetch('https://glowac-api.onrender.com/facts', { headers: { Accept: 'application/json' } });
            if (ref.ok) {
              const data = await ref.json();
              if (Array.isArray(data)) {
                const mapped: Fact[] = data.map((r: any) => ({ id: String(r.id ?? Date.now()), label: String(r.label ?? ''), value: String(r.number ?? '') }));
                setFacts(mapped);
                try { localStorage.setItem('home.facts', JSON.stringify(mapped)); } catch {}
                return;
              }
            }
          } else {
            // if API delete failed, throw and fallback
            throw new Error('API delete failed');
          }
        }
      } catch (err) {
        console.debug('Delete fact API failed, falling back to local', err);
        persistFacts(facts.filter(f => f.id !== id));
      } finally {
        setApiLoading(false);
      }
    })();
  };

  const clearFacts = () => {
    localStorage.removeItem('home.facts');
    setFacts([]);
  };

  const updateFact = (id: string, label: string, value: string) => {
    // attempt PUT to API if id numeric, else persist locally
    (async () => {
      setApiLoading(true);
      setApiError(null);
      try {
        if (/^\d+$/.test(id)) {
          const body = new URLSearchParams();
          body.append('label', label);
          const num = Number(value);
          body.append('number', Number.isNaN(num) ? value : String(num));
          body.append('status', 'Visible');
          const res = await fetch(`https://glowac-api.onrender.com/facts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
            body: body.toString(),
          });
          if (!res.ok) throw new Error('Failed to update fact');
          const ref = await fetch('https://glowac-api.onrender.com/facts', { headers: { Accept: 'application/json' } });
          if (ref.ok) {
            const data = await ref.json();
            if (Array.isArray(data)) {
              const mapped: Fact[] = data.map((r: any) => ({ id: String(r.id ?? Date.now()), label: String(r.label ?? ''), value: String(r.number ?? '') }));
              setFacts(mapped);
              try { localStorage.setItem('home.facts', JSON.stringify(mapped)); } catch {}
              return;
            }
          }
        }
      } catch (err) {
        console.error('Failed to update fact via API, falling back', err);
        persistFacts(facts.map(f => f.id === id ? { ...f, label, value } : f));
      } finally {
        setApiLoading(false);
      }
    })();
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

  // Added useEffect to load banner images only once when the page reloads
  // NOTE: banner slides are loaded from the API in the main mount effect above.
  // Removed accidental extra loader that fetched `/api/banner-images` which could
  // overwrite the real API-loaded slides during the session.

  return (
    <div className="space-y-8">
      <section className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Banner Slides</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">Add New Banner</button>
     
            <span className="text-sm text-gray-500">Total: {bannerSlides.length}</span>
          </div>
              {/* Add New Banner Modal */}
              {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                    <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowAddModal(false)}>&times;</button>
                    <h2 className="text-xl font-semibold mb-4">Add New Banner</h2>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Highlight Tag</label>
                        <input className="w-full border px-3 py-2 rounded" value={newBanner.highlight} onChange={e => setNewBanner(b => ({ ...b, highlight: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Title</label>
                        <input className="w-full border px-3 py-2 rounded" value={newBanner.title} onChange={e => setNewBanner(b => ({ ...b, title: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Description</label>
                        <textarea className="w-full border px-3 py-2 rounded" rows={3} value={newBanner.description} onChange={e => setNewBanner(b => ({ ...b, description: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Image</label>
                        <input type="file" accept="image/*" ref={addImageInputRef} onChange={e => setNewBanner(b => ({ ...b, imageFile: e.target.files && e.target.files[0] ? e.target.files[0] : null }))} />
                      </div>
                      {addModalError && <div className="text-red-600 text-sm">{addModalError}</div>}
                      <button
                        className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700"
                        onClick={async () => {
                          setAddModalError(null);
                          if (!newBanner.highlight.trim() || !newBanner.title.trim() || !newBanner.description.trim() || !newBanner.imageFile) {
                            setAddModalError('All fields and image are required.');
                            return;
                          }
                          const fd = new FormData();
                          fd.append('highlight_tag', newBanner.highlight);
                          fd.append('title', newBanner.title);
                          fd.append('description', newBanner.description);
                          fd.append('image', newBanner.imageFile, newBanner.imageFile.name);
                          try {
                            const res = await fetch('https://glowac-api.onrender.com/banners', { method: 'POST', body: fd });
                            if (!res.ok) {
                              setAddModalError('Failed to create banner.');
                              return;
                            }
                            setShowAddModal(false);
                            setNewBanner({ highlight: '', title: '', description: '', imageFile: null });
                            if (addImageInputRef.current) addImageInputRef.current.value = '';
                            await handleLoadFromApi();
                          } catch (err) {
                            setAddModalError('Network or server error.');
                          }
                        }}
                      >Create Banner</button>
                    </div>
                  </div>
                </div>
              )}
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
                    <div className="mt-2 text-sm text-gray-500">Or upload an image when publishing to the API</div>
                    <input type="file" accept="image/*" onChange={e => setSlideImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} className="mt-2" />
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
                  <button onClick={handlePublishToApi} className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700" disabled={apiLoading}>{apiLoading ? 'Publishing...' : 'Publish to API'}</button>
                  <button onClick={handleDeleteFromApi} className="px-4 py-2 border rounded-md shadow-sm text-red-600 hover:bg-red-50" disabled={apiLoading}>Delete from API</button>
                  <button onClick={handleLoadFromApi} className="px-4 py-2 border rounded-md shadow-sm" disabled={apiLoading}>{apiLoading ? 'Loading...' : 'Load From API'}</button>
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
          </div>
         
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-4">
          <input
            className="border px-3 py-2 rounded md:flex-1"
            placeholder="Day (e.g. Monday)"
            value={workingDayInput}
            onChange={e => setWorkingDayInput(e.target.value)}
          />
          <input
            className="border px-3 py-2 rounded md:flex-1"
            placeholder="Hours (e.g. 9:00 AM - 6:00 PM)"
            value={workingHoursInput}
            onChange={e => setWorkingHoursInput(e.target.value)}
          />
          <select
            className="border px-3 py-2 rounded md:w-40"
            value={workingStatusInput}
            onChange={e => setWorkingStatusInput(e.target.value === 'closed' ? 'closed' : 'open')}
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
          <button
            onClick={handleAddWorkingHour}
            className="px-4 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 md:w-auto"
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
                <div className="flex gap-2">
                  <button onClick={() => handleUpdateWorkingHour(entry.id)} disabled={apiLoading} className="mt-5 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    {apiLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => handleDeleteWorkingHour(entry.id)} className="mt-5 px-3 py-2 border rounded text-red-600 hover:bg-red-50">
                    Delete
                  </button>
                </div>
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
}
export default HomeUpdate;
