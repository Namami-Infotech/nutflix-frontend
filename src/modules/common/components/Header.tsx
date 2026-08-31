'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, Heart, Leaf } from 'lucide-react';
import { useCart } from '../../cart/cart.context';

export const Header: React.FC<{ onSearch?: (query: string) => void }> = ({ onSearch }) => {
  const { openCart, totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', color: 'var(--color-forest)' }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(22, 35, 26, 0.2)',
            }}
          >
            <Leaf size={22} color="var(--color-gold)" />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 900,
                fontSize: '1.4rem',
                letterSpacing: '0.04em',
                color: 'var(--color-forest)',
                display: 'block',
                lineHeight: 1,
              }}
            >
              TANZA<span style={{ color: 'var(--color-gold)' }}>KINDNESS</span>
            </span>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              Taste & Fuel Change
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          <Link href="/" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-forest)' }}>
            Home
          </Link>
          <Link href="/products" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-forest)' }}>
            Shop All
          </Link>
          <Link href="/categories/cashews-nuts" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-forest)' }}>
            Categories
          </Link>
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Search Trigger */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {searchOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f5efe6', padding: '0.3rem 0.8rem', borderRadius: '30px' }}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (onSearch) onSearch(e.target.value);
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.85rem',
                    width: '160px',
                    color: 'var(--color-forest)',
                  }}
                  autoFocus
                />
                <button type="button" onClick={() => setSearchOpen(false)} style={{ padding: 2 }}>
                  <X size={16} color="var(--color-text-muted)" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                style={{ padding: '0.6rem', borderRadius: '50%', backgroundColor: 'var(--color-cream-light)' }}
                title="Search"
              >
                <Search size={20} color="var(--color-forest)" />
              </button>
            )}
          </form>

          {/* Cart Drawer Trigger Button */}
          <button
            onClick={openCart}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-forest)',
              color: '#fff',
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'var(--transition)',
            }}
          >
            <ShoppingBag size={18} color="var(--color-gold)" />
            <span>Basket</span>
            {totalItems > 0 && (
              <span
                style={{
                  backgroundColor: 'var(--color-gold)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '4px',
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
