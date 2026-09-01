'use client';

import React from 'react';
import {
  X,
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  AlertCircle,
  ShoppingBag,
  RotateCcw,
  XCircle,
  FileCheck
} from 'lucide-react';
import { formatPrice } from '@/lib/api';

export interface OrderTrackerModalProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const DELIVERY_STEPS = [
  {
    key: 'confirmed',
    aliases: ['pending', 'confirmed', 'placed', 'order_placed'],
    label: 'Order Confirmed',
    description: 'Your order has been received & verified',
    icon: FileCheck,
  },
  {
    key: 'processing',
    aliases: ['processing', 'packed', 'preparing'],
    label: 'Processing & Packed',
    description: 'Items packed carefully in eco-friendly boxes',
    icon: Package,
  },
  {
    key: 'shipped',
    aliases: ['shipped', 'in_transit', 'dispatched'],
    label: 'Shipped',
    description: 'Package handed over to courier partner',
    icon: Truck,
  },
  {
    key: 'delivered',
    aliases: ['delivered', 'completed'],
    label: 'Delivered',
    description: 'Package successfully delivered',
    icon: CheckCircle2,
  },
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const rawStatus = (order.status || 'confirmed').toLowerCase();
  const isCancelled = rawStatus === 'cancelled';
  const isReturned = rawStatus === 'returned';

  // Determine active step index (0 to 4)
  let activeStepIndex = 0;
  if (!isCancelled && !isReturned) {
    const stepIdx = DELIVERY_STEPS.findIndex(s => s.aliases.includes(rawStatus));
    activeStepIndex = stepIdx !== -1 ? stepIdx : 0;
  }

  // Calculate formatted order date
  const createdDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Estimated Delivery (3 days after creation)
  const estDate = new Date(createdDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  const formattedEstDate = estDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          position: 'relative',
          padding: '0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: 'var(--color-forest)',
            color: '#ffffff',
            padding: '1.25rem 1.5rem',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid var(--color-gold)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gold)', fontWeight: 800 }}>
              Live Order Status Tracking
            </div>
            <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.01em' }}>
              Order #{order.orderNumber || order.customId || order.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#ffffff',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem' }}>

          {/* Date & Summary Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              backgroundColor: '#faf7f2',
              padding: '1rem',
              borderRadius: '14px',
              border: '1px solid #e2d5c3'
            }}
          >
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Order Date</span>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-forest)', marginTop: '2px' }}>
                {formattedDate}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Estimated Delivery</span>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                {isCancelled ? 'N/A (Cancelled)' : isReturned ? 'Returned' : formattedEstDate}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Total Amount</span>
              <div style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--color-forest)', marginTop: '2px' }}>
                ₹{formatPrice(order.totalAmount || 0)}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>Payment Method</span>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#3b82f6', marginTop: '2px' }}>
                {order.paymentMethod?.split('(')[0]?.trim() || 'Prepaid / UPI'}
              </div>
              {(order.transactionId || order.razorpayPaymentId || (order.paymentMethod && order.paymentMethod.includes('pay_'))) && (
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '2px', fontFamily: 'monospace' }}>
                  Txn: {order.transactionId || order.razorpayPaymentId || order.paymentMethod.match(/pay_[a-zA-Z0-9]+/)?.[0]}
                </div>
              )}
            </div>
          </div>

          {/* Cancelled / Returned Alert */}
          {isCancelled && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <XCircle size={24} color="#ef4444" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '0.9rem' }}>This order has been Cancelled.</strong>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#7f1d1d' }}>
                  If you paid online, your refund will be processed within 3-5 working days.
                </p>
              </div>
            </div>
          )}

          {isReturned && (
            <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <RotateCcw size={24} color="#f97316" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '0.9rem' }}>Return Request Initiated / Processed.</strong>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#c2410c' }}>
                  Our courier partner will pick up the returned items shortly.
                </p>
              </div>
            </div>
          )}

          {/* STEP BY STEP TRACKING TIMELINE */}
          {!isCancelled && !isReturned && (
            <div style={{ marginBottom: '2rem', padding: '0.5rem 0' }}>
              <h4 style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', fontWeight: 900, color: 'var(--color-forest)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🚚 Delivery Pipeline Progress
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {DELIVERY_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isDone = index <= activeStepIndex;
                  const isCurrent = index === activeStepIndex;
                  const isLast = index === DELIVERY_STEPS.length - 1;

                  return (
                    <div key={step.key} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                      {/* Left Column: Icon Circle & Connector Line */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            backgroundColor: isDone
                              ? isCurrent
                                ? 'var(--color-forest)'
                                : '#10b981'
                              : '#e2e8f0',
                            color: isDone ? '#ffffff' : '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: isCurrent ? '0 0 0 4px rgba(16, 185, 129, 0.25)' : 'none',
                            transition: 'all 0.3s ease',
                            zIndex: 2,
                            flexShrink: 0
                          }}
                        >
                          <Icon size={20} />
                        </div>

                        {!isLast && (
                          <div
                            style={{
                              width: '3px',
                              height: '45px',
                              backgroundColor: index < activeStepIndex ? '#10b981' : '#e2e8f0',
                              transition: 'background-color 0.3s ease',
                              margin: '4px 0'
                            }}
                          />
                        )}
                      </div>

                      {/* Right Column: Step Label & Description */}
                      <div style={{ paddingBottom: isLast ? '0' : '1.5rem', flexGrow: 1, paddingTop: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span
                            style={{
                              fontWeight: isCurrent ? 900 : isDone ? 800 : 600,
                              fontSize: '0.95rem',
                              color: isCurrent ? 'var(--color-forest)' : isDone ? '#0f172a' : '#94a3b8'
                            }}
                          >
                            {step.label}
                          </span>
                          {isCurrent && (
                            <span
                              style={{
                                backgroundColor: '#ecfdf5',
                                color: '#047857',
                                border: '1px solid #a7f3d0',
                                padding: '0.15rem 0.6rem',
                                borderRadius: '12px',
                                fontSize: '0.68rem',
                                fontWeight: 900,
                                textTransform: 'uppercase'
                              }}
                            >
                              Current Stage
                            </span>
                          )}
                          {isDone && !isCurrent && (
                            <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 800 }}>✓ Done</span>
                          )}
                        </div>

                        <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: isDone ? '#64748b' : '#cbd5e1' }}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shipping Address Details */}
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: '#64748b', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <MapPin size={14} color="var(--color-forest)" /> Shipping & Delivery Address
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1e293b' }}>
              {order.customerName}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>
              {order.shippingAddress}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
              Email: {order.customerEmail}
            </div>
          </div>

          {/* Purchased Items List */}
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: '#64748b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShoppingBag size={14} color="var(--color-forest)" /> Items in this Order ({Array.isArray(order.items) ? order.items.length : 0})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#fff',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=200&q=80'}
                      alt={item.name || 'Product'}
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=200&q=80';
                      }}
                      style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-forest)' }}>
                        {item.name || `Product #${item.productId}`}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Quantity: <strong>{item.quantity}</strong> | Price: <strong>₹{item.price}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontWeight: 900, fontSize: '0.88rem', color: 'var(--color-forest)' }}>
                    ₹{formatPrice((parseFloat(item.price) || 0) * (item.quantity || 1))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #e2e8f0', padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--color-forest)',
              color: '#ffffff',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
