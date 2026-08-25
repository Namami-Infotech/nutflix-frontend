'use client';

import React from 'react';
import { Category } from '@/lib/api';

interface Props {
  categories: Category[];
  selectedSlug: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export const CategoryFilter: React.FC<Props> = ({ categories, selectedSlug, onSelectCategory }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        gap: '0.8rem',
        justifyContent: 'flex-start',
        marginBottom: '2.5rem',
        paddingBottom: '0.5rem',
        WebkitOverflowScrolling: 'touch',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
      className="category-filter-scroll"
    >
      <button
        onClick={() => onSelectCategory(null)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.55rem 1.3rem',
          borderRadius: 'var(--radius-pill)',
          fontWeight: 700,
          fontSize: '0.88rem',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          border: selectedSlug === null ? 'none' : '1px solid var(--color-border)',
          backgroundColor: selectedSlug === null ? 'var(--color-forest)' : '#ffffff',
          color: selectedSlug === null ? '#ffffff' : 'var(--color-forest)',
          boxShadow: selectedSlug === null ? 'var(--shadow-sm)' : 'none',
          transition: 'var(--transition)',
          cursor: 'pointer',
        }}
      >
        <span>All Dry Fruits</span>
      </button>

      {categories.map((cat) => (
        <CategoryFilterItem
          key={cat.id}
          cat={cat}
          isSelected={selectedSlug === cat.slug}
          onSelectCategory={onSelectCategory}
        />
      ))}
    </div>
  );
};

const CategoryFilterItem: React.FC<{ cat: Category; isSelected: boolean; onSelectCategory: (slug: string | null) => void }> = ({ cat, isSelected, onSelectCategory }) => {
  const defaultFallback = 'https://images.unsplash.com/photo-1608797178974-15b35a640578?auto=format&fit=crop&w=100&q=80';
  const initialUrl = cat.imageUrl || (cat as any).image || defaultFallback;
  const [imgSrc, setImgSrc] = React.useState(initialUrl);

  React.useEffect(() => {
    setImgSrc(cat.imageUrl || (cat as any).image || defaultFallback);
  }, [cat.imageUrl, (cat as any).image]);

  return (
    <button
      onClick={() => onSelectCategory(cat.slug)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.55rem',
        padding: '0.45rem 1.25rem 0.45rem 0.65rem',
        borderRadius: 'var(--radius-pill)',
        fontWeight: 700,
        fontSize: '0.88rem',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        border: isSelected ? 'none' : '1px solid var(--color-border)',
        backgroundColor: isSelected ? 'var(--color-forest)' : '#ffffff',
        color: isSelected ? '#ffffff' : 'var(--color-forest)',
        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
        transition: 'var(--transition)',
        cursor: 'pointer',
      }}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt={cat.name}
          onError={() => {
            if (imgSrc !== defaultFallback) {
              setImgSrc(defaultFallback);
            }
          }}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: isSelected ? '1px solid var(--color-gold)' : '1px solid var(--color-border)',
          }}
        />
      )}
      <span>{cat.name}</span>
    </button>
  );
};

