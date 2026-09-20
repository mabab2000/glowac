import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  DEFAULT_HOMEPAGE_COPY,
  HomeCertification,
  HomepageCopy,
  loadHomepageCopy,
  saveHomepageCopy,
} from '../../content/homepageContent';

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

  const [homepageCopy, setHomepageCopy] = useState<HomepageCopy>(() => loadHomepageCopy());

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

  const updateHomepageCopy = (updater: (current: HomepageCopy) => HomepageCopy) => {
    setHomepageCopy(current => {
      const next = updater(current);
      saveHomepageCopy(next);
      return next;
    });
  };

  const updateCommitmentParagraph = (index: number, value: string) => {
    updateHomepageCopy(current => ({
      ...current,
      commitmentParagraphs: current.commitmentParagraphs.map((paragraph, paragraphIndex) => (
        paragraphIndex === index ? value : paragraph
      )),
    }));
  };

  const removeCommitmentParagraph = (index: number) => {
    updateHomepageCopy(current => ({
      ...current,
      commitmentParagraphs: current.commitmentParagraphs.filter((_, paragraphIndex) => paragraphIndex !== index),
    }));
  };

  const updateCertification = (id: string, field: keyof Omit<HomeCertification, 'id'>, value: string) => {
    updateHomepageCopy(current => ({
      ...current,
      certifications: current.certifications.map(certification => (
        certification.id === id ? { ...certification, [field]: value } : certification
      )),
    }));
  };

  const restoreHomepageCopy = () => {
    const restored: HomepageCopy = {
      ...DEFAULT_HOMEPAGE_COPY,
      commitmentParagraphs: [...DEFAULT_HOMEPAGE_COPY.commitmentParagraphs],
      certifications: DEFAULT_HOMEPAGE_COPY.certifications.map(certification => ({ ...certification })),
    };
    setHomepageCopy(restored);
    saveHomepageCopy(restored);
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

  const clearFacts = async () => {
    if (facts.length === 0 || !window.confirm('Remove every homepage highlight card?')) return;

    setApiLoading(true);
    const apiFacts = facts.filter(fact => /^\d+$/.test(fact.id));
    try {
      await Promise.all(apiFacts.map(async fact => {
        const response = await fetch(`https://glowac-api.onrender.com/facts/${fact.id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Failed to delete fact ${fact.id}`);
      }));
      localStorage.removeItem('home.facts');
      setFacts([]);
    } catch (error) {
      console.error('Failed to clear all facts', error);
      alert('Some highlight cards could not be removed. Please try again.');
    } finally {
      setApiLoading(false);
    }
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

  // Added useEffect to load banner images only once when the page reloads
  // NOTE: banner slides are loaded from the API in the main mount effect above.
  // Removed accidental extra loader that fetched `/api/banner-images` which could
  // overwrite the real API-loaded slides during the session.

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 p-6 text-white shadow-xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Website content</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Homepage</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-100 sm:text-base">
              View and manage every homepage section from one page. Your banner slides, opening hours and facts are all shown below.
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/20"
          >
            View live homepage
          </a>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { href: '#homepage-banners', label: 'Banner slides', value: bannerSlides.length, note: 'Hero images and messages' },
          { href: '#homepage-copy', label: 'Homepage copy', value: homepageCopy.commitmentParagraphs.length, note: 'Relationship and commitment' },
          { href: '#homepage-hours', label: 'Working hours', value: workingHours.length, note: 'Opening schedule entries' },
          { href: '#homepage-facts', label: 'Facts & figures', value: facts.length, note: 'Homepage statistics' },
        ].map(summary => (
          <a
            key={summary.href}
            href={summary.href}
            className="group rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-950">{summary.label}</p>
                <p className="mt-1 text-xs text-gray-500">{summary.note}</p>
              </div>
              <span className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-emerald-100 px-3 text-lg font-bold text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white">
                {summary.value}
              </span>
            </div>
          </a>
        ))}
      </div>

      <section id="homepage-banners" className="scroll-mt-24 space-y-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Banner Slides</h2>
              <p className="mt-1 text-sm text-gray-500">Preview each homepage hero banner and select a card to edit it.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">Add New Banner</button>
              <span className="text-sm text-gray-500">Total: {bannerSlides.length}</span>
            </div>
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

          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="grid gap-4 sm:grid-cols-2 lg:w-1/2 lg:grid-cols-1 xl:grid-cols-2">
              {bannerSlides.map((slide, index) => (
                <article
                  key={slide.id}
                  className={`cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${selectedSlideId === slide.id ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-gray-200'}`}
                  onClick={() => handleSelectSlide(slide)}
                >
                  <div className="relative h-36 overflow-hidden bg-gray-100">
                    <img
                      src={slide.image || '/placeholder.png'}
                      alt={slide.title || `slide-${index + 1}`}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                      {slide.highlight || `Banner ${index + 1}`}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="truncate text-sm font-bold text-gray-900">{slide.title || 'Untitled banner'}</h3>
                    <p className="mt-1 min-h-10 text-xs leading-5 text-gray-500">{slide.description || 'No description set.'}</p>
                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                      <span className="text-xs font-medium text-emerald-700">{selectedSlideId === slide.id ? 'Selected' : 'Select to edit'}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Move banner up"
                          onClick={e => { e.stopPropagation(); handleMoveSlide(slide.id, -1); }}
                          className="rounded-lg border px-2 py-1 text-gray-600 disabled:opacity-30"
                          disabled={index === 0}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          aria-label="Move banner down"
                          onClick={e => { e.stopPropagation(); handleMoveSlide(slide.id, 1); }}
                          className="rounded-lg border px-2 py-1 text-gray-600 disabled:opacity-30"
                          disabled={index === bannerSlides.length - 1}
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); handleDeleteSlide(slide.id); }}
                          className="rounded-lg border border-red-100 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
              {bannerSlides.length === 0 && (
                <div className="border border-dashed rounded-xl p-6 text-center text-sm text-gray-500">
                  No slides configured. Click "Add Slide" to create the first banner entry.
                </div>
              )}
            </div>

            <div className="lg:flex-1">
              {selectedSlideId && selectedSlide ? (
                <div className="space-y-4 rounded-2xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Slide Details</h3>
                    <span className="text-xs text-gray-500">ID: {selectedSlideId}</span>
                  </div>

                  <div className="relative h-52 overflow-hidden rounded-2xl bg-emerald-950">
                    <img
                      src={slideImage || selectedSlide.image || '/placeholder.png'}
                      alt="Selected banner preview"
                      className="h-full w-full object-cover opacity-70"
                      onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      {slideHighlight && <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200">{slideHighlight}</p>}
                      <p className="mt-1 text-xl font-bold">{slideTitle || 'Banner title preview'}</p>
                      <p className="mt-1 max-w-xl text-xs text-emerald-50/80">{slideDescription || 'Banner description preview'}</p>
                    </div>
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

      <section id="homepage-copy" className="relative scroll-mt-24 overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-100/50" />
        <div className="absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-blue-100/40" />
        <div className="relative">
          <div className="mb-8 flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">Live-style editor</p>
              <h2 className="mt-1 text-2xl font-bold text-gray-900">Homepage information</h2>
              <p className="mt-1 text-sm text-gray-500">This uses the same visual structure as the public homepage. Changes are saved automatically.</p>
            </div>
            <button type="button" onClick={restoreHomepageCopy} className="w-fit rounded-xl border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
              Restore default content
            </button>
          </div>

          <div className="mb-12 text-center">
            <div className="mb-4 flex flex-col justify-center gap-2 sm:flex-row">
              <input
                aria-label="Relationship heading first part"
                className="min-w-0 border-0 border-b border-dashed border-gray-300 bg-transparent text-center text-3xl font-bold text-gray-600 outline-none focus:border-emerald-500 sm:w-72 sm:text-right"
                value={homepageCopy.relationshipLead}
                onChange={event => updateHomepageCopy(current => ({ ...current, relationshipLead: event.target.value }))}
                placeholder="Building Strong"
              />
              <input
                aria-label="Relationship heading highlighted part"
                className="min-w-0 border-0 border-b border-dashed border-emerald-300 bg-transparent text-center text-3xl font-bold text-emerald-600 outline-none focus:border-emerald-600 sm:w-64 sm:text-left"
                value={homepageCopy.relationshipAccent}
                onChange={event => updateHomepageCopy(current => ({ ...current, relationshipAccent: event.target.value }))}
                placeholder="Relationships"
              />
            </div>
            <textarea
              aria-label="Relationship description"
              className="mx-auto block min-h-28 w-full max-w-4xl resize-y rounded-xl border border-dashed border-gray-300 bg-white/70 px-4 py-3 text-center text-lg leading-relaxed text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={homepageCopy.relationshipDescription}
              onChange={event => updateHomepageCopy(current => ({ ...current, relationshipDescription: event.target.value }))}
              placeholder="Company introduction"
            />
            <button
              type="button"
              onClick={() => updateHomepageCopy(current => ({ ...current, relationshipLead: '', relationshipAccent: '', relationshipDescription: '' }))}
              className="mt-3 text-xs font-medium text-red-600 hover:underline"
            >
              Clear relationship block
            </button>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <input
                aria-label="Commitment title"
                className="w-full border-0 border-b border-dashed border-gray-300 bg-transparent pb-2 text-3xl font-bold text-gray-900 outline-none focus:border-emerald-500 sm:text-4xl"
                value={homepageCopy.commitmentTitle}
                onChange={event => updateHomepageCopy(current => ({ ...current, commitmentTitle: event.target.value }))}
                placeholder="Our Commitment to Excellence"
              />
              <div className="mt-4 space-y-3">
                {homepageCopy.commitmentParagraphs.map((paragraph, index) => (
                  <div key={`commitment-${index}`} className="group relative">
                    <textarea
                      aria-label={`Commitment paragraph ${index + 1}`}
                      className="min-h-28 w-full resize-y rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 pr-20 text-lg leading-relaxed text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      value={paragraph}
                      onChange={event => updateCommitmentParagraph(index, event.target.value)}
                      placeholder="Commitment paragraph"
                    />
                    <button
                      type="button"
                      onClick={() => removeCommitmentParagraph(index)}
                      className="absolute right-3 top-3 rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateHomepageCopy(current => ({ ...current, commitmentParagraphs: [...current.commitmentParagraphs, ''] }))}
                    className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    Add paragraph
                  </button>
                  <button
                    type="button"
                    onClick={() => updateHomepageCopy(current => ({ ...current, commitmentTitle: '', commitmentParagraphs: [] }))}
                    className="rounded-xl border border-red-100 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Clear commitment
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white/80 p-6 shadow-lg">
              <input
                aria-label="Certifications title"
                className="mb-5 w-full border-0 border-b border-dashed border-gray-300 bg-transparent pb-2 text-center text-xl font-bold text-gray-900 outline-none focus:border-emerald-500"
                value={homepageCopy.certificationsTitle}
                onChange={event => updateHomepageCopy(current => ({ ...current, certificationsTitle: event.target.value }))}
                placeholder="Our Certifications"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {homepageCopy.certifications.map((certification, index) => (
                  <article key={certification.id} className={`relative rounded-lg border-2 p-3 text-center ${index % 2 === 0 ? 'border-blue-300' : 'border-gray-300'}`}>
                    <button
                      type="button"
                      aria-label={`Delete ${certification.name || 'certification'}`}
                      onClick={() => updateHomepageCopy(current => ({ ...current, certifications: current.certifications.filter(item => item.id !== certification.id) }))}
                      className="absolute right-2 top-2 rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                    <div className="mb-3 flex h-16 items-center justify-center pt-4">
                      {certification.image ? <img src={certification.image} alt="" className="h-12 max-w-full object-contain" /> : <span className="text-xs text-gray-400">No image</span>}
                    </div>
                    <input
                      aria-label="Certification name"
                      className="mb-2 w-full rounded border border-gray-200 px-2 py-1 text-center text-xs text-gray-600"
                      value={certification.name}
                      onChange={event => updateCertification(certification.id, 'name', event.target.value)}
                      placeholder="Certification name"
                    />
                    <input
                      aria-label="Certification detail"
                      className={`w-full rounded border px-2 py-1 text-center text-xs font-semibold ${index % 2 === 0 ? 'border-blue-100 text-blue-600' : 'border-gray-200 text-gray-700'}`}
                      value={certification.detail}
                      onChange={event => updateCertification(certification.id, 'detail', event.target.value)}
                      placeholder="Member or certificate number"
                    />
                    <input
                      aria-label="Certification image path"
                      className="mt-2 w-full rounded border border-gray-200 px-2 py-1 text-center text-[10px] text-gray-500"
                      value={certification.image}
                      onChange={event => updateCertification(certification.id, 'image', event.target.value)}
                      placeholder="/images/certificate.png"
                    />
                  </article>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => updateHomepageCopy(current => ({
                    ...current,
                    certifications: [
                      ...current.certifications,
                      { id: `certification-${Date.now()}`, name: '', image: '', detail: '' },
                    ],
                  }))}
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Add certification
                </button>
                <button
                  type="button"
                  onClick={() => updateHomepageCopy(current => ({ ...current, certificationsTitle: '', certifications: [] }))}
                  className="rounded-xl border border-red-100 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Clear certifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="homepage-hours" className="scroll-mt-24 space-y-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Working Hours</h2>
              <p className="mt-1 text-sm text-gray-500">Each schedule entry is shown as a card, matching how visitors scan your availability.</p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-2xl rounded-lg border border-gray-200 bg-white/80 p-6 shadow-lg">
            <h3 className="mb-4 text-center text-xl font-bold text-gray-900">Working Hours</h3>
            <div className="space-y-3">
              {workingHours.map((schedule, index) => (
                <div
                  key={`preview-${schedule.id}`}
                  className={`flex items-center justify-between rounded-lg border-l-4 p-3 transition-all duration-300 hover:scale-[1.02] ${schedule.status === 'open' ? 'border-teal-500 bg-teal-50 hover:bg-teal-100' : 'border-gray-400 bg-gray-50 hover:bg-gray-100'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className={`h-3 w-3 rounded-full ${schedule.status === 'open' ? 'animate-pulse bg-teal-500' : 'bg-gray-400'}`} />
                    <span className="font-semibold text-gray-900">{schedule.day || 'Day not set'}</span>
                  </div>
                  <span className={`font-medium ${schedule.status === 'open' ? 'text-teal-600' : 'text-gray-500'}`}>
                    {schedule.hours || (schedule.status === 'closed' ? 'Closed' : 'Hours not set')}
                  </span>
                </div>
              ))}
              {workingHours.length === 0 && <p className="py-4 text-center text-sm text-gray-500">No working hours shown.</p>}
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

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workingHours.map(entry => (
              <article key={entry.id} className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/60 p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-emerald-100 pb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Opening hours</p>
                    <p className="mt-1 text-lg font-bold text-emerald-950">{entry.day || 'Day not set'}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${entry.status === 'closed' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {entry.status === 'closed' ? 'Closed' : 'Open'}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Day</label>
                  <input
                    className="w-full border px-3 py-2 rounded"
                    value={entry.day}
                    onChange={e => handleWorkingHourChange(entry.id, 'day', e.target.value)}
                  />
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Hours</label>
                  <input
                    className="w-full border px-3 py-2 rounded"
                    value={entry.hours}
                    onChange={e => handleWorkingHourChange(entry.id, 'hours', e.target.value)}
                  />
                </div>
                <div className="mt-3">
                  <div className="w-full">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                    <select
                      className="w-full border px-3 py-2 rounded"
                      value={entry.status}
                      onChange={e => handleWorkingHourChange(entry.id, 'status', e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => handleUpdateWorkingHour(entry.id)} disabled={apiLoading} className="flex-1 rounded-lg bg-emerald-700 px-3 py-2 text-white hover:bg-emerald-800">
                      {apiLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => handleDeleteWorkingHour(entry.id)} className="rounded-lg border border-red-100 px-3 py-2 text-red-600 hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {workingHours.length === 0 && (
              <div className="border border-dashed rounded-2xl p-6 text-center text-sm text-gray-500">
                No working hours configured. Add a new entry above.
              </div>
            )}
          </div>
      </section>

      <section id="homepage-facts" className="scroll-mt-24 space-y-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="text-center">
            <input
              aria-label="Why choose us title"
              className="mx-auto block w-full max-w-xl border-0 border-b border-dashed border-gray-300 bg-transparent pb-2 text-center text-3xl font-bold text-gray-900 outline-none focus:border-emerald-500 sm:text-4xl"
              value={homepageCopy.whyTitle}
              onChange={event => updateHomepageCopy(current => ({ ...current, whyTitle: event.target.value }))}
              placeholder="Why Choose Us"
            />
            <div className="mx-auto mb-6 mt-3 h-1 w-24 bg-teal-500" />
            <textarea
              aria-label="Why choose us description"
              className="mx-auto block min-h-28 w-full max-w-4xl resize-y rounded-xl border border-dashed border-gray-300 px-4 py-3 text-justify text-xl leading-relaxed text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              value={homepageCopy.whyDescription}
              onChange={event => updateHomepageCopy(current => ({ ...current, whyDescription: event.target.value }))}
              placeholder="Explain why clients should choose GLOWAC"
            />
            <button
              type="button"
              onClick={() => updateHomepageCopy(current => ({ ...current, whyTitle: '', whyDescription: '' }))}
              className="mt-3 text-xs font-medium text-red-600 hover:underline"
            >
              Clear Why Choose Us
            </button>
          </div>

          {facts.length > 0 && (
            <div className="rounded-none border-2 border-teal-200 bg-white p-8 shadow-xl md:p-12">
              <div className="flex flex-col items-center justify-center gap-6 text-center md:flex-row">
                {facts.map((fact, index) => (
                  <React.Fragment key={`preview-${fact.id}`}>
                    {index > 0 && <div className="hidden items-center px-6 md:flex"><div className="h-24 w-[2px] rounded bg-black/90 md:h-28" /></div>}
                    <div className="group flex-1">
                      <div className="mb-2 text-4xl font-bold text-teal-600 transition-transform duration-300 group-hover:scale-110 md:text-5xl">{fact.value || '0'}</div>
                      <p className="font-medium text-gray-700">{fact.label || 'Fact label'}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit highlight cards</h2>
              <p className="text-sm text-gray-600">Change or remove the statistics shown in the preview above.</p>
            </div>
            <button onClick={clearFacts} disabled={apiLoading || facts.length === 0} className="rounded-md border px-4 py-2 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
              {apiLoading ? 'Updating...' : 'Clear all highlights'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className="border px-3 py-2 rounded" placeholder="Label (e.g. Projects)" value={factLabel} onChange={e => setFactLabel(e.target.value)} />
            <input className="border px-3 py-2 rounded" placeholder="Number (e.g. 120)" value={factValue} onChange={e => setFactValue(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={addFact} className="px-3 py-1 bg-teal-600 text-white rounded">Add</button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {facts.map(f => (
              <article key={f.id} className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
                <div className="bg-gradient-to-br from-emerald-800 to-teal-600 p-5 text-white">
                  <p className="text-3xl font-bold tracking-tight">{f.value || '0'}</p>
                  <p className="mt-1 text-sm text-emerald-100">{f.label || 'Fact label'}</p>
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Label</label>
                    <input className="w-full rounded border px-3 py-2" value={f.label} onChange={e => updateFact(f.id, e.target.value, f.value)} placeholder="Label" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600">Value</label>
                    <input className="w-full rounded border px-3 py-2" value={f.value} onChange={e => updateFact(f.id, f.label, e.target.value)} placeholder="Value" />
                  </div>
                  <button onClick={() => deleteFact(f.id)} className="w-full rounded-lg border border-red-100 px-3 py-2 text-sm text-red-600 hover:bg-red-50">Delete fact</button>
                </div>
              </article>
            ))}
            {facts.length === 0 && <div className="text-sm text-gray-500">No facts defined.</div>}
          </div>
      </section>
    </div>
  );
}
export default HomeUpdate;
