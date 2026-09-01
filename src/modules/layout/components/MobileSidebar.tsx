'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  X,
  User,
  Package,
  Info,
  Phone,
  ShieldCheck,
  FileText,
  Truck,
  LogOut,
  ChevronRight,
  ShoppingCart,
  Home,
  Mail,
  MessageCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/modules/auth';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, logout, openLoginModal } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  // Automatically close sidebar on navigation
  useEffect(() => {
    onClose();
  }, [pathname]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = async () => {
    onClose();
    await logout();
    router.push('/');
  };

  const handleLoginClick = () => {
    onClose();
    openLoginModal(() => {
      router.push('/');
    });
  };

  return (
    <div
      className="mobile-sidebar-container"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
      }}
    >
      {/* Backdrop overlay */}
      <div
        className="mobile-sidebar-overlay"
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(22, 35, 26, 0.65)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Sidebar Drawer Panel */}
      <div
        className="mobile-sidebar-drawer"
        style={{
          position: 'relative',
          width: '85%',
          maxWidth: '360px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '4px 0 25px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10000,
          animation: 'slideInLeft 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          overflowY: 'auto',
        }}
      >
        {/* Top Header with User Info / Brand */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--color-forest-dark) 0%, var(--color-forest) 100%)',
            color: '#ffffff',
            padding: '1.4rem 1.2rem 1.2rem',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <X size={20} />
          </button>

          {/* User Profile Card */}
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-gold)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                  flexShrink: 0,
                  textTransform: 'uppercase',
                }}
              >
                {user?.name ? user.name.charAt(0) : user?.email ? user.email.charAt(0) : 'U'}
              </div>
              <div style={{ minWidth: 0, flex: 1, paddingRight: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: '1.02rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user?.name || 'Valued Customer'}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: '#c0d4c5',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '2px',
                  }}
                >
                  {user?.email}
                </div>
                <div style={{ marginTop: '5px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: isAdmin ? '#10b981' : 'rgba(200, 157, 102, 0.35)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {isAdmin ? '🛡️ Administrator' : '✨ Verified Member'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '0.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <Sparkles size={20} color="var(--color-gold)" />
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Welcome to NUTFLIX</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#c0d4c5', marginBottom: '0.9rem', lineHeight: '1.4' }}>
                Sign in to view your orders, saved addresses & exclusive offers.
              </p>
              <button
                onClick={handleLoginClick}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-gold)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  padding: '0.55rem 1.2rem',
                  borderRadius: 'var(--radius-pill)',
                  width: '100%',
                  boxShadow: '0 4px 12px rgba(200, 157, 102, 0.4)',
                }}
              >
                <User size={16} />
                Sign In / Register
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Links & Actions */}
        <div style={{ flex: 1, padding: '1rem 0.9rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Quick Highlight: My Orders (Priority when logged in) */}
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0 0.5rem 0.4rem',
              }}
            >
              Account & Orders
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <Link
                href="/my-orders"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '14px',
                  backgroundColor: pathname === '/my-orders' ? 'var(--color-gold-light)' : '#fbf8f3',
                  border: '1px solid #e8dfd3',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-forest)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-gold)',
                      flexShrink: 0,
                    }}
                  >
                    <Package size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-forest)' }}>
                      My Orders
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                      Track & manage your orders
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--color-gold)" />
              </Link>

              {isLoggedIn && (
                <Link
                  href="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '12px',
                    backgroundColor: pathname === '/profile' ? 'var(--color-cream-light)' : 'transparent',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <User size={18} color="var(--color-forest)" />
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-forest)' }}>
                      Profile & Saved Addresses
                    </span>
                  </div>
                  <ChevronRight size={16} color="var(--color-text-muted)" />
                </Link>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '12px',
                    backgroundColor: '#e6f7ef',
                    border: '1px solid #b7ebd0',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ShieldCheck size={18} color="#10b981" />
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#065f46' }}>
                      Admin Dashboard
                    </span>
                  </div>
                  <ChevronRight size={16} color="#10b981" />
                </Link>
              )}
            </div>
          </div>

          {/* Shopping & Catalog Navigation */}
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0 0.5rem 0.4rem',
              }}
            >
              Explore Shop
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <Link
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.8rem',
                  borderRadius: '10px',
                  color: pathname === '/' ? 'var(--color-gold)' : 'var(--color-forest)',
                  fontWeight: pathname === '/' ? 800 : 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <Home size={18} />
                  <span>Home</span>
                </div>
                <ChevronRight size={15} color="var(--color-text-muted)" />
              </Link>

              <Link
                href="/products"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.8rem',
                  borderRadius: '10px',
                  color: pathname === '/products' ? 'var(--color-gold)' : 'var(--color-forest)',
                  fontWeight: pathname === '/products' ? 800 : 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <ShoppingCart size={18} />
                  <span>Shop All Products</span>
                </div>
                <ChevronRight size={15} color="var(--color-text-muted)" />
              </Link>

              <Link
                href="/categories/cashews-nuts"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.8rem',
                  borderRadius: '10px',
                  color: pathname?.includes('/cashews-nuts') ? 'var(--color-gold)' : 'var(--color-forest)',
                  fontWeight: pathname?.includes('/cashews-nuts') ? 800 : 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <Package size={18} />
                  <span>Categories</span>
                </div>
                <ChevronRight size={15} color="var(--color-text-muted)" />
              </Link>
            </div>
          </div>

          {/* Company & Support Information (Requested: About Us, Contact Info, Privacy Policy) */}
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0 0.5rem 0.4rem',
              }}
            >
              Information & Help
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {/* About Us */}
              <Link
                href="/about"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.8rem',
                  borderRadius: '10px',
                  color: pathname === '/about' ? 'var(--color-gold)' : 'var(--color-forest)',
                  fontWeight: pathname === '/about' ? 800 : 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <Info size={18} color="var(--color-gold)" />
                  <span>About Us</span>
                </div>
                <ChevronRight size={15} color="var(--color-text-muted)" />
              </Link>

              {/* Contact Us */}
              <Link
                href="/contact"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.8rem',
                  borderRadius: '10px',
                  color: pathname === '/contact' ? 'var(--color-gold)' : 'var(--color-forest)',
                  fontWeight: pathname === '/contact' ? 800 : 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <Phone size={18} color="var(--color-gold)" />
                  <span>Contact Info & Support</span>
                </div>
                <ChevronRight size={15} color="var(--color-text-muted)" />
              </Link>

              {/* Privacy Policy */}
              <Link
                href="/privacy-policy"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.8rem',
                  borderRadius: '10px',
                  color: pathname === '/privacy-policy' ? 'var(--color-gold)' : 'var(--color-forest)',
                  fontWeight: pathname === '/privacy-policy' ? 800 : 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <ShieldCheck size={18} color="var(--color-gold)" />
                  <span>Privacy Policy</span>
                </div>
                <ChevronRight size={15} color="var(--color-text-muted)" />
              </Link>

              {/* Terms & Conditions */}
              <Link
                href="/terms"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.8rem',
                  borderRadius: '10px',
                  color: pathname === '/terms' ? 'var(--color-gold)' : 'var(--color-forest)',
                  fontWeight: pathname === '/terms' ? 800 : 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <FileText size={18} color="var(--color-text-muted)" />
                  <span>Terms & Conditions</span>
                </div>
                <ChevronRight size={15} color="var(--color-text-muted)" />
              </Link>

              {/* Return & Refund Policy */}
              <Link
                href="/refund-policy"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.8rem',
                  borderRadius: '10px',
                  color: pathname === '/refund-policy' ? 'var(--color-gold)' : 'var(--color-forest)',
                  fontWeight: pathname === '/refund-policy' ? 800 : 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <Package size={18} color="var(--color-gold)" />
                  <span>Return &amp; Refund Policy</span>
                </div>
                <ChevronRight size={15} color="var(--color-text-muted)" />
              </Link>

              {/* Shipping & Delivery Policy */}
              <Link
                href="/shipping-policy"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.8rem',
                  borderRadius: '10px',
                  color: pathname === '/shipping-policy' ? 'var(--color-gold)' : 'var(--color-forest)',
                  fontWeight: pathname === '/shipping-policy' ? 800 : 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <Truck size={18} color="var(--color-text-muted)" />
                  <span>Shipping Policy</span>
                </div>
                <ChevronRight size={15} color="var(--color-text-muted)" />
              </Link>
            </div>
          </div>

          {/* Quick Contact Card */}
          <div
            style={{
              backgroundColor: '#fbf8f3',
              borderRadius: '16px',
              padding: '1rem',
              border: '1px solid #e8dfd3',
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>
              NUTFLIX (Darshan Techno System)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
              <a
                href="tel:9330193041"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--color-forest)',
                  textDecoration: 'none',
                  fontWeight: 700,
                }}
              >
                <Phone size={14} color="var(--color-gold)" />
                9330193041
              </a>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem', lineHeight: '1.4' }}>
                📍 43, Karaya Road, Kolkata – 700017
              </div>
              <div style={{ color: 'var(--color-gold)', fontSize: '0.72rem', fontWeight: 700 }}>
                FSSAI Lic.: 22826039000325
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                🌐 www.nutflix.in
              </div>
            </div>
          </div>

          {/* Logout Option if user is Logged In */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '0.75rem',
                borderRadius: '12px',
                backgroundColor: '#fff1f0',
                color: '#e11d48',
                border: '1px solid #fed7d7',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                marginTop: 'auto',
              }}
            >
              <LogOut size={18} />
              Sign Out
            </button>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
