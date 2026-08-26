'use client';

import React from 'react';
import Link from 'next/link';
import {
  LogOut,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Menu,
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
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 45,
          }}
        />
      )}

      <aside
        className={`admin-sidebar-container ${isCollapsed ? 'is-collapsed' : 'is-expanded'} ${mobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: isCollapsed ? '78px' : '270px',
          background: 'linear-gradient(180deg, #0b1f16 0%, #112d20 50%, #0d1e15 100%)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid rgba(217, 119, 6, 0.25)',
          boxShadow: '8px 0 30px rgba(0, 0, 0, 0.18)',
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          zIndex: 50,
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: isCollapsed ? '1.25rem 0.5rem' : '1.5rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            gap: '0.6rem',
            position: 'relative',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              textDecoration: 'none',
              minWidth: 0,
            }}
            title="NUTFLIX Storefront"
          >
            <img
              src="/logo.svg"
              alt="NUTFLIX LOGO"
              style={{
                width: isCollapsed ? '38px' : '42px',
                height: isCollapsed ? '38px' : '42px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                flexShrink: 0,
              }}
            />
            {!isCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                  NUT<span style={{ color: '#f59e0b' }}>FLIX</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: '#a3b19b', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800, marginTop: '0.2rem', whiteSpace: 'nowrap' }}>
                  ADMIN SUITE • DARSHAN
                </div>
              </div>
            )}
          </Link>

          {/* Toggle Button in Header */}
          {setIsCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="sidebar-collapse-btn"
              style={{
                border: 'none',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#cbd5e1',
                padding: '0.35rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: isCollapsed ? 'none' : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <ChevronLeft size={17} />
            </button>
          )}

          {/* Mobile Close Button */}
          {setMobileOpen && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="sidebar-mobile-close-btn"
              style={{
                display: 'none',
                border: 'none',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '0.35rem',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Collapsed Expand Quick Button */}
        {isCollapsed && setIsCollapsed && (
          <div style={{ padding: '0.5rem 0.5rem 0', display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#f59e0b',
                padding: '0.4rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                transition: 'all 0.2s',
              }}
              title="Expand Sidebar"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Navigation Menu */}
        <nav
          style={{
            padding: isCollapsed ? '1rem 0.4rem' : '1.25rem 0.85rem',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            overflowY: 'auto',
          }}
        >
          {!isCollapsed && (
            <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0 0.75rem 0.4rem' }}>
              MAIN MENU
            </div>
          )}

          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                title={isCollapsed ? `${item.label}${item.badge !== null ? ` (${item.badge})` : ''}` : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  width: '100%',
                  padding: isCollapsed ? '0.75rem 0.4rem' : '0.8rem 1rem',
                  borderRadius: '12px',
                  border: isActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(217, 119, 6, 0.9) 0%, rgba(245, 158, 11, 0.85) 100%)'
                    : 'transparent',
                  color: isActive ? '#fff' : '#cbd5e1',
                  fontWeight: isActive ? 900 : 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 6px 18px rgba(217, 119, 6, 0.3)' : 'none',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: isCollapsed ? 0 : '0.8rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent size={17} color={isActive ? '#fff' : item.color || '#a3b19b'} />
                    {isCollapsed && item.badge !== null && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-4px',
                          right: '-6px',
                          backgroundColor: '#ef4444',
                          color: '#fff',
                          fontSize: '0.62rem',
                          fontWeight: 900,
                          borderRadius: '10px',
                          minWidth: '16px',
                          height: '16px',
                          padding: '0 3px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1.5px solid #0b1f16',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                </div>

                {!isCollapsed && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {item.badge !== null && (
                      <span
                        style={{
                          padding: '0.15rem 0.5rem',
                          borderRadius: '20px',
                          fontSize: '0.7rem',
                          fontWeight: 900,
                          backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)',
                          color: '#fff',
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight size={14} color="#fff" />}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Footer */}
        <div
          style={{
            padding: isCollapsed ? '1rem 0.4rem' : '1.25rem 1.25rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          {/* Back to Storefront Link */}
          <Link
            href="/"
            style={{
              color: '#f59e0b',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              gap: '0.45rem',
              marginBottom: '0.85rem',
              transition: 'opacity 0.2s',
              padding: isCollapsed ? '0.4rem' : '0',
            }}
            title="Back to Storefront"
          >
            <ArrowLeft size={16} />
            {!isCollapsed && <span>Back to Storefront</span>}
          </Link>

          {/* User Profile Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between',
              backgroundColor: 'rgba(255,255,255,0.06)',
              padding: isCollapsed ? '0.5rem 0.25rem' : '0.65rem 0.75rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {!isCollapsed && (
              <div style={{ overflow: 'hidden', marginRight: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {adminUser?.name || 'Administrator'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {adminUser?.email || 'agr@guharoy.com'}
                </div>
              </div>
            )}

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
                fontWeight: 800,
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              title="Sign out of Admin Session"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .admin-sidebar-container.is-expanded {
            width: 240px !important;
          }
        }

        @media (max-width: 768px) {
          .admin-sidebar-container {
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            width: 270px !important;
            transform: translateX(-100%);
            z-index: 100 !important;
          }

          .admin-sidebar-container.mobile-open {
            transform: translateX(0) !important;
          }

          .sidebar-mobile-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
