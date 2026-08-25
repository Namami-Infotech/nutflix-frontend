import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'impact' | 'category' | 'featured';
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'impact',
  className = '',
  style,
}) => {
  if (variant === 'impact') {
    return (
      <span className={`badge-impact ${className}`} style={style}>
        {children}
      </span>
    );
  }

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.75rem',
    fontWeight: 800,
    padding: '0.25rem 0.75rem',
    borderRadius: 'var(--radius-pill)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    backgroundColor: variant === 'featured' ? 'var(--color-forest)' : 'var(--color-cream)',
    color: variant === 'featured' ? '#ffffff' : 'var(--color-forest)',
    ...style,
  };

  return (
    <span className={className} style={badgeStyle}>
      {children}
    </span>
  );
};
