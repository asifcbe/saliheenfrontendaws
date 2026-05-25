import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FiSearch, FiEye, FiPrinter, FiX, FiTrash2, FiAlertTriangle, FiPackage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import { getImageUrl } from '../../utils/api';

const STATUS_OPTIONS = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUS = ['pending', 'paid', 'failed', 'refunded'];
const statusColors = {
  placed: '#3498db', confirmed: '#27ae60', processing: '#f39c12',
  shipped: '#9b59b6', delivered: '#2ecc71', cancelled: '#e74c3c'
};

// Bulk packing slips — one slip per page
function BulkPackingSlips({ orders }) {
  return (
    <div>
      {orders.map((order, i) => (
        <div key={order._id} style={{ pageBreakAfter: i < orders.length - 1 ? 'always' : 'auto' }}>
          <PackingSlip order={order} />
        </div>
      ))}
    </div>
  );
}

// Packing slip — rendered off-screen, printed cleanly
function PackingSlip({ order }) {
  if (!order) return null;
  return (
    <div className="print-slip" style={{ fontFamily: 'Arial, sans-serif', padding: '24px', maxWidth: '380px', color: '#000' }}>
      <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '14px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>SALIHEEN PERFUMES</h2>
        <p style={{ fontSize: '11px', margin: '4px 0 0' }}>Packing Slip</p>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div className="slip-row"><span className="slip-label">Order ID:</span><span style={{ fontWeight: 700 }}>{order.orderId}</span></div>
        <div className="slip-row"><span className="slip-label">Date:</span><span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
        <div className="slip-row"><span className="slip-label">Payment:</span><span style={{ textTransform: 'capitalize' }}>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}</span></div>
      </div>

      <div style={{ borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', padding: '10px 0', margin: '10px 0' }}>
        <p style={{ fontWeight: 700, fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ship To:</p>
        <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '2px' }}>{order.customerInfo?.name}</p>
        <p style={{ fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
          {order.customerInfo?.address}<br />
          {order.customerInfo?.city}, {order.customerInfo?.state} — {order.customerInfo?.pincode}
        </p>
        <p style={{ fontSize: '12px', marginTop: '4px' }}>📞 {order.customerInfo?.phone}</p>
        {order.customerInfo?.notes && (
          <p style={{ fontSize: '11px', fontStyle: 'italic', marginTop: '4px', color: '#555' }}>Note: {order.customerInfo.notes}</p>
        )}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <p style={{ fontWeight: 700, fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items:</p>
        {order.items?.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ddd', padding: '5px 0', fontSize: '12px' }}>
            <div>
              <span style={{ fontWeight: 600 }}>{item.name}</span>
              <span style={{ color: '#666', marginLeft: '6px', textTransform: 'capitalize' }}>({item.type}, {item.ml}ml)</span>
              <span style={{ marginLeft: '6px' }}>× {item.quantity}</span>
            </div>
            <span style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #000', paddingTop: '8px' }}>
        {order.discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
            <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
            <span>−₹{order.discount?.toLocaleString()}</span>
          </div>
        )}
        {order.shippingCharge > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
            <span>Shipping:</span>
            <span>₹{order.shippingCharge?.toLocaleString()}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, marginTop: '4px' }}>
          <span>{order.paymentMethod === 'cod' ? 'COLLECT ON DELIVERY:' : 'TOTAL (PAID):'}</span>
          <span>₹{order.total?.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '10px', color: '#888', borderTop: '1px solid #eee', paddingTop: '10px' }}>
        Thank you for shopping with Saliheen Perfumes<br />
        saliheenperfumes@gmail.com
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const printRef = useRef();
  const bulkPrintRef = useRef();

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allOnPageSelected = orders.length > 0 && orders.every(o => selectedIds.has(o._id));
  const toggleAll = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        orders.forEach(o => next.delete(o._id));
      } else {
        orders.forEach(o => next.add(o._id));
      }
      return next;
    });
  };

  const selectedOrders = orders.filter(o => selectedIds.has(o._id));

  const fetchOrders = () => {
    setLoading(true);
    setSelectedIds(new Set());
    const params = new URLSearchParams({ page, limit: 15 });
    if (search) params.append('search', search);
    if (statusFilter) params.append('status', statusFilter);
    API.get(`/api/orders?${params}`)
      .then(({ data }) => {
        setOrders(data.orders || []);
        setTotal(data.total);
        setPages(data.pages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrders, [page, search, statusFilter]);

  const updateStatus = async (id, field, value) => {
    try {
      await API.put(`/api/orders/${id}/status`, { [field]: value });
      fetchOrders();
      if (selectedOrder?._id === id) setSelectedOrder(o => ({ ...o, [field]: value }));
      toast.success('Status updated');
    } catch { toast.error('Update failed'); }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order permanently?')) return;
    try {
      await API.delete(`/api/orders/${id}`);
      toast.success('Order deleted');
      if (selectedOrder?._id === id) setSelectedOrder(null);
      fetchOrders();
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const resetAllOrders = async () => {
    setResetting(true);
    try {
      await API.delete('/api/orders/reset-all');
      toast.success('All orders and customer data cleared');
      setOrders([]);
      setTotal(0);
      setSelectedOrder(null);
      setShowResetConfirm(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Reset failed'); }
    finally { setResetting(false); }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `PackingSlip-${selectedOrder?.orderId}`
  });

  const handleBulkPrint = useReactToPrint({
    content: () => bulkPrintRef.current,
    documentTitle: `PackingSlips-Bulk-${selectedIds.size}`
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1.8rem', marginBottom: '0.2rem' }}>Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{total} total order{total !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {selectedIds.size > 0 && (
            <button onClick={handleBulkPrint} className="btn btn-outline btn-sm">
              <FiPrinter size={13} /> Print Selected ({selectedIds.size})
            </button>
          )}
          <button onClick={() => setShowResetConfirm(true)} className="btn btn-danger btn-sm">
            <FiTrash2 size={13} /> Reset All Orders
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1); }} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FiSearch size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)} className="form-control" style={{ paddingLeft: '2.25rem' }} placeholder="Search by order ID, name, phone…" />
          </div>
          <button type="submit" className="btn btn-outline btn-sm"><FiSearch size={13} /></button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setSearchInput(''); }} className="btn btn-ghost btn-sm"><FiX size={13} /></button>
          )}
        </form>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="form-control" style={{ width: 'auto', minWidth: '150px' }}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--black-card)', border: '1px solid var(--black-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={toggleAll}
                    title="Select all on this page"
                    style={{ accentColor: 'var(--gold)', width: '15px', height: '15px', cursor: 'pointer' }}
                  />
                </th>
                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Order Status', 'Date', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '3rem' }}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
              ) : orders.map(o => (
                <tr key={o._id} style={{ background: selectedIds.has(o._id) ? 'rgba(201,168,76,0.06)' : undefined }}>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(o._id)}
                      onChange={() => toggleSelect(o._id)}
                      style={{ accentColor: 'var(--gold)', width: '15px', height: '15px', cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.03em' }}>{o.orderId}</td>
                  <td>
                    <p style={{ fontWeight: 500, fontSize: '0.85rem' }}>{o.customerInfo?.name}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{o.customerInfo?.phone}</p>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{o.items?.length}</td>
                  <td style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.9rem' }}>₹{o.total?.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span className={`badge ${o.paymentStatus === 'paid' ? 'badge-success' : o.paymentStatus === 'failed' ? 'badge-danger' : 'badge-warning'}`}>
                        {o.paymentMethod === 'cod' ? 'COD' : 'Online'}
                      </span>
                      <span className={`badge ${o.paymentStatus === 'paid' ? 'badge-success' : o.paymentStatus === 'failed' ? 'badge-danger' : 'badge-warning'}`}>
                        {o.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td>
                    <select value={o.orderStatus} onChange={e => updateStatus(o._id, 'orderStatus', e.target.value)} style={{
                      background: `${statusColors[o.orderStatus]}18`,
                      color: statusColors[o.orderStatus],
                      border: `1px solid ${statusColors[o.orderStatus]}55`,
                      borderRadius: 'var(--radius)', padding: '0.3rem 0.5rem',
                      fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600
                    }}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: 'var(--black-surface)', color: 'var(--text-primary)' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button onClick={() => setSelectedOrder(o)} className="btn btn-ghost btn-sm" style={{ padding: '0.4rem' }} title="View"><FiEye size={13} /></button>
                      <button onClick={() => deleteOrder(o._id)} className="btn btn-danger btn-sm" style={{ padding: '0.4rem' }} title="Delete"><FiTrash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <FiPackage size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
              <p>No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-ghost'}`}>{p}</button>
          ))}
        </div>
      )}

      {/* Hidden packing slips for print */}
      <div style={{ display: 'none' }}>
        <div ref={printRef}><PackingSlip order={selectedOrder} /></div>
        <div ref={bulkPrintRef}><BulkPackingSlips orders={selectedOrders} /></div>
      </div>

      {/* Order Detail Panel */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)' }}>
          <div style={{ width: '100%', maxWidth: '500px', height: '100vh', overflowY: 'auto', background: 'var(--black-card)', borderLeft: '1px solid var(--black-border)', padding: '0', display: 'flex', flexDirection: 'column' }}>

            {/* Panel Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--black-border)', background: 'var(--black-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1 }}>
              <div>
                <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold)', fontSize: '1rem' }}>{selectedOrder.orderId}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button onClick={handlePrint} className="btn btn-outline btn-sm"><FiPrinter size={13} /> Print Slip</button>
                <button onClick={() => setSelectedOrder(null)} className="modal-close"><FiX size={18} /></button>
              </div>
            </div>

            <div style={{ padding: '1.5rem', flex: 1 }}>
              {/* Customer */}
              <div style={{ background: 'var(--black-surface)', borderRadius: 'var(--radius-lg)', padding: '1.1rem', marginBottom: '1rem', border: '1px solid var(--black-border)' }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Customer & Delivery</p>
                <p style={{ fontWeight: 700, marginBottom: '0.3rem', fontSize: '0.95rem' }}>{selectedOrder.customerInfo?.name}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>📞 {selectedOrder.customerInfo?.phone}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>✉️ {selectedOrder.customerInfo?.email}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {selectedOrder.customerInfo?.address}<br />
                  {selectedOrder.customerInfo?.city}, {selectedOrder.customerInfo?.state} — {selectedOrder.customerInfo?.pincode}
                </p>
                {selectedOrder.customerInfo?.notes && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic', borderTop: '1px solid var(--black-border)', paddingTop: '0.5rem' }}>
                    Note: {selectedOrder.customerInfo.notes}
                  </p>
                )}
              </div>

              {/* Items */}
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Ordered Items</p>
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--black-surface)', borderRadius: 'var(--radius)', padding: '0.75rem', marginBottom: '0.5rem', border: '1px solid var(--black-border)' }}>
                    <img src={getImageUrl(item.image)} alt={item.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: 'var(--radius)', flexShrink: 0 }} onError={e => e.target.src = 'https://via.placeholder.com/44?text=🌸'} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{item.type} • {item.ml}ml × {item.quantity}</p>
                    </div>
                    <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.88rem', flexShrink: 0 }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ background: 'var(--black-surface)', borderRadius: 'var(--radius-lg)', padding: '1.1rem', marginBottom: '1rem', border: '1px solid var(--black-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span>₹{selectedOrder.subtotal?.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Discount {selectedOrder.couponCode && `(${selectedOrder.couponCode})`}</span>
                    <span style={{ color: '#2ecc71' }}>−₹{selectedOrder.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                  <span style={{ color: selectedOrder.shippingCharge > 0 ? 'var(--text-primary)' : '#2ecc71' }}>
                    {selectedOrder.shippingCharge > 0 ? `₹${selectedOrder.shippingCharge?.toLocaleString()}` : 'Free'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.6rem', marginTop: '0.4rem', borderTop: '1px solid var(--black-border)' }}>
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ color: 'var(--gold)', fontWeight: 700, fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>₹{selectedOrder.total?.toLocaleString()}</span>
                </div>
                {selectedOrder.razorpayPaymentId && (
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--black-border)' }}>
                    Razorpay ID: {selectedOrder.razorpayPaymentId}
                  </p>
                )}
              </div>

              {/* Status Update */}
              <div style={{ background: 'var(--black-surface)', borderRadius: 'var(--radius-lg)', padding: '1.1rem', marginBottom: '1rem', border: '1px solid var(--black-border)' }}>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Update Status</p>
                <div className="input-row input-row-2">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Order Status</label>
                    <select value={selectedOrder.orderStatus} onChange={e => updateStatus(selectedOrder._id, 'orderStatus', e.target.value)} className="form-control" style={{ fontSize: '0.85rem' }}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Payment Status</label>
                    <select value={selectedOrder.paymentStatus} onChange={e => updateStatus(selectedOrder._id, 'paymentStatus', e.target.value)} className="form-control" style={{ fontSize: '0.85rem' }}>
                      {PAYMENT_STATUS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Delete */}
              <button onClick={() => deleteOrder(selectedOrder._id)} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
                <FiTrash2 size={14} /> Delete This Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirm Modal */}
      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '440px', textAlign: 'center' }}>
            <FiAlertTriangle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-pale)', marginBottom: '0.75rem' }}>Reset All Orders?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7, fontSize: '0.9rem' }}>
              This will <strong style={{ color: 'var(--danger)' }}>permanently delete</strong> all orders and customer data from the database. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => setShowResetConfirm(false)} className="btn btn-ghost btn-lg">Cancel</button>
              <button onClick={resetAllOrders} className="btn btn-danger btn-lg" disabled={resetting}>
                {resetting ? 'Deleting…' : 'Yes, Reset All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
