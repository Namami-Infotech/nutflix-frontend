'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;
  return (
    <div
      style={{
        backgroundColor: 'var(--color-forest-dark)',
        color: '#eadfcb',
        padding: '0.4rem 0.8rem',
        fontSize: '0.8rem',
        fontWeight: 600,
        textAlign: 'center',
        letterSpacing: '0.03em',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <Sparkles size={14} color="var(--color-gold)" style={{ flexShrink: 0 }} />
      <span className="announcement-bar-text" style={{ lineHeight: 1.3 }}>
        ✨ Welcome to NUTFLIX by DARSHAN TECHNO SYSTEM • Call/WhatsApp: +91 98300-55527
      </span>
      <Sparkles size={14} color="var(--color-gold)" style={{ flexShrink: 0 }} />
    </div>
  );
};
