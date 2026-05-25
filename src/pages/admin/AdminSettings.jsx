import React, { useState, useEffect, useCallback } from 'react';
import { FiSave, FiUpload, FiShoppingBag, FiPhone, FiShare2, FiCreditCard, FiImage, FiDroplet } from 'react-icons/fi';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import { getImageUrl } from '../../utils/api';

// Outside component — prevents focus-loss on re-render
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

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: '', storeTagline: '', storeEmail: '', storePhone: '',
    storeAddress: '', codEnabled: true, razorpayKeyId: '', metaDescription: '',
    logo: '', shippingCharge: 0, theme: 'midnight-gold',
    socialLinks: { instagram: '', facebook: '', whatsapp: '', youtube: '' }
  });
  const [logo, setLogo] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/api/settings').then(({ data }) => {
      setSettings({
        storeName: data.storeName || '',
        storeTagline: data.storeTagline || '',
        storeEmail: data.storeEmail || '',
        storePhone: data.storePhone || '',
        storeAddress: data.storeAddress || '',
        codEnabled: data.codEnabled ?? true,
        razorpayKeyId: data.razorpayKeyId || '',
        metaDescription: data.metaDescription || '',
        logo: data.logo || '',
        shippingCharge: data.shippingCharge ?? 0,
        theme: data.theme || 'midnight-gold',
        socialLinks: data.socialLinks || { instagram: '', facebook: '', whatsapp: '', youtube: '' }
      });
    }).catch(() => toast.error('Failed to load settings'));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('social_')) {
      const key = name.replace('social_', '');
      setSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
    } else {
      setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(settings).forEach(([k, v]) => {
        if (k === 'socialLinks') fd.append(k, JSON.stringify(v));
        else if (k !== 'logo') fd.append(k, v);
      });
      if (logo) fd.append('logo', logo);
      await API.put('/api/settings', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Settings saved!');
    } catch { toast.error('Error saving settings'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1.8rem', marginBottom: '0.2rem' }}>Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Manage your store configuration</p>
        </div>
        <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
          <FiSave size={14} /> {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <form onSubmit={handleSave}>
        <Section icon={FiShoppingBag} title="Store Branding">
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Store Logo</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {settings.logo ? (
                <div style={{ background: 'var(--black-surface)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius)', padding: '8px', display: 'inline-flex' }}>
                  <img src={getImageUrl(settings.logo)} alt="Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain', maxWidth: '160px' }} />
                </div>
              ) : (
                <div style={{ width: '64px', height: '48px', background: 'var(--black-surface)', border: '1px dashed var(--black-border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiImage size={20} color="var(--text-muted)" />
                </div>
              )}
              <div>
                <input type="file" accept="image/*" onChange={e => setLogo(e.target.files[0])} style={{ display: 'none' }} id="logo-upload" />
                <label htmlFor="logo-upload" className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
                  <FiUpload size={13} /> {logo ? logo.name.slice(0, 20) + '…' : 'Upload Logo'}
                </label>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>PNG, JPG or WebP — max 5MB</p>
              </div>
            </div>
          </div>

          <div className="input-row input-row-2">
            <div className="form-group">
              <label className="form-label">Store Name</label>
              <input name="storeName" value={settings.storeName} onChange={handleChange} className="form-control" placeholder="Saliheen Perfumes" />
            </div>
            <div className="form-group">
              <label className="form-label">Tagline</label>
              <input name="storeTagline" value={settings.storeTagline} onChange={handleChange} className="form-control" placeholder="The Essence of Luxury" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">SEO Meta Description</label>
              <textarea name="metaDescription" value={settings.metaDescription} onChange={handleChange} className="form-control" rows={2} placeholder="Short description for search engines…" />
            </div>
          </div>
        </Section>

        <Section icon={FiPhone} title="Contact Information">
          <div className="input-row input-row-2">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="storeEmail" value={settings.storeEmail} onChange={handleChange} className="form-control" placeholder="info@saliheenperfumes.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" name="storePhone" value={settings.storePhone} onChange={handleChange} className="form-control" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Store Address</label>
              <textarea name="storeAddress" value={settings.storeAddress} onChange={handleChange} className="form-control" rows={2} placeholder="Full address of your main store" />
            </div>
          </div>
        </Section>

        <Section icon={FiShare2} title="Social Media Links">
          <div className="input-row input-row-2">
            {[
              { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/saliheen' },
              { key: 'facebook',  label: 'Facebook URL',  placeholder: 'https://facebook.com/saliheen' },
              { key: 'youtube',   label: 'YouTube URL',   placeholder: 'https://youtube.com/@saliheen' },
              { key: 'whatsapp', label: 'WhatsApp Number (with country code)', placeholder: '919876543210' }
            ].map(s => (
              <div key={s.key} className="form-group">
                <label className="form-label">{s.label}</label>
                <input
                  name={`social_${s.key}`}
                  value={settings.socialLinks?.[s.key] || ''}
                  onChange={handleChange}
                  className="form-control"
                  placeholder={s.placeholder}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section icon={FiCreditCard} title="Payment & Shipping">
          <div className="input-row input-row-2" style={{ alignItems: 'start' }}>
            <div className="form-group">
              <label className="form-label">Razorpay Key ID</label>
              <input name="razorpayKeyId" value={settings.razorpayKeyId} onChange={handleChange} className="form-control" placeholder="rzp_test_…" />
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Update Razorpay Secret in <code style={{ color: 'var(--gold)', background: 'rgba(201,168,76,0.1)', padding: '1px 5px', borderRadius: '2px' }}>backend/.env</code></p>
            </div>
            <div className="form-group">
              <label className="form-label">Shipping Charge (₹)</label>
              <input
                type="number" name="shippingCharge"
                value={settings.shippingCharge} onChange={handleChange}
                className="form-control" min="0" placeholder="0"
              />
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Set to <strong style={{ color: 'var(--gold)' }}>0</strong> for free shipping on all orders
              </p>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Cash on Delivery</label>
              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                cursor: 'pointer', padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-lg)',
                background: settings.codEnabled ? 'rgba(201,168,76,0.08)' : 'var(--black-surface)',
                border: `1px solid ${settings.codEnabled ? 'var(--gold-dark)' : 'var(--black-border)'}`,
                transition: 'var(--transition)'
              }}>
                <input type="checkbox" name="codEnabled" checked={settings.codEnabled} onChange={handleChange} style={{ accentColor: 'var(--gold)', width: '18px', height: '18px', cursor: 'pointer' }} />
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.88rem', color: settings.codEnabled ? 'var(--gold)' : 'var(--text-secondary)' }}>
                    {settings.codEnabled ? 'COD Enabled' : 'COD Disabled'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Allow customers to pay on delivery</p>
                </div>
              </label>
            </div>
          </div>
        </Section>

        <Section icon={FiDroplet} title="Store Theme">
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Choose a colour theme for your storefront. Changes apply instantly after saving.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {[
              { id: 'midnight-gold',  label: 'Midnight Gold',   swatch: ['#c9a84c', '#8b6914', '#080808'] },
              { id: 'royal-emerald',  label: 'Royal Emerald',   swatch: ['#00b894', '#007a62', '#080808'] },
              { id: 'crimson-noir',   label: 'Crimson Noir',    swatch: ['#e11d48', '#9f1239', '#080808'] },
              { id: 'sapphire-luxe',  label: 'Sapphire Luxe',   swatch: ['#3b82f6', '#1d4ed8', '#080808'] },
              { id: 'rose-noir',      label: 'Rose Noir',       swatch: ['#d4967a', '#a05a40', '#080808'] },
              { id: 'amethyst-dark',  label: 'Amethyst Dark',   swatch: ['#8b5cf6', '#6d28d9', '#080808'] },
              { id: 'ivory-light',    label: 'Ivory Light',     swatch: ['#a07820', '#c09030', '#f5f0e8'] },
              { id: 'onyx-black',     label: 'Onyx Black',      swatch: ['#f0c040', '#c09020', '#000000'] },
              { id: 'white-gold',     label: 'White & Gold',    swatch: ['#b8860b', '#7a5608', '#ffffff'] },
              { id: 'clean-white',    label: 'Clean White',     swatch: ['#8b7355', '#5a4838', '#ffffff'] },
            ].map(t => {
              const active = settings.theme === t.id;
              return (
                <button
                  key={t.id} type="button"
                  onClick={() => {
                    setSettings(prev => ({ ...prev, theme: t.id }));
                  }}
                  style={{
                    background: active ? 'rgba(var(--accent-rgb),0.08)' : 'var(--black-surface)',
                    border: `2px solid ${active ? 'var(--gold)' : 'var(--black-border)'}`,
                    borderRadius: 'var(--radius-lg)', padding: '0.9rem 0.75rem',
                    cursor: 'pointer', transition: 'var(--transition)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
                    boxShadow: active ? 'var(--shadow-gold)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {t.swatch.map((c, i) => (
                      <div key={i} style={{ width: i === 2 ? 14 : 20, height: 20, borderRadius: '3px', background: c, border: '1px solid rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: active ? 600 : 400, color: active ? 'var(--gold)' : 'var(--text-secondary)', letterSpacing: '0.03em' }}>
                    {t.label}
                  </span>
                  {active && <span style={{ fontSize: '0.6rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Active</span>}
                </button>
              );
            })}
          </div>
        </Section>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            <FiSave size={15} /> {saving ? 'Saving…' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
