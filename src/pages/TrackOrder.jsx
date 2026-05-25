import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch, FiPhone, FiHash, FiPackage, FiChevronDown, FiChevronUp,
  FiMapPin, FiShoppingBag, FiX
} from 'react-icons/fi';
import API from '../utils/api';
import { getImageUrl } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

/* ─── Status config ─── */
const STATUS_STEPS = [
  { key: 'placed',     label: 'Order Placed',  sub: 'We received your order',      icon: '📋' },
  { key: 'confirmed',  label: 'Confirmed',      sub: 'Your order is confirmed',     icon: '✅' },
  { key: 'processing', label: 'Processing',     sub: 'Being carefully prepared',    icon: '⚙️' },
  { key: 'shipped',    label: 'Shipped',        sub: 'On its way to you',           icon: '🚚' },
  { key: 'delivered',  label: 'Delivered',      sub: 'Enjoy your fragrance!',       icon: '🎉' },
];
const STATUS_ORDER = STATUS_STEPS.map(s => s.key);

/* ─── Timeline ─── */
function StatusTimeline({ status }) {
  if (status === 'cancelled') {
    return (
      <div style={{
        textAlign: 'center', padding: '1.5rem 2rem',
        background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 'var(--radius-lg)', marginBottom: '1rem'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✕</div>
        <p style={{ color: '#ef4444', fontWeight: 700, fontSize: '1rem' }}>Order Cancelled</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
          This order has been cancelled. Contact us if you need help.
        </p>
      </div>
    );
  }

  const currentIdx = Math.max(STATUS_ORDER.indexOf(status), 0);
  const fillPct = (currentIdx / (STATUS_STEPS.length - 1)) * 80;

  return (
    <div style={{ padding: '1.25rem 0 0.5rem', position: 'relative' }}>
      {/* gray connector */}
      <div style={{
        position: 'absolute', top: '2.6rem', left: '10%', right: '10%',
        height: '2px', background: 'var(--black-border)', zIndex: 0
      }} />
      {/* gold fill */}
      <div style={{
        position: 'absolute', top: '2.6rem', left: '10%',
        height: '2px', background: 'var(--gold)',
        width: `${fillPct}%`, zIndex: 1, transition: 'width 0.6s ease'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
        {STATUS_STEPS.map((step, i) => {
          const done = i < currentIdx;
          const current = i === currentIdx;
          return (
            <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%', textAlign: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: done ? 'var(--gold)' : current ? 'rgba(var(--accent-rgb),0.15)' : 'var(--black-card)',
                border: `2px solid ${(done || current) ? 'var(--gold)' : 'var(--black-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: done ? '1rem' : '0.8rem',
                color: done ? 'var(--black)' : current ? 'var(--gold)' : 'var(--text-muted)',
                fontWeight: 700,
                boxShadow: current ? '0 0 16px rgba(var(--accent-rgb),0.4)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                {done ? '✓' : step.icon}
              </div>
              <p style={{
                fontSize: '0.68rem', fontWeight: current ? 700 : 400,
                color: (done || current) ? 'var(--gold)' : 'var(--text-muted)',
                lineHeight: 1.3
              }}>{step.label}</p>
              {current && (
                <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', lineHeight: 1.3, maxWidth: '70px' }}>
                  {step.sub}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 560px) {
          .timeline-steps { flex-direction: column !important; gap: 0 !important; }
          .timeline-steps > div { flex-direction: row !important; width: 100% !important; text-align: left !important; align-items: center !important; gap: 0.75rem !important; padding: 0.5rem 0; }
          .timeline-connector-h { display: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── Single Order Card ─── */
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = {
    placed: '#3b82f6', confirmed: '#10b981', processing: '#f59e0b',
    shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444'
  }[order.orderStatus] || 'var(--gold)';

  return (
    <div style={{
      background: 'var(--black-card)', border: '1px solid var(--black-border)',
      borderRadius: 'var(--radius-xl)', overflow: 'hidden',
      marginBottom: '1rem', transition: 'var(--transition)'
    }}>
      {/* Card header */}
      <button
        onClick={() => setExpanded(p => !p)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', flex: 1 }}>
          <div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Order ID</p>
            <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.05em' }}>{order.orderId}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Date</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Total</p>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>₹{order.total?.toLocaleString()}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Status</p>
            <span style={{
              display: 'inline-block', padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600,
              background: `${statusColor}18`, color: statusColor,
              border: `1px solid ${statusColor}40`, textTransform: 'capitalize'
            }}>
              {order.orderStatus}
            </span>
          </div>
        </div>
        <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          {expanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--black-border)', padding: '1.5rem' }}>
          {/* Status timeline */}
          <div style={{ marginBottom: '1.75rem' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>Order Progress</p>
            <StatusTimeline status={order.orderStatus} />
          </div>

          {/* Items */}
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>Items</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                  <img
                    src={getImageUrl(item.image)} alt={item.name}
                    style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius)', flexShrink: 0 }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.15rem' }}>{item.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {item.type} · {item.ml}ml × {item.quantity}
                    </p>
                  </div>
                  <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem', flexShrink: 0 }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery address */}
          <div style={{
            background: 'var(--black-surface)', border: '1px solid var(--black-border)',
            borderRadius: 'var(--radius-lg)', padding: '1rem', marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <FiMapPin size={14} color="var(--gold)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.2rem' }}>{order.customerInfo.name}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  {order.customerInfo.address}, {order.customerInfo.city},<br />
                  {order.customerInfo.state} — {order.customerInfo.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Price summary */}
          <div style={{ borderTop: '1px solid var(--black-border)', paddingTop: '1rem' }}>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Discount {order.couponCode && `(${order.couponCode})`}</span>
                <span style={{ color: '#22c55e' }}>−₹{order.discount?.toLocaleString()}</span>
              </div>
            )}
            {order.shippingCharge > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span>₹{order.shippingCharge?.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>
                ₹{order.total?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function TrackOrder() {
  const [mode, setMode] = useState('id');
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setOrders(null);
    try {
      if (mode === 'id') {
        const { data } = await API.get(`/api/orders/track/${query.trim()}`);
        setOrders([data]);
      } else {
        const { data } = await API.get(`/api/orders/track-phone/${query.trim()}`);
        setOrders(Array.isArray(data) ? data : [data]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No orders found. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setOrders(null); setError(''); setQuery(''); };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh' }}>

      {/* ─── Hero ─── */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0800, #1a1200, #0a0800)',
        padding: '4rem 0 3.5rem', textAlign: 'center',
        borderBottom: '1px solid var(--black-border)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(var(--accent-rgb),0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div className="ornament" style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>✦</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', marginBottom: '0.75rem' }}>
            Track Your Order
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-accent)', fontSize: '1rem', fontStyle: 'italic', maxWidth: '460px', margin: '0 auto' }}>
            Enter your Order ID or the phone number you placed the order with
          </p>
        </div>
      </div>

      {/* ─── Search ─── */}
      <div className="container" style={{ maxWidth: '640px', padding: '3rem 1.5rem' }}>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', gap: '0', marginBottom: '1.5rem',
          background: 'var(--black-surface)', borderRadius: 'var(--radius-lg)',
          padding: '4px', border: '1px solid var(--black-border)'
        }}>
          {[
            { key: 'id',    icon: FiHash,  label: 'Order ID' },
            { key: 'phone', icon: FiPhone, label: 'Phone Number' }
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => { setMode(key); reset(); }}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem', padding: '0.65rem 1rem', borderRadius: 'calc(var(--radius-lg) - 3px)',
                border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
                transition: 'var(--transition)',
                background: mode === key ? 'var(--gold)' : 'transparent',
                color: mode === key ? 'var(--black)' : 'var(--text-secondary)'
              }}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="form-control"
              placeholder={mode === 'id' ? 'e.g. SAL-1234567890-0001' : 'e.g. 9876543210'}
              style={{ flex: 1, fontSize: '0.9rem' }}
              autoFocus
            />
            {query && (
              <button type="button" onClick={reset} style={{ background: 'none', border: '1px solid var(--black-border)', borderRadius: 'var(--radius)', padding: '0 0.75rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <FiX size={16} />
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading || !query.trim()} style={{ whiteSpace: 'nowrap' }}>
              <FiSearch size={15} /> {loading ? 'Searching…' : 'Track'}
            </button>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', paddingLeft: '0.25rem' }}>
            {mode === 'id'
              ? 'Find your Order ID in your confirmation email or SMS'
              : 'Use the exact mobile number you entered at checkout'}
          </p>
        </form>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <LoadingSpinner />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            marginTop: '2rem', padding: '1.25rem 1.5rem',
            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 'var(--radius-lg)', textAlign: 'center'
          }}>
            <p style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 500 }}>{error}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
              Need help? <Link to="/contactus" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Contact us</Link>
            </p>
          </div>
        )}

        {/* Results */}
        {orders && !loading && (
          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {orders.length === 1 ? '1 order found' : `${orders.length} orders found`}
              </p>
              <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FiX size={13} /> Clear
              </button>
            </div>
            {orders.map(order => <OrderCard key={order._id} order={order} />)}
          </div>
        )}

        {/* Empty state / CTA for guests */}
        {!orders && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '3rem 0', borderTop: '1px solid var(--black-border)', marginTop: '3rem' }}>
            <FiPackage size={36} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Have an account? View all your orders in one place.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/login" className="btn btn-outline btn-sm">Login to My Account</Link>
              <Link to="/shop" className="btn btn-ghost btn-sm"><FiShoppingBag size={13} /> Browse Shop</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
