'use client';

import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import Pagination from '@/components/Pagination';

interface NewOrdersViewProps {
  orders: any[];
  searchQuery: string;
  onStatusChange: (orderId: number, status: string) => void;
}

export default function NewOrdersView({
  orders,
  searchQuery,
  onStatusChange
}: NewOrdersViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredOrders = orders.filter(
    o => (!searchQuery || o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
      <div style={{ marginBottom: '0.85rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f291e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShoppingBag size={18} color="#3b82f6" /> New & Active Customer Orders Table
        </h3>
        <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
          Showing {paginatedOrders.length} of {filteredOrders.length} active orders.
        </p>
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
            {paginatedOrders.map((ord) => (
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
                  <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.72rem' }}>
                    {ord.paymentMethod || 'UPI'}
                  </span>
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
            ))}
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
