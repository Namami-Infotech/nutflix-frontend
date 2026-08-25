'use client';

import React from 'react';
import { ImpactMetric } from '@/lib/api';
import { Users, HeartPulse, TreePine } from 'lucide-react';

interface Props {
  metrics: ImpactMetric[];
}

export const ImpactCounterSection: React.FC<Props> = ({ metrics }) => {
  const getIcon = (key: string) => {
    switch (key) {
      case 'farmers_empowered':
        return <Users size={32} color="var(--color-gold)" />;
      case 'treatments_funded':
        return <HeartPulse size={32} color="var(--color-gold)" />;
      default:
        return <TreePine size={32} color="var(--color-gold)" />;
    }
  };

  return (
    <section style={{ backgroundColor: 'var(--color-cream-light)', padding: '4.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem' }}>
          <span className="badge-impact" style={{ marginBottom: '0.8rem' }}>Empowerment & Sustainability</span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.6rem' }}>
            Every Bite Fuels Life-Changing Impact
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>
            We bridge the gap between conscientious consumers and Tanzanian farming communities.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {metrics.map((m) => (
            <div
              key={m.id}
              style={{
                backgroundColor: '#ffffff',
                padding: '2.2rem 1.8rem',
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                transition: 'var(--transition)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-gold-light)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.2rem',
                }}
              >
                {getIcon(m.metricKey)}
              </div>
              <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--color-forest)', lineHeight: 1, marginBottom: '0.5rem' }}>
                {m.count.toLocaleString()}{m.suffix}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.5rem' }}>
                {m.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
