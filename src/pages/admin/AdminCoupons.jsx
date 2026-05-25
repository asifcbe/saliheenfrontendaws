import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiClock, FiTag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import API from '../../utils/api';

const emptyForm = {
  code: '', description: '', discountType: 'percentage',
  discountValue: '', minOrderAmount: 0, maxDiscount: '',
  expiryDate: '', isActive: true, showOnCheckout: false, usageLimit: ''
};

const isExpired = (date) => new Date(date) < new Date();

const getTimeLeft = (date) => {
  const diff = new Date(date) - new Date();
  if (diff <= 0) return 'Expired';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  return d > 0 ? `${d}d ${h}h left` : `${h}h left`;
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = useCallback(() => {
    setLoading(true);
    API.get('/api/coupons')
      .then(({ data }) => setCoupons(data))
      .catch(() => toast.error('Failed to load coupons'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const openCreate = useCallback(() => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  }, []);

  const openEdit = useCallback((c) => {
    setEditing(c._id);
    setForm({
      ...c,
      expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().slice(0, 16) : '',
      maxDiscount: c.maxDiscount ?? '',
      usageLimit: c.usageLimit ?? ''
    });
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => setShowForm(false), []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);

  const handleCodeChange = useCallback((e) => {
    setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.discountValue || Number(form.discountValue) <= 0) {
      return toast.error('Discount value must be greater than 0');
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0
      };
      if (form.maxDiscount) payload.maxDiscount = Number(form.maxDiscount);
      else delete payload.maxDiscount;
      if (form.usageLimit) payload.usageLimit = Number(form.usageLimit);
      else delete payload.usageLimit;

      if (editing) await API.put(`/api/coupons/${editing}`, payload);
      else await API.post('/api/coupons', payload);

      toast.success(editing ? 'Coupon updated' : 'Coupon created');
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await API.delete(`/api/coupons/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  }, [fetchCoupons]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1.8rem', marginBottom: '0.2rem' }}>Coupons</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{coupons.length} coupon{coupons.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary btn-sm">
          <FiPlus size={14} /> Add Coupon
        </button>
      </div>

      {loading ? (
        <div className="loading-overlay"><div className="spinner" /></div>
      ) : coupons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-xl)', color: 'var(--text-muted)' }}>
          <FiTag size={48} style={{ marginBottom: '1rem', opacity: 0.25 }} />
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>No coupons yet</p>
          <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Create discount codes to offer deals to your customers.</p>
          <button onClick={openCreate} className="btn btn-primary"><FiPlus size={14} /> Create First Coupon</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' }}>
          {coupons.map(c => {
            const expired = isExpired(c.expiryDate);
            const inactive = !c.isActive;
            return (
              <div key={c._id} style={{
                background: 'var(--black-card)',
                border: `1px solid ${expired || inactive ? 'var(--black-border)' : 'rgba(201,168,76,0.25)'}`,
                borderRadius: 'var(--radius-xl)', padding: '1.25rem',
                opacity: expired || inactive ? 0.6 : 1,
                transition: 'var(--transition)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-bright)', fontSize: '1.15rem', letterSpacing: '0.12em' }}>{c.code}</p>
                    {c.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{c.description}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button onClick={() => openEdit(c)} className="btn btn-ghost btn-sm" style={{ padding: '0.35rem' }} title="Edit"><FiEdit2 size={13} /></button>
                    <button onClick={() => handleDelete(c._id)} className="btn btn-danger btn-sm" style={{ padding: '0.35rem' }} title="Delete"><FiTrash2 size={13} /></button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                  <span className="badge badge-gold">
                    {c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                  </span>
                  {c.showOnCheckout && <span className="badge badge-info">Shown at checkout</span>}
                  {expired && <span className="badge badge-danger">Expired</span>}
                  {!expired && inactive && <span className="badge badge-danger">Inactive</span>}
                  {!expired && !inactive && <span className="badge badge-success">Active</span>}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {c.minOrderAmount > 0 && <span>Min order: ₹{c.minOrderAmount.toLocaleString()}</span>}
                  {c.maxDiscount && <span>Max discount: ₹{c.maxDiscount.toLocaleString()}</span>}
                  {c.usageLimit ? (
                    <span>Used: {c.usedCount}/{c.usageLimit}</span>
                  ) : (
                    c.usedCount > 0 && <span>Used: {c.usedCount} times</span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: expired ? 'var(--danger)' : 'var(--text-secondary)' }}>
                    <FiClock size={11} />
                    {expired ? 'Expired' : getTimeLeft(c.expiryDate)} — {new Date(c.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <span className="modal-title">
                <FiTag size={16} /> {editing ? 'Edit Coupon' : 'Create Coupon'}
              </span>
              <button onClick={closeForm} className="modal-close"><FiX size={18} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="input-row input-row-2">
                <div className="form-group">
                  <label className="form-label">Coupon Code *</label>
                  <input
                    name="code"
                    value={form.code}
                    onChange={handleCodeChange}
                    className="form-control"
                    placeholder="SAVE20"
                    required
                    disabled={!!editing}
                    style={{ letterSpacing: '0.1em', fontWeight: 600 }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Type *</label>
                  <select name="discountType" value={form.discountType} onChange={handleChange} className="form-control">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Value *</label>
                  <input
                    type="number" name="discountValue" value={form.discountValue}
                    onChange={handleChange} className="form-control" required min="1"
                    placeholder={form.discountType === 'percentage' ? '20' : '100'}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Min Order Amount (₹)</label>
                  <input
                    type="number" name="minOrderAmount" value={form.minOrderAmount}
                    onChange={handleChange} className="form-control" min="0" placeholder="0"
                  />
                </div>
                {form.discountType === 'percentage' && (
                  <div className="form-group">
                    <label className="form-label">Max Discount Cap (₹)</label>
                    <input
                      type="number" name="maxDiscount" value={form.maxDiscount}
                      onChange={handleChange} className="form-control" min="0" placeholder="Optional"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Usage Limit</label>
                  <input
                    type="number" name="usageLimit" value={form.usageLimit}
                    onChange={handleChange} className="form-control" min="0" placeholder="Unlimited"
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Expiry Date & Time *</label>
                  <input
                    type="datetime-local" name="expiryDate" value={form.expiryDate}
                    onChange={handleChange} className="form-control" required
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description</label>
                  <input
                    name="description" value={form.description}
                    onChange={handleChange} className="form-control"
                    placeholder="e.g. 20% off on orders above ₹500"
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '2rem', paddingTop: '0.25rem' }}>
                  {[
                    { name: 'isActive', label: 'Active' },
                    { name: 'showOnCheckout', label: 'Show on Checkout' }
                  ].map(f => (
                    <label key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <input
                        type="checkbox" name={f.name} checked={form[f.name]}
                        onChange={handleChange}
                        style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }}
                      />
                      {f.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={closeForm} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
