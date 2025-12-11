import React, { useEffect, useState } from 'react';

type TeamMember = {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  img: string;
};

const AboutUpdate: React.FC = () => {
  // Header
  const [headerTitle, setHeaderTitle] = useState('');

  // Background paragraphs
  const [bgPara1, setBgPara1] = useState('');
  const [bgPara2, setBgPara2] = useState('');
  const [bgPara3, setBgPara3] = useState('');

  // Policy tabs
  const [coreValues, setCoreValues] = useState<string[]>([]);
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [valueInput, setValueInput] = useState('');

  // Environmental Lab
  const [envLabPara1, setEnvLabPara1] = useState('');
  const [envLabPara2, setEnvLabPara2] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryInput, setGalleryInput] = useState('');

  // CEO Card
  const [ceoName, setCeoName] = useState('');
  const [ceoTitle, setCeoTitle] = useState('');
  const [ceoEmail, setCeoEmail] = useState('');
  const [ceoImage, setCeoImage] = useState('');
  const [ceoDescription, setCeoDescription] = useState('');

  // Team Members
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamName, setTeamName] = useState('');
  const [teamTitle, setTeamTitle] = useState('');
  const [teamPhone, setTeamPhone] = useState('');
  const [teamEmail, setTeamEmail] = useState('');
  const [teamImg, setTeamImg] = useState('');

  useEffect(() => {
    setHeaderTitle(localStorage.getItem('about.headerTitle') || 'About Us');
    setBgPara1(localStorage.getItem('about.bg.para1') || '');
    setBgPara2(localStorage.getItem('about.bg.para2') || '');
    setBgPara3(localStorage.getItem('about.bg.para3') || '');

    try {
      const cv = localStorage.getItem('about.coreValues');
      setCoreValues(cv ? JSON.parse(cv) : []);
    } catch { setCoreValues([]); }

    setMission(localStorage.getItem('about.mission') || '');
    setVision(localStorage.getItem('about.vision') || '');

    setEnvLabPara1(localStorage.getItem('about.envLab.para1') || '');
    setEnvLabPara2(localStorage.getItem('about.envLab.para2') || '');

    try {
      const gi = localStorage.getItem('about.gallery');
      setGalleryImages(gi ? JSON.parse(gi) : []);
    } catch { setGalleryImages([]); }

    setCeoName(localStorage.getItem('about.ceo.name') || '');
    setCeoTitle(localStorage.getItem('about.ceo.title') || '');
    setCeoEmail(localStorage.getItem('about.ceo.email') || '');
    setCeoImage(localStorage.getItem('about.ceo.image') || '');
    setCeoDescription(localStorage.getItem('about.ceo.description') || '');

    try {
      const t = localStorage.getItem('about.team');
      setTeam(t ? JSON.parse(t) : []);
    } catch { setTeam([]); }
  }, []);

  const saveAll = () => {
    localStorage.setItem('about.headerTitle', headerTitle);
    localStorage.setItem('about.bg.para1', bgPara1);
    localStorage.setItem('about.bg.para2', bgPara2);
    localStorage.setItem('about.bg.para3', bgPara3);
    localStorage.setItem('about.coreValues', JSON.stringify(coreValues));
    localStorage.setItem('about.mission', mission);
    localStorage.setItem('about.vision', vision);
    localStorage.setItem('about.envLab.para1', envLabPara1);
    localStorage.setItem('about.envLab.para2', envLabPara2);
    localStorage.setItem('about.gallery', JSON.stringify(galleryImages));
    localStorage.setItem('about.ceo.name', ceoName);
    localStorage.setItem('about.ceo.title', ceoTitle);
    localStorage.setItem('about.ceo.email', ceoEmail);
    localStorage.setItem('about.ceo.image', ceoImage);
    localStorage.setItem('about.ceo.description', ceoDescription);
    localStorage.setItem('about.team', JSON.stringify(team));
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

  const addGalleryImage = () => {
    if (!galleryInput.trim()) return;
    setGalleryImages([...galleryImages, galleryInput.trim()]);
    setGalleryInput('');
  };

  const deleteGalleryImage = (idx: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };

  const addTeamMember = () => {
    if (!teamName.trim() || !teamEmail.trim()) return;
    const id = Date.now().toString();
    setTeam([...team, { id, name: teamName.trim(), title: teamTitle.trim(), phone: teamPhone.trim(), email: teamEmail.trim(), img: teamImg.trim() }]);
    setTeamName('');
    setTeamTitle('');
    setTeamPhone('');
    setTeamEmail('');
    setTeamImg('');
  };

  const deleteTeamMember = (id: string) => {
    setTeam(team.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">About Page Editor</h2>
        <button onClick={saveAll} className="px-6 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">Save All</button>
      </div>

      {/* Header */}
      <section className="border p-4 rounded bg-white">
        <h3 className="text-lg font-semibold mb-3">Header Title</h3>
        <input value={headerTitle} onChange={e => setHeaderTitle(e.target.value)} className="w-full border px-3 py-2 rounded" placeholder="About Us" />
      </section>

      {/* Background */}
      <section className="border p-4 rounded bg-white">
        <h3 className="text-lg font-semibold mb-3">Background Section (3 paragraphs)</h3>
        <div className="space-y-3">
          <textarea value={bgPara1} onChange={e => setBgPara1(e.target.value)} rows={3} className="w-full border px-3 py-2 rounded" placeholder="Paragraph 1" />
          <textarea value={bgPara2} onChange={e => setBgPara2(e.target.value)} rows={3} className="w-full border px-3 py-2 rounded" placeholder="Paragraph 2" />
          <textarea value={bgPara3} onChange={e => setBgPara3(e.target.value)} rows={3} className="w-full border px-3 py-2 rounded" placeholder="Paragraph 3" />
        </div>
      </section>

      {/* Policy - Core Values */}
      <section className="border p-4 rounded bg-white">
        <h3 className="text-lg font-semibold mb-3">Core Values (bullets)</h3>
        <div className="flex gap-2 mb-3">
          <input value={valueInput} onChange={e => setValueInput(e.target.value)} className="flex-1 border px-3 py-2 rounded" placeholder="Add a value" />
          <button onClick={addValue} className="px-3 py-1 bg-teal-600 text-white rounded">Add</button>
        </div>
        <ul className="space-y-2">
          {coreValues.map((v, idx) => (
            <li key={idx} className="flex justify-between border p-2 rounded">
              <span className="text-sm">{v}</span>
              <button onClick={() => deleteValue(idx)} className="text-red-600 text-sm">Delete</button>
            </li>
          ))}
        </ul>
      </section>

      {/* Mission */}
      <section className="border p-4 rounded bg-white">
        <h3 className="text-lg font-semibold mb-3">Mission Statement</h3>
        <textarea value={mission} onChange={e => setMission(e.target.value)} rows={3} className="w-full border px-3 py-2 rounded" placeholder="Mission text" />
      </section>

      {/* Vision */}
      <section className="border p-4 rounded bg-white">
        <h3 className="text-lg font-semibold mb-3">Vision Statement</h3>
        <textarea value={vision} onChange={e => setVision(e.target.value)} rows={3} className="w-full border px-3 py-2 rounded" placeholder="Vision text" />
      </section>

      {/* Environmental Lab */}
      <section className="border p-4 rounded bg-white">
        <h3 className="text-lg font-semibold mb-3">Environmental Lab Section</h3>
        <div className="space-y-3">
          <textarea value={envLabPara1} onChange={e => setEnvLabPara1(e.target.value)} rows={2} className="w-full border px-3 py-2 rounded" placeholder="Paragraph 1" />
          <textarea value={envLabPara2} onChange={e => setEnvLabPara2(e.target.value)} rows={2} className="w-full border px-3 py-2 rounded" placeholder="Paragraph 2" />
        </div>
      </section>

      {/* Gallery Images */}
      <section className="border p-4 rounded bg-white">
        <h3 className="text-lg font-semibold mb-3">Environmental Lab Gallery</h3>
        <div className="flex gap-2 mb-3">
          <input value={galleryInput} onChange={e => setGalleryInput(e.target.value)} className="flex-1 border px-3 py-2 rounded" placeholder="Image URL" />
          <button onClick={addGalleryImage} className="px-3 py-1 bg-teal-600 text-white rounded">Add</button>
        </div>
        <div className="space-y-2">
          {galleryImages.map((img, idx) => (
            <div key={idx} className="flex items-center gap-3 border p-2 rounded">
              <img src={img} alt={`gallery-${idx}`} className="w-16 h-16 object-cover rounded" onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} />
              <span className="flex-1 text-sm break-words">{img}</span>
              <button onClick={() => deleteGalleryImage(idx)} className="text-red-600 text-sm">Delete</button>
            </div>
          ))}
        </div>
      </section>

      {/* CEO Card */}
      <section className="border p-4 rounded bg-white">
        <h3 className="text-lg font-semibold mb-3">CEO Card</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={ceoName} onChange={e => setCeoName(e.target.value)} className="border px-3 py-2 rounded" placeholder="Name" />
          <input value={ceoTitle} onChange={e => setCeoTitle(e.target.value)} className="border px-3 py-2 rounded" placeholder="Title" />
          <input value={ceoEmail} onChange={e => setCeoEmail(e.target.value)} className="border px-3 py-2 rounded" placeholder="Email" />
          <input value={ceoImage} onChange={e => setCeoImage(e.target.value)} className="border px-3 py-2 rounded" placeholder="Image URL" />
        </div>
        <textarea value={ceoDescription} onChange={e => setCeoDescription(e.target.value)} rows={2} className="w-full border px-3 py-2 rounded mt-3" placeholder="Short description" />
      </section>

      {/* Team Members */}
      <section className="border p-4 rounded bg-white">
        <h3 className="text-lg font-semibold mb-3">Team Members (Carousel)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input value={teamName} onChange={e => setTeamName(e.target.value)} className="border px-3 py-2 rounded" placeholder="Name" />
          <input value={teamTitle} onChange={e => setTeamTitle(e.target.value)} className="border px-3 py-2 rounded" placeholder="Title" />
          <input value={teamPhone} onChange={e => setTeamPhone(e.target.value)} className="border px-3 py-2 rounded" placeholder="Phone" />
          <input value={teamEmail} onChange={e => setTeamEmail(e.target.value)} className="border px-3 py-2 rounded" placeholder="Email" />
          <input value={teamImg} onChange={e => setTeamImg(e.target.value)} className="border px-3 py-2 rounded" placeholder="Image URL" />
          <button onClick={addTeamMember} className="px-3 py-1 bg-teal-600 text-white rounded">Add Member</button>
        </div>
        <div className="space-y-2">
          {team.map(m => (
            <div key={m.id} className="flex items-center gap-3 border p-2 rounded">
              <img src={m.img} alt={m.name} className="w-12 h-12 object-cover rounded" onError={e => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} />
              <div className="flex-1 text-sm">
                <div className="font-semibold">{m.name}</div>
                <div className="text-gray-600">{m.title} • {m.email}</div>
              </div>
              <button onClick={() => deleteTeamMember(m.id)} className="text-red-600 text-sm">Delete</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUpdate;
