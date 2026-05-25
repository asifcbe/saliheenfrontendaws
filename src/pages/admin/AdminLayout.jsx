import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiTag, FiSettings, FiLayout, FiMapPin, FiMenu, FiX, FiLogOut, FiHome } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/products', icon: FiPackage, label: 'Products' },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/admin/coupons', icon: FiTag, label: 'Coupons' },
  { to: '/admin/landing', icon: FiLayout, label: 'Landing Page' },
  { to: '/admin/branches', icon: FiMapPin, label: 'Branches' },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings' }
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'clean-white');
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const sidebarW = sidebarOpen ? '240px' : '64px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--black)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarW, flexShrink: 0, transition: 'width 0.3s ease',
        background: 'var(--black-rich)', borderRight: '1px solid var(--black-border)',
        display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 200,
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--black-border)', flexShrink: 0 }}>
          {sidebarOpen && (
            <span style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1rem', whiteSpace: 'nowrap' }}>Admin Panel</span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} title={item.label} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1.25rem', color: active ? 'var(--gold)' : 'var(--text-secondary)',
                textDecoration: 'none', fontSize: '0.88rem', fontWeight: active ? 600 : 400,
                background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                borderRight: active ? '3px solid var(--gold)' : '3px solid transparent',
                transition: 'var(--transition)', whiteSpace: 'nowrap'
              }}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--black-border)', flexShrink: 0 }}>
          <Link to="/" title="View Site" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: 'var(--radius)', whiteSpace: 'nowrap' }}>
            <FiHome size={16} style={{ flexShrink: 0 }} />
            {sidebarOpen && 'View Store'}
          </Link>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', padding: '0.5rem', width: '100%', whiteSpace: 'nowrap' }}>
            <FiLogOut size={16} style={{ flexShrink: 0 }} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: sidebarW, transition: 'margin-left 0.3s ease', minWidth: 0 }}>
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          aside { width: 64px !important; }
          main { margin-left: 64px !important; }
        }
      `}</style>
    </div>
  );
}
