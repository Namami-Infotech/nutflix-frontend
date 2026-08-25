'use client';

import React, { useState } from 'react';
import { CheckCircle2, MapPin } from 'lucide-react';
import Pagination from '@/components/Pagination';

interface DeliveredOrdersViewProps {
  orders: any[];
  searchQuery: string;
}

export default function DeliveredOrdersView({
  orders,
  searchQuery
}: DeliveredOrdersViewProps) {
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
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={18} color="#10b981" /> Fulfilled & Delivered Orders Table
        </h3>
        <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
          Showing {paginatedOrders.length} of {filteredOrders.length} fulfilled orders.
        </p>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.35rem', textAlign: 'left', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
          <thead>
            <tr style={{ color: '#166534', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Order #</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Customer Name</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Shipping Address</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Amount Paid</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Payment Mode</th>
              <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Fulfillment Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((ord) => (
              <tr key={ord.id} style={{ backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 900, color: '#0f291e', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                  {ord.orderNumber}
                </td>
                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 800, color: '#1e293b' }}>
                  {ord.customerName}
                </td>
                <td style={{ padding: '0.55rem 0.75rem', color: '#475569', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={13} color="#059669" />
                    {ord.shippingAddress}
                  </div>
                </td>
                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 900, color: '#10b981', fontSize: '0.88rem' }}>
                  ₹{ord.totalAmount}
                </td>
                <td style={{ padding: '0.55rem 0.75rem', fontWeight: 700 }}>
                  <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem' }}>
                    {ord.paymentMethod || 'UPI'}
                  </span>
                </td>
                <td style={{ padding: '0.55rem 0.75rem', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                  <span style={{ backgroundColor: '#10b981', color: '#fff', padding: '0.2rem 0.55rem', borderRadius: '12px', fontWeight: 900, fontSize: '0.68rem', textTransform: 'uppercase' }}>
                    DELIVERED ✓
                  </span>
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
