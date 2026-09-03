'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Package, Sparkles, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import Pagination from '@/components/Pagination';
import { formatPrice } from '@/lib/api';

interface ProductsViewProps {
  products: any[];
  categories?: any[];
  searchQuery: string;
  onAddProduct: () => void;
  onEditProduct?: (product: any) => void;
  onDeleteProduct: (id: number) => void;
  onActivateProduct?: (id: number) => void;
}

export default function ProductsView({
  products,
  categories = [],
  searchQuery,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onActivateProduct
}: ProductsViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const pageSize = 5;

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    (categories || []).forEach(c => map.set(String(c.id), c.name));
    return map;
  }, [categories]);

  const availableCategories = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories;
    }
    const catMap = new Map<string, string>();
    products.forEach(p => {
      if (p.categoryId) {
        catMap.set(String(p.categoryId), p.categoryName || `Category #${p.categoryId}`);
      }
    });
    return Array.from(catMap.entries()).map(([id, name]) => ({ id, name }));
  }, [categories, products]);

  const categoryScopedProducts = useMemo(() => {
    if (categoryFilter === 'all') return products;
    return products.filter(p => String(p.categoryId) === String(categoryFilter));
  }, [products, categoryFilter]);

  const activeCount = categoryScopedProducts.filter(p => p.status !== 'inactive').length;
  const inactiveCount = categoryScopedProducts.filter(p => p.status === 'inactive').length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch = !searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const isInactive = p.status === 'inactive';
    const matchesStatus =
      statusFilter === 'active' ? !isInactive :
      statusFilter === 'inactive' ? isInactive : true;
    const matchesCategory =
      categoryFilter === 'all' ? true : String(p.categoryId) === String(categoryFilter);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = (filter: 'all' | 'active' | 'inactive') => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const handleCategoryChange = (catId: string) => {
    setCategoryFilter(catId);
    setCurrentPage(1);
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
      {/* Top Header & Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f291e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Package size={18} color="#0284c7" /> Products Management
          </h3>
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
            Showing {paginatedProducts.length} of {filteredProducts.length} items.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Category Filter Dropdown */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <Filter size={13} color="#0284c7" />
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569' }}>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#0f291e',
                cursor: 'pointer',
                outline: 'none',
                padding: '0.15rem 0.2rem'
              }}
            >
              <option value="all">All Categories</option>
              {availableCategories.map((cat: any) => {
                const count = products.filter(p => String(p.categoryId) === String(cat.id)).length;
                return (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.name} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Active / Inactive Status Filter Pills */}
          <div style={{ display: 'inline-flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <button
              type="button"
              onClick={() => handleFilterChange('all')}
              style={{
                border: 'none',
                backgroundColor: statusFilter === 'all' ? '#fff' : 'transparent',
                color: statusFilter === 'all' ? '#0f291e' : '#64748b',
                fontWeight: 800,
                fontSize: '0.74rem',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: statusFilter === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              All ({categoryScopedProducts.length})
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('active')}
              style={{
                border: 'none',
                backgroundColor: statusFilter === 'active' ? '#166534' : 'transparent',
                color: statusFilter === 'active' ? '#fff' : '#15803d',
                fontWeight: 800,
                fontSize: '0.74rem',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: statusFilter === 'active' ? '0 1px 3px rgba(22,101,52,0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Active ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('inactive')}
              style={{
                border: 'none',
                backgroundColor: statusFilter === 'inactive' ? '#dc2626' : 'transparent',
                color: statusFilter === 'inactive' ? '#fff' : '#b91c1c',
                fontWeight: 800,
                fontSize: '0.74rem',
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: statusFilter === 'inactive' ? '0 1px 3px rgba(220,38,38,0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Inactive ({inactiveCount})
            </button>
          </div>

          <button
            onClick={onAddProduct}
            style={{
              backgroundColor: 'var(--color-forest)',
              color: '#fff',
              border: 'none',
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 3px 10px rgba(15, 41, 30, 0.2)'
            }}
          >
            <Plus size={15} /> Add New Product
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.35rem', textAlign: 'left', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
          <thead>
            <tr style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Thumbnail</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Product Details</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Price</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Origin & Weight</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Keywords</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Featured</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Status</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  No {statusFilter !== 'all' ? statusFilter : ''} products found.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((prod) => {
                const kws = Array.isArray(prod.keywords) ? prod.keywords : (prod.keywords ? (typeof prod.keywords === 'string' ? JSON.parse(prod.keywords) : [prod.name]) : [prod.name]);
                const isInactive = prod.status === 'inactive';
                return (
                  <tr
                    key={prod.id}
                    style={{
                      backgroundColor: isInactive ? '#f8fafc' : '#faf8f5',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      opacity: isInactive ? 0.78 : 1
                    }}
                  >
                    <td style={{ padding: '0.55rem 0.75rem', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid #e2e8f0',
                          filter: isInactive ? 'grayscale(40%)' : 'none'
                        }}
                      />
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, color: isInactive ? '#64748b' : '#0f291e', fontSize: '0.88rem' }}>{prod.name}</span>
                        {categoryMap.get(String(prod.categoryId)) && (
                          <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.1rem 0.45rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>
                            {categoryMap.get(String(prod.categoryId))}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.1rem' }}>{prod.description?.substring(0, 50)}...</div>
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem' }}>
                      {(() => {
                        const reg = parseFloat(prod.price) || 0;
                        const sell = prod.sellingPrice ? parseFloat(String(prod.sellingPrice)) : 0;
                        if (sell > 0 && sell < reg) {
                          const pct = Math.round(((reg - sell) / reg) * 100);
                          return (
                            <div>
                              <div style={{ fontWeight: 900, color: isInactive ? '#64748b' : '#047857', fontSize: '0.9rem' }}>
                                ₹{formatPrice(sell)}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <span style={{ textDecoration: 'line-through', color: '#dc2626', fontSize: '0.72rem', opacity: 0.85 }}>
                                  ₹{formatPrice(reg)}
                                </span>
                                <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '1px 4px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>
                                  {pct}% OFF
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <span style={{ fontWeight: 900, color: isInactive ? '#64748b' : '#0f291e', fontSize: '0.88rem' }}>
                            ₹{formatPrice(reg)}
                          </span>
                        );
                      })()}
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem', color: '#475569', fontWeight: 600 }}>
                      {prod.origin || 'Kolkata Reserve'} <span style={{ color: '#0284c7', fontWeight: 800 }}>({prod.weight || '250'} {prod.unit || 'g'})</span>
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '220px' }}>
                        {kws.slice(0, 3).map((kw: string, i: number) => (
                          <span key={i} style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.4rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
                            #{kw}
                          </span>
                        ))}
                        {kws.length > 3 && (
                          <span style={{ backgroundColor: '#e2e8f0', color: '#475569', padding: '0.15rem 0.4rem', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800 }}>
                            +{kws.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem' }}>
                      {prod.isFeatured ? (
                        <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.68rem', fontWeight: 900, border: '1px solid #fde68a', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Sparkles size={11} /> FEATURED
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Standard</span>
                      )}
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: '12px',
                          fontSize: '0.68rem',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          backgroundColor: isInactive ? '#fee2e2' : '#dcfce7',
                          color: isInactive ? '#b91c1c' : '#166534',
                          border: `1px solid ${isInactive ? '#fca5a5' : '#86efac'}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        {isInactive ? <AlertCircle size={11} /> : <CheckCircle size={11} />}
                        {isInactive ? 'inactive' : 'active'}
                      </span>
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        {/* Edit Button commented out as requested */}
                        {/* <button
                          onClick={() => onEditProduct && onEditProduct(prod)}
                          style={{ padding: '0.3rem 0.6rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Edit size={13} /> Edit
                        </button> */}

                        {isInactive ? (
                          onActivateProduct && (
                            <button
                              onClick={() => onActivateProduct(prod.id)}
                              style={{
                                padding: '0.3rem 0.65rem',
                                backgroundColor: '#dcfce7',
                                border: '1px solid #86efac',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: '0.75rem',
                                color: '#166534',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                              title="Reactivate Product"
                            >
                              <CheckCircle size={13} /> Activate
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => onDeleteProduct(prod.id)}
                            style={{
                              padding: '0.3rem 0.65rem',
                              backgroundColor: '#fee2e2',
                              border: '1px solid #fca5a5',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              color: '#ef4444',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            title="Deactivate Product"
                          >
                            <Trash2 size={13} /> Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredProducts.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
