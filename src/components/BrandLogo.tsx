'use client';

import React from 'react';

interface BrandLogoProps {
  width?: number | string;
  height?: number | string;
  variant?: 'dark' | 'light';
  showAdminBadge?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function BrandLogo({
  width,
  height,
  variant = 'light',
  showAdminBadge = false,
  className,
  style,
}: BrandLogoProps) {
  const isDark = variant === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        minWidth: 0,
        ...style,
      }}
      className={className}
    >
      <img
        src="/brand-logo-original.png"
        alt="NUTFLIX"
        style={{
          height: height ? (typeof height === 'number' ? `${height}px` : height) : '48px',
          width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
          maxWidth: '100%',
          objectFit: 'contain',
          borderRadius: '6px',
          display: 'block',
        }}
      />
    </div>
  );
}
