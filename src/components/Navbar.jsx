import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiLogOut, FiSettings, FiPackage } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../utils/api';
import { getImageUrl } from '../utils/api';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState({});
  const { user, logout, isAdmin } = useAuth();
  const { itemCount, setIsOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    API.get('/api/settings').then(({ data }) => setSettings(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/shop?type=perfume', label: 'Perfumes' },
    { to: '/shop?type=attar', label: 'Attars' },
    { to: '/track-order', label: 'Track Order' },
    { to: '/contactus', label: 'Contact' }
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(10,10,10,0.97)' : 'rgba(10,10,10,0.85)',
      backdropFilter: 'blur(10px)',
      borderBottom: scrolled ? '1px solid var(--gold-dark)' : '1px solid rgba(201,168,76,0.2)',
      transition: 'all 0.3s ease',
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.5)' : 'none'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', height: '100%', padding: '5px 0' }}>
          {settings.logo ? (
            <img src={getImageUrl(settings.logo)} alt="Logo" style={{ height: '100%', width: 'auto', objectFit: 'contain', maxWidth: '180px' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--gold)', lineHeight: 1, letterSpacing: '0.05em' }}>
                {settings.storeName || 'Saliheen'}
              </span>
              <span style={{ fontFamily: 'var(--font-accent)', fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Perfumes
              </span>
            </div>
          )}
        </Link>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="nav-desktop">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              color: location.pathname === link.to ? 'var(--gold)' : 'var(--text-secondary)',
              textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.08em',
              textTransform: 'uppercase', fontWeight: 500, transition: 'var(--transition)',
              borderBottom: location.pathname === link.to ? '1px solid var(--gold)' : '1px solid transparent',
              paddingBottom: '2px'
            }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = location.pathname === link.to ? 'var(--gold)' : 'var(--text-secondary)'}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setIsOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-primary)', position: 'relative', padding: '4px'
          }}>
            <FiShoppingBag size={22} color={itemCount > 0 ? 'var(--gold)' : 'var(--text-primary)'} />
            {itemCount > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                background: 'var(--gold)', color: 'var(--black)',
                borderRadius: '50%', width: '18px', height: '18px',
                fontSize: '0.65rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>{itemCount}</span>
            )}
          </button>

          {user ? (
            <div style={{ position: 'relative' }} className="user-menu">
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                onClick={() => isAdmin ? navigate('/admin') : null}>
                <FiUser size={20} />
                <span className="hide-mobile">{user.name.split(' ')[0]}</span>
              </button>
              <div className="dropdown-menu" style={{
                position: 'absolute', right: 0, top: '130%',
                background: 'var(--black-card)', border: '1px solid var(--black-border)',
                borderRadius: 'var(--radius)', minWidth: '160px', overflow: 'hidden',
                boxShadow: 'var(--shadow)'
              }}>
                {isAdmin && (
                  <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', color: 'var(--gold)', textDecoration: 'none', fontSize: '0.85rem', borderBottom: '1px solid var(--black-border)' }}>
                    <FiSettings size={14} /> Admin Panel
                  </Link>
                )}
                {!isAdmin && (
                  <Link to="/my-orders" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', borderBottom: '1px solid var(--black-border)' }}>
                    <FiPackage size={14} /> My Orders
                  </Link>
                )}
                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontSize: '0.85rem' }}>
                  <FiLogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', padding: '4px', flexShrink: 0 }}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{
          background: 'var(--black-rich)', borderTop: '1px solid var(--black-border)',
          padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
        }} className="mobile-menu">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={{
              color: 'var(--text-secondary)', textDecoration: 'none', padding: '0.75rem 1rem',
              borderRadius: 'var(--radius)', fontSize: '0.9rem', letterSpacing: '0.05em',
              borderBottom: '1px solid var(--black-border)'
            }}>
              {link.label}
            </Link>
          ))}
          {user && !isAdmin && (
            <Link to="/my-orders" style={{
              color: 'var(--gold)', textDecoration: 'none', padding: '0.75rem 1rem',
              borderRadius: 'var(--radius)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
              borderBottom: '1px solid var(--black-border)'
            }}>
              <FiPackage size={15} /> My Orders
            </Link>
          )}
        </div>
      )}

      <style>{`
        .hamburger { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .hamburger { display: flex; align-items: center; justify-content: center; }
          .hide-mobile { display: none; }
        }
        .user-menu:hover .dropdown-menu { display: block; }
        .dropdown-menu { display: none; }
      `}</style>
    </nav>
  );
}
