'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-forest-dark)',
        color: '#eadfcb',
        padding: '0.5rem 1rem',
        fontSize: '0.82rem',
        fontWeight: 600,
        textAlign: 'center',
        letterSpacing: '0.04em',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.6rem',
      }}
    >
      <Sparkles size={14} color="var(--color-gold)" />
      <span>🌱 Ethically Sourced from Tanzania • Free shipping on orders over ₹500 • Fueling Change Together</span>
      <Sparkles size={14} color="var(--color-gold)" />
    </div>
  );
};
