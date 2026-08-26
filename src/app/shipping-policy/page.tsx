import React from 'react';
import Link from 'next/link';
import { Truck, PackageCheck, MapPin, Clock, ShieldCheck, HelpCircle, Mail, Phone } from 'lucide-react';

export const metadata = {
  title: 'Shipping & Delivery Policy | NUTFLIX - Premium Dry Fruits',
  description: 'Shipping, Delivery and Tracking Policy for NUTFLIX operated by Darshan Techno System. Fast pan-India delivery with vacuum-sealed freshness.',
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
            <span>Pan-India Delivery</span>
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Shipping & Delivery Policy
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-cream)', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto' }}>
            Delivering farm-fresh roasted cashews, almonds, and premium dry fruits safely across India in vacuum-sealed freshness packs.
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
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>24–48h Dispatch</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Orders are freshly packed and handed over to express couriers within 24 to 48 hours of order confirmation.
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
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Free Shipping &gt; ₹500</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Enjoy complimentary doorstep delivery across India on all eligible cart orders above ₹500.
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
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)' }}>Aroma-Lock Packing</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Multi-layer food-safe packaging protects against moisture, preserving crunchiness and fresh taste.
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
              1. Delivery Timelines & Transit Estimates
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', marginBottom: '1rem' }}>
              We partner with India&apos;s leading logistics networks (including BlueDart, Delhivery, DTDC, and India Post Speed Post) to guarantee reliable transit:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-cream-light)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 800, color: 'var(--color-forest)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>Kolkata & West Bengal</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-gold)', marginBottom: '0.3rem' }}>1 – 2 Business Days</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Local hub express dispatch from Kolkata.</div>
              </div>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-cream-light)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 800, color: 'var(--color-forest)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>Metro Cities (Delhi, Mumbai, Bengaluru, etc.)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-gold)', marginBottom: '0.3rem' }}>3 – 5 Business Days</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Direct air/express line-haul shipping.</div>
              </div>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--color-cream-light)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 800, color: 'var(--color-forest)', fontSize: '0.95rem', marginBottom: '0.3rem' }}>Rest of India & Rural Pincodes</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-gold)', marginBottom: '0.3rem' }}>5 – 7 Business Days</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Comprehensive pin-code reach across all Indian states.</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              2. Shipping Charges
            </h2>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Orders ₹500 & Above:</strong> Free Delivery across all serviceable Indian pincodes.</li>
              <li><strong>Orders Under ₹500:</strong> A nominal standard shipping fee of ₹49 – ₹79 is applied at checkout depending on parcel weight and destination location.</li>
              <li><strong>Cash on Delivery (COD) Surcharge:</strong> A minimal handling fee of ₹30 may apply to cover COD courier cash-collection protocol.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              3. Order Tracking & Status Updates
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              As soon as your parcel is packed and dispatched from our warehouse, you will receive an automatic confirmation email and SMS/WhatsApp alert containing your <strong>AWB Tracking Number</strong> and direct live courier tracking link. You can track real-time parcel progress anytime.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              4. Packaging & Quality Assurance
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              All dry fruit items are carefully packed in multi-layered, tamper-evident food grade pouches with zip-lock or nitrogen flushing where applicable. This seals in natural crunch, prevents oxidation, and keeps moisture out throughout transit.
            </p>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              5. Delivery Attempts & Address Accuracy
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              Our delivery executives will make up to 3 delivery attempts before returning the parcel to origin. Please ensure you provide a complete physical address with landmarks and a valid contact phone number. If you need to update an incorrect address, please inform us immediately before dispatch.
            </p>
          </div>

          {/* Contact Box */}
          <div style={{ padding: '1.5rem', borderRadius: '16px', backgroundColor: 'var(--color-cream-light)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={20} color="var(--color-gold)" />
              <span>Track Your Order or Inquire About Shipping</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
              If you have queries regarding shipment status or special delivery requirements, please contact us:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-forest)' }}>
              <div><strong>Business Entity:</strong> DARSHAN TECHNO SYSTEM (Brand: NUTFLIX)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--color-gold)" />
                <span>43, KARAYA ROAD, KOLKATA – 700017</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--color-gold)" />
                <span>Phone / WhatsApp: <a href="tel:9830055527" style={{ color: 'var(--color-forest)', fontWeight: 700 }}>98300-55527</a> / <a href="tel:9330193041" style={{ color: 'var(--color-forest)', fontWeight: 700 }}>9330193041</a></span>
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
