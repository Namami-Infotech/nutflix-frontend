'use client';

import React, { useState, useEffect } from 'react';
import { Product, formatWeightAndUnit, getProductPrices, formatPrice } from '@/lib/api';
import { useCart } from '../../cart/cart.context';
import { useAuth } from '@/modules/auth';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import Link from 'next/link';

interface Props {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80';

export const ProductCard: React.FC<Props> = ({ product, onQuickView }) => {
  const [mounted, setMounted] = useState(false);
  const { items, addToCart, openCart } = useCart();
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const [imgSrc, setImgSrc] = useState(product.imageUrl || FALLBACK_IMG);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItem = mounted && Array.isArray(items) ? items.find((i) => String(i.product.id) === String(product.id)) : null;
  const cartQty = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    setImgSrc(product.imageUrl || FALLBACK_IMG);
  }, [product.imageUrl]);

  const productUrl = `/products/${product.slug || product.id}`;
  const { regularPrice, currentPrice, hasDiscount, discountPercent } = getProductPrices(product);

  return (
    <div className="product-card">
      {/* Product Image Container */}
      <div className="product-card-image-wrapper">
        {cartQty > 0 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openCart();
            }}
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'var(--color-forest)',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '0.35rem 0.75rem',
              borderRadius: '20px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              zIndex: 10,
              border: '1px solid rgba(255,255,255,0.25)',
              cursor: 'pointer',
            }}
            title="Click to view Cart"
          >
            <ShoppingCart size={13} color="var(--color-gold)" />
            <span>{cartQty} in Cart</span>
          </button>
        )}

        {/* Top-Right Discount % Badge */}
        {hasDiscount && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: '#15803d',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 900,
              padding: '0.22rem 0.55rem',
              borderRadius: '20px',
              boxShadow: '0 3px 8px rgba(21,128,61,0.35)',
              zIndex: 10,
              letterSpacing: '0.3px'
            }}
          >
            {discountPercent}% OFF
          </span>
        )}

        <Link
          href={productUrl}
          style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}
          title={`View details of ${product.name}`}
        >
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => setImgSrc(FALLBACK_IMG)}
            className="product-card-image"
            style={{ cursor: 'pointer' }}
          />
        </Link>

        {/* Quick View Button Overlay */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="quick-view-btn"
            title="Quick View"
          >
            <Eye size={13} />
            <span>Quick View</span>
          </button>
        )}
      </div>

      {/* Product Information */}
      <div className="product-card-body">
        <div>
          {/* Star Rating Badge */}
          <Link href={productUrl} style={{ textDecoration: 'none', display: 'block' }}>
            <div className="product-rating-row" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="var(--color-gold)" color="var(--color-gold)" />
                ))}
              </div>
              <span className="rating-score">{product.rating}</span>
              <span className="rating-count">({product.reviewCount})</span>
            </div>
          </Link>

          <Link href={productUrl} style={{ textDecoration: 'none', display: 'block' }} title={`View details of ${product.name}`}>
            <h3 className="product-title">{product.name}</h3>
          </Link>

          {/* Unit / Pack Size Tag */}
          <div style={{ marginBottom: '0.45rem' }}>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#475569',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                display: 'inline-block',
                letterSpacing: '0.2px',
              }}
            >
              {formatWeightAndUnit(product.weight, product.unit)}
            </span>
          </div>

          <Link href={productUrl} style={{ textDecoration: 'none', display: 'block' }}>
            <p className="product-desc" style={{ cursor: 'pointer' }}>{product.description}</p>
          </Link>

        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="product-card-footer">
          <div className="price-wrapper" style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span className="price-main">₹{formatPrice(currentPrice)}</span>
            {hasDiscount && (
              <span style={{ textDecoration: 'line-through', color: '#dc2626', fontSize: '0.82rem', fontWeight: 600, opacity: 0.85 }}>
                ₹{formatPrice(regularPrice)}
              </span>
            )}
          </div>

          <button
            onClick={() => !isAdmin && addToCart(product)}
            disabled={isAdmin}
            className={`btn-primary add-to-cart-btn ${isAdmin ? 'disabled-out-of-stock' : ''}`}
            style={
              isAdmin
                ? {
                  backgroundColor: '#e2e8f0',
                  color: '#94a3b8',
                  cursor: 'not-allowed',
                  boxShadow: 'none',
                  border: '1px solid #cbd5e1',
                }
                : {}
            }
            title={isAdmin ? 'Admin accounts cannot add to cart' : 'Add to Basket'}
          >
            <ShoppingCart size={14} />
            <span>{isAdmin ? 'Admin (Disabled)' : 'Add'}</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .product-card {
          background-color: #ffffff;
          border-radius: var(--radius-card);
          overflow: hidden;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: var(--transition);
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .product-card-image-wrapper {
          position: relative;
          width: 100%;
          height: 220px;
          background-color: var(--color-bg-light);
          overflow: hidden;
        }

        .product-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .product-origin-badge {
          position: absolute;
          top: 0.6rem;
          left: 0.6rem;
          background-color: rgba(22, 35, 26, 0.85);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-pill);
          white-space: nowrap;
          max-width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .quick-view-btn {
          opacity: 0;
          transition: opacity 0.2s ease;
          position: absolute;
          bottom: 0.6rem;
          right: 0.6rem;
          background-color: #ffffff;
          color: var(--color-forest);
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-pill);
          font-weight: 700;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }

        .product-card:hover .quick-view-btn {
          opacity: 1;
        }

        .product-card-body {
          padding: 1.1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .product-rating-row {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          margin-bottom: 0.35rem;
        }

        .rating-score {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--color-forest);
        }

        .rating-count {
          font-size: 0.72rem;
          color: var(--color-text-muted);
        }

        .product-title {
          font-size: 0.98rem;
          font-weight: 800;
          color: var(--color-forest);
          line-height: 1.35;
          margin-bottom: 0.4rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-desc {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-bottom: 0.6rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }



        .product-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.65rem;
          border-top: 1px solid #f0e8de;
        }

        .price-main {
          font-size: 1.15rem;
          font-weight: 900;
          color: var(--color-forest);
        }

        .price-weight {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          margin-left: 3px;
        }

        .add-to-cart-btn {
          padding: 0.45rem 0.9rem !important;
          font-size: 0.8rem !important;
          width: auto !important;
        }

        @media (max-width: 640px) {
          .product-card-image-wrapper {
            height: 155px;
          }
          .product-card-body {
            padding: 0.75rem;
          }
          .product-title {
            font-size: 0.88rem;
            margin-bottom: 0.3rem;
          }
          .product-desc {
            display: none;
          }

          .price-main {
            font-size: 1.02rem;
          }
          .add-to-cart-btn {
            padding: 0.4rem 0.7rem !important;
            font-size: 0.75rem !important;
          }
          .quick-view-btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
