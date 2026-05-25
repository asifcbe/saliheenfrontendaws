import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.phone);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--black), var(--black-rich))' }}>
      <div style={{ width: '100%', maxWidth: '440px', padding: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="ornament">✦</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>Join the world of Saliheen</p>
        </div>
        <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow)' }}>
          <form onSubmit={handleSubmit}>
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
              { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
              { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 XXXXXXXXXX' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              { name: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••' }
            ].map(f => (
              <div key={f.name} className="form-group">
                <label className="form-label">{f.label}</label>
                <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} className="form-control" placeholder={f.placeholder} required={f.name !== 'phone'} />
              </div>
            ))}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> : <><FiUserPlus size={16} /> Create Account</>}
            </button>
          </form>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
