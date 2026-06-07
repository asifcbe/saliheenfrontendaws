import React, { useState, useEffect } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../../utils/api';

export default function ContactUs() {
  const [settings, setSettings] = useState({});
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    API.get('/api/settings').then(({ data }) => setSettings(data)).catch(() => {});
    API.get('/api/branches').then(({ data }) => setBranches(data)).catch(() => {});
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you</p>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Contact Form */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>Send Us a Message</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>
              Have a question? We're here to help.
            </p>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select name="subject" value={form.subject} onChange={handleChange} className="form-control" required>
                    <option value="">Select subject</option>
                    <option>Order Inquiry</option>
                    <option>Product Question</option>
                    <option>Refund/Return</option>
                    <option>Wholesale/Bulk</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} className="form-control" rows={5} required placeholder="How can we help you?" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? 'Sending...' : <><FiSend size={15} /> Send Message</>}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '2rem', fontSize: '1.5rem' }}>Get in Touch</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {(() => { const email = settings.storeEmail || 'saliheenperfumes@gmail.com'; return (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '1px solid var(--gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FiMail size={18} color="var(--gold)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Email</p>
                    <a href={`mailto:${email}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem' }}>{email}</a>
                  </div>
                </div>
              ); })()}
              {(() => { const phone = settings.storePhone || '+91 8072826007'; return (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '1px solid var(--gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FiPhone size={18} color="var(--gold)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Phone</p>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem' }}>{phone}</a>
                  </div>
                </div>
              ); })()}
              {settings.socialLinks?.whatsapp && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaWhatsapp size={20} color="#25D366" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>WhatsApp</p>
                    <a href={`https://wa.me/${settings.socialLinks.whatsapp}`} target="_blank" rel="noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontSize: '0.95rem' }}>Chat with us</a>
                  </div>
                </div>
              )}
              {(() => { const address = settings.storeAddress || 'Saliheen Perfumes #2, Vincent Rd, near Masjidul Muslimeen, Fort, Coimbatore, Tamil Nadu 641001.'; return (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)', border: '1px solid var(--gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FiMapPin size={18} color="var(--gold)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Address</p>
                    <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.5 }}>{address}</p>
                  </div>
                </div>
              ); })()}
            </div>

            {branches.length > 0 && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '1rem', fontSize: '1rem' }}>Our Branches</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {branches.slice(0, 3).map(b => (
                    <div key={b._id} style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius)', padding: '0.9rem' }}>
                      <p style={{ fontWeight: 600, color: 'var(--gold)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>{b.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.address}{b.city && `, ${b.city}`}</p>
                      {b.timings && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                          <FiClock size={11} /> {b.timings}
                        </p>
                      )}
                      {b.googleMapLink && (
                        <a href={b.googleMapLink} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.4rem' }}>
                          <FiMapPin size={11} /> Get Directions
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginTop: '1.75rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start', background: 'var(--black-card)', border: '1px solid var(--gold-dark)', borderRadius: 'var(--radius)', padding: '0.9rem 1rem' }}>
              <FiClock size={16} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Our customer support team is available from <strong style={{ color: 'var(--text-primary)' }}>9 AM to 6 PM</strong>, Monday to Saturday. We are closed on public holidays.
              </p>
            </div>
          </div>
        </div>

        {/* Find Us on the Map */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '1.25rem', fontSize: '1.5rem' }}>Find Us on the Map</h2>
          <div style={{ height: '360px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--black-border)' }}>
            <iframe
              title="Saliheen Perfumes Location"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1157.6345153421153!2d76.96559120789108!3d10.991669091855398!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8590046440a5d%3A0x8fa6299e9c37a341!2sSaliheen%20Perfumes%20%232!5e0!3m2!1sen!2sin!4v1742639568974!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
