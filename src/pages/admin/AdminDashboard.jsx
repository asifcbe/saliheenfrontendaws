import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiDollarSign, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import API from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    API.get('/api/orders/stats').then(({ data }) => setStats(data)).catch(() => {});
    API.get('/api/orders?limit=5').then(({ data }) => setRecentOrders(data.orders || [])).catch(() => {});
    API.get('/api/products/admin/all').then(({ data }) => setProductCount(data.length)).catch(() => {});
  }, []);

  const statusColors = { placed: '#3498db', confirmed: '#27ae60', processing: '#f39c12', shipped: '#9b59b6', delivered: '#27ae60', cancelled: '#e74c3c' };

  const cards = [
    { label: 'Total Orders', value: stats?.total || 0, icon: FiShoppingBag, color: '#3498db' },
    { label: 'Revenue', value: `₹${(stats?.revenue || 0).toLocaleString()}`, icon: FiDollarSign, color: 'var(--gold)' },
    { label: 'Products', value: productCount, icon: FiPackage, color: '#27ae60' },
    { label: 'Delivered', value: stats?.byStatus?.find(s => s._id === 'delivered')?.count || 0, icon: FiTrendingUp, color: '#9b59b6' }
  ];

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '0.25rem', fontSize: '1.8rem' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.85rem' }}>Welcome back, Admin</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{c.label}</p>
                <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: c.color, fontWeight: 700 }}>{c.value}</p>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `${c.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <c.icon size={20} color={c.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats?.byStatus?.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
          {stats.byStatus.map(s => (
            <div key={s._id} style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius)', padding: '1rem', textAlign: 'center' }}>
              <span className="badge" style={{ background: `${statusColors[s._id] || '#888'}20`, color: statusColors[s._id] || '#888', border: `1px solid ${statusColors[s._id] || '#888'}`, textTransform: 'capitalize', marginBottom: '0.5rem', display: 'inline-block' }}>{s._id}</span>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 700 }}>{s.count}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1rem' }}>Recent Orders</h3>
          <Link to="/admin/orders" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View All <FiArrowRight size={12} />
          </Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--black-border)' }}>
                {['Order ID', 'Customer', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o._id} style={{ borderBottom: '1px solid var(--black-border)' }}>
                  <td style={{ padding: '0.75rem', color: 'var(--gold)', fontWeight: 500 }}>{o.orderId}</td>
                  <td style={{ padding: '0.75rem' }}>{o.customerInfo?.name}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--gold)' }}>₹{o.total?.toLocaleString()}</td>
                  <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{o.paymentMethod === 'cod' ? 'COD' : 'Razorpay'}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="badge" style={{ background: `${statusColors[o.orderStatus] || '#888'}20`, color: statusColors[o.orderStatus] || '#888', border: `1px solid ${statusColors[o.orderStatus] || '#888'}`, textTransform: 'capitalize', fontSize: '0.7rem' }}>{o.orderStatus}</span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No orders yet</p>}
        </div>
      </div>
    </div>
  );
}
