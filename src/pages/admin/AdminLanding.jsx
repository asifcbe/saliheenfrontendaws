import React, { useState, useEffect, useCallback } from 'react'; // useCallback kept for carousel handlers
import { FiSave, FiUpload, FiImage, FiFilm, FiLayout } from 'react-icons/fi';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import { getImageUrl } from '../../utils/api';

// Defined OUTSIDE component so it never remounts on re-render
function Section({ icon: Icon, title, children }) {
  return (
    <div className="admin-section">
      <div className="admin-section-title">
        {Icon && <Icon size={15} />} {title}
      </div>
      {children}
    </div>
  );
}

export default function AdminLanding() {
  const [content, setContent] = useState({
    heroTitle: '', heroSubtitle: '', youtubeVideoId: '', youtubeTitle: '',
    carouselImages: []
  });
  const [saving, setSaving] = useState(false);
  const [carouselFile, setCarouselFile] = useState(null);
  const [carouselMeta, setCarouselMeta] = useState({ alt: '', caption: '', subcaption: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    API.get('/api/landing').then(({ data }) => {
      setContent({
        heroTitle: data.heroTitle || '',
        heroSubtitle: data.heroSubtitle || '',
        youtubeVideoId: data.youtubeVideoId || '',
        youtubeTitle: data.youtubeTitle || '',
        carouselImages: data.carouselImages || []
      });
    });
  }, []);

  // Stable handlers using useCallback so inputs don't lose focus
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleCarouselMetaChange = useCallback((e) => {
    const { name, value } = e.target;
    setCarouselMeta(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put('/api/landing', {
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
        youtubeVideoId: content.youtubeVideoId,
        youtubeTitle: content.youtubeTitle
      });
      toast.success('Landing page saved!');
    } catch { toast.error('Error saving'); }
    finally { setSaving(false); }
  };

  const handleUploadCarousel = async () => {
    if (!carouselFile) return toast.error('Select an image first');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', carouselFile);
      fd.append('alt', carouselMeta.alt);
      fd.append('caption', carouselMeta.caption);
      fd.append('subcaption', carouselMeta.subcaption);
      const { data } = await API.post('/api/landing/carousel', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setContent(prev => ({ ...prev, carouselImages: data.content.carouselImages }));
      setCarouselFile(null);
      setCarouselMeta({ alt: '', caption: '', subcaption: '' });
      toast.success('Slide uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleDeleteCarousel = async (imageId) => {
    if (!window.confirm('Remove this slide?')) return;
    try {
      await API.delete(`/api/landing/carousel/${imageId}`);
      setContent(prev => ({ ...prev, carouselImages: prev.carouselImages.filter(i => i._id !== imageId) }));
      toast.success('Slide removed');
    } catch { toast.error('Delete failed'); }
  };


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1.8rem', marginBottom: '0.2rem' }}>Landing Page</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Manage your homepage content</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
          <FiSave size={14} /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Hero */}
      <Section icon={FiLayout} title="Hero Section">
        <div className="input-row input-row-2">
          <div className="form-group">
            <label className="form-label">Hero Title</label>
            <input name="heroTitle" value={content.heroTitle} onChange={handleChange} className="form-control" placeholder="Saliheen Perfumes" />
          </div>
          <div className="form-group">
            <label className="form-label">Hero Subtitle</label>
            <input name="heroSubtitle" value={content.heroSubtitle} onChange={handleChange} className="form-control" placeholder="The Essence of Luxury" />
          </div>
        </div>
      </Section>

      {/* Carousel */}
      <Section icon={FiImage} title="Hero Carousel Slides">
        <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          {content.carouselImages.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', padding: '0.5rem 0' }}>No slides yet — upload your first one below.</p>
          ) : content.carouselImages.map(img => (
            <div key={img._id} style={{ flexShrink: 0, position: 'relative', width: '170px' }}>
              <img src={getImageUrl(img.url)} alt={img.alt} style={{ width: '170px', height: '105px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--black-border)', display: 'block' }} />
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.caption || '(no caption)'}</p>
              <button onClick={() => handleDeleteCarousel(img._id)} style={{ position: 'absolute', top: '-7px', right: '-7px', width: '22px', height: '22px', borderRadius: '50%', background: 'var(--danger)', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>×</button>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--black-surface)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', border: '1px dashed var(--black-border)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Upload New Slide</p>
          <div className="input-row input-row-3" style={{ marginBottom: '0.75rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Caption</label>
              <input name="caption" value={carouselMeta.caption} onChange={handleCarouselMetaChange} className="form-control" placeholder="Main heading" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Subcaption</label>
              <input name="subcaption" value={carouselMeta.subcaption} onChange={handleCarouselMetaChange} className="form-control" placeholder="Subtitle" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Alt Text</label>
              <input name="alt" value={carouselMeta.alt} onChange={handleCarouselMetaChange} className="form-control" placeholder="Image description" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input type="file" accept="image/*" onChange={e => setCarouselFile(e.target.files[0])} style={{ display: 'none' }} id="carousel-upload" />
            <label htmlFor="carousel-upload" className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
              <FiImage size={13} /> {carouselFile ? carouselFile.name.slice(0, 18) + '…' : 'Choose Image'}
            </label>
            <button type="button" onClick={handleUploadCarousel} className="btn btn-primary btn-sm" disabled={uploading || !carouselFile}>
              <FiUpload size={13} /> {uploading ? 'Uploading…' : 'Upload Slide'}
            </button>
          </div>
        </div>
      </Section>

      {/* YouTube */}
      <Section icon={FiFilm} title="YouTube Video">
        <div className="input-row input-row-2">
          <div className="form-group">
            <label className="form-label">YouTube Video ID</label>
            <input name="youtubeVideoId" value={content.youtubeVideoId} onChange={handleChange} className="form-control" placeholder="e.g. dQw4w9WgXcQ" />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              From youtube.com/watch?v=<strong style={{ color: 'var(--gold)' }}>THIS_PART</strong>
            </p>
          </div>
          <div className="form-group">
            <label className="form-label">Section Title</label>
            <input name="youtubeTitle" value={content.youtubeTitle} onChange={handleChange} className="form-control" placeholder="Our Story" />
          </div>
        </div>
      </Section>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleSave} className="btn btn-primary btn-lg" disabled={saving}>
          <FiSave size={15} /> {saving ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
