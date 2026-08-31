'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingBag, Search, X, Heart, Leaf, User, Menu } from 'lucide-react';
import { useCart } from '@/modules/cart/cart.context';
import { useAuth } from '@/modules/auth';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchCategories, fetchProducts, Category, Product } from '@/lib/api';
import { MobileSidebar } from './MobileSidebar';

export const Header: React.FC<{ onSearch?: (query: string) => void }> = ({ onSearch }) => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const { openCart, totalItems } = useCart();
  const { isLoggedIn, user: currentUser, openLoginModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
      } catch (e) { }
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
        {/* Full-width Mobile Search Bar Overlay */}
        {searchOpen && (
          <div
            className="mobile-search-overlay"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#ffffff',
              zIndex: 65,
              display: 'flex',
              alignItems: 'center',
              padding: '0 0.75rem',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            }}
          >
            <Search size={18} color="var(--color-forest)" style={{ flexShrink: 0 }} />
            <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0, margin: 0 }}>
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
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.92rem',
                  color: 'var(--color-forest)',
                  fontWeight: 600,
                }}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                  title="Clear text"
                >
                  <X size={16} color="var(--color-text-muted)" />
                </button>
              )}
            </form>
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setShowSuggestions(false);
              }}
              style={{
                padding: '0.35rem 0.75rem',
                backgroundColor: 'var(--color-cream-light)',
                border: '1px solid var(--color-border)',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--color-forest)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Cancel
            </button>
          </div>
        )}

        <div className="container header-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '65px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
            {/* Mobile Hamburger Menu Button (visible on mobile / tablet <= 992px) */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="mobile-menu-toggle-btn"
              aria-label="Open navigation menu"
              title="Menu"
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.45rem',
                borderRadius: '50%',
                backgroundColor: 'var(--color-cream-light)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-forest)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <Menu size={19} />
            </button>

            {/* Brand Logo - Exact nutflix image */}
            <Link href="/" className="header-brand-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', minWidth: 0 }}>
              <img
                src="/brand-logo.png"
                alt="NUTFLIX"
                style={{
                  height: '42px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }} className="desktop-nav">
            <Link href="/" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-forest)' }}>
              Home
            </Link>
            <Link href="/products" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-forest)' }}>
              Shop All
            </Link>
            <Link href="/categories/cashews-nuts" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-forest)' }}>
             Categories
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
            {/* Search Bar Container */}
            <div ref={searchContainerRef} style={{ position: 'relative' }}>
              {/* Desktop Expandable Search Form */}
              <form onSubmit={handleSearchSubmit} className="desktop-search-form" style={{ display: 'flex', alignItems: 'center' }}>
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

              {/* Mobile Search Trigger Icon Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="header-action-btn mobile-search-trigger"
                style={{ display: 'none', padding: '0.45rem', borderRadius: '50%', backgroundColor: 'var(--color-cream-light)', border: 'none', cursor: 'pointer' }}
                title="Search Products & Categories"
              >
                <Search size={17} color="var(--color-forest)" />
              </button>

              {/* Debounced Predictive Suggestions Popup Dropdown */}
              {searchOpen && showSuggestions && debouncedQuery.trim() !== '' && (
                <div
                  className="search-suggestions-dropdown"
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
                              router.push(`/products/${prod.slug || prod.id}`);
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

            {/* Cart Trigger (Hidden for Admin) */}
            {!isAdmin && (
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
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <style jsx>{`
        @media (max-width: 992px) {
          .mobile-menu-toggle-btn {
            display: flex !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-search-form {
            display: none !important;
          }
          .mobile-search-trigger {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          .search-suggestions-dropdown {
            position: fixed !important;
            top: 66px !important;
            left: 10px !important;
            right: 10px !important;
            width: auto !important;
            max-width: calc(100vw - 20px) !important;
            max-height: 72vh !important;
            overflow-y: auto !important;
            box-shadow: 0 12px 30px rgba(0,0,0,0.2) !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-search-overlay {
            display: none !important;
          }
        }
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
