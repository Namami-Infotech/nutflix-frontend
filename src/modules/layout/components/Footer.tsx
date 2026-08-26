'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Heart, Mail, Truck, Award, Phone, MapPin } from 'lucide-react';
import { MobileBottomBar } from './MobileBottomBar';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <>
      <footer style={{ backgroundColor: 'var(--color-forest-dark)', color: '#eadfcb', paddingTop: '3.5rem', paddingBottom: '2rem' }}>
        {/* Value Proposition Banner */}
        <div className="container" style={{ marginBottom: '3rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
              padding: '1.5rem 1.8rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Award size={32} color="var(--color-gold)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 800 }}>100% Ethically Sourced</h4>
                <p style={{ fontSize: '0.8rem', color: '#a0b0a4' }}>Directly empowering smallholder farmers</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Truck size={32} color="var(--color-gold)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 800 }}>Fast Shipping</h4>
                <p style={{ fontSize: '0.8rem', color: '#a0b0a4' }}>Free delivery on orders over ₹500</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Heart size={32} color="var(--color-gold)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 800 }}>Pure Crunch & Quality</h4>
                <p style={{ fontSize: '0.8rem', color: '#a0b0a4' }}>Vacuum sealed for natural aroma</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Quick Navigation */}
        <div className="mobile-footer-nav container" style={{ display: 'none', marginBottom: '2.5rem' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '1.5rem 1.8rem',
              color: 'var(--color-forest)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <h4 style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Quick Navigation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <Link href="/" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-forest)', textDecoration: 'none' }}>
                Home
              </Link>
              <Link href="/products" style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-forest)', textDecoration: 'none' }}>
                Shop All Produce
              </Link>
              <Link href="/about" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-forest)', textDecoration: 'none' }}>
                About Us
              </Link>
              <Link href="/contact" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-forest)', textDecoration: 'none' }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Main Desktop/Tablet Footer Grid */}
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Brand Info */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <img 
                src="/logo.svg" 
                alt="NUTFLIX DRY FRUITS" 
                style={{ 
                  height: '44px', 
                  width: '44px', 
                  objectFit: 'contain'
                }} 
              />
              <span style={{ fontWeight: 900, fontSize: '1.4rem', color: '#ffffff', letterSpacing: '0.04em' }}>
                NUT<span style={{ color: 'var(--color-gold)' }}>FLIX</span>
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-gold)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
              DARSHAN TECHNO SYSTEM
            </div>
            <p style={{ fontSize: '0.85rem', color: '#a0b0a4', lineHeight: '1.5', marginBottom: '1rem' }}>
              Premium handcrafted dry fruits, almonds, giant roasted cashews, walnuts, and organic produce. Delivered fresh to your doorstep.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 600 }}>
              GSTIN: 19ADZPG6957G3ZN
            </div>
          </div>

          {/* Business Details & Contact */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Contact Details</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: '#a0b0a4' }}>
              <li style={{ lineHeight: '1.4' }}>
                <strong style={{ color: '#fff' }}>Address:</strong><br />
                43, KARAYA ROAD, KOLKATA - 700017
              </li>
              <li>
                <strong style={{ color: '#fff' }}>Mobile:</strong>{' '}
                <a href="tel:9830055527" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 700 }}>98300-55527</a>
              </li>
              <li>
                <strong style={{ color: '#fff' }}>WhatsApp:</strong>{' '}
                <a href="https://wa.me/919830055527" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)', textDecoration: 'none', fontWeight: 700 }}>98300-55527</a>
              </li>
              <li>
                <strong style={{ color: '#fff' }}>Email:</strong>{' '}
                <a href="mailto:agr@guharoy.com" style={{ color: '#a0b0a4', textDecoration: 'none' }}>agr@guharoy.com</a>
              </li>
            </ul>
          </div>

          {/* Quick Links & Company */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: '#a0b0a4' }}>
              <li><Link href="/about" style={{ color: '#a0b0a4' }}>About Us</Link></li>
              <li><Link href="/contact" style={{ color: '#a0b0a4' }}>Contact Us</Link></li>
              <li><Link href="/products" style={{ color: '#a0b0a4' }}>Shop All Produce</Link></li>
              <li><Link href="/categories/cashews-nuts" style={{ color: '#a0b0a4' }}>Cashews &amp; Nuts</Link></li>
              <li><Link href="/my-orders" style={{ color: '#a0b0a4' }}>Track My Order</Link></li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Customer Care</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: '#a0b0a4' }}>
              <li><Link href="/privacy-policy" style={{ color: '#a0b0a4' }}>Privacy Policy</Link></li>
              <li><Link href="/terms" style={{ color: '#a0b0a4' }}>Terms &amp; Conditions</Link></li>
              <li><Link href="/refund-policy" style={{ color: '#a0b0a4' }}>Return &amp; Refund Policy</Link></li>
              <li><Link href="/shipping-policy" style={{ color: '#a0b0a4' }}>Shipping &amp; Delivery</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 800, marginBottom: '0.6rem' }}>
              Join NUTFLIX Updates
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#a0b0a4', marginBottom: '1rem' }}>
              Subscribe to get exclusive discount offers &amp; fresh stock alerts.
            </p>

            {subscribed ? (
              <div style={{ backgroundColor: 'rgba(200, 157, 102, 0.2)', border: '1px solid var(--color-gold)', padding: '0.75rem', borderRadius: '12px', color: '#fff', fontSize: '0.82rem' }}>
                🎉 Thank you for subscribing! Use code <strong>NUTFLIX10</strong> for 10% off.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '0.88rem',
                  }}
                />
                <button type="submit" className="btn-primary" style={{ border: 'none', fontSize: '0.88rem' }}>
                  <Mail size={16} />
                  <span>Subscribe for Offers</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Policy Bar & Copyright */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#7a8c7e' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
            <Link href="/about" style={{ color: '#a0b0a4', textDecoration: 'none' }}>About Us</Link>
            <Link href="/contact" style={{ color: '#a0b0a4', textDecoration: 'none' }}>Contact Us</Link>
            <Link href="/privacy-policy" style={{ color: '#a0b0a4', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: '#a0b0a4', textDecoration: 'none' }}>Terms &amp; Conditions</Link>
            <Link href="/refund-policy" style={{ color: '#a0b0a4', textDecoration: 'none' }}>Return/Refund Policy</Link>
            <Link href="/shipping-policy" style={{ color: '#a0b0a4', textDecoration: 'none' }}>Shipping &amp; Delivery</Link>
          </div>
          <p>© {new Date().getFullYear()} DARSHAN TECHNO SYSTEM (Brand: NUTFLIX). All rights reserved. GSTIN: 19ADZPG6957G3ZN.</p>
        </div>
      </footer>

      {/* Sticky Mobile Bottom Navigation Bar */}
      <MobileBottomBar />

      <style jsx>{`
        @media (max-width: 992px) {
          .mobile-footer-nav {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
};
