import React from 'react';
import Link from 'next/link';
import { Ban, Clock, CheckCircle2, HelpCircle, Phone, MapPin, Globe, AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Cancellation Policy | NUTFLIX - Quality Dry Fruits',
  description: 'Cancellation Policy for NUTFLIX (A Brand of Darshan Techno System). Orders can only be cancelled prior to dispatch and shipping.',
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
            <Ban size={16} />
            <span>Order Guidelines</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Cancellation Policy
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-cream)', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto' }}>
            Orders can only be cancelled prior to dispatch and shipping. Please review our guidelines below.
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
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Cancel Before Shipping</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              You can cancel your order only before it is dispatched or shipped from our facility.
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
              <div style={{ padding: '0.5rem', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                <AlertTriangle size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>No Post-Dispatch Cancellation</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Once shipped or out for delivery, orders cannot be cancelled or returned due to hygiene and food safety standards.
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
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Quick Payment Reversal</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Pre-shipping cancellations are processed and payment reversed to original method within 24-48 hours.
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
              NUTFLIX Cancellation Policy
            </h2>
            <p style={{ color: 'var(--color-forest)', fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Important Guidelines Regarding Order Cancellation:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>
              <p>
                • <strong>Cancellation Before Shipping Only:</strong> Orders placed on NUTFLIX can only be cancelled before they have been shipped/dispatched from our facility.
              </p>
              <p>
                • <strong>No Cancellation After Shipping:</strong> Once the parcel is dispatched or handed over to our courier/delivery partners, order cancellation is strictly not permitted.
              </p>
              <p>
                • <strong>Hygiene &amp; Consumable Goods:</strong> Dry fruits, nuts, and edible products are perishable and consumable food items. For health, quality, and hygiene reasons, returns are not accepted after dispatch or delivery.
              </p>
              <p>
                • <strong>Payment Reversal:</strong> If an un-shipped order cancellation request is accepted, any prepaid payment will be initiated for reversal/refund to the original mode of payment within <strong>24 to 48 hours</strong>.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              1. How to Cancel Your Order (Prior to Dispatch)
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '1rem' }}>
              To cancel an order before it is dispatched:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-cream-light)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 900, color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '0.3rem' }}>Step 1</div>
                <div style={{ fontWeight: 800, color: 'var(--color-forest)', fontSize: '0.92rem', marginBottom: '0.3rem' }}>Immediate Contact</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Call or WhatsApp <strong>9330193041</strong> with your Order ID before the package is shipped.</div>
              </div>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-cream-light)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 900, color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '0.3rem' }}>Step 2</div>
                <div style={{ fontWeight: 800, color: 'var(--color-forest)', fontSize: '0.92rem', marginBottom: '0.3rem' }}>Dispatch Status Check</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Our support team will verify if the parcel has been dispatched.</div>
              </div>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-cream-light)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 900, color: 'var(--color-gold)', fontSize: '1.1rem', marginBottom: '0.3rem' }}>Step 3</div>
                <div style={{ fontWeight: 800, color: 'var(--color-forest)', fontSize: '0.92rem', marginBottom: '0.3rem' }}>Cancellation Confirmation</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Your order will be cancelled and payment reversed within 24–48 hours.</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              2. Cancellation Terms &amp; Restrictions
            </h2>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Orders are processed promptly to ensure quick delivery. Please submit cancellation requests as soon as possible after placing an order.</li>
              <li>Once the order has been handed over for delivery / shipment, it cannot be recalled or cancelled.</li>
              <li>NUTFLIX reserves the right to cancel any order due to unforeseen circumstances, stock unavailability, pricing inaccuracies, or unserviceable pin codes.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              3. Payment Reversal for Pre-Shipping Cancellations
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              For orders successfully cancelled before dispatch, the reversal of prepaid amounts is initiated within 24–48 hours to the original payment source (UPI, Credit/Debit Card, Net Banking). Bank processing times may take 3–7 business days.
            </p>
          </div>

          {/* Contact Box */}
          <div style={{ padding: '1.5rem', borderRadius: '16px', backgroundColor: 'var(--color-cream-light)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} color="var(--color-gold)" />
              <span>Order &amp; Cancellation Support</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
              Need urgent help to cancel an un-shipped order? Please reach out to our customer care desk immediately:
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
