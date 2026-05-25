import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingBag, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { getImageUrl } from '../utils/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMl, setSelectedMl] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { addItem } = useCart();

  useEffect(() => {
    API.get(`/api/products/${id}`)
      .then(({ data }) => {
        setProduct(data);
        setSelectedMl(data.variants?.[0]?.ml);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ paddingTop: '70px' }}><LoadingSpinner fullPage /></div>;
  if (!product) return (
    <div style={{ paddingTop: '70px', textAlign: 'center', padding: '5rem' }}>
      <h2 style={{ color: 'var(--gold)' }}>Product not found</h2>
      <Link to="/shop" className="btn btn-outline" style={{ marginTop: '1rem' }}>Back to Shop</Link>
    </div>
  );

  const selectedVariant = product.variants?.find(v => v.ml === selectedMl);

  const handleAddToCart = () => {
    if (!selectedVariant) return toast.error('Please select a size');
    for (let i = 0; i < quantity; i++) addItem(product, selectedMl);
    toast.success(`${product.name} (${selectedMl}ml × ${quantity}) added to cart`);
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.85rem' }}>
          <FiArrowLeft size={14} /> Back to Shop
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          {/* Images */}
          <div>
            <div style={{
              borderRadius: 'var(--radius-lg)', overflow: 'hidden',
              background: 'var(--black-surface)', border: '1px solid var(--black-border)',
              aspectRatio: '3/4', marginBottom: '1rem'
            }}>
              <img
                src={getImageUrl(product.images?.[activeImg])}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => e.target.src = 'https://via.placeholder.com/600x800?text=🌸'}
              />
            </div>
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{
                    width: '70px', height: '70px', flexShrink: 0,
                    borderRadius: 'var(--radius)', overflow: 'hidden',
                    border: `2px solid ${activeImg === i ? 'var(--gold)' : 'var(--black-border)'}`,
                    padding: 0, cursor: 'pointer', background: 'none'
                  }}>
                    <img src={getImageUrl(img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>{product.type}</span>
              {product.featured && <span className="badge" style={{ background: 'rgba(201,168,76,0.2)', color: 'var(--gold-bright)', border: '1px solid var(--gold)' }}>Featured</span>}
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--gold-pale)', marginBottom: '1rem' }}>
              {product.name}
            </h1>

            <div className="gold-divider" style={{ margin: '0 0 1.5rem', width: '40px' }} />

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem', fontFamily: 'var(--font-accent)', fontSize: '1.05rem' }}>
              {product.description}
            </p>

            {/* Type selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>
                Type
              </p>
              <span style={{
                display: 'inline-block', padding: '0.4rem 1.2rem',
                background: 'var(--gold-dark)', color: 'var(--gold-bright)',
                borderRadius: 'var(--radius)', fontSize: '0.85rem',
                border: '1px solid var(--gold)', textTransform: 'capitalize'
              }}>
                {product.type}
              </span>
            </div>

            {/* Size selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>
                Select Size
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.variants?.map(v => (
                  <button key={v.ml} onClick={() => setSelectedMl(v.ml)} style={{
                    padding: '0.5rem 1.2rem',
                    borderRadius: 'var(--radius)',
                    background: selectedMl === v.ml ? 'var(--gold-dark)' : 'var(--black-surface)',
                    border: `1px solid ${selectedMl === v.ml ? 'var(--gold)' : 'var(--black-border)'}`,
                    color: selectedMl === v.ml ? 'var(--gold-bright)' : 'var(--text-secondary)',
                    fontSize: '0.85rem', cursor: 'pointer', transition: 'var(--transition)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem', minWidth: '70px'
                  }}>
                    <span style={{ fontWeight: 600 }}>{v.ml}ml</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>₹{v.price.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--gold)', fontWeight: 700 }}>
                ₹{selectedVariant?.price?.toLocaleString() || '—'}
              </span>
              {selectedMl && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>for {selectedMl}ml</span>}
            </div>

            {/* Quantity + Add to Cart */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="qty-control">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><FiMinus size={14} /></button>
                <span style={{ padding: '0 16px' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}><FiPlus size={14} /></button>
              </div>
              <button onClick={handleAddToCart} className="btn btn-primary btn-lg" style={{ flex: 1, minWidth: '200px', justifyContent: 'center' }}>
                <FiShoppingBag size={18} /> Add to Cart
              </button>
            </div>

            {product.tags?.length > 0 && (
              <div style={{ marginTop: '2rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {product.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '0.2rem 0.75rem', borderRadius: '20px',
                    background: 'var(--black-surface)', border: '1px solid var(--black-border)',
                    color: 'var(--text-muted)', fontSize: '0.75rem'
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .product-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
