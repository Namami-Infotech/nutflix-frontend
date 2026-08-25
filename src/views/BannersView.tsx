'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import Pagination from '@/components/Pagination';

interface BannersViewProps {
  banners: any[];
  searchQuery: string;
  onAddBanner: () => void;
  onEditBanner: (banner: any) => void;
  onDeleteBanner: (id: number) => void;
}

export default function BannersView({
  banners,
  searchQuery,
  onAddBanner,
  onEditBanner,
  onDeleteBanner
}: BannersViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredBanners = banners.filter(
    b => !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBanners.length / pageSize) || 1;
  const paginatedBanners = filteredBanners.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f291e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ImageIcon size={18} color="#f59e0b" /> Hero Banners Upload Table
          </h3>
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
            Showing {paginatedBanners.length} of {filteredBanners.length} active banners.
          </p>
        </div>
        <button
          onClick={onAddBanner}
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
          <Plus size={15} /> Upload Banner
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.35rem', textAlign: 'left', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
          <thead>
            <tr style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Banner Preview</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Badge Tag</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Main Title</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBanners.map((b) => (
              <tr key={b.id} style={{ backgroundColor: '#faf8f5', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.55rem 0.75rem', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    style={{ width: '85px', height: '45px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                  />
                </td>
                <td style={{ padding: '0.55rem 0.75rem' }}>
                  <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.68rem', fontWeight: 900, border: '1px solid #fde68a' }}>
                    {b.badgeText || 'PROMO'}
                  </span>
                </td>
                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 800, color: '#0f291e', fontSize: '0.88rem' }}>
                  {b.title}
                </td>
                <td style={{ padding: '0.55rem 0.75rem', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => onEditBanner(b)}
                      style={{ padding: '0.3rem 0.6rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <Edit size={13} /> Edit
                    </button>
                    <button
                      onClick={() => onDeleteBanner(b.id)}
                      style={{ padding: '0.3rem 0.6rem', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
