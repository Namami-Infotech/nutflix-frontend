import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '70vh' }}>
      <Skeleton height="180px" borderRadius="24px" style={{ marginBottom: '2rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ borderRadius: '20px', padding: '1.5rem', backgroundColor: '#fff', border: '1px solid var(--color-border)' }}>
            <Skeleton height="200px" borderRadius="16px" style={{ marginBottom: '1rem' }} />
            <Skeleton height="24px" width="75%" style={{ marginBottom: '0.5rem' }} />
            <Skeleton height="16px" width="90%" style={{ marginBottom: '1rem' }} />
            <Skeleton height="36px" width="45%" borderRadius="20px" />
          </div>
        ))}
      </div>
    </div>
  );
}
