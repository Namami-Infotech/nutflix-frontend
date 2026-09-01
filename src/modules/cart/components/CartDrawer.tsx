'use client';

import React from 'react';
import { useCart } from '../cart.context';
import { formatWeightAndUnit, getAuthToken, getProductPrices, formatPrice } from '@/lib/api';
import { useAuth } from '@/modules/auth';
import { X, Plus, Minus, Trash2, ShoppingCart, ArrowRight, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, subtotal, freeShippingThreshold } = useCart();
  const { isLoggedIn, user, openLoginModal } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const router = useRouter();

  if (!isOpen) return null;

  const handleProceedToCheckout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdmin) {
      alert('Admin account is not permitted to place customer orders.');
      return;
    }
    const token = getAuthToken();
    if (!token && !isLoggedIn) {
      closeCart();
      openLoginModal(() => {
        router.push('/checkout');
      }, 'Please sign in or create an account to proceed to checkout.');
      return;
    }
    closeCart();
    router.push('/checkout');
  };

  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFree = freeShippingThreshold - subtotal;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(22, 35, 26, 0.6)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.3s ease-out',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        `}</style>
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-cream-light)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingCart size={20} color="var(--color-forest)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-forest)', margin: 0 }}>
              Your Basket ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={closeCart}
            style={{
              padding: '0.4rem',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--color-border)',
            }}
            aria-label="Close cart"
          >
            <X size={18} color="var(--color-forest)" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            <span>
              {remainingForFree <= 0 ? (
                <strong style={{ color: '#059669' }}>🎉 You unlocked FREE Express Delivery!</strong>
              ) : (
                <>Add <strong style={{ color: 'var(--color-gold-hover)' }}>₹{formatPrice(remainingForFree)}</strong> more for FREE Delivery</>
              )}
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-bg-light)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: remainingForFree <= 0 ? '#10b981' : 'var(--color-gold)',
                borderRadius: '3px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {items.length === 0 ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-bg-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingCart size={32} color="var(--color-gold)" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.3rem' }}>
                  Your Basket is Empty
                </h4>
                <p style={{ fontSize: '0.85rem' }}>
                  Discover our nutrient-dense, sustainably harvested Tanzanian cashews.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item) => {
                const { currentPrice, regularPrice, hasDiscount } = getProductPrices(item.product);
                return (
                  <div
                    key={item.product.id}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '0.85rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-bg-light)',
                      border: '1px solid var(--color-border)',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ paddingRight: '1.5rem' }}>
                        <h4
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            color: 'var(--color-forest)',
                            lineHeight: 1.3,
                            marginBottom: '0.2rem',
                          }}
                        >
                          {item.product.name}
                        </h4>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {formatWeightAndUnit(item.product.weight, item.product.unit)}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        style={{
                          position: 'absolute',
                          top: '0.75rem',
                          right: '0.75rem',
                          color: 'var(--color-text-muted)',
                          padding: '4px',
                        }}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '0.6rem',
                        }}
                      >
                        {/* Quantity Controls */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor: '#ffffff',
                            padding: '2px',
                          }}
                        >
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            style={{ padding: '4px' }}
                          >
                            <Minus size={12} color="var(--color-forest)" />
                          </button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 8px' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            style={{ padding: '4px' }}
                          >
                            <Plus size={12} color="var(--color-forest)" />
                          </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                          {hasDiscount && (
                            <span style={{ fontSize: '0.75rem', color: '#dc2626', textDecoration: 'line-through', opacity: 0.85 }}>
                              ₹{formatPrice(regularPrice * item.quantity)}
                            </span>
                          )}
                          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-forest)' }}>
                            ₹{formatPrice(currentPrice * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-cream-light)',
            }}
          >
            {/* Impact Promise Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: '#794d13',
                backgroundColor: 'var(--color-gold-light)',
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              <Heart size={16} fill="var(--color-gold)" color="var(--color-gold)" />
              This order supports smallholder farmers & funds local clinics!
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.1rem',
                fontWeight: 800,
                color: 'var(--color-forest)',
                marginBottom: '1rem',
              }}
            >
              <span>Subtotal</span>
              <span>₹{formatPrice(subtotal)}</span>
            </div>

            {isAdmin && (
              <div
                style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#991b1b',
                  fontSize: '0.8rem',
                  padding: '0.5rem 0.8rem',
                  borderRadius: '8px',
                  marginBottom: '0.8rem',
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                ⚠️ Admin Account: Checkout is disabled for admins.
              </div>
            )}

            <button
              onClick={handleProceedToCheckout}
              disabled={isAdmin}
              className="btn-primary"
              style={{
                width: '100%',
                borderRadius: 'var(--radius-pill)',
                justifyContent: 'center',
                backgroundColor: isAdmin ? '#e2e8f0' : undefined,
                color: isAdmin ? '#94a3b8' : undefined,
                cursor: isAdmin ? 'not-allowed' : 'pointer',
                border: isAdmin ? '1px solid #cbd5e1' : undefined,
                boxShadow: isAdmin ? 'none' : undefined,
              }}
              title={isAdmin ? 'Admin accounts cannot checkout' : 'Proceed to Checkout'}
            >
              <span>{isAdmin ? 'Admin (Checkout Disabled)' : 'Proceed to Checkout'}</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '0.8rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              🔒 Guaranteed Secure Checkout • Carbon Neutral Shipping
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
