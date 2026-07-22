import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTag, FiCheck, FiX, FiTruck, FiCreditCard } from 'react-icons/fi';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { getImageUrl, handleImageError } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { INDIAN_STATES } from '../utils/indianStates';


export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '',
    phone: '', address: '', city: '', state: '', pincode: '', notes: ''
  });
  const [couponCode, setCouponCode] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [checkoutCoupons, setCheckoutCoupons] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [settings, setSettings] = useState({ shippingChargeTN: 0, shippingChargeOther: 0, codChargeTN: 100, codChargeOther: 100 });
  const [loading, setLoading] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Shipping mirrors the backend: COD adds the COD charge, online uses the base
  // shipping charge (0 = free). Both vary by delivery state (Tamil Nadu vs other).
  const isTamilNadu = form.state === 'Tamil Nadu';
  const shippingCharge = paymentMethod === 'cod'
    ? Number(isTamilNadu ? settings.codChargeTN : settings.codChargeOther) || 0
    : Number(isTamilNadu ? settings.shippingChargeTN : settings.shippingChargeOther) || 0;
  const total = Math.max(subtotal - discount, 0) + shippingCharge;

  useEffect(() => {
    if (items.length === 0) navigate('/');
    API.get('/api/settings').then(({ data }) => setSettings(data)).catch(() => {});
    API.get('/api/coupons/checkout').then(({ data }) => setCheckoutCoupons(data)).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const validateCoupon = async (code) => {
    if (!code?.trim()) return;
    setValidatingCoupon(true);
    try {
      const { data } = await API.post('/api/coupons/validate', { code: code.trim(), orderAmount: subtotal });
      setDiscount(data.discount);
      setCouponCode(code.trim().toUpperCase());
      setCouponMsg(`✓ ${data.coupon.description || `${data.coupon.discountType === 'percentage' ? data.coupon.discountValue + '%' : '₹' + data.coupon.discountValue} off applied`}`);
      toast.success('Coupon applied!');
    } catch (err) {
      setCouponMsg(err.response?.data?.message || 'Invalid coupon');
      setDiscount(0);
      setCouponCode('');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponInput('');
    setDiscount(0);
    setCouponMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.pincode)
      return toast.error('Please fill all required fields');
    setLoading(true);
    const orderData = {
      customerInfo: form,
      items: items.map(i => ({ product: i.productId, ml: i.ml, quantity: i.quantity })),
      couponCode: couponCode || undefined,
      paymentMethod
    };
    try {
      if (paymentMethod === 'razorpay') {
        // No order is created up front. We create a Razorpay order and only
        // persist the order on the backend once payment is verified — so a
        // cancelled or failed payment leaves no order behind.
        const { data: rzp } = await API.post('/api/payment/create-order', orderData);
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: rzp.amount,
          currency: rzp.currency,
          name: settings.storeName || 'Saliheen Perfumes',
          description: 'Saliheen Perfumes order',
          order_id: rzp.razorpayOrderId,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: '#c9a84c' },
          handler: async (response) => {
            try {
              const { data } = await API.post('/api/payment/verify', { ...response, orderData });
              clearCart();
              navigate(`/order-confirmation/${data.orderId}`);
            } catch (err) {
              toast.error(err.response?.data?.message || 'Payment verification failed. If money was deducted, contact support.');
              setLoading(false);
            }
          },
          modal: { ondismiss: () => { setLoading(false); toast.info('Payment cancelled — no order was placed'); } }
        };
        const rzpInstance = new window.Razorpay(options);
        rzpInstance.on('payment.failed', () => {
          toast.error('Payment failed — no order was placed. Please try again.');
          setLoading(false);
        });
        rzpInstance.open();
      } else {
        // COD: order is placed immediately, no payment step.
        const { data: order } = await API.post('/api/orders', orderData);
        clearCart();
        navigate(`/order-confirmation/${order.orderId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page" style={{ paddingTop: '70px', minHeight: '100vh' }}>
      <div className="page-header">
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
            {/* Left: Form */}
            <div>
              <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiTruck size={18} /> Delivery Information
                </h3>
                <div className="checkout-fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} className="form-control" placeholder="Your full name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className="form-control" placeholder="email@example.com" required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="form-control" placeholder="+91 XXXXXXXXXX" required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Address *</label>
                    <input name="address" value={form.address} onChange={handleChange} className="form-control" placeholder="Street address, flat/house no." required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input name="city" value={form.city} onChange={handleChange} className="form-control" placeholder="City" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <select name="state" value={form.state} onChange={handleChange} className="form-control" required>
                      <option value="" disabled>Select state</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">PIN Code *</label>
                    <input name="pincode" value={form.pincode} onChange={handleChange} className="form-control" placeholder="XXXXXX" required />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Order Notes (Optional)</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} className="form-control" placeholder="Special instructions..." rows={3} />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiCreditCard size={18} /> Payment Method
                </h3>
                <div className="checkout-payment" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1, minWidth: '180px', padding: '1rem', borderRadius: 'var(--radius)', border: `1px solid ${paymentMethod === 'razorpay' ? 'var(--gold)' : 'var(--black-border)'}`, background: paymentMethod === 'razorpay' ? 'rgba(201,168,76,0.08)' : 'var(--black-surface)' }}>
                    <input type="radio" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={e => setPaymentMethod(e.target.value)} style={{ accentColor: 'var(--gold)' }} />
                    <div>
                      <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>Razorpay {(Number(isTamilNadu ? settings.shippingChargeTN : settings.shippingChargeOther) || 0) === 0 && <span style={{ color: 'var(--success)', fontSize: '0.72rem' }}>· Free shipping</span>}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>UPI, Card, Net Banking, Wallets</p>
                    </div>
                  </label>
                  {settings.codEnabled && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1, minWidth: '180px', padding: '1rem', borderRadius: 'var(--radius)', border: `1px solid ${paymentMethod === 'cod' ? 'var(--gold)' : 'var(--black-border)'}`, background: paymentMethod === 'cod' ? 'rgba(201,168,76,0.08)' : 'var(--black-surface)' }}>
                      <input type="radio" value="cod" checked={paymentMethod === 'cod'} onChange={e => setPaymentMethod(e.target.value)} style={{ accentColor: 'var(--gold)' }} />
                      <div>
                        <p style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>Cash on Delivery {(Number(isTamilNadu ? settings.codChargeTN : settings.codChargeOther) || 0) > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>· +₹{(Number(isTamilNadu ? settings.codChargeTN : settings.codChargeOther) || 0).toLocaleString()}</span>}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Pay when you receive</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="checkout-summary" style={{ position: 'sticky', top: '90px' }}>
              <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '1.25rem', fontSize: '1.1rem' }}>Order Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem', maxHeight: '250px', overflowY: 'auto' }}>
                  {items.map(item => (
                    <div key={item.key} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <img src={getImageUrl(item.image)} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius)', flexShrink: 0 }} onError={handleImageError} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.ml}ml × {item.quantity}</p>
                      </div>
                      <span style={{ color: 'var(--gold)', fontSize: '0.9rem', fontWeight: 600, flexShrink: 0 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div style={{ borderTop: '1px solid var(--black-border)', paddingTop: '1rem', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FiTag size={12} /> Apply Coupon
                  </p>
                  {checkoutCoupons.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      {checkoutCoupons.map(c => (
                        <button key={c.code} type="button" onClick={() => { setCouponInput(c.code); validateCoupon(c.code); }} style={{
                          padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem',
                          background: 'rgba(201,168,76,0.15)', border: '1px dashed var(--gold)',
                          color: 'var(--gold)', cursor: 'pointer'
                        }}>
                          {c.code}
                        </button>
                      ))}
                    </div>
                  )}
                  {!couponCode ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} className="form-control" style={{ flex: 1 }} placeholder="Enter code" />
                      <button type="button" onClick={() => validateCoupon(couponInput)} className="btn btn-outline btn-sm" disabled={validatingCoupon}>
                        {validatingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(39,174,96,0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius)', padding: '0.5rem 0.75rem' }}>
                      <span style={{ color: 'var(--success)', fontSize: '0.85rem' }}><FiCheck size={12} /> {couponCode}</span>
                      <button type="button" onClick={removeCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><FiX size={14} /></button>
                    </div>
                  )}
                  {couponMsg && <p style={{ fontSize: '0.75rem', color: couponCode ? 'var(--success)' : 'var(--danger)', marginTop: '0.3rem' }}>{couponMsg}</p>}
                </div>

                {/* Totals */}
                <div style={{ borderTop: '1px solid var(--black-border)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Discount</span>
                      <span style={{ color: 'var(--success)' }}>−₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                    <span style={{ color: shippingCharge === 0 ? 'var(--success)' : 'var(--text-primary)' }}>
                      {shippingCharge === 0 ? 'Free' : `₹${shippingCharge.toLocaleString()}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--black-border)', fontWeight: 700 }}>
                    <span style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>Total</span>
                    <span style={{ color: 'var(--gold)', fontSize: '1.3rem', fontFamily: 'var(--font-heading)' }}>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="checkout-submit">
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? <><div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Processing...</> : paymentMethod === 'cod' ? 'Place Order (COD)' : `Pay ₹${total.toLocaleString()}`}
                </button>
                {!user && <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.75rem' }}>No account needed — ordering as guest</p>}
              </div>
            </div>
          </div>
        </form>
      </div>
      <style>{`
        /* Tablet & below: single column, summary drops below the form */
        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-summary { position: static !important; top: auto !important; }
        }
        /* Mobile: stack form fields & payment, sticky pay bar */
        @media (max-width: 768px) {
          .checkout-fields { grid-template-columns: 1fr !important; gap: 0.85rem !important; }
          .checkout-fields .form-group { grid-column: auto !important; }
          .checkout-payment { flex-direction: column; }
          .checkout-payment label { min-width: 0 !important; width: 100%; }
          /* Leave room so the sticky pay bar never covers the guest note/content */
          .checkout-page { padding-bottom: 6rem !important; }
          .checkout-submit {
            position: fixed; left: 0; right: 0; bottom: 0; z-index: 50;
            padding: 0.85rem 1rem calc(0.85rem + env(safe-area-inset-bottom, 0px));
            background: var(--black-card);
            border-top: 1px solid var(--black-border);
            box-shadow: 0 -6px 20px rgba(0,0,0,0.35);
          }
          .checkout-submit p { margin-top: 0.4rem !important; }
        }
        @media (max-width: 480px) {
          .checkout-page .container { padding: 1.25rem 0.9rem 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
