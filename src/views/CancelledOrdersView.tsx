'use client';

import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import Pagination from '@/components/Pagination';

interface CancelledOrdersViewProps {
  orders: any[];
  searchQuery: string;
  onStatusChange: (orderId: number, status: string) => void;
}

export default function CancelledOrdersView({
  orders,
  searchQuery,
  onStatusChange
}: CancelledOrdersViewProps) {
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
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <XCircle size={18} color="#ef4444" /> Cancelled & Returned Orders Exception Table
        </h3>
        <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
          Showing {paginatedOrders.length} of {filteredOrders.length} exception orders.
        </p>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.35rem', textAlign: 'left', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
          <thead>
            <tr style={{ color: '#991b1b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Order #</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Customer Name</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Items</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Amount</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Exception Status</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Re-open / Update Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((ord) => (
              <tr key={ord.id} style={{ backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 900, color: '#0f291e', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                  {ord.orderNumber}
                </td>
                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 800, color: '#1e293b' }}>
                  {ord.customerName}
                </td>
                <td style={{ padding: '0.55rem 0.75rem' }}>
                  {Array.isArray(ord.items) && ord.items.map((it: any, i: number) => (
                    <div key={i} style={{ fontSize: '0.75rem', color: '#64748b' }}>• {it.name} x{it.quantity}</div>
                  ))}
                </td>
                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 900, color: '#ef4444', fontSize: '0.88rem' }}>
                  ₹{ord.totalAmount}
                </td>
                <td style={{ padding: '0.55rem 0.75rem' }}>
                  <span style={{ backgroundColor: ord.status === 'cancelled' ? '#ef4444' : '#f97316', color: '#fff', padding: '0.2rem 0.55rem', borderRadius: '12px', fontWeight: 900, fontSize: '0.68rem', textTransform: 'uppercase' }}>
                    {ord.status}
                  </span>
                </td>
                <td style={{ padding: '0.55rem 0.75rem', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                  <select
                    value={ord.status}
                    onChange={(e) => onStatusChange(ord.id, e.target.value)}
                    style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.75rem', outline: 'none', cursor: 'pointer', backgroundColor: '#fff' }}
                  >
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                    <option value="confirmed">Re-Confirm Order</option>
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
