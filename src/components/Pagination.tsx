'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

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

  // Generate smart truncated page numbers for responsive fitting
  const getVisiblePages = (): (number | string)[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="admin-pagination-container">
      {/* Range Info */}
      <div className="admin-pagination-info">
        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalItems}</strong> entries
      </div>

      {/* Pagination Controls */}
      <div className="admin-pagination-controls">
        {/* First Page (<<) */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="admin-pagination-nav-btn"
          title="First Page (<<)"
          aria-label="First Page"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous Page (<) */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="admin-pagination-nav-btn"
          title="Previous Page (<)"
          aria-label="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        <div className="admin-pagination-pages">
          {visiblePages.map((pg, index) => {
            if (pg === '...') {
              return (
                <span key={`dots-${index}`} className="admin-pagination-ellipsis">
                  ...
                </span>
              );
            }

            const pageNum = Number(pg);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`admin-pagination-page-btn ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                title={`Page ${pageNum}`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Page (>) */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="admin-pagination-nav-btn"
          title="Next Page (>)"
          aria-label="Next Page"
        >
          <ChevronRight size={16} />
        </button>

        {/* Last Page (>>) */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="admin-pagination-nav-btn"
          title="Last Page (>>)"
          aria-label="Last Page"
        >
          <ChevronsRight size={16} />
        </button>
      </div>

      <style jsx>{`
        .admin-pagination-container {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          padding: 0.85rem 0 0.25rem;
          border-top: 1px solid #e2e8f0;
          margin-top: 1rem;
          width: 100%;
          box-sizing: border-box;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .admin-pagination-info {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
          white-space: nowrap;
        }

        .admin-pagination-info strong {
          color: #0f291e;
        }

        .admin-pagination-controls {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: wrap;
          max-width: 100%;
        }

        .admin-pagination-pages {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex-wrap: wrap;
        }

        .admin-pagination-nav-btn {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justifyContent: center;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background-color: #fff;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s ease;
          user-select: none;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .admin-pagination-nav-btn:hover:not(:disabled) {
          background-color: #f8fafc;
          border-color: #94a3b8;
          color: #0f291e;
        }

        .admin-pagination-nav-btn:disabled {
          background-color: #f1f5f9;
          color: #94a3b8;
          cursor: not-allowed;
          opacity: 0.6;
          border-color: #e2e8f0;
        }

        .admin-pagination-page-btn {
          min-width: 32px;
          height: 32px;
          padding: 0 0.35rem;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background-color: #fff;
          color: #334155;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justifyContent: center;
          transition: all 0.15s ease;
          user-select: none;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .admin-pagination-page-btn:hover:not(.is-active) {
          background-color: #f8fafc;
          border-color: #94a3b8;
        }

        .admin-pagination-page-btn.is-active {
          border-color: #d97706;
          background-color: var(--color-forest, #0f291e);
          color: #fff;
          font-weight: 900;
          box-shadow: 0 2px 6px rgba(15, 41, 30, 0.25);
        }

        .admin-pagination-ellipsis {
          padding: 0 0.2rem;
          color: #94a3b8;
          font-size: 0.8rem;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .admin-pagination-container {
            flex-direction: column;
            align-items: center;
            justifyContent: center;
            text-align: center;
            gap: 0.6rem;
          }

          .admin-pagination-controls {
            justify-content: center;
            width: 100%;
          }

          .admin-pagination-info {
            width: 100%;
            text-align: center;
            font-size: 0.76rem;
          }
        }

        @media (max-width: 480px) {
          .admin-pagination-nav-btn {
            width: 28px;
            height: 28px;
          }

          .admin-pagination-page-btn {
            min-width: 28px;
            height: 28px;
            font-size: 0.74rem;
          }
        }
      `}</style>
    </div>
  );
}
