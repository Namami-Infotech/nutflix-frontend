'use client';

import React, { useEffect, useState } from 'react';
import { fetchImpactMetrics } from '@/lib/api';
import { ImpactMetric } from '@/types';
import { ImpactCounterSection } from '@/modules/home';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ImpactPage() {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);

  useEffect(() => {
    fetchImpactMetrics().then(setMetrics);
  }, []);

  return (
    <div>
      <section style={{ backgroundColor: 'var(--color-forest)', color: '#ffffff', padding: '5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <span className="badge-impact" style={{ marginBottom: '1rem' }}>Transparent Social Impact</span>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>
            Empowering Farmers, Healing Communities
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-cream)', lineHeight: '1.6' }}>
            At Tanza Kindness, social impact is not an afterthought. It is the foundational core of our business model in Tanzania.
          </p>
        </div>
      </section>

      <ImpactCounterSection metrics={metrics} />

      <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '1.5rem', textAlign: 'center' }}>
            How Your Purchases Create Real Change
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'var(--color-cream-light)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-gold)', marginBottom: '0.5rem' }}>01. Direct Fair Trade</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>Eliminating Middlemen</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                We purchase directly from farmer cooperatives, ensuring farmers receive up to 45% higher incomes than conventional commodity markets.
              </p>
            </div>

            <div style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'var(--color-cream-light)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-gold)', marginBottom: '0.5rem' }}>02. Healthcare Grants</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>Funding Rural Clinics</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                Every purchase contributes to healthcare micro-grants funding mobile doctors, maternal health, and emergency medical checkups in rural farming villages.
              </p>
            </div>

            <div style={{ padding: '2rem', borderRadius: '20px', backgroundColor: 'var(--color-cream-light)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-gold)', marginBottom: '0.5rem' }}>03. Agroforestry</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>Preserving Ecosystems</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                We promote regenerative farming and sustainable beekeeping in protected Miombo forests to combat deforestation.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link href="/products" className="btn-primary">
              <span>Support Our Mission - Shop Produce</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
