'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Package, User } from 'lucide-react';

export const MobileBottomBar: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop All', href: '/products', icon: ShoppingBag },
    { label: 'Cashews & Nuts', href: '/categories/cashews-nuts', icon: Package },
    { label: 'My Orders', href: '/my-orders', icon: User },
  ];

  return (
    <div
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 45,
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
        padding: '0.5rem 0.5rem calc(0.5rem + env(safe-area-inset-bottom))',
        display: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          maxWidth: '500px',
          margin: '0 auto',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                textDecoration: 'none',
                color: isActive
                  ? 'var(--color-forest)'
                  : 'var(--color-text-muted)',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.72rem',
                flex: 1,
                textAlign: 'center',
                padding: '0.2rem 0',
              }}
            >
              <Icon
                size={20}
                color={
                  isActive
                    ? 'var(--color-forest)'
                    : 'var(--color-text-muted)'
                }
                fill={isActive ? 'var(--color-forest)' : 'none'}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <style jsx global>{`
        @media (max-width: 992px) {
          .mobile-bottom-nav {
            display: block !important;
          }
          body {
            padding-bottom: 60px !important;
          }
        }
      `}</style>

    </div>
  );
};
