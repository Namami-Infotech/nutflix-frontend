import React from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onQuickView?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onQuickView,
}) => {
  if (isLoading) {
    return (
      <div className="product-grid-container">
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ borderRadius: '20px', padding: '1rem', backgroundColor: '#fff' }}>
            <Skeleton height="150px" borderRadius="16px" style={{ marginBottom: '0.8rem' }} />
            <Skeleton height="20px" width="70%" style={{ marginBottom: '0.4rem' }} />
            <Skeleton height="14px" width="90%" style={{ marginBottom: '0.8rem' }} />
            <Skeleton height="32px" width="50%" borderRadius="20px" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#ffffff', borderRadius: '24px', border: '1px dashed var(--color-border)' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>
          No Products Found
        </h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Try clearing your search query or choosing a different category filter.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="product-grid-container">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
        ))}
      </div>

      <style jsx>{`
        .product-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }
        @media (max-width: 640px) {
          .product-grid-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.85rem;
          }
        }
        @media (max-width: 360px) {
          .product-grid-container {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
};
