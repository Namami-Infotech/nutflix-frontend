'use client';

import React from 'react';
import { Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const BrandStory: React.FC = () => {
  return (
    <section style={{ padding: '5.5rem 0', backgroundColor: '#ffffff' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          {/* Left Grid Images */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80"
              alt="Kilimanjaro Coffee Harvest"
              style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '20px' }}
            />
            <img
              src="https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80"
              alt="Miombo Wild Honey Beekeeping"
              style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '20px', marginTop: '2rem' }}
            />
          </div>

          {/* Right Text */}
          <div>
            <span className="badge-impact" style={{ marginBottom: '0.8rem' }}>Our Purpose</span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--color-forest)', lineHeight: '1.2', marginBottom: '1.2rem' }}>
              We Believe Premium Taste Should Create Lasting Impact
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              At Tanza Kindness, every product tells a story of craftsmanship and ethical partnership. We bypass exploitative middlemen to work directly with smallholder farming cooperatives across Southern and Northern Tanzania.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <CheckCircle2 size={20} color="var(--color-gold)" />
                <span style={{ fontWeight: 700, color: 'var(--color-forest)', fontSize: '0.95rem' }}>
                  Direct Fair Trade Premiums paid straight to growers
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <CheckCircle2 size={20} color="var(--color-gold)" />
                <span style={{ fontWeight: 700, color: 'var(--color-forest)', fontSize: '0.95rem' }}>
                  A portion of every sale funds local health clinics & clean water
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <CheckCircle2 size={20} color="var(--color-gold)" />
                <span style={{ fontWeight: 700, color: 'var(--color-forest)', fontSize: '0.95rem' }}>
                  100% natural, preservative-free artisanal processing
                </span>
              </div>
            </div>

            <Link href="/impact" className="btn-secondary">
              <Heart size={18} color="var(--color-gold)" />
              <span>Read Our Full Impact Story</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
