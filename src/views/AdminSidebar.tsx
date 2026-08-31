'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import {
  LogOut,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Store,
  X
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  badge: number | null;
  color?: string;
}

interface AdminSidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  sidebarItems: SidebarItem[];
  adminUser: any;
  onLogout: () => void;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function AdminSidebar({
  activeMenu,
  setActiveMenu,
  sidebarItems,
  adminUser,
  onLogout,
  isCollapsed = false,
  setIsCollapsed,
  mobileOpen = false,
  setMobileOpen
}: AdminSidebarProps) {
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobileScreen(window.innerWidth <= 768);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // When on mobile drawer, force collapsed to false so it always renders complete labels & proper width
  const effectiveCollapsed = isCollapsed && !isMobileScreen && !mobileOpen;

  const handleItemClick = (id: string) => {
    setActiveMenu(id);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="admin-sidebar-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
        />
      )}

      <aside
        className={`admin-sidebar-container ${effectiveCollapsed ? 'is-collapsed' : 'is-expanded'} ${mobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: effectiveCollapsed ? '76px' : '265px',
          background: 'linear-gradient(180deg, #091a12 0%, #0f291e 50%, #081710 100%)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '4px 0 25px rgba(0, 0, 0, 0.3)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 95,
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: effectiveCollapsed ? '1.25rem 0.5rem' : '1.25rem 1.15rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
            background: 'rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: effectiveCollapsed ? 'center' : 'space-between',
            gap: '0.6rem',
            position: 'relative',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              minWidth: 0,
              flex: 1,
            }}
            title="NUTFLIX Storefront"
          >
            {effectiveCollapsed ? (
              <BrandLogo width={42} height={32} variant="dark" />
            ) : (
              <BrandLogo width="100%" height={52} variant="dark" />
            )}
          </Link>

          {/* Desktop Toggle Button in Header */}
          {setIsCollapsed && !isMobileScreen && (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#94a3b8',
                padding: '0.35rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: effectiveCollapsed ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Mobile Drawer Close Button */}
          {setMobileOpen && isMobileScreen && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              style={{
                border: 'none',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                padding: '0.4rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Close Menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Collapsed Mode Expand Button */}
        {effectiveCollapsed && setIsCollapsed && (
          <div style={{ padding: '0.6rem 0.5rem 0', display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              style={{
                border: '1px solid rgba(245, 158, 11, 0.3)',
                background: 'rgba(245, 158, 11, 0.1)',
                color: '#f59e0b',
                width: '38px',
                height: '32px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              title="Expand Sidebar"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Navigation Menu */}
        <nav
          style={{
            padding: effectiveCollapsed ? '0.75rem 0.4rem' : '1rem 0.75rem',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: effectiveCollapsed ? '0.45rem' : '0.3rem',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {!effectiveCollapsed && (
            <div style={{ fontSize: '0.62rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.14em', padding: '0 0.6rem 0.4rem' }}>
              MAIN MENU
            </div>
          )}

          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeMenu === item.id;

            if (effectiveCollapsed) {
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    title={`${item.label}${item.badge !== null ? ` (${item.badge})` : ''}`}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      border: isActive ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
                      background: isActive
                        ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'
                        : 'rgba(255, 255, 255, 0.04)',
                      color: isActive ? '#fff' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: isActive ? '0 4px 14px rgba(217, 119, 6, 0.35)' : 'none',
                      position: 'relative',
                      padding: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.color = '#fff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.color = '#94a3b8';
                      }
                    }}
                  >
                    <IconComponent size={19} color={isActive ? '#fff' : item.color || '#cbd5e1'} />
                    {item.badge !== null && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-3px',
                          right: '-3px',
                          backgroundColor: '#ef4444',
                          color: '#fff',
                          fontSize: '0.6rem',
                          fontWeight: 900,
                          borderRadius: '10px',
                          minWidth: '16px',
                          height: '16px',
                          padding: '0 3px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1.5px solid #091a12',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(217, 119, 6, 0.9) 0%, rgba(245, 158, 11, 0.85) 100%)'
                    : 'transparent',
                  color: isActive ? '#fff' : '#cbd5e1',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: isActive ? '0 4px 14px rgba(217, 119, 6, 0.25)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#cbd5e1';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent size={17} color={isActive ? '#fff' : item.color || '#cbd5e1'} />
                  </div>
                  <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {item.badge !== null && (
                    <span
                      style={{
                        padding: '0.12rem 0.45rem',
                        borderRadius: '20px',
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)',
                        color: '#fff',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight size={14} color="#fff" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* User Footer */}
        <div
          style={{
            padding: effectiveCollapsed ? '0.75rem 0.4rem' : '1rem 1rem',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
          }}
        >
          {/* Back to Storefront Link */}
          {effectiveCollapsed ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link
                href="/"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  color: '#f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                title="Back to Storefront"
              >
                <Store size={18} />
              </Link>
            </div>
          ) : (
            <Link
              href="/"
              style={{
                color: '#f59e0b',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.5rem',
                borderRadius: '8px',
                transition: 'all 0.2s',
              }}
              title="Back to Storefront"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Storefront</span>
            </Link>
          )}

          {/* User Profile / Logout Box */}
          {effectiveCollapsed ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={onLogout}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                title="Sign out of Admin Session"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: '0.55rem 0.75rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div style={{ overflow: 'hidden', marginRight: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {adminUser?.name || 'Administrator'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {adminUser?.email || 'admin@nutflix.com'}
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                style={{
                  border: 'none',
                  background: 'rgba(239,68,68,0.15)',
                  color: '#f87171',
                  padding: '0.4rem 0.55rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
                title="Sign out of Admin Session"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </aside>

      <style jsx global>{`
        /* Clean sleek dark scrollbars for Admin Sidebar */
        .admin-sidebar-container::-webkit-scrollbar,
        .admin-sidebar-container nav::-webkit-scrollbar {
          width: 4px;
        }
        .admin-sidebar-container::-webkit-scrollbar-track,
        .admin-sidebar-container nav::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.15);
        }
        .admin-sidebar-container::-webkit-scrollbar-thumb,
        .admin-sidebar-container nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 4px;
        }
        .admin-sidebar-container::-webkit-scrollbar-thumb:hover,
        .admin-sidebar-container nav::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.5);
        }

        @media (max-width: 768px) {
          .admin-sidebar-container {
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            width: 280px !important;
            transform: translateX(-100%);
            z-index: 100 !important;
          }

          .admin-sidebar-container.mobile-open {
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </>
  );
}
