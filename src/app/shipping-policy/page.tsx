import React from 'react';
import Link from 'next/link';
import { Truck, PackageCheck, MapPin, Clock, ShieldCheck, HelpCircle, Mail, Phone, Globe } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy | NUTFLIX - Quality Dry Fruits',
  description: 'Shipping and Delivery Policy for NUTFLIX (A Brand of Darshan Techno System). Orders normally delivered within 24 hours with fast, convenient service.',
};

export default function ShippingPolicyPage() {
  const lastUpdated = 'August 2026';

  return (
    <div style={{ backgroundColor: 'var(--color-bg-light)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero Header */}
      <section
        style={{
          backgroundColor: 'var(--color-forest)',
          color: '#ffffff',
          padding: '4rem 0 3.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(200, 157, 102, 0.15)',
              color: 'var(--color-gold)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
              border: '1px solid rgba(200, 157, 102, 0.3)',
            }}
          >
            <Truck size={16} />
            <span>Fast & Convenient Delivery</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Shipping & Delivery Policy
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-cream)', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto' }}>
            Delivering quality, hygienically packed dry fruits fresh to your doorstep with convenient ordering and prompt delivery.
          </p>
          <div style={{ marginTop: '1.2rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            Last Updated: {lastUpdated} • NUTFLIX (A Brand of Darshan Techno System)
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ maxWidth: '960px', marginTop: '3rem' }}>
        {/* Quick Highlights Box */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '12px', backgroundColor: 'var(--color-gold-light)', color: '#794d13' }}>
                <Clock size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Normally within 24h</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Orders are normally delivered within 24 hours from receipt and confirmation.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '12px', backgroundColor: 'var(--color-gold-light)', color: '#794d13' }}>
                <PackageCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Hygienic Packaging</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Carefully packed to retain natural crunch, freshness, and nutritive value.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '12px', backgroundColor: 'var(--color-gold-light)', color: '#794d13' }}>
                <Truck size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Transparent Charges</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Any applicable delivery charges are clearly displayed at checkout before order confirmation.
            </p>
          </div>
        </div>

        {/* Content Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2.5rem 3rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            color: 'var(--color-text-dark)',
          }}
        >
          {/* Main Official Delivery Statement Box */}
          <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--color-border)', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              NUTFLIX Delivery Commitment
            </h2>
            <p style={{ color: 'var(--color-forest)', fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              NUTFLIX aims to provide fast and convenient delivery.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
              <p>
                • <strong>Delivery Timeline:</strong> Orders will normally be delivered within <strong>24 hours</strong> from receipt and confirmation of the order, subject to product availability, serviceable location and circumstances beyond our reasonable control.
              </p>
              <p>
                • <strong>Delivery Charges:</strong> Any applicable delivery charges will be communicated or displayed at the time of placing the order.
              </p>
              <p>
                • <strong>Customer Communication:</strong> In case of an unexpected delay, we will make reasonable efforts to inform the customer.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              1. Delivery Service & Channels
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              NUTFLIX is a brand of Darshan Techno System, serving customers through both online and offline channels. We coordinate with express logistics and local delivery executives to ensure your dry fruits reach you promptly and in pristine condition.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              2. Packaging & Freshness Assurance
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              All dry fruit items are hygienically packed and sealed to prevent any exposure to moisture or environmental elements, safeguarding freshness and aroma from our Kolkata facility to your home.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              3. Address Accuracy & Delivery Coordination
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Please ensure your complete delivery address, landmarks, and reachable mobile phone number are entered correctly during checkout. Our delivery team may reach out to coordinate delivery arrival.
            </p>
          </div>

          {/* Contact Box */}
          <div style={{ padding: '1.5rem', borderRadius: '16px', backgroundColor: 'var(--color-cream-light)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} color="var(--color-gold)" />
              <span>Delivery Assistance & Inquiries</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
              For order status, delivery queries, or assistance, please contact us:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-forest)' }}>
              <div><strong>Brand:</strong> NUTFLIX (A Brand of Darshan Techno System)</div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Registered Office:</strong> 43, Karaya Road, Kolkata – 700017, West Bengal, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--color-gold)" />
                <span><strong>Phone / WhatsApp:</strong> <a href="tel:9330193041" style={{ color: 'var(--color-forest)', fontWeight: 700 }}>9330193041</a></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={16} color="var(--color-gold)" />
                <span><strong>Website:</strong> <a href="https://www.nutflix.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)', fontWeight: 700 }}>www.nutflix.in</a></span>
              </div>
              <div><strong>FSSAI License No.:</strong> 22826039000325</div>
            </div>
          </div>
        </div>

        {/* Bottom Related Links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
          <Link href="/privacy-policy" style={{ color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'underline' }}>
            Privacy Policy
          </Link>
          <Link href="/terms" style={{ color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'underline' }}>
            Terms & Conditions
          </Link>
          <Link href="/refund-policy" style={{ color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'underline' }}>
            Return & Refund Policy
          </Link>
          <Link href="/contact" style={{ color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'underline' }}>
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
