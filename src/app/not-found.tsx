import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div style={{ maxWidth: '520px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-gold-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <Leaf size={32} color="var(--color-gold)" />
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.8rem' }}>
          404 - Page Not Found
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '2rem' }}>
          The harvest page or product collection you are looking for does not exist or may have moved.
        </p>

        <Link href="/products" className="btn-primary">
          <ArrowLeft size={18} />
          <span>Explore All Products</span>
        </Link>
      </div>
    </div>
  );
}
