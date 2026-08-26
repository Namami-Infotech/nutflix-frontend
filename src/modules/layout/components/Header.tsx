'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, Search, X, Heart, Leaf, User } from 'lucide-react';
import { useCart } from '@/modules/cart/cart.context';
import { useAuth } from '@/modules/auth';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchCategories, fetchProducts, Category, Product } from '@/lib/api';

export const Header: React.FC<{ onSearch?: (query: string) => void }> = ({ onSearch }) => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const { openCart, totalItems } = useCart();
  const { isLoggedIn, user: currentUser, openLoginModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [searchOpen, setSearchOpen] = useState(false);
  const isAdmin = currentUser?.role?.toLowerCase() === 'admin';
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load catalog items for predictive search when search is opened
  React.useEffect(() => {
    if (searchOpen) {
      Promise.all([fetchCategories(), fetchProducts()]).then(([cats, prods]) => {
        setCategoriesList(cats || []);
        setProductsList(prods || []);
      });
    }
  }, [searchOpen]);

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchKeyword = (keywords: any, q: string) => {
    if (!keywords) return false;
    if (Array.isArray(keywords)) return keywords.some(k => String(k).toLowerCase().includes(q));
    if (typeof keywords === 'string') {
      try {
        const parsed = JSON.parse(keywords);
        if (Array.isArray(parsed)) return parsed.some(k => String(k).toLowerCase().includes(q));
      } catch (e) {}
      return keywords.toLowerCase().includes(q);
    }
    return false;
  };

  const matchedCategories = debouncedQuery.trim()
    ? categoriesList.filter(c => {
        const q = debouncedQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          matchKeyword(c.keywords, q)
        );
      }).slice(0, 3)
    : [];

  const matchedProducts = debouncedQuery.trim()
    ? productsList.filter(p => {
        const q = debouncedQuery.toLowerCase();
        const cat = categoriesList.find(c => c.id === p.categoryId);
        return (
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.origin && p.origin.toLowerCase().includes(q)) ||
          matchKeyword(p.keywords, q) ||
          (cat && cat.name.toLowerCase().includes(q)) ||
          (cat && matchKeyword(cat.keywords, q))
        );
      }).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div className="container header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '65px' }}>
          {/* Brand Logo - Exact nutflix wordmark with dual-color, leaf on i and chand from u to l */}
          <Link href="/" className="header-brand-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', minWidth: 0 }}>
            <svg viewBox="0 0 145 44" width="145" height="44" style={{ display: 'block', overflow: 'visible', maxWidth: '100%' }}>
              <defs>
                <linearGradient id="headerGoldChand" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#C58526" />
                  <stop offset="50%" stopColor="#E5A638" />
                  <stop offset="100%" stopColor="#C58526" />
                </linearGradient>
              </defs>
              <g transform="translate(0, 2)">
                {/* 'nut' in rich chocolate brown */}
                <text x="0" y="28" fontFamily="'Outfit', 'Poppins', 'Montserrat', -apple-system, sans-serif" fontSize="33" fontWeight="900" fill="#23160C" letterSpacing="-0.5px">
                  nut
                </text>
                {/* 'fl' in rich forest olive green */}
                <text x="52" y="28" fontFamily="'Outfit', 'Poppins', 'Montserrat', -apple-system, sans-serif" fontSize="33" fontWeight="900" fill="#1D4A22" letterSpacing="-0.5px">
                  fl
                </text>
                {/* 'ı' stem without dot */}
                <text x="78" y="28" fontFamily="'Outfit', 'Poppins', 'Montserrat', -apple-system, sans-serif" fontSize="33" fontWeight="900" fill="#1D4A22">
                  ı
                </text>
                {/* 'x' */}
                <text x="88" y="28" fontFamily="'Outfit', 'Poppins', 'Montserrat', -apple-system, sans-serif" fontSize="33" fontWeight="900" fill="#1D4A22" letterSpacing="-0.5px">
                  x
                </text>
                {/* Leaf cluster on 'i' matching photo */}
                <g transform="translate(82, 8)">
                  <path d="M 0,0 C -3.5,-7 -11,-8 -14,-3 C -16,2 -6,3 0,0 Z" fill="#1D4A22" />
                  <path d="M 0,-1 C 0,-7 7,-11 11,-7 C 13,-2.5 5,-1 0,-1 Z" fill="#26612E" />
                  <path d="M 1.5,-1 C 5,-8 15,-9 19,-4 C 21,1.5 9,2.5 1.5,-1 Z" fill="#1D4A22" />
                </g>
                {/* TM in small uppercase */}
                <text x="110" y="10" fontFamily="'Inter', sans-serif" fontSize="7.5" fontWeight="800" fill="#23160C">TM</text>

                {/* Golden Chand Curve strictly from 'u' to 'l' with thick middle and tapered ends */}
                <path d="M 24,33 C 39,43 60,43 75,33 C 60,39.5 39,39.5 24,33 Z" fill="url(#headerGoldChand)" />
              </g>
            </svg>
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }} className="desktop-nav">
            <Link href="/" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-forest)' }}>
              Home
            </Link>
            <Link href="/products" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-forest)' }}>
              Shop All
            </Link>
            <Link href="/categories/cashews-nuts" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-forest)' }}>
              Cashews & Nuts
            </Link>
            <Link href="/about" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-forest)' }}>
              About
            </Link>
            <Link href="/contact" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-forest)' }}>
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
            {/* Search Bar with Debounced Suggestions */}
            <div ref={searchContainerRef} style={{ position: 'relative' }}>
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                {searchOpen ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#f5efe6', padding: '0.2rem 0.5rem', borderRadius: '30px', border: '1px solid var(--color-border)' }}>
                    <input
                      type="text"
                      placeholder="Search category or product..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: '0.8rem',
                        width: '210px',
                        color: 'var(--color-forest)',
                      }}
                      autoFocus
                    />
                    {searchQuery && (
                      <button type="button" onClick={() => setSearchQuery('')} style={{ padding: 2, background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={14} color="var(--color-text-muted)" />
                      </button>
                    )}
                    <button type="button" onClick={() => { setSearchOpen(false); setShowSuggestions(false); }} style={{ padding: 2, background: 'none', border: 'none', cursor: 'pointer' }}>
                      <X size={14} color="var(--color-forest)" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className="header-action-btn"
                    style={{ padding: '0.45rem', borderRadius: '50%', backgroundColor: 'var(--color-cream-light)', border: 'none', cursor: 'pointer' }}
                    title="Search Products & Categories"
                  >
                    <Search size={17} color="var(--color-forest)" />
                  </button>
                )}
              </form>

              {/* Debounced Predictive Suggestions Popup Dropdown */}
              {searchOpen && showSuggestions && debouncedQuery.trim() !== '' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '320px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    border: '1px solid var(--color-border)',
                    padding: '0.75rem',
                    zIndex: 100,
                    overflow: 'hidden',
                  }}
                >
                  {/* Category Matches */}
                  {matchedCategories.length > 0 && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                        Categories
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {matchedCategories.map((cat) => (
                          <Link
                            key={cat.id || cat.slug}
                            href={`/products?category=${encodeURIComponent(cat.slug)}`}
                            onClick={() => {
                              setShowSuggestions(false);
                              setSearchOpen(false);
                            }}
                            style={{
                              backgroundColor: 'var(--color-cream-light)',
                              color: 'var(--color-forest)',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              padding: '0.3rem 0.7rem',
                              borderRadius: '20px',
                              textDecoration: 'none',
                              border: '1px solid #e2d5c3',
                              display: 'inline-block',
                            }}
                          >
                            🏷️ {cat.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product Matches */}
                  {matchedProducts.length > 0 ? (
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                        Products
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {matchedProducts.map((prod) => (
                          <div
                            key={prod.id}
                            onClick={() => {
                              setShowSuggestions(false);
                              setSearchOpen(false);
                              router.push(`/products?search=${encodeURIComponent(prod.name)}`);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.6rem',
                              padding: '0.35rem',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                              textDecoration: 'none',
                              color: 'inherit',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAF7F2')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <img
                              src={prod.imageUrl || '/logo.svg'}
                              alt={prod.name}
                              style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#eee' }}
                            />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-forest)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {prod.name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--color-gold)', fontWeight: 800 }}>
                                ₹{prod.price}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    matchedCategories.length === 0 && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', padding: '0.5rem 0', textAlign: 'center' }}>
                        No results found for "{debouncedQuery}"
                      </div>
                    )
                  )}

                  {/* All Results Footer */}
                  <div
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchOpen(false);
                      router.push(`/products?search=${encodeURIComponent(debouncedQuery.trim())}`);
                    }}
                    style={{
                      marginTop: '0.6rem',
                      paddingTop: '0.6rem',
                      borderTop: '1px solid var(--color-border)',
                      textAlign: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: 'var(--color-forest)',
                      cursor: 'pointer',
                    }}
                  >
                    View all search results →
                  </div>
                </div>
              )}
            </div>

            {/* Profile Icon Button */}
            <button
              type="button"
              onClick={() => {
                if (!isLoggedIn) {
                  openLoginModal(() => {
                    router.push('/profile');
                  });
                } else {
                  router.push('/profile');
                }
              }}
              className="header-action-btn"
              style={{
                padding: '0.45rem',
                borderRadius: '50%',
                backgroundColor: 'var(--color-cream-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'var(--transition)',
                border: 'none',
                position: 'relative',
              }}
              title={currentUser ? `Profile (${currentUser.name || currentUser.email} - ${currentUser.role || 'User'})` : "Sign In / Register"}
            >
              <User size={17} color="var(--color-forest)" />
              {currentUser && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: currentUser?.role?.toLowerCase() === 'admin' ? '#10b981' : 'var(--color-gold)',
                    border: '1.5px solid #fff',
                  }}
                />
              )}
            </button>

            {/* Quick Admin Navigation button */}
            {isAdmin && (
              <Link
                href="/admin"
                style={{
                  backgroundColor: '#f5efe6',
                  color: 'var(--color-forest)',
                  padding: '0.45rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  border: '1px solid #e2d5c3',
                }}
                title="Admin Dashboard"
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                Admin
              </Link>
            )}

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="header-cart-btn"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                backgroundColor: 'var(--color-forest)',
                color: '#fff',
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 700,
                fontSize: '0.82rem',
                transition: 'var(--transition)',
                flexShrink: 0,
              }}
            >
              <ShoppingBag size={16} color="var(--color-gold)" />
              <span className="cart-text">Basket</span>
              {totalItems > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--color-gold)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '2px',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <style jsx>{`
        @media (max-width: 480px) {
          .header-container {
            padding: 0 0.5rem !important;
          }
          .header-logo-icon {
            width: 30px !important;
            height: 30px !important;
          }
          .header-logo-text {
            font-size: 1.02rem !important;
          }
          .header-actions {
            gap: 0.2rem !important;
          }
          .header-action-btn {
            padding: 0.35rem !important;
          }
          .header-cart-btn {
            padding: 0.4rem 0.6rem !important;
          }
        }
        @media (max-width: 360px) {
          .header-container {
            padding: 0 0.35rem !important;
          }
          .header-logo-text {
            font-size: 0.92rem !important;
          }
          .header-logo-icon {
            width: 26px !important;
            height: 26px !important;
          }
        }
      `}</style>
    </>
  );
};
