'use client';

import React from 'react';
import { Users, Package, ShoppingBag, CheckCircle2, XCircle, TrendingUp, ArrowUpRight } from 'lucide-react';

interface DashboardViewProps {
  usersCount: number;
  productsCount: number;
  ordersCount: number;
  newOrdersCount: number;
  deliveredCount: number;
  cancelledCount: number;
  totalRevenue: number;
  recentOrders: any[];
  onViewAllOrders: () => void;
}

// https://nutflix-frontend.vercel.app/dashboard

export default function DashboardView({
  usersCount,
  productsCount,
  ordersCount,
  newOrdersCount,
  deliveredCount,
  cancelledCount,
  totalRevenue,
  recentOrders,
  onViewAllOrders
}: DashboardViewProps) {
  const cards = [
    {
      title: 'Total Received Orders',
      value: ordersCount,
      subtext: `${newOrdersCount} New Orders Pending`,
      icon: ShoppingBag,
      bg: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      color: '#fff'
    },
    {
      title: 'Fulfilled Deliveries',
      value: deliveredCount,
      subtext: 'Successfully Completed',
      icon: CheckCircle2,
      bg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      color: '#fff'
    },
    {
      title: 'Active Products',
      value: productsCount,
      subtext: 'Live Catalog Items',
      icon: Package,
      bg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      color: '#fff'
    },
    {
      title: 'Total Sales Revenue',
      value: `₹${totalRevenue.toFixed(2)}`,
      subtext: 'Active Revenue Stream',
      icon: TrendingUp,
      bg: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      color: '#fff'
    },
    {
      title: 'Total Users',
      value: usersCount,
      subtext: 'Active Registered Base',
      icon: Users,
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#fff'
    },
    {
      title: 'Cancelled / Returned',
      value: cancelledCount,
      subtext: 'Order Exception Count',
      icon: XCircle,
      bg: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      color: '#fff'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
        {cards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div
              key={idx}
              style={{
                background: card.bg,
                color: card.color,
                padding: '0.85rem 1.1rem',
                borderRadius: '10px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '92px'
              }}
            >
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '65px', height: '65px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.12)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.95 }}>
                  {card.title}
                </span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <IconComp size={16} color="#fff" />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '1.55rem', fontWeight: 900, letterSpacing: '-0.02em', margin: '0.1rem 0 0.15rem', lineHeight: 1.1 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ArrowUpRight size={12} /> {card.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Table */}
      <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f291e' }}>📦 Recent Orders Activity</h3>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>Latest customer purchases and order fulfillment tracking.</p>
          </div>
          <button
            onClick={onViewAllOrders}
            style={{
              backgroundColor: '#fef3c7',
              color: '#b45309',
              border: '1px solid #fde68a',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            View All Orders &rarr;
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.35rem', textAlign: 'left', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
            <thead>
              <tr style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Order #</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Customer</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Amount</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Payment Method</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.slice(0, 5).map((ord) => (
                <tr key={ord.id} style={{ backgroundColor: '#faf8f5', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.55rem 0.75rem', fontWeight: 900, color: '#0f291e', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                    {ord.orderNumber}
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <div style={{ fontWeight: 800, color: '#1e293b' }}>{ord.customerName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{ord.customerEmail}</div>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', fontWeight: 900, color: '#10b981', fontSize: '0.88rem' }}>
                    ₹{ord.totalAmount}
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-start' }}>
                      <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.72rem' }}>
                        {ord.paymentMethod?.split('(')[0]?.trim() || (ord.paymentType === 'cash' ? 'Cash on Delivery' : 'Online / UPI')}
                      </span>
                      {(ord.transactionId || ord.razorpayPaymentId || (ord.paymentMethod && ord.paymentMethod.includes('pay_'))) && (
                        <span
                          title={ord.transactionId || ord.razorpayPaymentId || ord.paymentMethod}
                          style={{
                            backgroundColor: '#ecfdf5',
                            color: '#065f46',
                            border: '1px solid #a7f3d0',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.66rem',
                            fontFamily: 'monospace',
                            display: 'inline-block',
                            maxWidth: '120px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Txn: {ord.transactionId || ord.razorpayPaymentId || ord.paymentMethod.match(/pay_[a-zA-Z0-9]+/)?.[0] || ord.paymentMethod}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                    <span style={{
                      padding: '0.2rem 0.55rem',
                      borderRadius: '12px',
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      backgroundColor: ord.status === 'delivered' ? '#dcfce7' : ord.status === 'cancelled' ? '#fee2e2' : '#e0f2fe',
                      color: ord.status === 'delivered' ? '#15803d' : ord.status === 'cancelled' ? '#b91c1c' : '#0369a1',
                      border: `1px solid ${ord.status === 'delivered' ? '#86efac' : ord.status === 'cancelled' ? '#fca5a5' : '#7dd3fc'}`
                    }}>
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
