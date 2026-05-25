import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiImage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import { getImageUrl } from '../../utils/api';

const emptyForm = { name: '', description: '', type: 'perfume', category: '', featured: false, isActive: true, tags: '', variants: [{ ml: 3, price: '', stock: 0 }] };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    API.get('/api/products/admin/all').then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  };

  useEffect(fetch, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImages([]); setExistingImages([]); setShowForm(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, description: p.description, type: p.type, category: p.category || '', featured: p.featured, isActive: p.isActive, tags: (p.tags || []).join(', '), variants: p.variants?.length ? p.variants : [{ ml: 3, price: '', stock: 0 }] });
    setImages([]);
    setExistingImages(p.images || []);
    setShowForm(true);
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const updateVariant = (i, field, val) => {
    const v = [...form.variants];
    v[i] = { ...v[i], [field]: field === 'ml' || field === 'price' || field === 'stock' ? Number(val) : val };
    setForm(f => ({ ...f, variants: v }));
  };

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { ml: '', price: '', stock: 0 }] }));
  const removeVariant = (i) => setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.variants.length || form.variants.some(v => !v.ml || !v.price)) return toast.error('Add at least one valid variant');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'variants') fd.append(k, JSON.stringify(v));
        else if (k === 'tags') fd.append(k, JSON.stringify(v.split(',').map(t => t.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      if (editing) fd.append('existingImages', JSON.stringify(existingImages));
      images.forEach(img => fd.append('images', img));
      if (editing) await API.put(`/api/products/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await API.post('/api/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(editing ? 'Product updated' : 'Product created');
      setShowForm(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/api/products/${id}`);
      toast.success('Product deleted');
      fetch();
    } catch { toast.error('Delete failed'); }
  };

  const removeExistingImage = (url) => setExistingImages(imgs => imgs.filter(i => i !== url));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1.8rem' }}>Products</h1>
        <button onClick={openCreate} className="btn btn-primary btn-sm"><FiPlus size={16} /> Add Product</button>
      </div>

      {loading ? <div className="loading-overlay"><div className="spinner" /></div> : (
        <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--black-surface)', borderBottom: '1px solid var(--black-border)' }}>
                  {['Image', 'Name', 'Type', 'Variants', 'Featured', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} style={{ borderBottom: '1px solid var(--black-border)' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <img src={getImageUrl(p.images?.[0])} alt={p.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--black-border)' }} onError={e => e.target.src='https://via.placeholder.com/44?text=🌸'} />
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>{p.type}</span></td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                      {p.variants?.map(v => `${v.ml}ml`).join(', ')}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      {p.featured ? <span className="badge badge-gold">Yes</span> : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => openEdit(p)} className="btn btn-ghost btn-sm" style={{ padding: '0.4rem' }}><FiEdit2 size={14} /></button>
                        <button onClick={() => handleDelete(p._id)} className="btn btn-danger btn-sm" style={{ padding: '0.4rem' }}><FiTrash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>No products yet. Add your first product!</p>}
          </div>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', padding: '2rem', overflowY: 'auto' }}>
          <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '700px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1.3rem' }}>{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><FiX size={20} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Product Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows={3} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select name="type" value={form.type} onChange={handleChange} className="form-control">
                    <option value="perfume">Perfume</option>
                    <option value="attar">Attar</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input name="category" value={form.category} onChange={handleChange} className="form-control" placeholder="e.g. Floral, Woody..." />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Tags (comma-separated)</label>
                  <input name="tags" value={form.tags} onChange={handleChange} className="form-control" placeholder="oud, rose, musk..." />
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }} />
                    Featured Product
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }} />
                    Active (visible on store)
                  </label>
                </div>
              </div>

              {/* Variants */}
              <div style={{ margin: '1.25rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Variants (ML & Price) *</label>
                  <button type="button" onClick={addVariant} className="btn btn-ghost btn-sm"><FiPlus size={13} /> Add Size</button>
                </div>
                {form.variants.map((v, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <input type="number" value={v.ml} onChange={e => updateVariant(i, 'ml', e.target.value)} className="form-control" placeholder="ML" min="1" />
                      <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.8rem', pointerEvents: 'none' }}>ml</span>
                    </div>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>₹</span>
                      <input type="number" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} className="form-control" style={{ paddingLeft: '1.75rem' }} placeholder="Price" min="0" />
                    </div>
                    <input type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} className="form-control" style={{ flex: 1 }} placeholder="Stock" min="0" />
                    {form.variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}><FiX size={16} /></button>
                    )}
                  </div>
                ))}
              </div>

              {/* Images */}
              <div className="form-group">
                <label className="form-label"><FiImage size={13} style={{ marginRight: '0.3rem' }} /> Product Images</label>
                {existingImages.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {existingImages.map(img => (
                      <div key={img} style={{ position: 'relative' }}>
                        <img src={getImageUrl(img)} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--black-border)' }} />
                        <button type="button" onClick={() => removeExistingImage(img)} style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--danger)', border: 'none', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files))} style={{ display: 'none' }} id="product-images" />
                <label htmlFor="product-images" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.6rem 1rem', background: 'var(--black-surface)', border: '1px dashed var(--black-border)', borderRadius: 'var(--radius)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <FiImage size={14} /> {images.length > 0 ? `${images.length} file(s) selected` : 'Upload Images'}
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
