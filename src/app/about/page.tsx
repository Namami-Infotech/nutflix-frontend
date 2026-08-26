import React from 'react';
import Link from 'next/link';
import { Award, Leaf, ShieldCheck, Heart, Sparkles, Truck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Us | NUTFLIX - Pure, Premium Handcrafted Dry Fruits',
  description: 'Learn about NUTFLIX by Darshan Techno System. Our heritage of delivering fresh, authentic, and naturally wholesome dry fruits across India.',
};

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg-light)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section
        style={{
          backgroundColor: 'var(--color-forest)',
          color: '#ffffff',
          padding: '5.5rem 0 4.5rem',
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
            <span>Our Story & Mission</span>
          </div>

          <h1 style={{ fontSize: '3.2rem', fontWeight: 900, marginBottom: '1.2rem', letterSpacing: '-0.02em', lineHeight: '1.15', color: '#ffffff' }}>
            Pure Crunch, Honest Nutrition &amp; Royal Flavor
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--color-cream)', lineHeight: '1.7', maxWidth: '680px', margin: '0 auto' }}>
            At <strong>NUTFLIX</strong>, we believe snacking should be both deeply satisfying and genuinely healthy. We bring nature’s finest dry fruits, roasted nuts, and superfoods directly from trusted farms to your table.
          </p>
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section className="container" style={{ maxWidth: '1100px', marginTop: '-2rem', position: 'relative', zIndex: 2 }}>
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
              <Leaf size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>100% Naturally Sourced</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Zero chemical preservatives, no artificial colors, and zero adulteration. Only pure, wholesome dry fruits.
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
              <Award size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>Handpicked Jumbo Grade</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Rigorous multi-stage sorting to ensure every pouch is packed with giant, crispy, uniform-sized kernels.
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
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>Aroma-Lock Freshness</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Food-grade nitrogen vacuum sealing retains the crunch and rich nutty aroma for maximum shelf freshness.
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
              <Heart size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>Farmer Empowerment</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              Ethically sourced through direct grower partnerships, providing fair value and sustainable farming support.
            </p>
          </div>
        </div>
      </section>

      {/* The NUTFLIX Story */}
      <section className="container" style={{ maxWidth: '1000px', marginTop: '4.5rem' }}>
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
              <span className="badge-impact" style={{ marginBottom: '0.8rem' }}>Behind The Brand</span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '1.2rem', lineHeight: '1.2' }}>
                Crafting The Standard for Premium Dry Fruits
              </h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.96rem', marginBottom: '1.2rem' }}>
                Founded under <strong>DARSHAN TECHNO SYSTEM</strong>, <strong>NUTFLIX</strong> was created with a clear, singular vision: to eliminate the ambiguity around dry fruit quality and bring genuine, luxury-grade dry fruits to Indian households at fair, transparent prices.
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', fontSize: '0.96rem', marginBottom: '1.5rem' }}>
                From hand-roasted jumbo cashews and rich Californian almonds to organic Kashmiri walnuts and golden raisins, every single product under NUTFLIX undergoes strict grading, hygienic vacuum sealing, and rigorous testing before it leaves our Kolkata headquarters.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.92rem' }}>
                  <CheckCircle2 size={20} color="var(--color-gold)" />
                  <span>Direct sourcing from the most fertile growing regions</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.92rem' }}>
                  <CheckCircle2 size={20} color="var(--color-gold)" />
                  <span>Zero compromises on hygiene and packaging integrity</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.92rem' }}>
                  <CheckCircle2 size={20} color="var(--color-gold)" />
                  <span>Prompt, nationwide doorstep shipping with care</span>
                </div>
              </div>
            </div>

            {/* Visual Highlight Card */}
            <div
              style={{
                backgroundColor: 'var(--color-forest)',
                color: '#ffffff',
                borderRadius: '24px',
                padding: '2.5rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--color-gold)', lineHeight: '1', marginBottom: '0.5rem' }}>
                100%
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#ffffff' }}>
                Quality &amp; Satisfaction Guarantee
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-cream)', lineHeight: '1.6', marginBottom: '2rem' }}>
                If you are ever unsatisfied with the crunch, flavor, or condition of your order, our dedicated customer desk will make it right with an instant replacement or refund.
              </p>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-gold)' }}>
                <strong>DARSHAN TECHNO SYSTEM</strong><br />
                <span style={{ color: '#eadfcb' }}>Kolkata – 700017, West Bengal</span>
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
            Ready to Experience Fresh Healthy Snacking?
          </h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--color-text-muted)', marginBottom: '1.8rem', maxWidth: '520px', margin: '0 auto 1.8rem' }}>
            Explore our curated catalog of freshly roasted cashews, premium almonds, walnuts, and gift collections today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn-primary">
              <span>Shop All Dry Fruits</span>
              <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn-outline">
              <span>Get In Touch</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
