'use client';

import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import Pagination from '@/components/Pagination';

interface NewOrdersViewProps {
  orders: any[];
  searchQuery: string;
  onStatusChange: (orderId: number, status: string) => void;
}

type OrderStatusTab = 'all' | 'confirmed' | 'processing' | 'shipped';

export default function NewOrdersView({
  orders,
  searchQuery,
  onStatusChange
}: NewOrdersViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusTab, setStatusTab] = useState<OrderStatusTab>('all');
  const pageSize = 5;

  const allOrdersList = orders || [];

  const confirmedCount = allOrdersList.filter(o => o?.status === 'confirmed' || o?.status === 'pending').length;
  const processingCount = allOrdersList.filter(o => o?.status === 'processing' || o?.status === 'packed').length;
  const shippedCount = allOrdersList.filter(o => o?.status === 'shipped').length;

  const tabs: { id: OrderStatusTab; label: string; count: number; activeBg: string; activeColor: string }[] = [
    { id: 'all', label: 'All Order', count: allOrdersList.length, activeBg: '#0f291e', activeColor: '#fff' },
    { id: 'confirmed', label: 'Confirmed', count: confirmedCount, activeBg: '#2563eb', activeColor: '#fff' },
    { id: 'processing', label: 'Processing & Packed', count: processingCount, activeBg: '#d97706', activeColor: '#fff' },
    { id: 'shipped', label: 'Shipped', count: shippedCount, activeBg: '#7c3aed', activeColor: '#fff' },
  ];

  const handleTabChange = (tabId: OrderStatusTab) => {
    setStatusTab(tabId);
    setCurrentPage(1);
  };

  const filteredOrders = allOrdersList.filter(o => {
    const matchesSearch = !searchQuery ||
      (o?.orderNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o?.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o?.customerEmail || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusTab === 'all') return true;
    if (statusTab === 'confirmed') return o?.status === 'confirmed' || o?.status === 'pending';
    if (statusTab === 'processing') return o?.status === 'processing' || o?.status === 'packed';
    if (statusTab === 'shipped') return o?.status === 'shipped';
    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
      {/* Header with Title and Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f291e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShoppingBag size={18} color="#3b82f6" /> New & Active Customer Orders Table
          </h3>
          <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
            Showing {paginatedOrders.length} of {filteredOrders.length} {statusTab === 'all' ? 'active' : tabs.find(t => t.id === statusTab)?.label.toLowerCase()} orders.
          </p>
        </div>

        {/* Tab Filters */}
        <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.35rem', backgroundColor: '#f8fafc', padding: '4px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          {tabs.map((tab) => {
            const isActive = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                style={{
                  border: 'none',
                  backgroundColor: isActive ? tab.activeBg : 'transparent',
                  color: isActive ? tab.activeColor : '#64748b',
                  fontWeight: 800,
                  fontSize: '0.76rem',
                  padding: '0.38rem 0.8rem',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.18s ease'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                  color: isActive ? '#fff' : '#475569',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  fontSize: '0.68rem',
                  fontWeight: 900
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.35rem', textAlign: 'left', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
          <thead>
            <tr style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Order #</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Customer Details</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Items Purchased</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Total Amount</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Payment Method</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8', fontWeight: 700, backgroundColor: '#faf8f5', borderRadius: '8px' }}>
                  No orders found in "{tabs.find(t => t.id === statusTab)?.label}" tab{searchQuery ? ` matching "${searchQuery}"` : ''}.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((ord) => (
                <tr key={ord.id} style={{ backgroundColor: '#faf8f5', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.55rem 0.75rem', fontWeight: 900, color: '#0f291e', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                    {ord.orderNumber}
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 400, marginTop: '0.05rem' }}>
                      {new Date(ord.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    <div style={{ fontWeight: 800, color: '#1e293b' }}>{ord.customerName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{ord.customerEmail}</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.05rem' }}>{ord.shippingAddress}</div>
                  </td>
                  <td style={{ padding: '0.55rem 0.75rem' }}>
                    {Array.isArray(ord.items) && ord.items.map((it: any, i: number) => (
                      <div key={i} style={{ fontSize: '0.75rem', color: '#334155', marginBottom: '0.15rem' }}>
                        • <strong>{it.name}</strong> x{it.quantity} <span style={{ color: '#059669' }}>(₹{it.price})</span>
                      </div>
                    ))}
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
                            maxWidth: '130px',
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
                    <select
                      value={ord.status}
                      onChange={(e) => onStatusChange(ord.id, e.target.value)}
                      style={{
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        outline: 'none',
                        cursor: 'pointer',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                      }}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing & Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredOrders.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
