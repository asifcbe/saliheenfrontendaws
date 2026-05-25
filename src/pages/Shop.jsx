import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setType(searchParams.get('type') || '');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: currentPage, limit: 12 });
    if (type) params.append('type', type);
    if (search) params.append('search', search);
    API.get(`/api/products?${params}`)
      .then(({ data }) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      })
      .finally(() => setLoading(false));
  }, [type, search, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const handleTypeFilter = (t) => {
    setType(t);
    setCurrentPage(1);
    if (t) setSearchParams({ type: t });
    else setSearchParams({});
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <div className="page-header">
        <h1>Our {type ? (type === 'perfume' ? 'Perfumes' : 'Attars') : 'Collection'}</h1>
        <p>{total} {total === 1 ? 'product' : 'products'} available</p>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['', 'perfume', 'attar'].map(t => (
              <button key={t} onClick={() => handleTypeFilter(t)} className={`btn btn-sm ${type === t ? 'btn-primary' : 'btn-ghost'}`}>
                {t === '' ? 'All' : t === 'perfume' ? 'Perfumes' : 'Attars'}
              </button>
            ))}
          </div>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: '0 0 auto' }}>
            <div style={{ position: 'relative' }}>
              <FiSearch size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search fragrances..."
                className="form-control"
                style={{ paddingLeft: '2.5rem', width: '220px' }}
              />
            </div>
            {search && (
              <button type="button" onClick={() => { setSearch(''); setSearchInput(''); setCurrentPage(1); }} className="btn btn-ghost btn-sm">
                <FiX size={14} />
              </button>
            )}
            <button type="submit" className="btn btn-outline btn-sm"><FiSearch size={14} /></button>
          </form>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <FiFilter size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>No products found</p>
            <p>Try a different filter or search term.</p>
          </div>
        ) : (
          <>
            <div className="grid-4">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            {pages > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`btn btn-sm ${currentPage === p ? 'btn-primary' : 'btn-ghost'}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
