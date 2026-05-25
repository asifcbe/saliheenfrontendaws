import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.isAdmin ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--black), var(--black-rich))' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="ornament">✦</div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}>Sign in to your account</p>
        </div>

        <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="form-control" placeholder="••••••••" style={{ paddingRight: '3rem' }} required />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> : <><FiLogIn size={16} /> Sign In</>}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Register here</Link>
          </p>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '0.8rem' }}>
            Or <Link to="/checkout" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>continue as guest</Link> to checkout
          </p>
        </div>
      </div>
    </div>
  );
}
