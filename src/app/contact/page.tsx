'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, MessageSquare, Clock, Send, CheckCircle2, ShieldCheck, Headphones } from 'lucide-react';

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
    // Simulate brief network submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-light)', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero Header */}
      <section
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
            <span>We&apos;re Here to Help</span>
          </div>
          <h1 style={{ fontSize: '2.9rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Contact Us
          </h1>
          <p style={{ fontSize: '1.08rem', color: 'var(--color-cream)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            Have a question about your order, bulk dry fruit inquiries, or feedback? Reach out to our Kolkata team anytime.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="container" style={{ maxWidth: '1140px', marginTop: '3.5rem' }}>
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
              <span className="badge-impact" style={{ marginBottom: '0.6rem' }}>Customer Desk</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.6rem' }}>
                Get in Touch Directly
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Whether you need assistance with an existing order or want to discuss custom gift hampers, our team is just a call or message away.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Address Card */}
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
                    Registered Address
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: '1.5', fontWeight: 600 }}>
                    43, KARAYA ROAD, KOLKATA – 700017
                  </p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    West Bengal, India
                  </p>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-gold)', fontWeight: 800, marginTop: '0.4rem' }}>
                    DARSHAN TECHNO SYSTEM (GSTIN: 19ADZPG6957G3ZN)
                  </div>
                </div>
              </div>

              {/* Phone / Call Card */}
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
                    Phone Support
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <a
                      href="tel:9830055527"
                      style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-forest)', textDecoration: 'none' }}
                    >
                      +91 98300-55527
                    </a>
                    <a
                      href="tel:9330193041"
                      style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textDecoration: 'none' }}
                    >
                      Alternative: +91 9330193041
                    </a>
                  </div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <a
                      href="tel:9830055527"
                      className="btn-primary"
                      style={{ padding: '0.5rem 1.2rem', fontSize: '0.82rem', borderRadius: 'var(--radius-pill)', display: 'inline-flex', gap: '0.4rem' }}
                    >
                      <Phone size={14} />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp & Email Card */}
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
                  <MessageSquare size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.3rem' }}>
                    WhatsApp & Email
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
                    <strong>Email:</strong>{' '}
                    <a href="mailto:agr@guharoy.com" style={{ color: 'var(--color-gold)', fontWeight: 700 }}>
                      agr@guharoy.com
                    </a>
                  </p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    <strong>WhatsApp:</strong> +91 98300-55527
                  </p>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <a
                      href="https://wa.me/919830055527"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ padding: '0.5rem 1.2rem', fontSize: '0.82rem', borderRadius: 'var(--radius-pill)', display: 'inline-flex', gap: '0.4rem' }}
                    >
                      <MessageSquare size={14} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div
                style={{
                  backgroundColor: 'var(--color-cream-light)',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <Clock size={22} color="var(--color-gold)" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--color-forest)', fontSize: '0.9rem' }}>Business Hours</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Monday – Saturday: 10:00 AM to 7:00 PM IST (Sunday Closed)</div>
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
              Fill in your inquiry details below and our team will get back to you within 24 business hours.
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
                  Thank You for Reaching Out!
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6', maxWidth: '380px', margin: '0 auto 1.5rem' }}>
                  Your message has been received. Our support team at Karaya Road, Kolkata will review your request and contact you promptly.
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
                    <option value="Order Status / Tracking">Order Status / Tracking</option>
                    <option value="Bulk / Corporate Gift Hamper Inquiry">Bulk / Corporate Gift Hamper Inquiry</option>
                    <option value="Return / Replacement Request">Return / Replacement Request</option>
                    <option value="Product Quality / Ingredients Query">Product Quality / Ingredients Query</option>
                    <option value="General Feedback">General Feedback</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please mention your query or Order ID..."
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

        {/* Map / Location Showcase */}
        <div
          style={{
            marginTop: '3.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2rem 2.5rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <span className="badge-impact" style={{ marginBottom: '0.4rem' }}>Central Kolkata Hub</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.3rem' }}>
              Visit Our Kolkata Office & Distribution Center
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
              DARSHAN TECHNO SYSTEM • 43, KARAYA ROAD, KOLKATA – 700017, West Bengal
            </p>
          </div>
          <div>
            <a
              href="https://maps.google.com/?q=43+Karaya+Road+Kolkata+700017"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}
            >
              <MapPin size={16} />
              <span>View On Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
