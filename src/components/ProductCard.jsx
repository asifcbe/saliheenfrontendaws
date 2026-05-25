import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiEye } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/api';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [selectedMl, setSelectedMl] = useState(product.variants?.[0]?.ml);
  const selectedVariant = product.variants?.find(v => v.ml === selectedMl);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!selectedVariant) return;
    addItem(product, selectedMl);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="card product-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div className="card-image" style={{ position: 'relative', paddingTop: '120%', overflow: 'hidden', background: 'var(--black-surface)' }}>
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', transition: 'transform 0.5s ease'
            }}
            onError={e => e.target.src = 'https://via.placeholder.com/300x360?text=🌸'}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
          <div style={{
            position: 'absolute', top: '0.75rem', left: '0.75rem',
            display: 'flex', gap: '0.4rem', flexWrap: 'wrap'
          }}>
            <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>{product.type}</span>
            {product.featured && <span className="badge" style={{ background: 'rgba(201,168,76,0.3)', color: 'var(--gold-bright)', border: '1px solid var(--gold)' }}>Featured</span>}
          </div>
          <div style={{
            position: 'absolute', top: '0.75rem', right: '0.75rem'
          }}>
            <Link to={`/product/${product._id}`} style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)', border: '1px solid var(--black-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)', backdropFilter: 'blur(4px)'
            }}>
              <FiEye size={15} />
            </Link>
          </div>
        </div>
      </Link>

      <div className="card-body" style={{ padding: '1rem' }}>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)', fontSize: '1rem',
            color: 'var(--text-primary)', marginBottom: '0.5rem',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {product.name}
          </h3>
        </Link>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {product.variants?.map(v => (
            <button key={v.ml} onClick={() => setSelectedMl(v.ml)} className="variant-btn" style={{
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius)',
              background: selectedMl === v.ml ? 'var(--gold-dark)' : 'var(--black-surface)',
              border: `1px solid ${selectedMl === v.ml ? 'var(--gold)' : 'var(--black-border)'}`,
              color: selectedMl === v.ml ? 'var(--gold-bright)' : 'var(--text-muted)',
              fontSize: '0.75rem', cursor: 'pointer', transition: 'var(--transition)'
            }}>
              {v.ml}ml
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="price" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem' }}>
            ₹{selectedVariant?.price?.toLocaleString() || '—'}
          </span>
          <button onClick={handleAddToCart} className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
            <FiShoppingBag size={14} /> Add
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .product-card .card-image { padding-top: 90% !important; }
          .product-card { font-size: 0.82rem; }
          .product-card h3 { font-size: 0.85rem !important; margin-bottom: 0.35rem !important; }
          .product-card .card-body { padding: 0.65rem !important; }
          .product-card .variant-btn { padding: 0.18rem 0.45rem !important; font-size: 0.7rem !important; }
          .product-card .price { font-size: 0.95rem !important; }
        }
      `}</style>
    </div>
  );
}
