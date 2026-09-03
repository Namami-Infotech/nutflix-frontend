import React from 'react';
import Link from 'next/link';
import { RotateCcw, Clock, Banknote, ShieldAlert, CheckCircle2, HelpCircle, Mail, Phone, MapPin, Globe } from 'lucide-react';

export const metadata = {
  title: 'Return & Refund Policy | NUTFLIX - Quality Dry Fruits',
  description: 'Return and Refund Policy for NUTFLIX (A Brand of Darshan Techno System). Quality dry fruits with prompt resolution and 48-hour refund processing.',
};

export default function RefundPolicyPage() {
  const lastUpdated = 'August 2026';

  return (
    <div style={{ backgroundColor: 'var(--color-bg-light)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero Header */}
      <section
        className="page-header-banner"
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
            <RotateCcw size={16} />
            <span>Customer Satisfaction</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Return & Refund Policy
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-cream)', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto' }}>
            Customer satisfaction is important to us. Clear guidelines for returns, replacements, and refunds.
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
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Prompt Assistance</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Contact us promptly upon delivery if you receive a damaged, defective, or incorrect product.
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
                <Banknote size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>48-Hour Initiation</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Approved refunds are initiated within 48 hours of verification to your original payment mode.
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
                <CheckCircle2 size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Customer Focused</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Dedicated support to ensure complete satisfaction with every dry fruit order.
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
          {/* Core Official Policy Declaration Box */}
          <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--color-border)', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              NUTFLIX Return & Refund Policy
            </h2>
            <p style={{ color: 'var(--color-forest)', fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Customer satisfaction is important to us.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
              <p>
                • If you receive a damaged, defective, incorrect or materially unsatisfactory product, please contact NUTFLIX promptly after delivery.
              </p>
              <p>
                • Eligible products should be returned in their original packaging, as far as reasonably possible.
              </p>
              <p>
                • After receiving and verifying the returned material, the approved refund will be initiated within <strong>48 hours</strong>.
              </p>
              <p>
                • Refunds will normally be made through the original mode of payment. Any applicable bank or payment-gateway processing time may be additional.
              </p>
              <p>
                • Products that have been substantially consumed, altered or damaged after delivery may not be eligible for return or refund.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              1. How to Request a Return / Refund
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '1rem' }}>
              To report an issue with your order:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-cream-light)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 900, color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '0.3rem' }}>Step 1</div>
                <div style={{ fontWeight: 800, color: 'var(--color-forest)', fontSize: '0.92rem', marginBottom: '0.3rem' }}>Contact Support</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Call or WhatsApp <strong>9330193041</strong> with your Order ID.</div>
              </div>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-cream-light)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 900, color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '0.3rem' }}>Step 2</div>
                <div style={{ fontWeight: 800, color: 'var(--color-forest)', fontSize: '0.92rem', marginBottom: '0.3rem' }}>Verification</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Provide photos/details of the damaged or incorrect item.</div>
              </div>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-cream-light)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 900, color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '0.3rem' }}>Step 3</div>
                <div style={{ fontWeight: 800, color: 'var(--color-forest)', fontSize: '0.92rem', marginBottom: '0.3rem' }}>48h Initiation</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Approved refund is initiated within 48 hours to original payment mode.</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              2. Eligibility Criteria
            </h2>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Products that arrived defective, tampered, or damaged during transit.</li>
              <li>Incorrect items delivered (wrong variant or quantity).</li>
              <li>Items must be in their original packaging as far as reasonably possible.</li>
              <li>Items substantially consumed or modified after delivery are non-returnable.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              3. Refund Mode & Timelines
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Approved refunds are initiated within 48 hours to the original mode of payment (UPI, Credit/Debit Card, Net Banking, or direct bank transfer for COD). Additional processing time may depend on your issuing bank or payment gateway.
            </p>
          </div>

          {/* Contact Box */}
          <div style={{ padding: '1.5rem', borderRadius: '16px', backgroundColor: 'var(--color-cream-light)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} color="var(--color-gold)" />
              <span>Returns & Refund Assistance</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
              Please reach out to our customer care desk for any return or refund support:
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
                <span><strong>Website:</strong> <a href="https://www.nut-flix.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)', fontWeight: 700 }}>www.nut-flix.in</a></span>
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
          <Link href="/shipping-policy" style={{ color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'underline' }}>
            Shipping & Delivery Policy
          </Link>
          <Link href="/contact" style={{ color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'underline' }}>
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
