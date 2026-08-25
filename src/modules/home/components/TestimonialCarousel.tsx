'use client';

import React from 'react';
import { Review } from '@/lib/api';
import { Star, CheckCircle } from 'lucide-react';

interface Props {
  reviews: Review[];
}

export const TestimonialCarousel: React.FC<Props> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  // Duplicate reviews array 3 times for seamless infinite looping
  const displayReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section style={{ backgroundColor: 'var(--color-bg-light)', padding: '5rem 0', borderTop: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <style>{`
        @keyframes scrollRightToLeft {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .marquee-track {
          display: flex;
          gap: 2rem;
          width: max-content;
          animation: scrollRightToLeft 30s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="container" style={{ marginBottom: '2.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
          <span className="badge-impact" style={{ marginBottom: '0.8rem' }}>Customer Love</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>
            Let Customers Speak For Us
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
            Rated 4.95 / 5 based on verified customer reviews
          </p>
        </div>
      </div>

      {/* Auto-Scrolling Marquee Track (Right to Left) */}
      <div style={{ width: '100%', overflow: 'hidden', padding: '0.5rem 0' }}>
        <div className="marquee-track">
          {displayReviews.map((rev, index) => (
            <div
              key={`${rev.id}-${index}`}
              style={{
                width: '360px',
                flexShrink: 0,
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="var(--color-gold)" color="var(--color-gold)" />
                    ))}
                  </div>
                  {rev.verified && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#276749' }}>
                      <CheckCircle size={14} /> Verified Buyer
                    </span>
                  )}
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>
                  "{rev.title}"
                </h4>

                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  {rev.comment}
                </p>
              </div>

              <div style={{ borderTop: '1px solid #f0e8de', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-forest)' }}>
                  {rev.author}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Verified Purchase
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
