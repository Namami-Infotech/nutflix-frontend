'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Globe, MessageSquare, Clock, Send, CheckCircle2, ShieldCheck, Headphones, Award } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-light)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero Header */}
      <section
        className="page-header-banner"
        style={{
          backgroundColor: 'var(--color-forest)',
          color: '#ffffff',
          padding: '4.5rem 0 3.5rem',
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
              padding: '0.4rem 1.1rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
              border: '1px solid rgba(200, 157, 102, 0.3)',
            }}
          >
            <Headphones size={16} />
            <span>Support &amp; Inquiries</span>
          </div>
          <h1 style={{ fontSize: '2.9rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Contact Us
          </h1>
          <p style={{ fontSize: '1.08rem', color: 'var(--color-cream)', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto' }}>
            For orders, product enquiries, delivery assistance, returns, refunds or other support, we are here to assist you.
          </p>
          <div style={{ marginTop: '0.8rem', fontSize: '0.92rem', color: 'var(--color-gold)', fontWeight: 800 }}>
            NUTFLIX – Quality Dry Fruits, Delivered Fresh.
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="container contact-main-container" style={{ maxWidth: '1140px', marginTop: '3.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Direct Contact Information Cards */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <span className="badge-impact" style={{ marginBottom: '0.6rem' }}>Reach Our Team</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.6rem' }}>
                Customer Care &amp; Office
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                NUTFLIX is a brand of Darshan Techno System, serving customers through both online and offline channels.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Phone / Call / WhatsApp Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '1.5rem',
                  borderRadius: '20px',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  gap: '1.2rem',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    padding: '0.85rem',
                    borderRadius: '16px',
                    backgroundColor: 'var(--color-gold-light)',
                    color: '#794d13',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.3rem' }}>
                    Phone &amp; WhatsApp Support
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <a
                      href="tel:9330193041"
                      style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-forest)', textDecoration: 'none' }}
                    >
                      9330193041
                    </a>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      Available for orders, enquiries, deliveries, returns &amp; refunds.
                    </p>
                  </div>
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <a
                      href="tel:9330193041"
                      className="btn-primary"
                      style={{ padding: '0.5rem 1.2rem', fontSize: '0.82rem', borderRadius: 'var(--radius-pill)', display: 'inline-flex', gap: '0.4rem' }}
                    >
                      <Phone size={14} />
                      <span>Call: 9330193041</span>
                    </a>
                    <a
                      href="https://wa.me/919330193041"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '0.5rem 1.2rem', fontSize: '0.82rem', borderRadius: 'var(--radius-pill)', display: 'inline-flex', gap: '0.4rem' }}
                    >
                      <MessageSquare size={14} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Website & FSSAI Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '1.5rem',
                  borderRadius: '20px',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  gap: '1.2rem',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    padding: '0.85rem',
                    borderRadius: '16px',
                    backgroundColor: 'var(--color-gold-light)',
                    color: '#794d13',
                    flexShrink: 0,
                  }}
                >
                  <Globe size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.3rem' }}>
                    Website &amp; Regulatory
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                    <strong>Official Website:</strong>{' '}
                    <a href="https://www.nut-flix.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)', fontWeight: 700 }}>
                      www.nut-flix.in
                    </a>
                  </p>
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.8rem', backgroundColor: 'var(--color-cream-light)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--color-forest)', fontWeight: 800 }}>
                      FSSAI LICENSE NO.
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--color-gold)' }}>
                      22826039000325
                    </div>
                  </div>
                </div>
              </div>

              {/* Registered Office Address Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '1.5rem',
                  borderRadius: '20px',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  gap: '1.2rem',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    padding: '0.85rem',
                    borderRadius: '16px',
                    backgroundColor: 'var(--color-gold-light)',
                    color: '#794d13',
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.3rem' }}>
                    Registered Office
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: '1.5', fontWeight: 600 }}>
                    43, Karaya Road
                  </p>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: '1.5', fontWeight: 600 }}>
                    Kolkata – 700017
                  </p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    West Bengal, India
                  </p>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-gold)', fontWeight: 800, marginTop: '0.4rem' }}>
                    A Brand of Darshan Techno System
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Send Message Form */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '2.5rem',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
              Send Us a Message
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.8rem' }}>
              Fill in your inquiry details below and our team will get back to you promptly.
            </p>

            {submitted ? (
              <div
                style={{
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--color-cream-light)',
                  borderRadius: '20px',
                  border: '1.5px solid var(--color-gold)',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(200, 157, 102, 0.2)',
                    color: 'var(--color-gold)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>
                  Thank You for Contacting NUTFLIX!
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                  Your message has been received. Our team at 43, Karaya Road, Kolkata will assist you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="btn-primary"
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.88rem' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg-light)',
                      fontSize: '0.92rem',
                      color: 'var(--color-text-dark)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-light)',
                        fontSize: '0.92rem',
                        color: 'var(--color-text-dark)',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                      Phone / Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit Mobile"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-light)',
                        fontSize: '0.92rem',
                        color: 'var(--color-text-dark)',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                    Subject / Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg-light)',
                      fontSize: '0.92rem',
                      color: 'var(--color-text-dark)',
                      outline: 'none',
                    }}
                  >
                    <option value="">Select Topic...</option>
                    <option value="Order Status / Delivery Assistance">Order Status / Delivery Assistance</option>
                    <option value="Product Enquiries">Product Enquiries</option>
                    <option value="Return / Refund Request">Return / Refund Request</option>
                    <option value="Bulk / Wholesale Inquiry">Bulk / Wholesale Inquiry</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please write your query, order ID, or product requirement..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg-light)',
                      fontSize: '0.92rem',
                      color: 'var(--color-text-dark)',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    padding: '0.9rem',
                    fontSize: '0.95rem',
                    width: '100%',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <Send size={18} />
                  <span>{loading ? 'Sending Message...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .page-header-banner {
            display: none !important;
          }
          .contact-main-container {
            margin-top: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
