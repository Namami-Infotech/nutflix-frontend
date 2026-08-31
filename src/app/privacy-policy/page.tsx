import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, Bell, HelpCircle, Mail, Phone, MapPin, Globe } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | NUTFLIX - Quality Dry Fruits',
  description: 'Privacy Policy for NUTFLIX (A Brand of Darshan Techno System). Learn how we collect, protect, and handle your personal information.',
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck size={16} />
            <span>Legal & Privacy</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-cream)', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto' }}>
            At NUTFLIX, we respect your privacy. Learn how we handle and protect your personal information.
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
                <Eye size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>No Data Selling</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              We do not sell or misuse customers&apos; personal information under any circumstances.
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
                <Lock size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Purposeful Collection</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Information is collected solely for order fulfillment, customer support, and delivery service.
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
                <ShieldCheck size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Secure Processing</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Shared only with trusted delivery partners and payment gateways when required to complete your order.
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
          className="policy-content"
        >
          {/* Core Official Policy Declaration */}
          <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.5rem 1.8rem', borderRadius: '16px', border: '1px solid var(--color-border)', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              NUTFLIX Privacy Statement
            </h2>
            <p style={{ color: 'var(--color-forest)', lineHeight: '1.8', fontSize: '0.98rem', fontWeight: 600 }}>
              At NUTFLIX, we respect your privacy.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              Information such as your name, mobile number, address, email address and order details may be collected only for processing orders, providing customer service, making deliveries and improving our services.
            </p>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              We do not sell or misuse customers&apos; personal information. Information may be shared with payment gateways, delivery partners or service providers only when required for completing your order or complying with applicable law.
            </p>
            <p style={{ color: 'var(--color-forest)', lineHeight: '1.7', fontSize: '0.95rem', fontWeight: 700, marginTop: '0.6rem' }}>
              By using <a href="https://www.nutflix.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)', textDecoration: 'underline' }}>www.nutflix.in</a>, you agree to this Privacy Policy.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              1. Information We Collect
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '0.8rem' }}>
              When you purchase or interact with our platform, we collect only the necessary information:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Contact Information:</strong> Name, mobile phone number, and email address.</li>
              <li><strong>Delivery Information:</strong> Shipping address, landmark, postal pincode, and billing details.</li>
              <li><strong>Order & Transaction Details:</strong> Products purchased, quantities, order date, payment status, and delivery instructions.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              2. Purpose of Information Use
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '0.8rem' }}>
              The collected information is used strictly for legitimate business and service operations:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Processing, packing, and dispatching your dry fruit orders.</li>
              <li>Providing active customer support, order updates, and tracking details via SMS/WhatsApp/Call.</li>
              <li>Facilitating efficient and timely doorstep deliveries through our logistics partners.</li>
              <li>Improving our website performance, product offerings, and overall customer satisfaction.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              3. Information Sharing & Third Parties
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              We do not sell, rent, or trade your personal data. Data is shared only under specific operational conditions:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Payment Gateways:</strong> Securely processing electronic payments via encrypted banking channels.</li>
              <li><strong>Delivery Partners:</strong> Providing courier executives with your shipping address and phone number for successful order delivery.</li>
              <li><strong>Legal Compliance:</strong> When strictly required by applicable Indian law or government authorities.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              4. Data Protection & Security
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              We implement appropriate physical, electronic, and managerial safeguards to protect your personal information against unauthorized access, alteration, or disclosure.
            </p>
          </div>

          {/* Contact Box */}
          <div style={{ padding: '1.5rem', borderRadius: '16px', backgroundColor: 'var(--color-cream-light)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} color="var(--color-gold)" />
              <span>Contact for Privacy Inquiries</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
              If you have any questions or requests regarding your personal information or this Privacy Policy, please contact:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-forest)' }}>
              <div><strong>Brand:</strong> NUTFLIX</div>
              <div><strong>Business:</strong> A Brand of Darshan Techno System</div>
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
          <Link href="/terms" style={{ color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'underline' }}>
            Terms & Conditions
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
