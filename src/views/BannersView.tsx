'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon, CheckCircle, AlertCircle, Filter, X, Eye, Monitor, Smartphone, ExternalLink, Maximize2 } from 'lucide-react';
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
  const [viewingBanner, setViewingBanner] = useState<any | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile' | 'both'>('desktop');
  const pageSize = 5;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewingBanner(null);
      }
    };
    if (viewingBanner) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingBanner]);

  const handleOpenPreview = (banner: any, device: 'desktop' | 'mobile' | 'both' = 'desktop') => {
    setViewingBanner(banner);
    setPreviewDevice(device);
  };

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
                      <div
                        onClick={() => handleOpenPreview(b, 'desktop')}
                        title="Click to view banner preview"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.55rem',
                          cursor: 'pointer',
                          padding: '0.25rem 0.4rem',
                          borderRadius: '8px',
                          border: '1px solid transparent',
                          transition: 'all 0.15s ease',
                          userSelect: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.borderColor = '#cbd5e1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                      >
                        {/* Desktop Thumbnail */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPreview(b, 'desktop');
                          }}
                          style={{ textAlign: 'center', position: 'relative' }}
                          title="Click to view Desktop Banner (1900×650)"
                        >
                          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '5px' }}>
                            <img
                              src={b.imageUrl}
                              alt={b.title}
                              style={{ width: '85px', height: '36px', borderRadius: '5px', objectFit: 'cover', border: '1px solid #cbd5e1', filter: isInactive ? 'grayscale(40%)' : 'none', display: 'block' }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundColor: 'rgba(15, 41, 30, 0.45)',
                                opacity: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'opacity 0.15s ease',
                                borderRadius: '5px'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                            >
                              <Eye size={14} color="#ffffff" />
                            </div>
                          </div>
                          <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                            <Monitor size={10} /> Desktop
                          </div>
                        </div>

                        {/* Mobile Thumbnail */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPreview(b, b.mobileImageUrl ? 'mobile' : 'desktop');
                          }}
                          style={{ textAlign: 'center', position: 'relative' }}
                          title={b.mobileImageUrl ? "Click to view Mobile Banner (1200×896)" : "Auto-crop from desktop (Click to view)"}
                        >
                          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '5px' }}>
                            {b.mobileImageUrl ? (
                              <>
                                <img
                                  src={b.mobileImageUrl}
                                  alt={`${b.title} Mobile`}
                                  style={{ width: '48px', height: '36px', borderRadius: '5px', objectFit: 'cover', border: '1px solid #cbd5e1', filter: isInactive ? 'grayscale(40%)' : 'none', display: 'block' }}
                                />
                                <div
                                  style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundColor: 'rgba(15, 41, 30, 0.45)',
                                    opacity: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'opacity 0.15s ease',
                                    borderRadius: '5px'
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                                >
                                  <Eye size={12} color="#ffffff" />
                                </div>
                              </>
                            ) : (
                              <div style={{ width: '48px', height: '36px', borderRadius: '5px', border: '1px dashed #cbd5e1', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#94a3b8' }}>
                                Auto
                              </div>
                            )}
                          </div>
                          <div style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                            <Smartphone size={10} /> Mobile
                          </div>
                        </div>
                      </div>
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
                        <button
                          onClick={() => onEditBanner && onEditBanner(b)}
                          style={{ padding: '0.3rem 0.6rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <Edit size={13} /> Edit
                        </button>

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

      {/* BANNER PREVIEW MODAL */}
      {viewingBanner && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(8px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
          onClick={() => setViewingBanner(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              width: '100%',
              maxWidth: '920px',
              maxHeight: '92vh',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.1rem 1.5rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <ImageIcon size={19} color="#d97706" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f291e' }}>
                      {viewingBanner.title || 'Banner Preview'}
                    </h3>
                    <span
                      style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        backgroundColor: (viewingBanner.status === 'inactive' || viewingBanner.isActive === false) ? '#fee2e2' : '#dcfce7',
                        color: (viewingBanner.status === 'inactive' || viewingBanner.isActive === false) ? '#b91c1c' : '#166534',
                        border: `1px solid ${(viewingBanner.status === 'inactive' || viewingBanner.isActive === false) ? '#fca5a5' : '#86efac'}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {(viewingBanner.status === 'inactive' || viewingBanner.isActive === false) ? <AlertCircle size={10} /> : <CheckCircle size={10} />}
                      {(viewingBanner.status === 'inactive' || viewingBanner.isActive === false) ? 'inactive' : 'active'}
                    </span>
                    {viewingBanner.badgeText && (
                      <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '6px', fontWeight: 700 }}>
                        🏷️ {viewingBanner.badgeText}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                    Preview banner as displayed on web storefront.
                  </p>
                </div>
              </div>

              {/* View Switcher Tabs & Close */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ display: 'inline-flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '9px', border: '1px solid #e2e8f0' }}>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    style={{
                      border: 'none',
                      backgroundColor: previewDevice === 'desktop' ? '#0f291e' : 'transparent',
                      color: previewDevice === 'desktop' ? '#ffffff' : '#64748b',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.7rem',
                      borderRadius: '7px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Monitor size={13} /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    style={{
                      border: 'none',
                      backgroundColor: previewDevice === 'mobile' ? '#0f291e' : 'transparent',
                      color: previewDevice === 'mobile' ? '#ffffff' : '#64748b',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.7rem',
                      borderRadius: '7px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Smartphone size={13} /> Mobile
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('both')}
                    style={{
                      border: 'none',
                      backgroundColor: previewDevice === 'both' ? '#0f291e' : 'transparent',
                      color: previewDevice === 'both' ? '#ffffff' : '#64748b',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.7rem',
                      borderRadius: '7px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Maximize2 size={13} /> Both
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setViewingBanner(null)}
                  style={{
                    border: 'none',
                    background: '#f1f5f9',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.color = '#475569';
                  }}
                  title="Close Preview (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flexGrow: 1, backgroundColor: '#f8fafc' }}>
              {/* DESKTOP VIEW */}
              {previewDevice === 'desktop' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b' }}>
                      <Monitor size={15} color="#0f291e" /> Desktop Banner Preview
                      <span style={{ fontSize: '0.7rem', color: '#166534', backgroundColor: '#dcfce7', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 700 }}>
                        Target: 1900 × 650
                      </span>
                    </div>
                    {viewingBanner.imageUrl && (
                      <a
                        href={viewingBanner.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.74rem',
                          color: '#166534',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          backgroundColor: '#ffffff',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1'
                        }}
                      >
                        <ExternalLink size={12} /> Open Original in New Tab
                      </a>
                    )}
                  </div>

                  <div
                    style={{
                      borderRadius: '14px',
                      overflow: 'hidden',
                      backgroundColor: '#0f172a',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '220px',
                      maxHeight: '480px',
                      position: 'relative'
                    }}
                  >
                    <img
                      src={viewingBanner.imageUrl}
                      alt={viewingBanner.title}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '480px',
                        objectFit: 'contain',
                        display: 'block'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=1600&q=80';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* MOBILE VIEW */}
              {previewDevice === 'mobile' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 800, color: '#1e293b' }}>
                      <Smartphone size={15} color="#d97706" /> Mobile Banner Preview
                      <span style={{ fontSize: '0.7rem', color: '#b45309', backgroundColor: '#fef3c7', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 700 }}>
                        Target: 1200 × 896
                      </span>
                    </div>
                    {viewingBanner.mobileImageUrl && (
                      <a
                        href={viewingBanner.mobileImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.74rem',
                          color: '#d97706',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          backgroundColor: '#ffffff',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1'
                        }}
                      >
                        <ExternalLink size={12} /> Open Mobile Banner in New Tab
                      </a>
                    )}
                  </div>

                  {viewingBanner.mobileImageUrl ? (
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '380px',
                        backgroundColor: '#0f172a',
                        borderRadius: '28px',
                        padding: '10px',
                        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
                        border: '2px solid #334155'
                      }}
                    >
                      <div style={{ width: '60px', height: '4px', backgroundColor: '#475569', borderRadius: '4px', margin: '4px auto 8px' }} />
                      <div style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                        <img
                          src={viewingBanner.mobileImageUrl}
                          alt={`${viewingBanner.title} Mobile`}
                          style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = viewingBanner.imageUrl;
                          }}
                        />
                      </div>
                      <div style={{ width: '40px', height: '3px', backgroundColor: '#475569', borderRadius: '4px', margin: '8px auto 2px' }} />
                    </div>
                  ) : (
                    <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                      <div
                        style={{
                          backgroundColor: '#fffbeb',
                          border: '1px solid #fef3c7',
                          borderLeft: '4px solid #f59e0b',
                          borderRadius: '8px',
                          padding: '0.65rem 0.85rem',
                          width: '100%',
                          fontSize: '0.78rem',
                          color: '#92400e',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem'
                        }}
                      >
                        <AlertCircle size={15} color="#d97706" style={{ flexShrink: 0 }} />
                        <span>
                          <strong>No Dedicated Mobile Banner:</strong> Mobile visitors will see the Desktop banner auto-scaled to fit their screen.
                        </span>
                      </div>

                      <div
                        style={{
                          width: '100%',
                          backgroundColor: '#0f172a',
                          borderRadius: '28px',
                          padding: '10px',
                          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
                          border: '2px solid #334155'
                        }}
                      >
                        <div style={{ width: '60px', height: '4px', backgroundColor: '#475569', borderRadius: '4px', margin: '4px auto 8px' }} />
                        <div style={{ borderRadius: '20px', overflow: 'hidden', backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                          <img
                            src={viewingBanner.imageUrl}
                            alt={`${viewingBanner.title} Auto-scaled`}
                            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ width: '40px', height: '3px', backgroundColor: '#475569', borderRadius: '4px', margin: '8px auto 2px' }} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* BOTH VIEWS COMPARISON */}
              {previewDevice === 'both' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: '1.25rem', alignItems: 'start' }}>
                  {/* Left: Desktop */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Monitor size={14} color="#0f291e" /> Desktop (1900×650)
                      </span>
                      {viewingBanner.imageUrl && (
                        <a
                          href={viewingBanner.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                        >
                          <ExternalLink size={11} /> Open
                        </a>
                      )}
                    </div>
                    <div style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#0f172a', border: '1px solid #cbd5e1', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}>
                      <img
                        src={viewingBanner.imageUrl}
                        alt={viewingBanner.title}
                        style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
                      />
                    </div>
                  </div>

                  {/* Right: Mobile */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Smartphone size={14} color="#d97706" /> Mobile (1200×896)
                      </span>
                      {viewingBanner.mobileImageUrl && (
                        <a
                          href={viewingBanner.mobileImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                        >
                          <ExternalLink size={11} /> Open
                        </a>
                      )}
                    </div>
                    <div style={{ backgroundColor: '#0f172a', borderRadius: '20px', padding: '8px', border: '2px solid #334155', boxShadow: '0 4px 14px rgba(0,0,0,0.1)', maxWidth: '280px', margin: '0 auto' }}>
                      <div style={{ borderRadius: '14px', overflow: 'hidden', backgroundColor: '#1e293b' }}>
                        <img
                          src={viewingBanner.mobileImageUrl || viewingBanner.imageUrl}
                          alt={`${viewingBanner.title} Mobile`}
                          style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                        />
                      </div>
                      {!viewingBanner.mobileImageUrl && (
                        <div style={{ fontSize: '0.62rem', color: '#f59e0b', textAlign: 'center', marginTop: '4px', fontWeight: 700 }}>
                          Auto Desktop Crop
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Banner Details Card */}
              {(viewingBanner.subtitle || viewingBanner.badgeText || viewingBanner.link || viewingBanner.ctaText) && (
                <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Banner Metadata & Links
                  </div>
                  {viewingBanner.subtitle && (
                    <div style={{ fontSize: '0.82rem', color: '#334155' }}>
                      <strong style={{ color: '#0f291e' }}>Subtitle:</strong> {viewingBanner.subtitle}
                    </div>
                  )}
                  {viewingBanner.badgeText && (
                    <div style={{ fontSize: '0.82rem', color: '#334155' }}>
                      <strong style={{ color: '#0f291e' }}>Badge:</strong> {viewingBanner.badgeText}
                    </div>
                  )}
                  {(viewingBanner.link || viewingBanner.ctaText) && (
                    <div style={{ fontSize: '0.82rem', color: '#334155' }}>
                      <strong style={{ color: '#0f291e' }}>Action / Route:</strong> {viewingBanner.ctaText ? `"${viewingBanner.ctaText}" → ` : ''}{viewingBanner.link || '/shop'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '0.9rem 1.5rem',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                gap: '0.75rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                ID: <strong>#{viewingBanner.id}</strong> | Recommended specs: Desktop <strong>1900×650</strong>, Mobile <strong>1200×896</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {onEditBanner && (
                  <button
                    type="button"
                    onClick={() => {
                      const b = viewingBanner;
                      setViewingBanner(null);
                      onEditBanner(b);
                    }}
                    style={{
                      padding: '0.45rem 0.9rem',
                      backgroundColor: '#0f291e',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: '0 2px 8px rgba(15, 41, 30, 0.2)'
                    }}
                  >
                    <Edit size={14} /> Edit Banner
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setViewingBanner(null)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
