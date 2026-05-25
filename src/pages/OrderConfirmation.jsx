import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { FiCheckCircle, FiPrinter, FiShoppingBag } from 'react-icons/fi';
import API from '../utils/api';
import { getImageUrl } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef();

  useEffect(() => {
    API.get(`/api/orders/track/${orderId}`)
      .then(({ data }) => setOrder(data))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Order-${orderId}`
  });

  if (loading) return <div style={{ paddingTop: '70px' }}><LoadingSpinner fullPage /></div>;
  if (!order) return (
    <div style={{ paddingTop: '70px', textAlign: 'center', padding: '5rem' }}>
      <h2 style={{ color: 'var(--gold)' }}>Order not found</h2>
      <Link to="/" className="btn btn-outline" style={{ marginTop: '1rem' }}>Go Home</Link>
    </div>
  );

  const statusColors = { placed: '#3498db', confirmed: '#27ae60', processing: '#f39c12', shipped: '#9b59b6', delivered: '#27ae60', cancelled: '#e74c3c' };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #001a00, #0a2200)', padding: '4rem 0', textAlign: 'center', borderBottom: '1px solid var(--black-border)' }}>
        <FiCheckCircle size={64} color="var(--success)" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '0.5rem' }}>
          Order Placed Successfully!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-accent)', fontSize: '1.1rem', fontStyle: 'italic' }}>
          Thank you, {order.customerInfo.name}. Your fragrance is on its way.
        </p>
        <p style={{ color: 'var(--gold)', fontWeight: 600, marginTop: '0.5rem', letterSpacing: '0.1em' }}>
          Order ID: {order.orderId}
        </p>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '700px' }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button onClick={handlePrint} className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiPrinter size={14} /> Print Order
          </button>
          <Link to="/shop" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiShoppingBag size={14} /> Continue Shopping
          </Link>
        </div>

        <div ref={printRef} className="print-area">
          {/* Order Header */}
          <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order ID</p>
                <p style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '1rem' }}>{order.orderId}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date</p>
                <p style={{ fontWeight: 500 }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</p>
                <span className="badge" style={{ background: `${statusColors[order.orderStatus]}20`, color: statusColors[order.orderStatus], border: `1px solid ${statusColors[order.orderStatus]}`, textTransform: 'capitalize' }}>
                  {order.orderStatus}
                </span>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Payment</p>
                <p style={{ fontWeight: 500, textTransform: 'capitalize' }}>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay'}</p>
              </div>
            </div>
            {order.razorpayPaymentId && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payment ID: {order.razorpayPaymentId}</p>
            )}
          </div>

          {/* Delivery Info */}
          <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '1rem', fontSize: '1rem' }}>Delivery Address</h3>
            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{order.customerInfo.name}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              {order.customerInfo.address}<br />
              {order.customerInfo.city}, {order.customerInfo.state} — {order.customerInfo.pincode}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
              📞 {order.customerInfo.phone} &nbsp;|&nbsp; ✉️ {order.customerInfo.email}
            </p>
          </div>

          {/* Order Items */}
          <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '1rem', fontSize: '1rem' }}>Order Items</h3>
            {order.items.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '1rem', alignItems: 'center',
                paddingBottom: '1rem', marginBottom: '1rem',
                borderBottom: i < order.items.length - 1 ? '1px solid var(--black-border)' : 'none'
              }}>
                <img src={getImageUrl(item.image)} alt={item.name} style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius)' }} onError={e => e.target.src='https://via.placeholder.com/56?text=🌸'} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{item.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{item.type} • {item.ml}ml × {item.quantity}</p>
                </div>
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span>₹{order.subtotal?.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Discount {order.couponCode && `(${order.couponCode})`}</span>
                <span style={{ color: 'var(--success)' }}>−₹{order.discount?.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--black-border)' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total Paid</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>₹{order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
