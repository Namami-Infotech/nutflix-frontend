import React from 'react';
import Link from 'next/link';
import { Scale, FileCheck, CheckCircle2, AlertCircle, HelpCircle, Mail, Phone, MapPin, Globe } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | NUTFLIX - Quality Dry Fruits',
  description: 'Terms and Conditions for NUTFLIX (A Brand of Darshan Techno System). Please review our terms before purchasing from www.nut-flix.in.',
};

export default function TermsPage() {
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
            <Scale size={16} />
            <span>Customer Agreement</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Terms & Conditions
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-cream)', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto' }}>
            Please read these Terms and Conditions carefully before browsing or purchasing from www.nut-flix.in.
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
                <CheckCircle2 size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Quality Produce</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Fresh, hygienically packed, and carefully selected premium dry fruits and nuts.
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
                <FileCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Fair Terms</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Transparent pricing, clear order processing, and customer-first policies.
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
                <AlertCircle size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Governing Law</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              All transactions and interactions are governed by the applicable laws of India.
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
          {/* Main Official Policy Box */}
          <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.8rem', borderRadius: '16px', border: '1px solid var(--color-border)', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '1rem' }}>
              Terms of Use & Purchase Agreement
            </h2>
            <p style={{ color: 'var(--color-forest)', fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.8rem' }}>
              By accessing or purchasing from <a href="https://www.nut-flix.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)', textDecoration: 'underline' }}>www.nut-flix.in</a>, you agree to the following terms:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-muted)', lineHeight: '1.8', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><strong>Product Prices & Availability:</strong> Product prices and availability may change without prior notice.</li>
              <li><strong>Order Acceptance:</strong> Orders are subject to acceptance and product availability.</li>
              <li><strong>Accurate Information:</strong> Customers must provide correct delivery and contact information.</li>
              <li><strong>Representation of Products:</strong> Product images on the website are for representation purposes and actual packaging or appearance may vary slightly.</li>
              <li><strong>Right to Cancel:</strong> NUTFLIX reserves the right to cancel or refuse an order in case of pricing errors, non-availability, payment issues or circumstances beyond our control.</li>
              <li><strong>Governing Law:</strong> All transactions shall be governed by the applicable laws of India.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              1. Brand & Business Identity
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              <strong>NUTFLIX</strong> is a brand of <strong>Darshan Techno System</strong>, engaged in the online and offline sale of quality dry fruits. Our registered office is located at 43, Karaya Road, Kolkata – 700017, West Bengal, India.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              2. Accuracy of Billing and Account Information
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              You agree to provide current, complete, and accurate purchase and account information for all orders made on our store. You agree to promptly update your contact information, including email address, mobile number, and delivery address, so that we can complete your transactions and contact you as needed.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              3. Products, Packaging & Natural Variations
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Dry fruits and nuts are agricultural products. While we maintain rigorous quality standards, grading, and hygienic packaging, slight natural variations in size, texture, and color may occur.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              4. Payment & Order Cancellation
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Payments must be made through authorized electronic payment methods or Cash on Delivery where supported. If an order is cancelled by NUTFLIX due to unavoidable circumstances (such as pricing error or stock non-availability), any payment received will be refunded in accordance with our Return & Refund Policy.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              5. Governing Law and Jurisdiction
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              These Terms and Conditions and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of India, with jurisdiction in Kolkata, West Bengal.
            </p>
          </div>

          {/* Contact Box */}
          <div style={{ padding: '1.5rem', borderRadius: '16px', backgroundColor: 'var(--color-cream-light)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} color="var(--color-gold)" />
              <span>Questions About Our Terms?</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
              For any questions regarding these Terms & Conditions, please contact us:
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
          <Link href="/refund-policy" style={{ color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'underline' }}>
            Return & Refund Policy
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
