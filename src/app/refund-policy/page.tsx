import React from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldAlert, CheckCircle, Clock, Banknote, HelpCircle, Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Return & Refund Policy | NUTFLIX - Premium Dry Fruits',
  description: 'Return, Replacement and Refund Policy for NUTFLIX (Darshan Techno System). Hassle-free resolution for our valued dry fruit customers.',
};

export default function RefundPolicyPage() {
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
            <RotateCcw size={16} />
            <span>Customer Satisfaction</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Return & Refund Policy
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-cream)', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto' }}>
            Your satisfaction and health are our top priorities. Learn about our clear, hassle-free return and refund guidelines for premium dry fruits.
          </p>
          <div style={{ marginTop: '1.2rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            Last Updated: {lastUpdated} • Darshan Techno System (NUTFLIX)
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
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>48-Hour Reporting</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Notify us within 48 hours of parcel delivery in case of damaged, defective, or incorrect items.
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
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>5–7 Days Refund</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Approved refunds are directly processed back to your original payment method (Bank/UPI/Card).
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
                <CheckCircle size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Free Replacement</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              We will ship a fresh replacement batch at zero extra shipping cost for genuine transit issues.
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
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              1. Return Eligibility for Food & Dry Fruit Items
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Because premium dry fruits, nuts, and roasted edibles are food products with stringent hygiene considerations, we accept returns or issue replacements under the following conditions:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Transit Damage:</strong> The outer package or seal arrived physically torn, tampered with, or leaking.</li>
              <li><strong>Incorrect Item Received:</strong> The product received differs from what was ordered (e.g. wrong weight, different nut variety).</li>
              <li><strong>Quality or Freshness Concern:</strong> Genuine freshness issues noticed immediately upon opening the vacuum seal.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              2. Non-Returnable Items
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              In accordance with FSSAI hygiene standards, items cannot be returned under the following circumstances:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Items that have been significantly consumed, modified, or improperly stored after opening.</li>
              <li>Requests submitted after more than 48 hours from the timestamp of parcel delivery.</li>
              <li>Minor subjective taste preferences or natural differences in individual nut sizes/coloring inherent to organic farming.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              3. How to Request a Return or Replacement
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 900, color: 'var(--color-gold)', fontSize: '1.2rem', marginBottom: '0.3rem' }}>Step 1</div>
                <div style={{ fontWeight: 800, color: 'var(--color-forest)', fontSize: '0.95rem', marginBottom: '0.4rem' }}>Take Photos / Video</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                  Capture clear photos or a short video showing the parcel label, seal, and damaged item.
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 900, color: 'var(--color-gold)', fontSize: '1.2rem', marginBottom: '0.3rem' }}>Step 2</div>
                <div style={{ fontWeight: 800, color: 'var(--color-forest)', fontSize: '0.95rem', marginBottom: '0.4rem' }}>Contact Support</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                  WhatsApp / Call us at <strong>98300-55527</strong> or email <strong>agr@guharoy.com</strong> with your Order ID.
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 900, color: 'var(--color-gold)', fontSize: '1.2rem', marginBottom: '0.3rem' }}>Step 3</div>
                <div style={{ fontWeight: 800, color: 'var(--color-forest)', fontSize: '0.95rem', marginBottom: '0.4rem' }}>Instant Resolution</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                  Our team validates your request within 24 hours and initiates free replacement dispatch or full refund.
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              4. Refund Processing & Timelines
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Once your refund request is approved:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Prepaid Orders (UPI / Cards / NetBanking):</strong> Refund is credited directly to the original bank account/card within <strong>5–7 business days</strong>.</li>
              <li><strong>Cash on Delivery (COD) Orders:</strong> Our support team will request your UPI ID or Bank Account Details (Account No. & IFSC) to securely initiate a NEFT/IMPS/UPI transfer within <strong>3–5 business days</strong>.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              5. Order Cancellation Policy
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              You may cancel your order at any time <strong>before the parcel is dispatched</strong> from our facility by contacting our helpline at 9330193041 or visiting your account page. Once the order has been handed over to the courier partner, cancellation is no longer possible, but you may avail of return/replacement upon arrival if eligible.
            </p>
          </div>

          {/* Contact Box */}
          <div style={{ padding: '1.5rem', borderRadius: '16px', backgroundColor: 'var(--color-cream-light)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} color="var(--color-gold)" />
              <span>Need Help with a Return or Refund?</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
              Our dedicated support team is here to assist you from Monday to Saturday (10:00 AM – 7:00 PM IST):
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-forest)' }}>
              <div><strong>Business Entity:</strong> DARSHAN TECHNO SYSTEM (Brand: NUTFLIX)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--color-gold)" />
                <span>43, KARAYA ROAD, KOLKATA – 700017</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--color-gold)" />
                <span>Support Hotline: <a href="tel:9830055527" style={{ color: 'var(--color-forest)', fontWeight: 700 }}>98300-55527</a> / <a href="tel:9330193041" style={{ color: 'var(--color-forest)', fontWeight: 700 }}>9330193041</a></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--color-gold)" />
                <span>Email: <a href="mailto:agr@guharoy.com" style={{ color: 'var(--color-gold)', fontWeight: 700 }}>agr@guharoy.com</a></span>
              </div>
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
