'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Leaf, Heart, Mail, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export const Footer: React.FC = () => {
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
    <footer style={{ backgroundColor: 'var(--color-forest-dark)', color: '#eadfcb', paddingTop: '4rem', paddingBottom: '2rem' }}>
      {/* Value Proposition Grid */}
      <div className="container" style={{ marginBottom: '3.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            padding: '2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Award size={36} color="var(--color-gold)" />
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 800 }}>100% Ethically Sourced</h4>
              <p style={{ fontSize: '0.82rem', color: '#a0b0a4' }}>Directly empowering smallholder farmers</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Truck size={36} color="var(--color-gold)" />
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 800 }}>Fast Shipping</h4>
              <p style={{ fontSize: '0.82rem', color: '#a0b0a4' }}>Free delivery on orders over ₹500</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Heart size={36} color="var(--color-gold)" />
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 800 }}>Healthcare Funding</h4>
              <p style={{ fontSize: '0.82rem', color: '#a0b0a4' }}>Every sale funds local health clinics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Leaf size={20} color="var(--color-forest)" />
            </div>
            <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#ffffff', letterSpacing: '0.05em' }}>
              TANZA<span style={{ color: 'var(--color-gold)' }}>KINDNESS</span>
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#a0b0a4', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Premium Tanzanian products that do more than satisfy cravings - they empower farmers, strengthen communities, and fund life-changing healthcare initiatives.
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.85rem', color: 'var(--color-gold)' }}>
            <span>📍 Mtwara & Moshi, Tanzania</span>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.2rem' }}>Shop Collections</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#a0b0a4' }}>
            <li><Link href="/categories/cashews-nuts">Organic Roasted Cashews</Link></li>
            <li><Link href="/categories/cashews-nuts">Premium Almonds</Link></li>
            <li><Link href="/categories/cashews-nuts">Salted Pistachios</Link></li>
            <li><Link href="/categories/cashews-nuts">Organic Walnuts</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 800, marginBottom: '1.2rem' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#a0b0a4' }}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/products">Shop All Produce</Link></li>
            <li><Link href="/categories/cashews-nuts">Categories</Link></li>
            <li><Link href="/my-orders">My Orders</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.8rem' }}>
            Join the Kindness Movement
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#a0b0a4', marginBottom: '1rem' }}>
            Subscribe to get 10% off your first order & impact updates from Tanzania.
          </p>

          {subscribed ? (
            <div style={{ backgroundColor: 'rgba(200, 157, 102, 0.2)', border: '1px solid var(--color-gold)', padding: '0.8rem', borderRadius: '12px', color: '#fff', fontSize: '0.85rem' }}>
              🎉 Asante Sana! Thank you for subscribing. Use code <strong>KINDNESS10</strong> for 10% off.
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
                  padding: '0.8rem 1rem',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
              <button type="submit" className="btn-primary" style={{ border: 'none' }}>
                <Mail size={16} />
                <span>Subscribe for 10% Off</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: '#7a8c7e' }}>
        <p>© {new Date().getFullYear()} Tanza Kindness. All rights reserved. Built with Next.js, Node.js & Drizzle ORM.</p>
      </div>
    </footer>
  );
};
