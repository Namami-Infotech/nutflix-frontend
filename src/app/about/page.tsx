import React from 'react';
import Link from 'next/link';
import { Award, Leaf, ShieldCheck, Heart, Sparkles, Truck, CheckCircle2, ArrowRight, Phone, MapPin, Globe } from 'lucide-react';

export const metadata = {
  title: 'About Us | NUTFLIX - Quality Dry Fruits, Delivered Fresh',
  description: 'Welcome to NUTFLIX, a brand of Darshan Techno System. Fresh, hygienically packed and carefully selected quality dry fruits at competitive prices.',
};

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg-light)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section
        style={{
          backgroundColor: 'var(--color-forest)',
          color: '#ffffff',
          padding: '5rem 0 4rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ maxWidth: '840px', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(200, 157, 102, 0.15)',
              color: 'var(--color-gold)',
              padding: '0.4rem 1.2rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.88rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '1.2rem',
              border: '1px solid rgba(200, 157, 102, 0.3)',
            }}
          >
            <Sparkles size={16} />
            <span>About NUTFLIX</span>
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.2rem', letterSpacing: '-0.02em', lineHeight: '1.2', color: '#ffffff' }}>
            Quality Dry Fruits, Delivered Fresh
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--color-cream)', lineHeight: '1.7', maxWidth: '700px', margin: '0 auto' }}>
            Welcome to <strong>NUTFLIX</strong>, your destination for quality dry fruits at competitive prices. A brand of <strong>Darshan Techno System</strong>, serving customers across India through both online and offline channels.
          </p>
        </div>
      </section>

      {/* Brand Value Pillars: Quality • Freshness • Value • Convenience */}
      <section className="container" style={{ maxWidth: '1100px', marginTop: '-2.5rem', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '24px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-gold-light)',
                color: '#794d13',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Award size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>Quality</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Rigorous selection of premium, handpicked dry fruits and nuts to ensure top-tier taste and nutrition.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '24px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-gold-light)',
                color: '#794d13',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Leaf size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>Freshness</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Hygienically packed with aroma-lock seals to preserve natural aroma, crunchy texture, and pure wholesome goodness.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '24px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-gold-light)',
                color: '#794d13',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>Value</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Direct sourcing enables us to offer competitive, transparent prices without compromising on grade or purity.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '24px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-gold-light)',
                color: '#794d13',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Truck size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>Convenience</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Seamless online ordering, fast prompt dispatch, and dedicated customer support at your fingertips.
            </p>
          </div>
        </div>
      </section>

      {/* The NUTFLIX Story & Mission */}
      <section className="container" style={{ maxWidth: '1000px', marginTop: '4rem' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '28px',
            padding: '3.5rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="badge-impact" style={{ marginBottom: '0.8rem' }}>Darshan Techno System</span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '1.2rem', lineHeight: '1.2' }}>
                About NUTFLIX
              </h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.96rem', marginBottom: '1.2rem' }}>
                <strong>NUTFLIX</strong> is a brand of <strong>Darshan Techno System</strong>, engaged in the online and offline sale of quality dry fruits.
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.96rem', marginBottom: '1.2rem' }}>
                We aim to provide fresh, hygienically packed and carefully selected dry fruits with convenient ordering and prompt delivery. Our promise is simple and steadfast: <strong>Quality • Freshness • Value • Convenience</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.92rem' }}>
                  <CheckCircle2 size={20} color="var(--color-gold)" />
                  <span>Fresh, carefully selected and graded dry fruits</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.92rem' }}>
                  <CheckCircle2 size={20} color="var(--color-gold)" />
                  <span>Hygienically packed to retain natural crunch and aroma</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.92rem' }}>
                  <CheckCircle2 size={20} color="var(--color-gold)" />
                  <span>Convenient ordering with fast delivery across India</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.92rem' }}>
                  <CheckCircle2 size={20} color="var(--color-gold)" />
                  <span>FSSAI Certified: License No. 22826039000325</span>
                </div>
              </div>
            </div>

            {/* Official Business Information Card */}
            <div
              style={{
                backgroundColor: 'var(--color-forest)',
                color: '#ffffff',
                borderRadius: '24px',
                padding: '2.2rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-gold)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Brand & Corporate Office
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.4rem', color: '#ffffff' }}>
                NUTFLIX
              </div>
              <div style={{ fontSize: '0.9rem', color: '#c0d4c5', marginBottom: '1.5rem', fontWeight: 600 }}>
                A Brand of Darshan Techno System
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#eadfcb', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <MapPin size={18} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Registered Office:</strong><br />
                    43, Karaya Road, Kolkata – 700017<br />
                    West Bengal, India
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Phone size={18} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Phone / WhatsApp:</strong>{' '}
                    <a href="tel:9330193041" style={{ color: '#ffffff', fontWeight: 700, textDecoration: 'none' }}>
                      9330193041
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Globe size={18} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                  <div>
                    <strong>Website:</strong>{' '}
                    <a href="https://www.nutflix.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)', fontWeight: 700, textDecoration: 'none' }}>
                      www.nutflix.in
                    </a>
                  </div>
                </div>

                <div style={{ marginTop: '0.5rem', padding: '0.6rem 0.8rem', backgroundColor: 'rgba(200, 157, 102, 0.18)', borderRadius: '12px', border: '1px solid rgba(200, 157, 102, 0.35)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-gold)', fontWeight: 800 }}>
                    FSSAI LICENSE NUMBER
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.04em' }}>
                    22826039000325
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container" style={{ maxWidth: '800px', marginTop: '4rem', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: 'var(--color-cream-light)',
            borderRadius: '24px',
            padding: '3rem 2rem',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.8rem' }}>
            Experience Fresh, Wholesome Snacking
          </h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--color-text-muted)', marginBottom: '1.8rem', maxWidth: '520px', margin: '0 auto 1.8rem' }}>
            Explore our curated catalog of freshly packed cashews, premium almonds, walnuts, raisins, and dried fruits today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn-primary">
              <span>Shop All Dry Fruits</span>
              <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn-outline">
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
