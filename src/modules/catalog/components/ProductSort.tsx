import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating';

export interface ProductSortProps {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
}

export const ProductSort: React.FC<ProductSortProps> = ({ sortBy, onSortChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <ArrowUpDown size={16} color="var(--color-text-muted)" />
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-forest)' }}>
        Sort By:
      </span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        style={{
          padding: '0.4rem 0.8rem',
          borderRadius: 'var(--radius-pill)',
          border: '1.5px solid var(--color-border)',
          backgroundColor: '#ffffff',
          color: 'var(--color-forest)',
          fontWeight: 700,
          fontSize: '0.85rem',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        <option value="featured">Featured First</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
      </select>
    </div>
  );
};
