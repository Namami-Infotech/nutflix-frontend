'use client';

import React, { useState } from 'react';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Eye,
  X,
  XCircle,
  TrendingUp
} from 'lucide-react';
import Pagination from '@/components/Pagination';

interface QROrdersViewProps {
  orders: any[];
  searchQuery: string;
  onStatusChange: (orderId: number, status: string) => void;
}

type QRStatusTab = 'all' | 'pending' | 'confirmed' | 'cancelled';

export default function QROrdersView({
  orders,
  searchQuery: globalSearchQuery,
  onStatusChange,
}: QROrdersViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusTab, setStatusTab] = useState<QRStatusTab>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedScreenshotOrder, setSelectedScreenshotOrder] = useState<any | null>(null);
  const pageSize = 8;

  // Filter only QR orders or orders with paymentScreenshot
  const qrOrders = (orders || []).filter((o) => {
    const method = (o?.paymentMethod || '').toLowerCase();
    const type = (o?.paymentType || '').toLowerCase();
    return Boolean(o?.paymentScreenshot) || method.includes('qr') || type === 'qr';
  });

  // Calculate statistics
  const pendingOrders = qrOrders.filter((o) => o?.status === 'pending' || !o?.status);
  const confirmedOrders = qrOrders.filter((o) => o?.status === 'confirmed');
  const cancelledOrders = qrOrders.filter((o) => o?.status === 'cancelled' || o?.status === 'returned');

  const totalQrRevenue = confirmedOrders.reduce((sum, o) => sum + (parseFloat(o?.totalAmount) || 0), 0);
  const pendingQrRevenue = pendingOrders.reduce((sum, o) => sum + (parseFloat(o?.totalAmount) || 0), 0);

  const tabs: { id: QRStatusTab; label: string; count: number; activeBg: string; activeColor: string }[] = [
    { id: 'all', label: 'All QR Orders', count: qrOrders.length, activeBg: '#0f291e', activeColor: '#fff' },
    { id: 'pending', label: 'Pending (Default)', count: pendingOrders.length, activeBg: '#d97706', activeColor: '#fff' },
    { id: 'confirmed', label: 'Verify (Confirmed)', count: confirmedOrders.length, activeBg: '#10b981', activeColor: '#fff' },
    { id: 'cancelled', label: 'Cancel (Rejected)', count: cancelledOrders.length, activeBg: '#ef4444', activeColor: '#fff' },
  ];

  const handleTabChange = (tabId: QRStatusTab) => {
    setStatusTab(tabId);
    setCurrentPage(1);
  };

  const effectiveSearch = (globalSearchQuery || '').trim().toLowerCase();

  const filteredOrders = qrOrders.filter((o) => {
    const matchesSearch =
      !effectiveSearch ||
      (o?.orderNumber || '').toLowerCase().includes(effectiveSearch) ||
      (o?.customerName || '').toLowerCase().includes(effectiveSearch) ||
      (o?.customerEmail || '').toLowerCase().includes(effectiveSearch) ||
      (o?.transactionId || '').toLowerCase().includes(effectiveSearch) ||
      (o?.shippingAddress || '').toLowerCase().includes(effectiveSearch);

    if (!matchesSearch) return false;

    if (statusTab === 'all') return true;
    if (statusTab === 'pending') return o?.status === 'pending' || !o?.status;
    if (statusTab === 'confirmed') return o?.status === 'confirmed';
    if (statusTab === 'cancelled') return o?.status === 'cancelled' || o?.status === 'returned';
    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCopyUtr = (utr: string, id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(utr);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const formatImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return url.startsWith('/') ? url : `/${url}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* 4 Clean Metric Cards at Top */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
        {/* Card 1: Total QR Orders */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '1.1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total QR Orders
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
              <QrCode size={17} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f291e', lineHeight: 1 }}>{qrOrders.length}</div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '0.35rem' }}>Placed via Static QR Code</div>
          </div>
        </div>

        {/* Card 2: Needs Verification (Highlighted) */}
        <div
          style={{
            backgroundColor: pendingOrders.length > 0 ? '#fffdf7' : '#fff',
            borderRadius: '12px',
            padding: '1.1rem 1.25rem',
            border: pendingOrders.length > 0 ? '1px solid #fde68a' : '1px solid #e2e8f0',
            boxShadow: pendingOrders.length > 0 ? '0 4px 12px rgba(245, 158, 11, 0.08)' : '0 2px 6px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={13} color="#d97706" /> Needs Verification
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <Clock size={17} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#d97706', lineHeight: 1 }}>{pendingOrders.length}</div>
            <div style={{ fontSize: '0.74rem', color: '#b45309', marginTop: '0.35rem' }}>
              {pendingOrders.length > 0 ? `₹${pendingQrRevenue.toFixed(2)} awaiting check` : 'All QR orders verified'}
            </div>
          </div>
        </div>

        {/* Card 3: Verified & Confirmed */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '1.1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={13} color="#10b981" /> Verified & Confirmed
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
              <CheckCircle2 size={17} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#15803d', lineHeight: 1 }}>{confirmedOrders.length}</div>
            <div style={{ fontSize: '0.74rem', color: '#166534', marginTop: '0.35rem' }}>Ready for packing & delivery</div>
          </div>
        </div>

        {/* Card 4: Total QR Revenue */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '1.1rem 1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total QR Revenue
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <TrendingUp size={17} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f291e', lineHeight: 1 }}>₹{totalQrRevenue.toFixed(2)}</div>
            <div style={{ fontSize: '0.74rem', color: '#059669', marginTop: '0.35rem' }}>From approved QR payments</div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', padding: '1.25rem' }}>
        {/* Header & Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f291e', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <QrCode size={18} color="#10b981" /> Verify QR Payments Table
              {pendingOrders.length > 0 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    border: '1px solid #fcd34d',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '999px',
                  }}
                >
                  {pendingOrders.length} Pending
                </span>
              )}
            </h3>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Showing {paginatedOrders.length} of {filteredOrders.length} orders. Inspect screenshot proof and verify or cancel payment.
            </p>
          </div>

          {/* Tab Filter Buttons */}
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
                    transition: 'all 0.18s ease',
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                      color: isActive ? '#fff' : '#475569',
                      padding: '0.1rem 0.45rem',
                      borderRadius: '999px',
                      fontSize: '0.68rem',
                      fontWeight: 900,
                    }}
                  >
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
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Total Amount</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>UPI UTR / Reference</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Payment Screenshot</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Verification Status</th>
                <th style={{ padding: '0.5rem 0.75rem', fontWeight: 800 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8', fontWeight: 700, backgroundColor: '#faf8f5', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                      <QrCode size={32} color="#cbd5e1" />
                      <span>No QR orders found in "{tabs.find((t) => t.id === statusTab)?.label}" tab{effectiveSearch ? ` matching "${effectiveSearch}"` : ''}.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ord) => {
                  const isPending = ord.status === 'pending' || !ord.status;
                  const isConfirmed = ord.status === 'confirmed';
                  const isCancelled = ord.status === 'cancelled' || ord.status === 'returned';
                  const utr = ord.transactionId || ord.razorpayPaymentId || '';
                  const screenshotUrl = formatImageUrl(ord.paymentScreenshot);

                  return (
                    <tr
                      key={ord.id}
                      style={{
                        backgroundColor: '#faf8f5',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      {/* Order Number & Date */}
                      <td style={{ padding: '0.55rem 0.75rem', fontWeight: 900, color: '#0f291e', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
                        <div>{ord.orderNumber}</div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 400, marginTop: '0.05rem' }}>
                          {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      {/* Customer Details */}
                      <td style={{ padding: '0.55rem 0.75rem' }}>
                        <div style={{ fontWeight: 800, color: '#1e293b' }}>{ord.customerName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{ord.customerEmail}</div>
                        {ord.shippingAddress && (
                          <div
                            style={{
                              fontSize: '0.68rem',
                              color: '#94a3b8',
                              marginTop: '0.05rem',
                              maxWidth: '180px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={ord.shippingAddress}
                          >
                            📍 {ord.shippingAddress}
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td style={{ padding: '0.55rem 0.75rem', fontWeight: 900, color: '#10b981', fontSize: '0.9rem' }}>
                        ₹{ord.totalAmount}
                      </td>

                      {/* UPI UTR / Transaction ID */}
                      <td style={{ padding: '0.55rem 0.75rem' }}>
                        {utr ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span
                              style={{
                                backgroundColor: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                color: '#0f291e',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '6px',
                                fontFamily: 'monospace',
                                fontWeight: 800,
                                fontSize: '0.73rem',
                                letterSpacing: '0.03em',
                                maxWidth: '160px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                              title={utr}
                            >
                              {utr}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyUtr(utr, `utr-${ord.id}`)}
                              style={{
                                border: '1px solid #e2e8f0',
                                background: copiedId === `utr-${ord.id}` ? '#dcfce7' : '#fff',
                                color: copiedId === `utr-${ord.id}` ? '#15803d' : '#64748b',
                                padding: '0.2rem 0.4rem',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                fontSize: '0.66rem',
                                fontWeight: 700,
                              }}
                              title="Copy UTR / Transaction ID"
                            >
                              {copiedId === `utr-${ord.id}` ? <Check size={11} /> : <Copy size={11} />}
                              <span>{copiedId === `utr-${ord.id}` ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.72rem', fontStyle: 'italic' }}>
                            Not provided
                          </span>
                        )}
                      </td>

                      {/* Payment Screenshot (Thumbnail & View trigger) */}
                      <td style={{ padding: '0.55rem 0.75rem' }}>
                        {screenshotUrl ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                            {/* Clickable Image Thumbnail */}
                            <div
                              onClick={() => setSelectedScreenshotOrder(ord)}
                              style={{
                                width: '46px',
                                height: '46px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '1.5px solid #cbd5e1',
                                cursor: 'pointer',
                                position: 'relative',
                                flexShrink: 0,
                                backgroundColor: '#fff',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
                              }}
                              title="Click to zoom screenshot"
                            >
                              <img
                                src={screenshotUrl}
                                alt={`Payment Screenshot for ${ord.orderNumber}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  transition: 'transform 0.2s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => setSelectedScreenshotOrder(ord)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                backgroundColor: '#eff6ff',
                                color: '#1d4ed8',
                                border: '1px solid #bfdbfe',
                                padding: '0.25rem 0.55rem',
                                borderRadius: '6px',
                                fontWeight: 800,
                                fontSize: '0.71rem',
                                cursor: 'pointer',
                              }}
                            >
                              <Eye size={12} /> View Proof
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#94a3b8', fontSize: '0.72rem', fontStyle: 'italic' }}>
                            <AlertCircle size={12} color="#94a3b8" /> No screenshot
                          </div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '0.55rem 0.75rem' }}>
                        {isPending ? (
                          <span
                            style={{
                              backgroundColor: '#fef3c7',
                              color: '#92400e',
                              border: '1px solid #fcd34d',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <Clock size={12} /> Pending (Default)
                          </span>
                        ) : isConfirmed ? (
                          <span
                            style={{
                              backgroundColor: '#dcfce7',
                              color: '#166534',
                              border: '1px solid #86efac',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <CheckCircle2 size={12} /> Verify (Confirmed)
                          </span>
                        ) : (
                          <span
                            style={{
                              backgroundColor: '#fee2e2',
                              color: '#991b1b',
                              border: '1px solid #fca5a5',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '999px',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <XCircle size={12} /> Cancel (Rejected)
                          </span>
                        )}
                      </td>

                      {/* Actions with only 3 options: Pending (default), Verify, Cancel */}
                      <td style={{ padding: '0.55rem 0.75rem', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          {isPending && (
                            <button
                              type="button"
                              onClick={() => onStatusChange(ord.id, 'confirmed')}
                              style={{
                                backgroundColor: '#10b981',
                                color: '#fff',
                                border: 'none',
                                padding: '0.3rem 0.65rem',
                                borderRadius: '6px',
                                fontWeight: 800,
                                fontSize: '0.73rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.25)',
                              }}
                              title="Verify Payment and Confirm Order"
                            >
                              <CheckCircle2 size={13} /> Verify
                            </button>
                          )}

                          {/* 3 Status Options Only: Pending (default), Verify, Cancel */}
                          <select
                            value={ord.status || 'pending'}
                            onChange={(e) => onStatusChange(ord.id, e.target.value)}
                            style={{
                              padding: '0.3rem 0.6rem',
                              borderRadius: '6px',
                              border: isConfirmed ? '1.5px solid #10b981' : isCancelled ? '1.5px solid #ef4444' : '1.5px solid #f59e0b',
                              fontWeight: 800,
                              fontSize: '0.73rem',
                              outline: 'none',
                              cursor: 'pointer',
                              backgroundColor: isConfirmed ? '#f0fdf4' : isCancelled ? '#fef2f2' : '#fffbeb',
                              color: isConfirmed ? '#15803d' : isCancelled ? '#b91c1c' : '#b45309',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Verify</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredOrders.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* FULL-SIZE PAYMENT SCREENSHOT INSPECTION MODAL */}
      {selectedScreenshotOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
          onClick={() => setSelectedScreenshotOrder(null)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              maxWidth: '880px',
              width: '100%',
              maxHeight: '92vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              animation: 'fadeIn 0.2s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '0.9rem 1.3rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <QrCode size={20} color="#10b981" />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f291e' }}>
                    Payment Screenshot Verification — {selectedScreenshotOrder.orderNumber}
                  </h4>
                  <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '0.05rem' }}>
                    Verify payment of <strong>₹{selectedScreenshotOrder.totalAmount}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedScreenshotOrder(null)}
                style={{
                  border: 'none',
                  background: 'rgba(0,0,0,0.06)',
                  color: '#475569',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
                gap: '1.25rem',
                padding: '1.25rem',
                overflowY: 'auto',
                backgroundColor: '#f8fafc',
              }}
            >
              {/* Left: Image Preview */}
              <div
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '360px',
                  maxHeight: '480px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img
                  src={formatImageUrl(selectedScreenshotOrder.paymentScreenshot)}
                  alt="Payment Proof"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '430px',
                    objectFit: 'contain',
                    borderRadius: '6px',
                  }}
                />
                <a
                  href={formatImageUrl(selectedScreenshotOrder.paymentScreenshot)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    color: '#0f172a',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <ExternalLink size={12} /> Open Original
                </a>
              </div>

              {/* Right: Order Details & Decision */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                    Order Information
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.35rem' }}>
                      <span style={{ color: '#64748b' }}>Order Number:</span>
                      <strong style={{ color: '#0f291e' }}>{selectedScreenshotOrder.orderNumber}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.35rem' }}>
                      <span style={{ color: '#64748b' }}>Customer:</span>
                      <strong>{selectedScreenshotOrder.customerName}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.35rem' }}>
                      <span style={{ color: '#64748b' }}>Total Amount:</span>
                      <strong style={{ color: '#10b981', fontSize: '1rem' }}>₹{selectedScreenshotOrder.totalAmount}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.35rem' }}>
                      <span style={{ color: '#64748b' }}>Customer UTR:</span>
                      {selectedScreenshotOrder.transactionId ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <code style={{ backgroundColor: '#f1f5f9', padding: '2px 5px', borderRadius: '4px', fontWeight: 800, color: '#0f291e', fontSize: '0.76rem' }}>
                            {selectedScreenshotOrder.transactionId}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopyUtr(selectedScreenshotOrder.transactionId, 'modal-utr')}
                            style={{
                              border: 'none',
                              background: '#f1f5f9',
                              padding: '2px 5px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              color: copiedId === 'modal-utr' ? '#16a34a' : '#64748b',
                              fontSize: '0.68rem',
                            }}
                          >
                            {copiedId === 'modal-utr' ? <Check size={11} /> : <Copy size={11} />}
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Not provided</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#64748b' }}>Status:</span>
                      <span
                        style={{
                          backgroundColor: selectedScreenshotOrder.status === 'confirmed' ? '#dcfce7' : selectedScreenshotOrder.status === 'cancelled' ? '#fee2e2' : '#fef3c7',
                          color: selectedScreenshotOrder.status === 'confirmed' ? '#166534' : selectedScreenshotOrder.status === 'cancelled' ? '#991b1b' : '#92400e',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          textTransform: 'capitalize',
                        }}
                      >
                        {selectedScreenshotOrder.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Decision Actions */}
                <div style={{ backgroundColor: '#fff', borderRadius: '10px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#334155' }}>Payment Verification Decision (3 Options)</div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    {/* Option 1: Pending (Default) */}
                    <button
                      type="button"
                      onClick={() => {
                        onStatusChange(selectedScreenshotOrder.id, 'pending');
                        setSelectedScreenshotOrder({ ...selectedScreenshotOrder, status: 'pending' });
                      }}
                      style={{
                        backgroundColor: (!selectedScreenshotOrder.status || selectedScreenshotOrder.status === 'pending') ? '#fef3c7' : '#fff',
                        color: '#92400e',
                        border: '1px solid #fcd34d',
                        padding: '0.6rem 0.4rem',
                        borderRadius: '7px',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <Clock size={12} /> Pending
                    </button>

                    {/* Option 2: Verify */}
                    <button
                      type="button"
                      onClick={() => {
                        onStatusChange(selectedScreenshotOrder.id, 'confirmed');
                        setSelectedScreenshotOrder({ ...selectedScreenshotOrder, status: 'confirmed' });
                      }}
                      style={{
                        backgroundColor: '#10b981',
                        color: '#fff',
                        border: 'none',
                        padding: '0.6rem 0.4rem',
                        borderRadius: '7px',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
                      }}
                    >
                      <CheckCircle2 size={12} /> Verify
                    </button>

                    {/* Option 3: Cancel */}
                    <button
                      type="button"
                      onClick={() => {
                        onStatusChange(selectedScreenshotOrder.id, 'cancelled');
                        setSelectedScreenshotOrder({ ...selectedScreenshotOrder, status: 'cancelled' });
                      }}
                      style={{
                        backgroundColor: selectedScreenshotOrder.status === 'cancelled' ? '#fee2e2' : '#fff',
                        color: '#ef4444',
                        border: '1px solid #fca5a5',
                        padding: '0.6rem 0.4rem',
                        borderRadius: '7px',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <XCircle size={12} /> Cancel
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedScreenshotOrder(null)}
                    style={{
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      padding: '0.45rem',
                      borderRadius: '7px',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      marginTop: '0.15rem',
                    }}
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
