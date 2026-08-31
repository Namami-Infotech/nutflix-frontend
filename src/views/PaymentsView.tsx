'use client';

import React, { useState } from 'react';
import { CreditCard, IndianRupee, Wallet, CheckCircle2, Sliders, Calendar, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { PaymentType } from '@/types';

interface PaymentsViewProps {
  paymentBreakdown: any;
  paymentTypes?: PaymentType[];
  orders?: any[];
  onTogglePaymentStatus?: (id: number, currentStatus: 'active' | 'inactive') => void;
}

const getInitialMonthRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const formatDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return {
    start: formatDate(start),
    end: formatDate(end),
  };
};

export default function PaymentsView({
  paymentBreakdown,
  paymentTypes = [
    { id: 1, name: 'Online', code: 'online', status: 'active' },
    { id: 2, name: 'Cash', code: 'cash', status: 'active' }
  ],
  orders = [],
  onTogglePaymentStatus
}: PaymentsViewProps) {
  // Date filter state (default to current month)
  const [startDate, setStartDate] = useState<string>(() => getInitialMonthRange().start);
  const [endDate, setEndDate] = useState<string>(() => getInitialMonthRange().end);

  const methodIcons: any = {
    'UPI': Wallet,
    'Online': CreditCard,
    'Credit Card': CreditCard,
    'Cash': IndianRupee,
    'Cash on Delivery': IndianRupee
  };

  // Filter orders by date range
  const filteredOrders = orders.filter((order) => {
    if (!order.createdAt) return true;
    const orderTime = new Date(order.createdAt).getTime();

    if (startDate) {
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      if (orderTime < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate).setHours(23, 59, 59, 999);
      if (orderTime > end) return false;
    }

    return true;
  });

  // Calculate Online Revenue & Cash Revenue for filtered orders
  const onlineOrders = filteredOrders.filter((curr) => {
    const pm = (curr.paymentMethod || 'Online').toLowerCase();
    return !pm.includes('cash');
  });

  const cashOrders = filteredOrders.filter((curr) => {
    const pm = (curr.paymentMethod || '').toLowerCase();
    return pm.includes('cash');
  });

  const onlineRevenue = onlineOrders.reduce((acc, curr) => {
    const val = parseFloat(curr.totalAmount || 0);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const cashRevenue = cashOrders.reduce((acc, curr) => {
    const val = parseFloat(curr.totalAmount || 0);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* SECTION 1: PAYMENT TYPES MANAGEMENT (ONLINE & CASH WITH SWITCH) */}
      <div style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f291e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sliders size={18} color="#0284c7" /> Payment Types Configuration
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Enable or disable Online and Cash payment methods with the active/inactive status switch.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {paymentTypes.map((pt) => {
            const isActive = pt.status === 'active';
            const IconComp = pt.code === 'cash' ? IndianRupee : CreditCard;

            return (
              <div
                key={pt.id}
                style={{
                  backgroundColor: isActive ? '#f0fdf4' : '#f8fafc',
                  border: isActive ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? '#dcfce7' : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComp size={22} color={isActive ? '#16a34a' : '#64748b'} />
                  </div>

                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f291e' }}>
                      {pt.name} Payment
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px',
                        backgroundColor: isActive ? '#10b981' : '#64748b',
                        color: '#ffffff'
                      }}>
                        {pt.status}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Code: {pt.code}</span>
                    </div>
                  </div>
                </div>

                {/* ACTIVE / INACTIVE SWITCH */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                  <button
                    type="button"
                    onClick={() => onTogglePaymentStatus && onTogglePaymentStatus(pt.id, pt.status)}
                    style={{
                      width: '46px',
                      height: '24px',
                      borderRadius: '12px',
                      backgroundColor: isActive ? '#10b981' : '#cbd5e1',
                      border: 'none',
                      padding: '2px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'background-color 0.2s ease',
                      position: 'relative'
                    }}
                    title={`Click to set ${pt.name} as ${isActive ? 'INACTIVE' : 'ACTIVE'}`}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      transform: isActive ? 'translateX(22px)' : 'translateX(0px)',
                      transition: 'transform 0.2s ease'
                    }} />
                  </button>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: isActive ? '#15803d' : '#64748b' }}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* SECTION 3: TOTAL REVENUE & DATE RANGE FILTER (AT BOTTOM) */}
      <div style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f291e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <TrendingUp size={18} color="#10b981" /> Total Revenue & Sales Filter (Date Range)
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Calculate total sales revenue ("kitne paise ka sell huaa h") filtered by Start Date and End Date.
            </p>
          </div>

          {/* DATE RANGE FILTER INPUTS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#faf8f5', padding: '0.35rem 0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <Calendar size={14} color="#64748b" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ border: 'none', backgroundColor: 'transparent', fontSize: '0.78rem', fontWeight: 700, color: '#0f291e', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#faf8f5', padding: '0.35rem 0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <Calendar size={14} color="#64748b" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ border: 'none', backgroundColor: 'transparent', fontSize: '0.78rem', fontWeight: 700, color: '#0f291e', outline: 'none' }}
              />
            </div>

            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                style={{
                  padding: '0.35rem 0.65rem',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <RefreshCw size={12} /> Clear Filter
              </button>
            )}
          </div>
        </div>        {/* REVENUE METRICS CARDS (2 CARDS ONLY: ONLINE & CASH) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          
          {/* ONLINE REVENUE CARD */}
          <div style={{
            background: 'linear-gradient(135deg, #0f291e 0%, #1e4d38 100%)',
            color: '#fff',
            padding: '1.25rem',
            borderRadius: '12px',
            boxShadow: '0 4px 14px rgba(15,41,30,0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a7f3d0' }}>
                Online Sales Revenue
              </div>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={18} color="#a7f3d0" />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, margin: '0.5rem 0 0.2rem 0', color: '#ffffff' }}>
              ₹{onlineRevenue.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{startDate || endDate ? `Filtered: ${startDate || 'Start'} to ${endDate || 'Today'}` : 'All-time online sales'}</span>
              <span style={{ fontWeight: 800, color: '#a7f3d0' }}>{onlineOrders.length} Orders</span>
            </div>
          </div>

          {/* CASH REVENUE CARD */}
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#fff',
            padding: '1.25rem',
            borderRadius: '12px',
            boxShadow: '0 4px 14px rgba(2,132,199,0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#bae6fd' }}>
                Cash Sales Revenue
              </div>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IndianRupee size={18} color="#bae6fd" />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, margin: '0.5rem 0 0.2rem 0', color: '#ffffff' }}>
              ₹{cashRevenue.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{startDate || endDate ? `Filtered: ${startDate || 'Start'} to ${endDate || 'Today'}` : 'All-time cash sales'}</span>
              <span style={{ fontWeight: 800, color: '#bae6fd' }}>{cashOrders.length} Orders</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
