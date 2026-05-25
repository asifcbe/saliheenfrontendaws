import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/api';

export default function CartSidebar() {
  const { items, removeItem, updateQty, subtotal, isOpen, setIsOpen, itemCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {isOpen && (
        <div onClick={() => setIsOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1100,
          backdropFilter: 'blur(4px)'
        }} />
      )}
      <div style={{
        position: 'fixed', top: 0, right: isOpen ? 0 : '-100%', bottom: 0, zIndex: 1200,
        width: '100%', maxWidth: '420px',
        background: 'var(--black-rich)',
        borderLeft: '1px solid var(--black-border)',
        display: 'flex', flexDirection: 'column',
        transition: 'right 0.35s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--black-border)',
          background: 'linear-gradient(90deg, var(--black-surface), var(--black-rich))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FiShoppingBag color="var(--gold)" size={20} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1.1rem' }}>
              Your Cart
            </h3>
            {itemCount > 0 && (
              <span className="badge badge-gold">{itemCount}</span>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', padding: '4px'
          }}>
            <FiX size={22} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <FiShoppingBag size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p style={{ fontFamily: 'var(--font-accent)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.85rem' }}>Add some fragrances to get started</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => (
                <div key={item.key} style={{
                  display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  background: 'var(--black-card)', borderRadius: 'var(--radius)',
                  padding: '0.9rem', border: '1px solid var(--black-border)'
                }}>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--black-border)' }}
                    onError={e => e.target.src = 'https://via.placeholder.com/60x60?text=🌸'}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                      {item.type} • {item.ml}ml
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="qty-control" style={{ transform: 'scale(0.85)', transformOrigin: 'left' }}>
                        <button onClick={() => updateQty(item.key, item.quantity - 1)}>−</button>
                        <span style={{ padding: '0 8px', minWidth: '32px' }}>{item.quantity}</span>
                        <button onClick={() => updateQty(item.key, item.quantity + 1)}>+</button>
                      </div>
                      <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem' }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.key)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: '2px', flexShrink: 0
                  }}>
                    <FiTrash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--black-border)', background: 'var(--black-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Subtotal</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem' }}>
                ₹{subtotal.toLocaleString()}
              </span>
            </div>
            <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
