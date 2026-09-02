import React, { useState, useEffect } from 'react';
import { Product, formatWeightAndUnit, getProductPrices, formatPrice } from '@/lib/api';
import { useCart } from '../../cart/cart.context';
import { useAuth } from '@/modules/auth';
import { Star, ShoppingCart, X, ShieldCheck, Truck, Sparkles, Check, CreditCard, ChevronRight, Plus, Minus, Heart } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface Props {
  product: Product | null;
  isOpen?: boolean;
  onClose: () => void;
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80';

export const ProductDetailModal: React.FC<Props> = ({ product, isOpen = true, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const { items, addToCart, updateQuantity, openCart } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const [paymentModesText, setPaymentModesText] = useState('Online / UPI, Cash on Delivery');

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItem = mounted && product && Array.isArray(items) ? items.find((i) => String(i.product.id) === String(product.id)) : null;
  const cartQty = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('nutflix_active_payment_modes');
        if (stored) {
          setPaymentModesText(stored);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  if (!isOpen || !product) return null;

  const stockNum = typeof product.stock === 'number' ? product.stock : parseInt(String(product.stock || 0), 10);
  const isOutOfStock = isNaN(stockNum) || stockNum <= 0;
  const { regularPrice, currentPrice, hasDiscount, discountPercent, savings } = getProductPrices(product);

  const handleAddToCart = () => {
    if (isOutOfStock || isAdmin) return;
    addToCart(product, 1);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(22, 35, 26, 0.75)', backdropFilter: 'blur(6px)', animation: 'fadeIn 0.2s ease-out' }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: '820px', backgroundColor: '#ffffff', borderRadius: 'var(--radius-card, 24px)', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', zIndex: 10, animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', zIndex: 20, cursor: 'pointer', border: 'none', transition: 'var(--transition)' }} title="Close Modal">
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', overflowY: 'auto' }}>
          <div style={{ position: 'relative', backgroundColor: 'var(--color-bg-light, #f9f6f0)', minHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
            <OptimizedImage
              src={product.imageUrl}
              fallbackSrc={FALLBACK_IMG}
              alt={product.name}
              priority={true}
              objectFit="contain"
              style={{ maxHeight: '360px', borderRadius: '16px', filter: isOutOfStock ? 'grayscale(35%) opacity(0.85)' : 'none' }}
            />
            {hasDiscount && !isOutOfStock && (
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: '#15803d', color: '#ffffff', fontSize: '0.8rem', fontWeight: 900, padding: '0.3rem 0.75rem', borderRadius: '20px', boxShadow: '0 4px 12px rgba(21,128,61,0.35)', zIndex: 5 }}>
                {discountPercent}% OFF
              </div>
            )}
          </div>

          <div style={{ padding: '2rem 1.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="var(--color-gold)" color="var(--color-gold)" />
                  ))}
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-forest)' }}>{product.rating}</span>
                <a href={`/products/${product.slug}`} onClick={onClose} style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark, #b45309)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                  ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'}) • See all
                </a>
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', lineHeight: '1.25', marginBottom: '0.6rem' }}>{product.name}</h2>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-forest)' }}>₹{formatPrice(currentPrice)}</span>
                {hasDiscount && <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#dc2626', textDecoration: 'line-through', opacity: 0.85 }}>₹{formatPrice(regularPrice)}</span>}
                {hasDiscount && <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 7px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 900 }}>Save ₹{formatPrice(savings)}</span>}
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>({formatWeightAndUnit(product.weight, product.unit)})</span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.55', marginBottom: '1rem' }}>
              {product.description}
            </p>

            {/* Impact Box */}
            <div
              style={{
                backgroundColor: 'var(--color-gold-light)',
                border: '1px solid var(--color-gold)',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
              }}
            >
              <Heart size={18} fill="var(--color-gold)" color="var(--color-gold)" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: '#794d13' }}>Kindness Impact Guarantee</h4>
                <p style={{ fontSize: '0.78rem', color: '#794d13' }}>{product.impactDescription}</p>
              </div>
            </div>
          </div>

          <div>
            {/* Quantity Selector & Add button */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              {cartQty > 0 && !isAdmin ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: 'none',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0.4rem 0.8rem',
                      backgroundColor: 'var(--color-forest)',
                      color: '#ffffff',
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(product.id, cartQty - 1)}
                      style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} color="#ffffff" />
                    </button>
                    <span style={{ fontSize: '1rem', fontWeight: 900, padding: '0 10px', minWidth: '28px', textAlign: 'center', color: 'var(--color-gold)' }}>
                      {cartQty}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, cartQty + 1)}
                      style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} color="#ffffff" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      openCart();
                    }}
                    className="btn-primary"
                    style={{
                      flex: '1 1 180px',
                      height: '46px',
                      fontSize: '0.9rem',
                      backgroundColor: 'var(--color-gold-dark, #b45309)',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(180, 83, 9, 0.25)',
                    }}
                  >
                    <ShoppingCart size={17} />
                    <span>View in Cart ({cartQty}) • ₹{formatPrice(currentPrice * cartQty)}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isAdmin}
                  className="btn-primary"
                  style={{
                    flex: '1 1 180px',
                    height: '46px',
                    fontSize: '0.9rem',
                    backgroundColor: isAdmin ? '#e2e8f0' : undefined,
                    color: isAdmin ? '#94a3b8' : undefined,
                    cursor: isAdmin ? 'not-allowed' : 'pointer',
                    border: isAdmin ? '1px solid #cbd5e1' : undefined,
                    boxShadow: isAdmin ? 'none' : undefined,
                  }}
                  title={isAdmin ? 'Admin accounts cannot purchase items' : 'Add to Basket'}
                >
                  <ShoppingCart size={18} />
                  <span>{isAdmin ? 'Admin (Disabled)' : `Add to Basket • ₹${formatPrice(currentPrice)}`}</span>
                </button>
              )}
            </div>

            {/* Delivery Payment Modes & Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingTop: '0.8rem', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-forest)' }}>
                <CreditCard size={15} color="var(--color-gold)" />
                <span>Accepted Payment Modes: {paymentModesText}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Truck size={14} color="var(--color-gold)" /> Dispatch within 24h</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={14} color="var(--color-gold)" /> Fair Trade Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
