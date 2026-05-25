import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiMapPin, FiPhone, FiClock, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import API from '../../utils/api';

const emptyForm = {
  name: '', address: '', city: '', state: '',
  phone: '', email: '', timings: '',
  googleMapLink: '', isActive: true, isComingSoon: false, order: 0
};

export default function AdminBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchBranches = () => {
    API.get('/api/branches/admin/all')
      .then(({ data }) => setBranches(data))
      .catch(() => toast.error('Failed to load branches'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBranches(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (b) => {
    setEditing(b._id);
    setForm({
      name: b.name || '',
      address: b.address || '',
      city: b.city || '',
      state: b.state || '',
      phone: b.phone || '',
      email: b.email || '',
      timings: b.timings || '',
      googleMapLink: b.googleMapLink || '',
      isActive: b.isActive ?? true,
      isComingSoon: b.isComingSoon ?? false,
      order: b.order ?? 0
    });
    setShowForm(true);
  };

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) return toast.error('Name and address are required');
    setSaving(true);
    try {
      if (editing) {
        await API.put(`/api/branches/${editing}`, form);
        toast.success('Branch updated');
      } else {
        await API.post('/api/branches', form);
        toast.success('Branch added');
      }
      setShowForm(false);
      fetchBranches();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving branch');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this branch?')) return;
    try {
      await API.delete(`/api/branches/${id}`);
      toast.success('Branch deleted');
      fetchBranches();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1.8rem', marginBottom: '0.2rem' }}>Branches</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{branches.length} location{branches.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary btn-sm">
          <FiPlus size={14} /> Add Branch
        </button>
      </div>

      {loading ? (
        <div className="loading-overlay"><div className="spinner" /></div>
      ) : branches.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}>
          <FiMapPin size={48} style={{ marginBottom: '1rem', opacity: 0.25 }} />
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>No branches yet</p>
          <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Add your first store location to show it on the landing page timeline.</p>
          <button onClick={openCreate} className="btn btn-primary"><FiPlus size={14} /> Add First Branch</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {branches.map((b, idx) => (
            <div key={b._id} style={{
              background: 'var(--black-card)',
              border: `1px solid ${b.isComingSoon ? 'rgba(241,196,15,0.3)' : b.isActive ? 'rgba(201,168,76,0.2)' : 'var(--black-border)'}`,
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem',
              position: 'relative',
              opacity: b.isActive ? 1 : 0.55,
              transition: 'var(--transition)'
            }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.35rem' }}>
                <button onClick={() => openEdit(b)} className="btn btn-ghost btn-sm" style={{ padding: '0.35rem' }} title="Edit"><FiEdit2 size={13} /></button>
                <button onClick={() => handleDelete(b._id)} className="btn btn-danger btn-sm" style={{ padding: '0.35rem' }} title="Delete"><FiTrash2 size={13} /></button>
              </div>

              <div style={{ marginBottom: '0.75rem', paddingRight: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1rem' }}>{b.name}</h3>
                  {b.isComingSoon && <span className="badge badge-warning">Coming Soon</span>}
                  {!b.isActive && <span className="badge badge-danger">Inactive</span>}
                  {b.isActive && !b.isComingSoon && <span className="badge badge-success">Active</span>}
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Branch #{idx + 1}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <FiMapPin size={13} color="var(--gold)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {b.address}{b.city ? `, ${b.city}` : ''}{b.state ? `, ${b.state}` : ''}
                  </span>
                </div>
                {b.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiPhone size={12} color="var(--text-muted)" />
                    <a href={`tel:${b.phone}`} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>{b.phone}</a>
                  </div>
                )}
                {b.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiMail size={12} color="var(--text-muted)" />
                    <a href={`mailto:${b.email}`} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>{b.email}</a>
                  </div>
                )}
                {b.timings && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiClock size={12} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{b.timings}</span>
                  </div>
                )}
              </div>

              {b.googleMapLink && !b.isComingSoon && (
                <a href={b.googleMapLink} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: '0.9rem', display: 'inline-flex', gap: '0.3rem' }}>
                  <FiMapPin size={11} /> Open in Maps
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <span className="modal-title">
                <FiMapPin size={16} /> {editing ? 'Edit Branch' : 'Add New Branch'}
              </span>
              <button onClick={() => setShowForm(false)} className="modal-close"><FiX size={18} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Branch Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="form-control" placeholder="e.g. Saliheen Main Store" required />
              </div>

              <div className="form-group">
                <label className="form-label">Address *</label>
                <textarea name="address" value={form.address} onChange={handleChange} className="form-control" rows={2} placeholder="Full address including street, building" required />
              </div>

              <div className="input-row input-row-2">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input name="city" value={form.city} onChange={handleChange} className="form-control" placeholder="Coimbatore" />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input name="state" value={form.state} onChange={handleChange} className="form-control" placeholder="Tamil Nadu" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="form-control" placeholder="+91 98765 43210" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="branch@saliheen.com" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Timings</label>
                <input name="timings" value={form.timings} onChange={handleChange} className="form-control" placeholder="Mon–Sat: 10 AM – 9 PM, Sun: 11 AM – 7 PM" />
              </div>

              <div className="form-group">
                <label className="form-label">Google Maps Link</label>
                <input name="googleMapLink" value={form.googleMapLink} onChange={handleChange} className="form-control" placeholder="https://maps.app.goo.gl/..." />
              </div>

              <div className="input-row input-row-2" style={{ marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Display Order</label>
                  <input type="number" name="order" value={form.order} onChange={handleChange} className="form-control" min="0" placeholder="0 = first" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center', paddingTop: '1.5rem' }}>
                  {[{ name: 'isActive', label: 'Branch is Active' }, { name: 'isComingSoon', label: 'Mark as Coming Soon' }].map(f => (
                    <label key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <input type="checkbox" name={f.name} checked={form[f.name]} onChange={handleChange} style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }} />
                      {f.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Update Branch' : 'Add Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
