import React, { useEffect, useState } from 'react';

type TeamMember = {
  id: number;
  name: string;
  title: string;
  email: string;
  image_url: string;
  short_description?: string;
};

const AboutUpdate: React.FC = () => {
  // Header
  const [headerTitle, setHeaderTitle] = useState('');

  // Background paragraphs
  type Background = { id: number; paragraph: string };
  const [backgrounds, setBackgrounds] = useState<Background[]>([]);
  const [bgInput, setBgInput] = useState('');
  const [aboutTab, setAboutTab] = useState<'background' | 'gallery' | 'ceo' | 'team'>('background');

  // Policy tabs
  const [coreValues, setCoreValues] = useState<string[]>([]);
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [valueInput, setValueInput] = useState('');

  // Environmental Lab
  const [envLabPara1, setEnvLabPara1] = useState('');
  const [envLabPara2, setEnvLabPara2] = useState('');
  type GalleryItem = { id: number; image_preview_url: string };
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryEditingId, setGalleryEditingId] = useState<number | null>(null);

  // CEO Card
  const [ceoName, setCeoName] = useState('');
  const [ceoTitle, setCeoTitle] = useState('');
  const [ceoEmail, setCeoEmail] = useState('');
  const [ceoImage, setCeoImage] = useState('');
  const [ceoDescription, setCeoDescription] = useState('');
  const [ceoId, setCeoId] = useState<number | null>(null);
  const [ceoFile, setCeoFile] = useState<File | null>(null);
  const [ceoUploading, setCeoUploading] = useState(false);

  // Team Members (API-backed)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [memberName, setMemberName] = useState('');
  const [memberTitle, setMemberTitle] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberDesc, setMemberDesc] = useState('');
  const [memberFile, setMemberFile] = useState<File | null>(null);
  const [memberUploading, setMemberUploading] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);

  useEffect(() => {
    setHeaderTitle(localStorage.getItem('about.headerTitle') || 'About Us');
    // load backgrounds from API
    fetch('https://glowac-api.onrender.com/background')
      .then(r => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBackgrounds(data.map((d: any) => ({ id: d.id, paragraph: d.paragraph ?? '' })));
      })
      .catch(() => setBackgrounds([]));

    try {
      const cv = localStorage.getItem('about.coreValues');
      setCoreValues(cv ? JSON.parse(cv) : []);
    } catch { setCoreValues([]); }

    setMission(localStorage.getItem('about.mission') || '');
    setVision(localStorage.getItem('about.vision') || '');

    setEnvLabPara1(localStorage.getItem('about.envLab.para1') || '');
    setEnvLabPara2(localStorage.getItem('about.envLab.para2') || '');

    // load gallery images from API
    fetch('https://glowac-api.onrender.com/gallery')
      .then(r => r.json())
      .then((data) => {
        if (Array.isArray(data)) setGalleryItems(data.map((d: any) => ({ id: d.id, image_preview_url: d.image_preview_url })));
      })
      .catch(() => setGalleryItems([]));

    // load CEO from API
    fetch('https://glowac-api.onrender.com/ceo')
      .then(r => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const c = data[0];
          setCeoId(c.id ?? null);
          setCeoName(c.name ?? '');
          setCeoTitle(c.title ?? '');
          setCeoEmail(c.email ?? '');
          setCeoImage(c.image_url ?? '');
          setCeoDescription(c.short_description ?? '');
        }
      })
      .catch(() => {
        setCeoId(null);
      });

    // load team members from API
    fetch('https://glowac-api.onrender.com/members')
      .then(r => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTeamMembers(data.map((d: any) => ({ id: d.id, name: d.name, title: d.title, email: d.email, image_url: d.image_url, short_description: d.short_description })));
      })
      .catch(() => setTeamMembers([]));
  }, []);

  const saveAll = () => {
    localStorage.setItem('about.headerTitle', headerTitle);
    // backgrounds are managed via API (see Backgrounds section)
    localStorage.setItem('about.coreValues', JSON.stringify(coreValues));
    localStorage.setItem('about.mission', mission);
    localStorage.setItem('about.vision', vision);
    localStorage.setItem('about.envLab.para1', envLabPara1);
    localStorage.setItem('about.envLab.para2', envLabPara2);
    // CEO and team are managed via API; use their controls below to create/update.
    alert('About page content saved!');
  };

  const addValue = () => {
    if (!valueInput.trim()) return;
    setCoreValues([...coreValues, valueInput.trim()]);
    setValueInput('');
  };

  const deleteValue = (idx: number) => {
    setCoreValues(coreValues.filter((_, i) => i !== idx));
  };

  // Gallery API actions
  const uploadGallery = async (file?: File | null) => {
    if (!file) return;
    setGalleryUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('https://glowac-api.onrender.com/gallery', { method: 'POST', body: fd });
      const data = await res.json();
      // API returns created item
      setGalleryItems(prev => [...prev, { id: data.id, image_preview_url: data.image_preview_url }]);
      setGalleryFile(null);
    } catch (err) {
      alert('Failed to upload image');
    } finally {
      setGalleryUploading(false);
    }
  };

  const replaceGallery = async (id: number, file?: File | null) => {
    if (!file) return;
    setGalleryUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch(`https://glowac-api.onrender.com/gallery/${id}`, { method: 'PUT', body: fd });
      const data = await res.json();
      setGalleryItems(prev => prev.map(p => (p.id === data.id ? { id: data.id, image_preview_url: data.image_preview_url } : p)));
    } catch (err) {
      alert('Failed to replace image');
    } finally {
      setGalleryUploading(false);
      setGalleryEditingId(null);
    }
  };

  const deleteGallery = async (id: number) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await fetch(`https://glowac-api.onrender.com/gallery/${id}`, { method: 'DELETE' });
      setGalleryItems(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete image');
    }
  };

  // Team member API actions
  const loadMembers = async () => {
    try {
      const res = await fetch('https://glowac-api.onrender.com/members');
      const data = await res.json();
      if (Array.isArray(data)) setTeamMembers(data.map((d: any) => ({ id: d.id, name: d.name, title: d.title, email: d.email, image_url: d.image_url, short_description: d.short_description })));
    } catch {
      setTeamMembers([]);
    }
  };

  const editMember = (m: TeamMember) => {
    setEditingMemberId(m.id);
    setMemberName(m.name || '');
    setMemberTitle(m.title || '');
    setMemberEmail(m.email || '');
    setMemberDesc(m.short_description || '');
    setMemberFile(null);
  };

  const createOrUpdateMember = async () => {
    if (!memberName.trim() || !memberEmail.trim()) return;
    setMemberUploading(true);
    try {
      const fd = new FormData();
      fd.append('name', memberName.trim());
      fd.append('title', memberTitle.trim());
      fd.append('email', memberEmail.trim());
      fd.append('short_description', memberDesc.trim());
      if (memberFile) fd.append('image', memberFile);

      if (!editingMemberId) {
        const res = await fetch('https://glowac-api.onrender.com/members', { method: 'POST', body: fd });
        const data = await res.json();
        setTeamMembers(prev => [...prev, { id: data.id, name: data.name, title: data.title, email: data.email, image_url: data.image_url, short_description: data.short_description }]);
      } else {
        const res = await fetch(`https://glowac-api.onrender.com/members/${editingMemberId}`, { method: 'PUT', body: fd });
        const data = await res.json();
        setTeamMembers(prev => prev.map(p => p.id === data.id ? { id: data.id, name: data.name, title: data.title, email: data.email, image_url: data.image_url, short_description: data.short_description } : p));
        setEditingMemberId(null);
      }
      setMemberName(''); setMemberTitle(''); setMemberEmail(''); setMemberDesc(''); setMemberFile(null);
    } catch (err) {
      alert('Failed to save member');
    } finally {
      setMemberUploading(false);
    }
  };

  const deleteMember = async (id: number) => {
    if (!window.confirm('Delete this member?')) return;
    try {
      await fetch(`https://glowac-api.onrender.com/members/${id}`, { method: 'DELETE' });
      setTeamMembers(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete member');
    }
  };

  // Background API actions
  const addBackground = async () => {
    if (!bgInput.trim()) return;
    try {
      const res = await fetch('https://glowac-api.onrender.com/background', {
        method: 'POST',
        headers: { accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `paragraph=${encodeURIComponent(bgInput.trim())}`,
      });
      const data = await res.json();
      setBackgrounds(prev => Array.isArray(data) ? data : [...prev, data]);
      setBgInput('');
    } catch (err) {
      alert('Failed to add background paragraph');
    }
  };

  const updateBackground = async (id: number, paragraph: string) => {
    try {
      const res = await fetch(`https://glowac-api.onrender.com/background/${id}`, {
        method: 'PUT',
        headers: { accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `paragraph=${encodeURIComponent(paragraph)}`,
      });
      const updated = await res.json();
      setBackgrounds(prev => prev.map(b => b.id === updated.id ? updated : b));
    } catch (err) {
      alert('Failed to update background');
    }
  };

  const deleteBackground = async (id: number) => {
    if (!window.confirm('Delete this background paragraph?')) return;
    try {
      await fetch(`https://glowac-api.onrender.com/background/${id}`, { method: 'DELETE' });
      setBackgrounds(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      alert('Failed to delete background');
    }
  };

  // CEO API actions
  const createOrUpdateCeo = async () => {
    setCeoUploading(true);
    try {
      const fd = new FormData();
      fd.append('name', ceoName);
      fd.append('title', ceoTitle);
      fd.append('email', ceoEmail);
      fd.append('short_description', ceoDescription);
      if (ceoFile) fd.append('image', ceoFile);

      if (!ceoId) {
        const res = await fetch('https://glowac-api.onrender.com/ceo', { method: 'POST', body: fd });
        const data = await res.json();
        setCeoId(data.id ?? null);
        setCeoImage(data.image_url ?? '');
      } else {
        const res = await fetch(`https://glowac-api.onrender.com/ceo/${ceoId}`, { method: 'PUT', body: fd });
        const data = await res.json();
        setCeoImage(data.image_url ?? '');
      }
      setCeoFile(null);
      alert('CEO saved');
    } catch (err) {
      alert('Failed to save CEO');
    } finally {
      setCeoUploading(false);
    }
  };

  const deleteCeo = async () => {
    if (!ceoId) return;
    if (!window.confirm('Delete CEO?')) return;
    try {
      await fetch(`https://glowac-api.onrender.com/ceo/${ceoId}`, { method: 'DELETE' });
      setCeoId(null);
      setCeoName('');
      setCeoTitle('');
      setCeoEmail('');
      setCeoImage('');
      setCeoDescription('');
      alert('CEO deleted');
    } catch (err) {
      alert('Failed to delete CEO');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">About Page Editor</h2>
        <button onClick={saveAll} className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save All</button>
      </div>

     

      <div className="space-y-4">
        <div className="flex gap-2">
          <button className={`px-3 py-1 rounded ${aboutTab === 'background' ? 'bg-teal-600 text-white' : 'bg-gray-100'}`} onClick={() => setAboutTab('background')}>Background</button>
          <button className={`px-3 py-1 rounded ${aboutTab === 'gallery' ? 'bg-teal-600 text-white' : 'bg-gray-100'}`} onClick={() => setAboutTab('gallery')}>Gallery</button>
          <button className={`px-3 py-1 rounded ${aboutTab === 'ceo' ? 'bg-teal-600 text-white' : 'bg-gray-100'}`} onClick={() => setAboutTab('ceo')}>CEO</button>
          <button className={`px-3 py-1 rounded ${aboutTab === 'team' ? 'bg-teal-600 text-white' : 'bg-gray-100'}`} onClick={() => setAboutTab('team')}>Team</button>
        </div>

        {aboutTab === 'background' && (
          <section className="border p-4 rounded bg-white">
            <h3 className="text-lg font-semibold mb-3">Background (manage paragraphs)</h3>
            <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-2">
              <textarea value={bgInput} onChange={e => setBgInput(e.target.value)} rows={2} className="col-span-2 w-full border px-3 py-2 rounded" placeholder="New paragraph" />
              <div className="flex items-start">
                <button type="button" onClick={addBackground} className="px-3 py-2 bg-teal-600 text-white rounded">Add</button>
              </div>
            </div>

            <div className="space-y-2">
              {backgrounds.length === 0 ? (
                <div className="p-3 border rounded text-sm text-gray-500">No background paragraphs found.</div>
              ) : (
                backgrounds.map(b => (
                  <div key={b.id} className="border p-3 rounded bg-gray-50">
                    <textarea
                      value={b.paragraph}
                      onChange={e => setBackgrounds(prev => prev.map(p => p.id === b.id ? { ...p, paragraph: e.target.value } : p))}
                      rows={3}
                      className="w-full border px-3 py-2 rounded mb-2"
                    />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => updateBackground(b.id, b.paragraph)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Update</button>
                      <button type="button" onClick={() => deleteBackground(b.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      

    

      {aboutTab === 'gallery' && (
        <section className="border p-4 rounded bg-white">
        <h3 className="text-lg font-semibold mb-3"> Gallery</h3>
        <div className="flex gap-2 mb-3 items-center">
          <input type="file" accept="image/*" onChange={e => setGalleryFile(e.target.files ? e.target.files[0] : null)} />
          <button onClick={() => uploadGallery(galleryFile)} disabled={galleryUploading || !galleryFile} className="px-3 py-1 bg-teal-600 text-white rounded">{galleryUploading ? 'Uploading...' : 'Upload'}</button>
        </div>
        <div className="space-y-2">
          {galleryItems.length === 0 ? (
            <div className="p-3 border rounded text-sm text-gray-500">No gallery images found.</div>
          ) : (
            galleryItems.map((g) => (
              <div key={g.id} className="flex items-center gap-3 border p-2 rounded">
                <img src={g.image_preview_url} alt={`gallery-${g.id}`} className="w-16 h-16 object-cover rounded" onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} />
                <span className="flex-1 text-sm break-words">{g.image_preview_url}</span>
                <div className="flex gap-2">
                  <label className="px-2 py-1 border rounded text-sm cursor-pointer bg-gray-100">
                    Replace
                    <input type="file" accept="image/*" className="hidden" onChange={e => replaceGallery(g.id, e.target.files ? e.target.files[0] : null)} />
                  </label>
                  <button onClick={() => deleteGallery(g.id)} className="text-red-600 text-sm">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
        </section>
      )}

      {aboutTab === 'ceo' && (
        <section className="border p-4 rounded bg-white">
        <h3 className="text-lg font-semibold mb-3">CEO Card</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={ceoName} onChange={e => setCeoName(e.target.value)} className="border px-3 py-2 rounded" placeholder="Name" />
          <input value={ceoTitle} onChange={e => setCeoTitle(e.target.value)} className="border px-3 py-2 rounded" placeholder="Title" />
          <input value={ceoEmail} onChange={e => setCeoEmail(e.target.value)} className="border px-3 py-2 rounded" placeholder="Email" />
          <div className="flex items-center gap-3">
            <div>
              {ceoImage ? (
                <img src={ceoImage} alt="CEO" className="w-24 h-24 object-cover rounded" onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} />
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">No Image</div>
              )}
            </div>
            <div>
              <input type="file" accept="image/*" onChange={e => setCeoFile(e.target.files ? e.target.files[0] : null)} />
            </div>
          </div>
        </div>
        <textarea value={ceoDescription} onChange={e => setCeoDescription(e.target.value)} rows={2} className="w-full border px-3 py-2 rounded mt-3" placeholder="Short description" />
        <div className="flex gap-2 mt-3">
          <button onClick={createOrUpdateCeo} className="px-4 py-2 bg-blue-600 text-white rounded">{ceoId ? (ceoUploading ? 'Saving...' : 'Update CEO') : (ceoUploading ? 'Saving...' : 'Create CEO')}</button>
          <button onClick={deleteCeo} className="px-4 py-2 bg-red-100 text-red-700 rounded" disabled={!ceoId}>Delete</button>
        </div>
        </section>
      )}

      {aboutTab === 'team' && (
        <section className="border p-4 rounded bg-white">
        <h3 className="text-lg font-semibold mb-3">Team Members (Carousel)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input value={memberName} onChange={e => setMemberName(e.target.value)} className="border px-3 py-2 rounded" placeholder="Name" />
          <input value={memberTitle} onChange={e => setMemberTitle(e.target.value)} className="border px-3 py-2 rounded" placeholder="Title" />
          <input value={memberEmail} onChange={e => setMemberEmail(e.target.value)} className="border px-3 py-2 rounded" placeholder="Email" />
          <input value={memberDesc} onChange={e => setMemberDesc(e.target.value)} className="border px-3 py-2 rounded" placeholder="Short description" />
          <input type="file" accept="image/*" onChange={e => setMemberFile(e.target.files ? e.target.files[0] : null)} className="border px-3 py-2 rounded" />
          <div className="flex items-center">
            <button onClick={createOrUpdateMember} className="px-3 py-1 bg-teal-600 text-white rounded">{editingMemberId ? (memberUploading ? 'Saving...' : 'Update Member') : (memberUploading ? 'Saving...' : 'Add Member')}</button>
            {editingMemberId && (
              <button type="button" onClick={() => { setEditingMemberId(null); setMemberName(''); setMemberTitle(''); setMemberEmail(''); setMemberDesc(''); setMemberFile(null); }} className="ml-2 px-3 py-1 border rounded">Cancel</button>
            )}
          </div>
        </div>
        <div className="space-y-2">
          {teamMembers.map(m => (
            <div key={m.id} className="flex items-center gap-3 border p-2 rounded">
              <img src={m.image_url} alt={m.name} className="w-12 h-12 object-cover rounded" onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} />
              <div className="flex-1 text-sm">
                <div className="font-semibold">{m.name}</div>
                <div className="text-gray-600">{m.title} • {m.email}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => editMember(m)} className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded">Edit</button>
                <button onClick={() => deleteMember(m.id)} className="text-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
        </section>
      )}
      </div>
    </div>
  );
};

export default AboutUpdate;
