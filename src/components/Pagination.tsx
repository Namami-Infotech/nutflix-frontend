'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange
}: PaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 0 0.5rem',
      borderTop: '1px solid #e2e8f0',
      marginTop: '1.25rem',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      {/* Range Info */}
      <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
        Showing <strong style={{ color: '#0f291e' }}>{startItem}</strong> to <strong style={{ color: '#0f291e' }}>{endItem}</strong> of <strong style={{ color: '#0f291e' }}>{totalItems}</strong> entries
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: currentPage === 1 ? '#f1f5f9' : '#fff',
            color: currentPage === 1 ? '#94a3b8' : '#334155',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <ChevronLeft size={16} style={{ marginRight: '0.2rem' }} /> Previous
        </button>

        {/* Page Numbers */}
        {pages.map((pg) => {
          const isActive = pg === currentPage;
          return (
            <button
              key={pg}
              onClick={() => onPageChange(pg)}
              style={{
                minWidth: '34px',
                height: '34px',
                borderRadius: '8px',
                border: isActive ? '1px solid #d97706' : '1px solid #cbd5e1',
                backgroundColor: isActive ? 'var(--color-forest)' : '#fff',
                color: isActive ? '#fff' : '#334155',
                fontWeight: isActive ? 900 : 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {pg}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: currentPage === totalPages ? '#f1f5f9' : '#fff',
            color: currentPage === totalPages ? '#94a3b8' : '#334155',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Next <ChevronRight size={16} style={{ marginLeft: '0.2rem' }} />
        </button>
      </div>
    </div>
  );
}
