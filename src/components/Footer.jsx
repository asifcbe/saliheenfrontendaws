import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import API from '../utils/api';
import { getImageUrl } from '../utils/api';

export default function Footer() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    API.get('/api/settings').then(({ data }) => setSettings(data)).catch(() => {});
  }, []);

  const policies = [
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/shipping-delivery', label: 'Shipping & Delivery' },
    { to: '/refund-cancellation', label: 'Refund & Cancellation' },
    { to: '/terms-conditions', label: 'Terms & Conditions' },
    { to: '/contactus', label: 'Contact Us' }
  ];

  return (
    <footer style={{ background: 'var(--black-rich)', borderTop: '1px solid var(--black-border)' }}>
      <div style={{
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.08), transparent)',
        height: '1px', marginBottom: 0
      }} />

      <div className="container" style={{ padding: '4rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            {settings.logo ? (
              <img src={getImageUrl(settings.logo)} alt="Logo" style={{ height: '50px', marginBottom: '1rem' }} />
            ) : (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: 'var(--gold)' }}>
                  {settings.storeName || 'Saliheen'}
                </div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Perfumes
                </div>
              </div>
            )}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.8, marginBottom: '1.5rem', fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>
              {settings.storeTagline || 'The Essence of Luxury'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {settings.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" style={socialStyle}><FiInstagram size={18} /></a>
              )}
              {settings.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" style={socialStyle}><FiFacebook size={18} /></a>
              )}
              {settings.socialLinks?.youtube && (
                <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" style={socialStyle}><FiYoutube size={18} /></a>
              )}
              {settings.socialLinks?.whatsapp && (
                <a href={`https://wa.me/${settings.socialLinks.whatsapp}`} target="_blank" rel="noreferrer" style={socialStyle}><FaWhatsapp size={18} /></a>
              )}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '1.25rem', fontSize: '1rem' }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <Link to="/shop" style={linkStyle}>Our Collection</Link>
              <Link to="/shop?type=perfume" style={linkStyle}>Perfumes</Link>
              <Link to="/shop?type=attar" style={linkStyle}>Attars</Link>
              <Link to="/login" style={linkStyle}>My Account</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '1.25rem', fontSize: '1rem' }}>
              Policies
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {policies.map(p => (
                <Link key={p.to} to={p.to} style={linkStyle}>{p.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '1.25rem', fontSize: '1rem' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {settings.storeEmail && (
                <a href={`mailto:${settings.storeEmail}`} style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiMail size={14} color="var(--gold)" /> {settings.storeEmail}
                </a>
              )}
              {settings.storePhone && (
                <a href={`tel:${settings.storePhone}`} style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiPhone size={14} color="var(--gold)" /> {settings.storePhone}
                </a>
              )}
              {settings.storeAddress && (
                <div style={{ ...linkStyle, display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <FiMapPin size={14} color="var(--gold)" style={{ marginTop: '2px', flexShrink: 0 }} /> {settings.storeAddress}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--black-border)', paddingTop: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} {settings.storeName || 'Saliheen Perfumes'}. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <img src="https://razorpay.com/favicon.png" alt="Razorpay" style={{ height: '20px', opacity: 0.6 }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Secure Payments by Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const socialStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '36px', height: '36px', borderRadius: '50%',
  background: 'var(--black-surface)', border: '1px solid var(--black-border)',
  color: 'var(--text-secondary)', textDecoration: 'none', transition: 'var(--transition)'
};

const linkStyle = {
  color: 'var(--text-secondary)', textDecoration: 'none',
  fontSize: '0.85rem', transition: 'var(--transition)',
  lineHeight: 1.8
};
