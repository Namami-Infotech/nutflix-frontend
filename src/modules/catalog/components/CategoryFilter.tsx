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
        <span>All Fruits</span>
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

import { OptimizedImage } from '@/components/ui/OptimizedImage';

const CategoryFilterItem: React.FC<{ cat: Category; isSelected: boolean; onSelectCategory: (slug: string | null) => void }> = ({ cat, isSelected, onSelectCategory }) => {
  const defaultFallback = 'https://images.unsplash.com/photo-1608797178974-15b35a640578?auto=format&fit=crop&w=100&q=80';
  const imgUrl = cat.imageUrl || (cat as any).image || defaultFallback;

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
      <div
        style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          border: isSelected ? '1px solid var(--color-gold)' : '1px solid var(--color-border)',
        }}
      >
        <OptimizedImage
          src={imgUrl}
          fallbackSrc={defaultFallback}
          alt={cat.name}
          priority={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
      <span>{cat.name}</span>
    </button>
  );
};

