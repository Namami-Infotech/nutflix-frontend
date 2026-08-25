'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import Pagination from '@/components/Pagination';

interface CategoriesViewProps {
  categories: any[];
  searchQuery: string;
  onAddCategory: () => void;
  onEditCategory: (category: any) => void;
  onDeleteCategory: (id: number) => void;
}

export default function CategoriesView({
  categories,
  searchQuery,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}: CategoriesViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredCategories = categories.filter(
    c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f291e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FolderTree size={18} color="#8b5cf6" /> Total Categories Table
          </h3>
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
            Showing {paginatedCategories.length} of {filteredCategories.length} categories.
          </p>
        </div>
        <button
          onClick={onAddCategory}
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
          <Plus size={15} /> Add Category
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.35rem', textAlign: 'left', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
          <thead>
            <tr style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Cover</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Category Name</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>URL Slug</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Keywords</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((cat) => {
              const kws = Array.isArray(cat.keywords) ? cat.keywords : (cat.keywords ? (typeof cat.keywords === 'string' ? JSON.parse(cat.keywords) : [cat.name]) : [cat.name]);
              return (
                <tr key={cat.id} style={{ backgroundColor: '#faf8f5', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.55rem 0.75rem', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                    <CategoryImageCell cat={cat} />
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', fontWeight: 800, color: '#0f291e', fontSize: '0.88rem' }}>
                    {cat.name}
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700 }}>
                      /{cat.slug}
                    </span>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '220px' }}>
                      {kws.slice(0, 3).map((kw: string, i: number) => (
                        <span key={i} style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '0.15rem 0.4rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
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
                <td style={{ padding: '0.55rem 0.75rem', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => onEditCategory(cat)}
                      style={{ padding: '0.3rem 0.6rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <Edit size={13} /> Edit
                    </button>
                    <button
                      onClick={() => onDeleteCategory(cat.id)}
                      style={{ padding: '0.3rem 0.6rem', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredCategories.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

function CategoryImageCell({ cat }: { cat: any }) {
  const fallback = 'https://images.unsplash.com/photo-1608797178974-15b35a640578?auto=format&fit=crop&w=100&q=80';
  const initialUrl = cat.imageUrl || cat.image || fallback;
  const [imgSrc, setImgSrc] = useState(initialUrl);

  React.useEffect(() => {
    setImgSrc(cat.imageUrl || cat.image || fallback);
  }, [cat.imageUrl, cat.image]);

  return (
    <img
      src={imgSrc}
      alt={cat.name}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
      style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
    />
  );
}

