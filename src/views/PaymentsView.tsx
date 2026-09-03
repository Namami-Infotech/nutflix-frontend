'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  IndianRupee,
  Wallet,
  CheckCircle2,
  Sliders,
  Calendar,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  ShoppingBag,
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  ListOrdered,
  Server
} from 'lucide-react';
import { PaymentType } from '@/types';
import { formatPrice, fetchAllOrders } from '@/lib/api';
import Pagination from '@/components/Pagination';

interface PaymentsViewProps {
  paymentBreakdown: any;
  paymentTypes?: PaymentType[];
  orders?: any[];
  onTogglePaymentStatus?: (id: number, currentStatus: 'active' | 'inactive') => void;
  onStatusChange?: (orderId: number, status: string) => void;
  searchQuery?: string;
}

type OrderStatusTab = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

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
  orders: initialOrders = [],
  onTogglePaymentStatus,
  onStatusChange,
  searchQuery = ''
}: PaymentsViewProps) {
  // Date filter state (default to all time, user can select date range)
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [statusTab, setStatusTab] = useState<OrderStatusTab>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ordersList, setOrdersList] = useState<any[]>(initialOrders);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const pageSize = 5;

  // Load orders on mount and sync with prop updates
  useEffect(() => {
    if (initialOrders && initialOrders.length > 0) {
      setOrdersList(initialOrders);
    }
    // Also fetch fresh from API
    fetchAllOrders().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setOrdersList(data);
      }
    }).catch(() => {});
  }, [initialOrders]);

  // Load latest orders from backend API
  const handleSyncFromBackend = async () => {
    setIsSyncing(true);
    try {
      const data = await fetchAllOrders();
      if (Array.isArray(data) && data.length > 0) {
        setOrdersList(data);
      }
    } catch (e) {
      console.warn('Could not sync orders from backend API:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Filter orders by date range
  const filteredOrders = ordersList.filter((order) => {
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

  // Status helper predicates
  const isPending = (s: string) => s === 'pending' || s === 'confirmed' || s === 'new';
  const isProcessing = (s: string) => s === 'processing' || s === 'packed';
  const isShipped = (s: string) => s === 'shipped';
  const isDelivered = (s: string) => s === 'delivered';
  const isCancelled = (s: string) => s === 'cancelled' || s === 'returned';

  // Counts for status tabs
  const pendingCount = filteredOrders.filter(o => isPending((o?.status || '').toLowerCase())).length;
  const processingCount = filteredOrders.filter(o => isProcessing((o?.status || '').toLowerCase())).length;
  const shippedCount = filteredOrders.filter(o => isShipped((o?.status || '').toLowerCase())).length;
  const deliveredCount = filteredOrders.filter(o => isDelivered((o?.status || '').toLowerCase())).length;
  const cancelledCount = filteredOrders.filter(o => isCancelled((o?.status || '').toLowerCase())).length;

  const tabs: { id: OrderStatusTab; label: string; count: number; activeBg: string; activeColor: string; icon: any }[] = [
    { id: 'all', label: 'All Orders', count: filteredOrders.length, activeBg: '#0f291e', activeColor: '#fff', icon: ListOrdered },
    { id: 'pending', label: 'Pending', count: pendingCount, activeBg: '#2563eb', activeColor: '#fff', icon: Clock },
    { id: 'processing', label: 'Processing', count: processingCount, activeBg: '#d97706', activeColor: '#fff', icon: Package },
    { id: 'shipped', label: 'Shipped', count: shippedCount, activeBg: '#7c3aed', activeColor: '#fff', icon: Truck },
    { id: 'delivered', label: 'Delivered', count: deliveredCount, activeBg: '#10b981', activeColor: '#fff', icon: CheckCircle2 },
    { id: 'cancelled', label: 'Cancelled', count: cancelledCount, activeBg: '#ef4444', activeColor: '#fff', icon: AlertCircle },
  ];

  const handleTabChange = (tabId: OrderStatusTab) => {
    setStatusTab(tabId);
    setCurrentPage(1);
  };

  // Filter orders for table display based on tab & search query
  const tableOrders = filteredOrders.filter((ord) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (ord?.orderNumber || '').toLowerCase().includes(q) ||
        (ord?.customerName || '').toLowerCase().includes(q) ||
        (ord?.customerEmail || '').toLowerCase().includes(q) ||
        (ord?.paymentMethod || '').toLowerCase().includes(q) ||
        (ord?.transactionId || '').toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    const s = (ord?.status || '').toLowerCase();
    if (statusTab === 'all') return true;
    if (statusTab === 'pending') return isPending(s);
    if (statusTab === 'processing') return isProcessing(s);
    if (statusTab === 'shipped') return isShipped(s);
    if (statusTab === 'delivered') return isDelivered(s);
    if (statusTab === 'cancelled') return isCancelled(s);
    return true;
  });

  const totalPages = Math.ceil(tableOrders.length / pageSize) || 1;
  const paginatedOrders = tableOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Status badge styling helper
  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (isDelivered(s)) {
      return { bg: '#dcfce7', color: '#15803d', border: '#86efac', text: 'Delivered' };
    }
    if (isCancelled(s)) {
      return { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', text: 'Cancelled' };
    }
    if (isShipped(s)) {
      return { bg: '#f3e8ff', color: '#6b21a8', border: '#d8b4fe', text: 'Shipped' };
    }
    if (isProcessing(s)) {
      return { bg: '#fef3c7', color: '#b45309', border: '#fde68a', text: 'Processing' };
    }
    return { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe', text: 'Pending' };
  };

  const handleOrderLocalStatusChange = (orderId: number, newStatus: string) => {
    setOrdersList(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (onStatusChange) {
      onStatusChange(orderId, newStatus);
    }
  };

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


      {/* SECTION 2: TOTAL REVENUE & DATE RANGE FILTER */}
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
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ border: 'none', backgroundColor: 'transparent', fontSize: '0.78rem', fontWeight: 700, color: '#0f291e', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#faf8f5', padding: '0.35rem 0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <Calendar size={14} color="#64748b" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569' }}>To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ border: 'none', backgroundColor: 'transparent', fontSize: '0.78rem', fontWeight: 700, color: '#0f291e', outline: 'none' }}
              />
            </div>

            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setCurrentPage(1);
                }}
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
        </div>

        {/* REVENUE METRICS CARDS (ONLINE & CASH) */}
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
              ₹{formatPrice(onlineRevenue)}
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
              ₹{formatPrice(cashRevenue)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{startDate || endDate ? `Filtered: ${startDate || 'Start'} to ${endDate || 'Today'}` : 'All-time cash sales'}</span>
              <span style={{ fontWeight: 800, color: '#bae6fd' }}>{cashOrders.length} Orders</span>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: ALL ORDERS TABLE WITH STATUS TABS & PAGINATION */}
      <div style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        {/* Header & Status Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f291e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShoppingBag size={18} color="#059669" /> All Orders Breakdown & Management
              </h3>
              <button
                type="button"
                onClick={handleSyncFromBackend}
                disabled={isSyncing}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  color: '#334155',
                  cursor: isSyncing ? 'not-allowed' : 'pointer'
                }}
                title="Sync latest orders directly from backend API"
              >
                <RefreshCw size={11} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
                <span>{isSyncing ? 'Syncing...' : 'Sync API'}</span>
              </button>
            </div>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Showing {paginatedOrders.length} of {tableOrders.length} {statusTab === 'all' ? 'total' : tabs.find(t => t.id === statusTab)?.label.toLowerCase()} orders {startDate || endDate ? `(Filtered by Date)` : ''}.
            </p>
          </div>

          {/* Tab Filters: All, Pending, Processing, Shipped, Delivered, Cancelled */}
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.35rem', backgroundColor: '#f8fafc', padding: '4px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            {tabs.map((tab) => {
              const isActive = statusTab === tab.id;
              const TabIcon = tab.icon;
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
                    padding: '0.38rem 0.75rem',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                    transition: 'all 0.18s ease'
                  }}
                >
                  <TabIcon size={14} />
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

        {/* Orders Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.35rem', textAlign: 'left', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
            <thead>
              <tr style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Order # & Date</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Customer Details</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Items Purchased</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Total Amount</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Payment Method</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Status</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8', fontWeight: 700, backgroundColor: '#faf8f5', borderRadius: '8px' }}>
                    No orders found in "{tabs.find(t => t.id === statusTab)?.label}" tab{searchQuery ? ` matching "${searchQuery}"` : ''}{startDate || endDate ? ` for the selected date range` : ''}.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ord) => {
                  const badge = getStatusBadge(ord.status);
                  return (
                    <tr key={ord.id} style={{ backgroundColor: '#faf8f5', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '0.55rem 0.75rem', fontWeight: 900, color: '#0f291e', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                        <div>{ord.orderNumber}</div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 400, marginTop: '0.05rem' }}>
                          {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td style={{ padding: '0.55rem 0.75rem' }}>
                        <div style={{ fontWeight: 800, color: '#1e293b' }}>{ord.customerName || 'Guest User'}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{ord.customerEmail || ord.customerPhone || 'N/A'}</div>
                        {ord.shippingAddress && (
                          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.05rem', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={ord.shippingAddress}>
                            {ord.shippingAddress}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.55rem 0.75rem' }}>
                        {Array.isArray(ord.items) && ord.items.length > 0 ? (
                          ord.items.map((it: any, i: number) => (
                            <div key={i} style={{ fontSize: '0.75rem', color: '#334155', marginBottom: '0.15rem' }}>
                              • <strong>{it.name}</strong> x{it.quantity} <span style={{ color: '#059669' }}>(₹{it.price})</span>
                            </div>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>1 Package</span>
                        )}
                      </td>
                      <td style={{ padding: '0.55rem 0.75rem', fontWeight: 900, color: '#10b981', fontSize: '0.88rem' }}>
                        ₹{formatPrice(ord.totalAmount)}
                      </td>
                      <td style={{ padding: '0.55rem 0.75rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-start' }}>
                          <span style={{
                            backgroundColor: (ord.paymentMethod || '').toLowerCase().includes('cash') ? '#e0f2fe' : '#ecfdf5',
                            color: (ord.paymentMethod || '').toLowerCase().includes('cash') ? '#0369a1' : '#065f46',
                            border: (ord.paymentMethod || '').toLowerCase().includes('cash') ? '1px solid #bae6fd' : '1px solid #a7f3d0',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.72rem'
                          }}>
                            {ord.paymentMethod?.split('(')[0]?.trim() || (ord.paymentType === 'cash' ? 'Cash on Delivery' : 'Online / UPI')}
                          </span>
                          {(ord.transactionId || ord.razorpayPaymentId || (ord.paymentMethod && ord.paymentMethod.includes('pay_'))) && (
                            <span
                              title={ord.transactionId || ord.razorpayPaymentId || ord.paymentMethod}
                              style={{
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                                border: '1px solid #cbd5e1',
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
                              Txn: {ord.transactionId || ord.razorpayPaymentId || ord.paymentMethod?.match(/pay_[a-zA-Z0-9]+/)?.[0] || ord.paymentMethod}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '0.55rem 0.75rem' }}>
                        <span style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          padding: '0.2rem 0.55rem',
                          borderRadius: '999px',
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          textTransform: 'capitalize',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {ord.status || 'pending'}
                        </span>
                      </td>
                      <td style={{ padding: '0.55rem 0.75rem', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                        <select
                          value={ord.status || 'pending'}
                          onChange={(e) => handleOrderLocalStatusChange(ord.id, e.target.value)}
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
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={tableOrders.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

    </div>
  );
}
