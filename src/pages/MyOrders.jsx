import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPackage, FiChevronDown, FiChevronUp, FiMapPin,
  FiShoppingBag, FiClock, FiCheckCircle
} from 'react-icons/fi';
import API from '../utils/api';
import { getImageUrl } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

/* ─── Status config ─── */
const STATUS_STEPS = [
  { key: 'placed',     label: 'Placed',     sub: 'Order received',          icon: '📋' },
  { key: 'confirmed',  label: 'Confirmed',  sub: 'Order is confirmed',      icon: '✅' },
  { key: 'processing', label: 'Processing', sub: 'Being prepared',          icon: '⚙️' },
  { key: 'shipped',    label: 'Shipped',    sub: 'On its way to you',       icon: '🚚' },
  { key: 'delivered',  label: 'Delivered',  sub: 'Enjoy your fragrance!',   icon: '🎉' },
];
const STATUS_ORDER = STATUS_STEPS.map(s => s.key);

const STATUS_COLOR = {
  placed: '#3b82f6', confirmed: '#10b981', processing: '#f59e0b',
  shipped: '#8b5cf6', delivered: '#22c55e', cancelled: '#ef4444'
};

/* ─── Timeline (horizontal desktop, vertical mobile) ─── */
function StatusTimeline({ status }) {
  if (status === 'cancelled') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '1rem 1.25rem', background: 'rgba(239,68,68,0.06)',
        border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-lg)'
      }}>
        <span style={{ fontSize: '1.5rem' }}>✕</span>
        <div>
          <p style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>Order Cancelled</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Contact support if you need assistance</p>
        </div>
      </div>
    );
  }

  const currentIdx = Math.max(STATUS_ORDER.indexOf(status), 0);
  const fillPct = (currentIdx / (STATUS_STEPS.length - 1)) * 80;

  return (
    <>
      {/* ── Horizontal (desktop) ── */}
      <div className="tl-h" style={{ padding: '1rem 0 0.5rem', position: 'relative' }}>
        {/* gray track */}
        <div style={{ position: 'absolute', top: '1.85rem', left: '10%', right: '10%', height: '2px', background: 'var(--black-border)', zIndex: 0 }} />
        {/* gold fill */}
        <div style={{ position: 'absolute', top: '1.85rem', left: '10%', height: '2px', background: 'var(--gold)', width: `${fillPct}%`, zIndex: 1, transition: 'width 0.6s ease' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
          {STATUS_STEPS.map((step, i) => {
            const done = i < currentIdx;
            const current = i === currentIdx;
            return (
              <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%', textAlign: 'center', gap: '0.4rem' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: done ? 'var(--gold)' : current ? 'rgba(var(--accent-rgb),0.15)' : 'var(--black-card)',
                  border: `2px solid ${(done || current) ? 'var(--gold)' : 'var(--black-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: done ? '0.85rem' : '0.75rem',
                  color: done ? 'var(--black)' : current ? 'var(--gold)' : 'var(--text-muted)',
                  fontWeight: 700,
                  boxShadow: current ? '0 0 14px rgba(var(--accent-rgb),0.4)' : 'none',
                  transition: 'all 0.3s'
                }}>
                  {done ? '✓' : step.icon}
                </div>
                <p style={{ fontSize: '0.65rem', fontWeight: current ? 700 : 400, color: (done || current) ? 'var(--gold)' : 'var(--text-muted)', lineHeight: 1.3 }}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Vertical (mobile) ── */}
      <div className="tl-v" style={{ display: 'none', flexDirection: 'column', gap: 0, padding: '0.5rem 0' }}>
        {STATUS_STEPS.map((step, i) => {
          const done = i < currentIdx;
          const current = i === currentIdx;
          return (
            <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', paddingBottom: i < STATUS_STEPS.length - 1 ? '1rem' : 0, position: 'relative' }}>
              {/* Connector line */}
              {i < STATUS_STEPS.length - 1 && (
                <div style={{
                  position: 'absolute', left: '15px', top: '32px', width: '2px',
                  height: 'calc(100% - 8px)',
                  background: done ? 'var(--gold)' : 'var(--black-border)'
                }} />
              )}
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: done ? 'var(--gold)' : current ? 'rgba(var(--accent-rgb),0.15)' : 'var(--black-card)',
                border: `2px solid ${(done || current) ? 'var(--gold)' : 'var(--black-border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem',
                color: done ? 'var(--black)' : current ? 'var(--gold)' : 'var(--text-muted)',
                fontWeight: 700,
                boxShadow: current ? '0 0 12px rgba(var(--accent-rgb),0.4)' : 'none',
                zIndex: 1
              }}>
                {done ? '✓' : step.icon}
              </div>
              <div style={{ paddingTop: '4px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: current ? 700 : 500, color: (done || current) ? 'var(--gold)' : 'var(--text-muted)' }}>
                  {step.label}
                </p>
                {current && <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{step.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 540px) {
          .tl-h { display: none !important; }
          .tl-v { display: flex !important; }
        }
      `}</style>
    </>
  );
}

/* ─── Order Card ─── */
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const color = STATUS_COLOR[order.orderStatus] || 'var(--gold)';
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div style={{
      background: 'var(--black-card)', border: '1px solid var(--black-border)',
      borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '1rem',
      transition: 'border-color 0.2s'
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb),0.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--black-border)'}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(p => !p)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '1.25rem 1.5rem', textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          {/* Left: meta */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.15rem' }}>Order ID</p>
              <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.04em' }}>{order.orderId}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.15rem' }}>Placed On</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.15rem' }}>Items</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{itemCount} item{itemCount > 1 ? 's' : ''}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.15rem' }}>Total</p>
              <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.88rem' }}>₹{order.total?.toLocaleString()}</p>
            </div>
          </div>
          {/* Right: status + chevron */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              padding: '3px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600,
              background: `${color}18`, color, border: `1px solid ${color}40`,
              textTransform: 'capitalize'
            }}>
              {order.orderStatus === 'delivered' && <FiCheckCircle size={11} />}
              {order.orderStatus === 'shipped' && '🚚 '}
              {order.orderStatus}
            </span>
            <div style={{ color: 'var(--text-muted)' }}>
              {expanded ? <FiChevronUp size={17} /> : <FiChevronDown size={17} />}
            </div>
          </div>
        </div>

        {/* Item thumbnails preview */}
        {!expanded && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.875rem', alignItems: 'center' }}>
            {order.items.slice(0, 4).map((item, i) => (
              <img
                key={i}
                src={getImageUrl(item.image)} alt={item.name}
                style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--black-border)' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
            ))}
            {order.items.length > 4 && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>+{order.items.length - 4} more</span>
            )}
          </div>
        )}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--black-border)', padding: '1.5rem' }}>

          {/* Timeline */}
          <div style={{ marginBottom: '1.75rem' }}>
            <p style={{ fontSize: '0.68rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FiClock size={12} /> Order Progress
            </p>
            <StatusTimeline status={order.orderStatus} />
          </div>

          {/* Items */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.875rem' }}>Items Ordered</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                  <img
                    src={getImageUrl(item.image)} alt={item.name}
                    style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: 'var(--radius)', flexShrink: 0, border: '1px solid var(--black-border)' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>{item.name}</p>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {/* Delivery address */}
            <div style={{ background: 'var(--black-surface)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FiMapPin size={11} /> Delivery Address
              </p>
              <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{order.customerInfo.name}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.6 }}>
                {order.customerInfo.address}<br />
                {order.customerInfo.city}, {order.customerInfo.state}<br />
                {order.customerInfo.pincode}
              </p>
            </div>

            {/* Payment summary */}
            <div style={{ background: 'var(--black-surface)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Payment</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'capitalize' }}>
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}
              </p>
              {order.discount > 0 && (
                <p style={{ fontSize: '0.78rem', color: '#22c55e', marginBottom: '0.25rem' }}>
                  Saved ₹{order.discount?.toLocaleString()} {order.couponCode && `(${order.couponCode})`}
                </p>
              )}
              {order.shippingCharge > 0 && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Shipping ₹{order.shippingCharge?.toLocaleString()}
                </p>
              )}
              <div style={{ borderTop: '1px solid var(--black-border)', paddingTop: '0.5rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Total</span>
                <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.95rem' }}>₹{order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/api/orders/my')
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);
  const statusCounts = orders.reduce((acc, o) => { acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1; return acc; }, {});

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh' }}>

      {/* ─── Header ─── */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0800, #1a1200, #0a0800)',
        padding: '3.5rem 0 3rem', borderBottom: '1px solid var(--black-border)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(var(--accent-rgb),0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <p className="section-label" style={{ marginBottom: '0.5rem' }}>My Account</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', marginBottom: '0.5rem' }}>
            My Orders
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {orders.length > 0 ? `${orders.length} order${orders.length > 1 ? 's' : ''} placed` : 'Your order history'}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '860px' }}>
        {loading ? (
          <div style={{ padding: '4rem 0' }}><LoadingSpinner /></div>
        ) : orders.length === 0 ? (
          /* ─── Empty state ─── */
          <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <FiPackage size={56} color="var(--text-muted)" style={{ marginBottom: '1.5rem', opacity: 0.4 }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '0.75rem', fontSize: '1.5rem' }}>
              No orders yet
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', maxWidth: '380px', margin: '0 auto 2rem', fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>
              Your fragrance journey begins with a single bottle. Explore our collection.
            </p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              <FiShoppingBag size={16} /> Shop Now
            </Link>
          </div>
        ) : (
          <>
            {/* ─── Filter tabs ─── */}
            <div style={{
              display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
              marginBottom: '1.75rem', padding: '4px',
              background: 'var(--black-surface)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--black-border)', width: 'fit-content'
            }}>
              {[
                { key: 'all', label: 'All' },
                { key: 'placed', label: 'Placed' },
                { key: 'processing', label: 'Processing' },
                { key: 'shipped', label: 'Shipped' },
                { key: 'delivered', label: 'Delivered' },
                { key: 'cancelled', label: 'Cancelled' },
              ].filter(t => t.key === 'all' || statusCounts[t.key]).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  style={{
                    padding: '0.45rem 0.875rem', border: 'none', cursor: 'pointer',
                    borderRadius: 'calc(var(--radius-lg) - 3px)', fontSize: '0.78rem', fontWeight: 500,
                    transition: 'var(--transition)',
                    background: filter === tab.key ? 'var(--gold)' : 'transparent',
                    color: filter === tab.key ? 'var(--black)' : 'var(--text-secondary)'
                  }}
                >
                  {tab.label}
                  {tab.key !== 'all' && statusCounts[tab.key] && (
                    <span style={{ marginLeft: '0.35rem', opacity: 0.7 }}>({statusCounts[tab.key]})</span>
                  )}
                  {tab.key === 'all' && (
                    <span style={{ marginLeft: '0.35rem', opacity: 0.7 }}>({orders.length})</span>
                  )}
                </button>
              ))}
            </div>

            {/* ─── Orders list ─── */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No {filter} orders
              </div>
            ) : (
              filtered.map(order => <OrderCard key={order._id} order={order} />)
            )}
          </>
        )}
      </div>
    </div>
  );
}
