import React, { useState, useEffect } from 'react';
import { Product, formatWeightAndUnit, fetchPaymentTypes, PaymentType } from '@/lib/api';
import { useCart } from '../../cart/cart.context';
import { X, Star, ShoppingBag, Plus, Minus, Heart, ShieldCheck, Truck, CreditCard } from 'lucide-react';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<Props> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activePayments, setActivePayments] = useState<PaymentType[]>([]);

  useEffect(() => {
    async function loadPayments() {
      const types = await fetchPaymentTypes();
      setActivePayments(types.filter((t) => t.status === 'active'));
    }
    loadPayments();
  }, []);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const paymentModesText = activePayments.length > 0
    ? activePayments.map((p) => (p.code === 'cash' ? 'Cash on Delivery' : 'UPI Payment')).join(' • ')
    : 'Cash on Delivery • UPI Payment';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(13, 23, 17, 0.7)',
          backdropFilter: 'blur(5px)',
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          animation: 'fadeIn 0.3s ease-out',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 12,
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
          }}
          aria-label="Close detail modal"
        >
          <X size={20} color="var(--color-forest)" />
        </button>

        {/* Left Product Image */}
        <div style={{ position: 'relative', height: '100%', minHeight: '260px', backgroundColor: 'var(--color-bg-light)' }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Right Details */}
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    fill={i < Math.round(Number(product.rating || 5)) ? 'var(--color-gold)' : '#e2e8f0'}
                    color={i < Math.round(Number(product.rating || 5)) ? 'var(--color-gold)' : '#cbd5e1'}
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-forest)' }}>
                {product.rating}
              </span>
              <a
                href={`/products/${product.slug}`}
                onClick={onClose}
                style={{ fontSize: '0.8rem', color: 'var(--color-gold-dark, #b45309)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
              >
                ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'}) • See all
              </a>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', lineHeight: '1.25', marginBottom: '0.6rem' }}>
              {product.name}
            </h2>

            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.8rem' }}>
              ₹{parseFloat(product.price).toFixed(2)}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginLeft: '6px' }}>
                ({formatWeightAndUnit(product.weight, product.unit)})
              </span>
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '0.4rem 0.8rem',
                  backgroundColor: 'var(--color-cream-light)',
                }}
              >
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '4px' }}>
                  <Minus size={16} color="var(--color-forest)" />
                </button>
                <span style={{ fontSize: '1rem', fontWeight: 800, padding: '0 10px', minWidth: '28px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button onClick={() => setQuantity(quantity + 1)} style={{ padding: '4px' }}>
                  <Plus size={16} color="var(--color-forest)" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary"
                style={{ flex: '1 1 180px', height: '46px', fontSize: '0.9rem' }}
              >
                <ShoppingBag size={18} />
                <span>Add to Basket • ₹{(parseFloat(product.price) * quantity).toFixed(2)}</span>
              </button>
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
