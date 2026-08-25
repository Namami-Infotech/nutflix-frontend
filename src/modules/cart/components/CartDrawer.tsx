'use client';

import React from 'react';
import { useCart } from '../cart.context';
import { formatWeightAndUnit } from '@/lib/api';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, subtotal, freeShippingThreshold } = useCart();

  if (!isOpen) return null;

  const freeShippingDiff = freeShippingThreshold - subtotal;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(13, 23, 17, 0.6)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Slide Drawer Panel */}
      <div
        className="cart-drawer-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          animation: 'slideLeft 0.3s ease-out',
        }}
      >
        <style>{`
          @keyframes slideLeft {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @media (max-width: 480px) {
            .cart-drawer-panel {
              max-width: 100% !important;
            }
          }
        `}</style>

        {/* Drawer Header */}
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
            <ShoppingBag size={22} color="var(--color-forest)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-forest)' }}>
              Your Kindness Basket
            </h2>
          </div>
          <button
            onClick={closeCart}
            style={{
              padding: '0.4rem',
              borderRadius: '50%',
              backgroundColor: '#fff',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
            }}
            aria-label="Close cart drawer"
          >
            <X size={18} color="var(--color-forest)" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f5efe6', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
            {freeShippingDiff <= 0 ? (
              <span style={{ color: '#276749' }}>🎉 You unlocked FREE Shipping!</span>
            ) : (
              <span>
                Add <strong>₹{freeShippingDiff.toFixed(2)}</strong> more for FREE Shipping!
              </span>
            )}
          </div>
          <div style={{ height: '6px', width: '100%', backgroundColor: '#e2dad0', borderRadius: '10px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                backgroundColor: 'var(--color-gold)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-cream-light)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <ShoppingBag size={32} color="var(--color-gold)" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-forest)' }}>
                Your basket is empty
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                Discover ethically harvested Tanzanian treasures and fuel positive change today.
              </p>
              <button onClick={closeCart} className="btn-primary">
                Explore Products
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {items.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid #f0e8de',
                  }}
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    style={{
                      width: '75px',
                      height: '75px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      backgroundColor: 'var(--color-bg-light)',
                    }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-forest)', lineHeight: '1.3' }}>
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          style={{ color: '#999', padding: '2px' }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Weight: {formatWeightAndUnit(item.product.weight, item.product.unit)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--color-border)',
                          borderRadius: '20px',
                          padding: '2px 8px',
                          backgroundColor: '#fbf8f3',
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
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-forest)' }}>
                        ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary"
              style={{ width: '100%', borderRadius: 'var(--radius-pill)', textDecoration: 'none' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </Link>

            <div style={{ textAlign: 'center', marginTop: '0.8rem', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              🔒 Guaranteed Secure Checkout • Carbon Neutral Shipping
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
