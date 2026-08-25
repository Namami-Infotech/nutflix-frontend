'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchProductBySlug, fetchReviews, fetchPaymentTypes, formatWeightAndUnit, PaymentType } from '@/lib/api';
import { Product, Review } from '@/types';
import { useCart } from '@/modules/cart';
import { Star, ShoppingBag, Heart, ArrowLeft, Plus, Minus, CreditCard, ShieldCheck, Truck, Share2, Sparkles, CheckCircle2, Leaf } from 'lucide-react';
import Link from 'next/link';
import { ProductReviews } from '@/modules/catalog/components/ProductReviews';

export default function ProductDetailPage() {
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const slug = params?.slug as string;
  const { items: cartItems, addToCart, openCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activePayments, setActivePayments] = useState<PaymentType[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    async function loadData() {
      if (slug) {
        const prod = await fetchProductBySlug(slug);
        if (prod) {
          const revs = await fetchReviews(prod.id);
          setReviews(revs);
          if (revs && revs.length > 0) {
            const sum = revs.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
            const dynamicAvg = (sum / revs.length).toFixed(1);
            setProduct({
              ...prod,
              rating: dynamicAvg,
              reviewCount: revs.length,
            });
          } else {
            setProduct(prod);
          }
        } else {
          setProduct(null);
        }
      }
      const pTypes = await fetchPaymentTypes();
      setActivePayments(pTypes.filter((t) => t.status === 'active'));
      setLoading(false);
    }
    loadData();
  }, [slug]);

  const handleReviewSubmitted = (newRating: string | number, newCount: number, newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    if (product) {
      setProduct({
        ...product,
        rating: String(newRating),
        reviewCount: newCount,
      });
    }
  };

  if (!mounted || loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link href="/products" className="btn-primary" style={{ marginTop: '1rem' }}>
          Back to Products Catalog
        </Link>
      </div>
    );
  }

  const paymentModesText = activePayments.length > 0
    ? activePayments.map((p) => (p.code === 'cash' ? 'Cash on Delivery' : 'UPI Payment')).join(' • ')
    : 'Cash on Delivery • UPI Payment';

  const stockNum = typeof product.stock === 'number' ? product.stock : parseInt(String(product.stock || 0), 10);
  const isOutOfStock = isNaN(stockNum) || stockNum <= 0;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem', position: 'relative' }}>
      {toastMsg && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, backgroundColor: '#10b981', color: '#fff', padding: '0.85rem 1.5rem', borderRadius: '8px', fontWeight: 800, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-forest)', fontWeight: 700, marginBottom: '2rem', textDecoration: 'none' }}>
        <ArrowLeft size={18} />
        Back to Products Catalog
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '4rem', alignItems: 'flex-start' }}>
        {/* Product Gallery Left */}
        <div>
          <div style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '440px', objectFit: 'cover' }} />
          </div>

          {/* Product Quality Assurance Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', padding: '0.85rem 1rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Leaf size={20} color="var(--color-forest)" />
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-forest)' }}>100% Pure & Organic</div>
            </div>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--color-border)', padding: '0.85rem 1rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Truck size={20} color="var(--color-gold)" />
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-forest)' }}>Express Shipping</div>
            </div>
          </div>
        </div>

        {/* Product Info Right */}
        <div>
          {/* Status Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {cartItems.find((i) => String(i.product.id) === String(product.id)) && (
              <button
                onClick={() => openCart()}
                style={{ backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
                title="Click to view Cart"
              >
                <ShoppingBag size={13} color="#2563eb" />
                <span>{cartItems.find((i) => String(i.product.id) === String(product.id))?.quantity} in your Cart</span>
              </button>
            )}
            <span style={{ backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
              In Stock & Ready to Dispatch
            </span>
            <span style={{ backgroundColor: '#fefce8', color: '#854d0e', border: '1px solid #fef08a', padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={12} color="#eab308" /> Direct Farm Sourced
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-forest)', lineHeight: '1.2', marginBottom: '0.8rem' }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < Math.round(Number(product.rating || 5)) ? 'var(--color-gold)' : '#e2e8f0'}
                  color={i < Math.round(Number(product.rating || 5)) ? 'var(--color-gold)' : '#cbd5e1'}
                />
              ))}
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-forest)' }}>
              {product.rating}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-forest)' }}>
                ₹{parseFloat(product.price).toFixed(2)}
              </span>
              <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>
                / {formatWeightAndUnit(product.weight, product.unit)}
              </span>
            </div>

            {/* Stock Quantity Badge */}
            <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>
              {isOutOfStock ? (
                <span style={{ color: '#dc2626', backgroundColor: '#fee2e2', padding: '0.35rem 0.85rem', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#dc2626' }}></span>
                  Out of Stock (0 units)
                </span>
              ) : stockNum <= 5 ? (
                <span style={{ color: '#ea580c', backgroundColor: '#ffedd5', padding: '0.35rem 0.85rem', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ea580c' }}></span>
                  Only {stockNum} left in stock!
                </span>
              ) : (
                <span style={{ color: '#166534', backgroundColor: '#dcfce7', padding: '0.35rem 0.85rem', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
                  In Stock: <strong>{stockNum} units</strong>
                </span>
              )}
            </div>
          </div>

          <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          <div style={{ backgroundColor: 'var(--color-gold-light)', padding: '1rem 1.2rem', borderRadius: '14px', border: '1px solid var(--color-gold)', marginBottom: '1.5rem', display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
            <Heart size={20} fill="var(--color-gold)" color="var(--color-gold)" style={{ marginTop: 2 }} />
            <div>
              <h4 style={{ fontWeight: 800, color: '#794d13', fontSize: '0.95rem' }}>Impact Contribution</h4>
              <p style={{ fontSize: '0.88rem', color: '#794d13' }}>{product.impactDescription}</p>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-pill)', padding: '0.5rem 1rem', backgroundColor: '#fff', opacity: isOutOfStock ? 0.6 : 1 }}>
              <button disabled={isOutOfStock} onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '4px' }}>
                <Minus size={18} color="var(--color-forest)" />
              </button>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, padding: '0 14px' }}>{isOutOfStock ? 0 : quantity}</span>
              <button disabled={isOutOfStock || quantity >= stockNum} onClick={() => setQuantity(quantity + 1)} style={{ padding: '4px' }}>
                <Plus size={18} color="var(--color-forest)" />
              </button>
            </div>

            <button
              onClick={() => !isOutOfStock && addToCart(product, quantity)}
              disabled={isOutOfStock}
              className="btn-primary"
              style={{
                flex: 1,
                height: '52px',
                fontSize: '1rem',
                backgroundColor: isOutOfStock ? '#e2e8f0' : undefined,
                color: isOutOfStock ? '#94a3b8' : undefined,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                border: isOutOfStock ? '1px solid #cbd5e1' : undefined,
                boxShadow: isOutOfStock ? 'none' : undefined,
              }}
            >
              <ShoppingBag size={20} />
              <span>{isOutOfStock ? 'Out of Stock' : `Add to Basket • ₹${(parseFloat(product.price) * quantity).toFixed(2)}`}</span>
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Product link copied to clipboard!');
                }
              }}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                border: '1.5px solid var(--color-border)',
                backgroundColor: '#ffffff',
                color: 'var(--color-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                flexShrink: 0
              }}
              title="Share Product Link"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Ratings & Reviews Section */}
      <ProductReviews
        productId={product.id}
        productName={product.name}
        initialReviews={reviews}
        currentRating={product.rating}
        currentReviewCount={product.reviewCount}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}

