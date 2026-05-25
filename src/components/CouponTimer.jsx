import React, { useState, useEffect } from 'react';
import { FiClock, FiTag } from 'react-icons/fi';
import API from '../utils/api';

export default function CouponTimer() {
  const [coupon, setCoupon] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    API.get('/api/coupons/expiring').then(({ data }) => setCoupon(data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!coupon?.expiryDate) return;
    const calc = () => {
      const diff = new Date(coupon.expiryDate) - new Date();
      if (diff <= 0) { setCoupon(null); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000)
      });
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [coupon]);

  if (!coupon) return null;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1200, #2a1e00)',
      border: '1px solid var(--gold-dark)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem 2rem',
      textAlign: 'center',
      margin: '2rem auto',
      maxWidth: '600px',
      boxShadow: '0 0 30px rgba(201, 168, 76, 0.15)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <FiTag color="var(--gold)" />
        <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>
          Limited Time Offer
        </span>
      </div>
      {coupon.description && (
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
          {coupon.description}
        </p>
      )}
      <div style={{
        background: 'rgba(201, 168, 76, 0.1)',
        border: '1px dashed var(--gold)',
        borderRadius: 'var(--radius)',
        padding: '0.5rem 1.5rem',
        display: 'inline-block',
        marginBottom: '1rem',
        letterSpacing: '0.15em',
        fontWeight: 700,
        color: 'var(--gold-bright)',
        fontSize: '1.2rem'
      }}>
        {coupon.code}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <FiClock color="var(--text-secondary)" size={14} />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Expires in
        </span>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hrs' },
          { value: timeLeft.minutes, label: 'Min' },
          { value: timeLeft.seconds, label: 'Sec' }
        ].map(({ value, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{
              background: 'var(--black-surface)',
              border: '1px solid var(--gold-dark)',
              borderRadius: 'var(--radius)',
              width: '56px',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: 'var(--gold)',
              fontFamily: 'monospace'
            }}>
              {pad(value || 0)}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
