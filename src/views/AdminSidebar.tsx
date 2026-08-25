'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  Image as ImageIcon,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  CreditCard,
  LogOut,
  ArrowLeft,
  Crown,
  ChevronRight
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
}

export default function AdminSidebar({
  activeMenu,
  setActiveMenu,
  sidebarItems,
  adminUser,
  onLogout
}: AdminSidebarProps) {
  return (
    <aside style={{
      width: '280px',
      background: 'linear-gradient(180deg, #0b1f16 0%, #112d20 50%, #0d1e15 100%)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      borderRight: '1px solid rgba(217, 119, 6, 0.25)',
      boxShadow: '8px 0 30px rgba(0, 0, 0, 0.15)',
      height: '100vh',
      position: 'sticky',
      top: 0,
      overflowY: 'auto',
      zIndex: 20
    }}>
      {/* Brand Header */}
      <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="/logo.svg"
            alt="NUTFLIX LOGO"
            style={{
              width: '44px',
              height: '44px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
              flexShrink: 0
            }}
          />
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1 }}>
              NUT<span style={{ color: '#f59e0b' }}>FLIX</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#a3b19b', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800, marginTop: '0.2rem' }}>
              ADMIN SUITE • DARSHAN
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ padding: '1.25rem 0.85rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '0 0.75rem 0.4rem' }}>
          MAIN MENU
        </div>

        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                border: isActive ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid transparent',
                background: isActive 
                  ? 'linear-gradient(90deg, rgba(217, 119, 6, 0.9) 0%, rgba(245, 158, 11, 0.85) 100%)' 
                  : 'transparent',
                color: isActive ? '#fff' : '#cbd5e1',
                fontWeight: isActive ? 900 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 6px 20px rgba(217, 119, 6, 0.3)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <IconComponent size={17} color={isActive ? '#fff' : (item.color || '#a3b19b')} />
                </div>
                <span>{item.label}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {item.badge !== null && (
                  <span style={{
                    padding: '0.2rem 0.55rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)',
                    color: '#fff',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                  }}>
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
      <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
        <Link href="/" style={{ color: '#f59e0b', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1rem', transition: 'opacity 0.2s' }}>
          <ArrowLeft size={15} /> Back to Storefront
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.06)', padding: '0.75rem 0.85rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 900, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {adminUser?.name || 'Administrator'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {adminUser?.email}
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              border: 'none',
              background: 'rgba(239,68,68,0.15)',
              color: '#f87171',
              padding: '0.4rem 0.6rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.2s'
            }}
            title="Sign out of Admin Session"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
