'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import Pagination from '@/components/Pagination';

interface BannersViewProps {
  banners: any[];
  searchQuery: string;
  onAddBanner: () => void;
  onEditBanner?: (banner: any) => void;
  onDeleteBanner: (id: number) => void;
  onActivateBanner?: (id: number) => void;
}

export default function BannersView({
  banners,
  searchQuery,
  onAddBanner,
  onEditBanner,
  onDeleteBanner,
  onActivateBanner
}: BannersViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const pageSize = 5;

  const activeCount = banners.filter(b => b.status !== 'inactive' && b.isActive !== false).length;
  const inactiveCount = banners.filter(b => b.status === 'inactive' || b.isActive === false).length;

  const filteredBanners = banners.filter((b) => {
    const matchesSearch = !searchQuery || b.title?.toLowerCase().includes(searchQuery.toLowerCase()) || b.badgeText?.toLowerCase().includes(searchQuery.toLowerCase());
    const isInactive = b.status === 'inactive' || b.isActive === false;
    if (statusFilter === 'active') return matchesSearch && !isInactive;
    if (statusFilter === 'inactive') return matchesSearch && isInactive;
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredBanners.length / pageSize) || 1;
  const paginatedBanners = filteredBanners.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = (filter: 'all' | 'active' | 'inactive') => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
      {/* Top Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f291e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ImageIcon size={18} color="#f59e0b" /> Hero Banners Upload Table
          </h3>
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
            Showing {paginatedBanners.length} of {filteredBanners.length} banners.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
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
              All ({banners.length})
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
              Active ({activeCount}/10)
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
            onClick={onAddBanner}
            style={{
              backgroundColor: activeCount >= 10 ? '#475569' : 'var(--color-forest)',
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
            <Plus size={15} /> Upload Banner
          </button>
        </div>
      </div>

      {/* 10 Active Banners Limit Warning / Info Bar */}
      {activeCount >= 10 ? (
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fef3c7',
          borderLeft: '4px solid #f59e0b',
          borderRadius: '8px',
          padding: '0.6rem 0.85rem',
          marginBottom: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.78rem',
          color: '#92400e'
        }}>
          <AlertCircle size={16} color="#d97706" style={{ flexShrink: 0 }} />
          <span>
            <strong>Maximum Active Limit Reached (10/10):</strong> Only 10 banners can be active on the storefront at once. Deactivate an existing active banner to activate or add new ones.
          </span>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #dcfce7',
          borderLeft: '4px solid #22c55e',
          borderRadius: '8px',
          padding: '0.45rem 0.75rem',
          marginBottom: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.75rem',
          color: '#166534'
        }}>
          <CheckCircle size={14} color="#16a34a" style={{ flexShrink: 0 }} />
          <span>
            Active Banners: <strong>{activeCount}/10 slots used</strong> ({10 - activeCount} available).
          </span>
        </div>
      )}

      {/* Data Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.35rem', textAlign: 'left', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
          <thead>
            <tr style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Banner Preview</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Main Title</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Status</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBanners.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  No {statusFilter !== 'all' ? statusFilter : ''} banners found.
                </td>
              </tr>
            ) : (
              paginatedBanners.map((b) => {
                const isInactive = b.status === 'inactive' || b.isActive === false;
                return (
                  <tr
                    key={b.id}
                    style={{
                      backgroundColor: isInactive ? '#f8fafc' : '#faf8f5',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      opacity: isInactive ? 0.78 : 1
                    }}
                  >
                    <td style={{ padding: '0.55rem 0.75rem', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                      <img
                        src={b.imageUrl}
                        alt={b.title}
                        style={{ width: '85px', height: '45px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0', filter: isInactive ? 'grayscale(40%)' : 'none' }}
                      />
                    </td>
                  
                    <td style={{ padding: '0.55rem 0.75rem', fontWeight: 800, color: isInactive ? '#64748b' : '#0f291e', fontSize: '0.88rem' }}>
                      {b.title}
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
                          onClick={() => onEditBanner && onEditBanner(b)}
                          style={{ padding: '0.3rem 0.6rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Edit size={13} /> Edit
                        </button> */}

                        {isInactive ? (
                          onActivateBanner && (
                            <button
                              onClick={() => onActivateBanner(b.id)}
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
                              title="Reactivate Banner"
                            >
                              <CheckCircle size={13} /> Activate
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => onDeleteBanner(b.id)}
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
                            title="Deactivate Banner"
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
        totalItems={filteredBanners.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
