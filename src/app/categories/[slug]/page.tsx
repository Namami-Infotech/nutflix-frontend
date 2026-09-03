'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchCategories, fetchProducts, Category } from '@/lib/api';
import { ArrowLeft, Sparkles, ArrowRight, Layers, Package, ShieldCheck, ChevronRight, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';

export const dynamic = 'force-dynamic';

export default function CategoryProductsPage({ params }: { params?: { slug?: string } }) {
  const [mounted, setMounted] = useState(false);
  const routeParams = useParams();
  const slug = (params?.slug || routeParams?.slug || '') as string;
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    async function loadCategories() {
      setLoading(true);
      try {
        const apiCats = await fetchCategories();
        setCategories(apiCats || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, [slug]);

  if (!mounted) return null;

  const displayCategories = categories.filter((cat) => {
    if (!debouncedSearchQuery.trim()) return true;
    const q = debouncedSearchQuery.trim().toLowerCase();
    return (
      cat.name?.toLowerCase().includes(q) ||
      cat.description?.toLowerCase().includes(q) ||
      cat.slug?.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '88vh', paddingBottom: '6rem' }}>
      {/* Category Header Banner */}
      <section 
        className="page-header-banner"
        style={{ 
          backgroundColor: 'var(--color-forest)', 
          color: '#ffffff', 
          padding: '4rem 0 3.5rem',
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 60%)',
          borderBottom: '4px solid var(--color-gold)'
        }}
      >
        <div className="container">
          <Link
            href="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-gold)',
              fontWeight: 700,
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              textDecoration: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
            }}
          >
            <ArrowLeft size={16} /> Back to Shop All
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
            <span className="badge-impact" style={{ backgroundColor: 'var(--color-gold)', color: '#3E1906', fontWeight: 800 }}>
              <Layers size={14} /> CATEGORIES ONLY
            </span>
            <span style={{ color: 'var(--color-cream)', fontSize: '0.88rem', fontWeight: 600 }}>
              • Handpicked Dry Fruit Collections
            </span>
          </div>

          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '0.8rem', color: '#ffffff', fontFamily: 'var(--font-serif, Georgia, serif)' }}>
            Cashews & Premium Dry Fruit Categories
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#E5D6C3', maxWidth: '750px', lineHeight: '1.6' }}>
            Choose a category below to explore our hand-roasted cashews, organic almonds, pistachio kernels, and luxury gift boxes.
          </p>
        </div>
      </section>

      {/* Main Categories Grid Container */}
      <div className="container categories-main-container" style={{ paddingTop: '3rem' }}>
        
        {/* Section Header with Debounced Search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-forest)' }}>
              Explore Categories ({displayCategories.length})
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
              Select any category to view individual products
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Category Search Input (Hidden on Mobile) */}
            <div className="category-search-box" style={{ position: 'relative', width: '280px' }}>
              <Search size={18} color="var(--color-forest)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search category keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 2.4rem 0.65rem 2.6rem',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.9rem',
                  color: 'var(--color-forest)',
                  outline: 'none',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-muted)',
                  }}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <Link
              href="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.7rem 1.4rem',
                backgroundColor: 'var(--color-forest)',
                color: '#ffffff',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <span>View All Products</span>
              <ArrowRight size={16} color="var(--color-gold)" />
            </Link>
          </div>
        </div>

        {/* Categories Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            Loading categories...
          </div>
        ) : displayCategories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <h3>No categories found</h3>
            <p>Try searching for another keyword or browse all products.</p>
          </div>
        ) : (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '2rem' 
            }}
          >
            {displayCategories.map((cat) => (
              <CategoryCardItem key={cat.id || cat.slug} cat={cat} />
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .page-header-banner {
            display: none !important;
          }
          .categories-main-container {
            padding-top: 1.5rem !important;
          }
          .category-search-box {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function CategoryCardItem({ cat }: { cat: any }) {
  const fallback = 'https://images.unsplash.com/photo-1608797178974-15b35a640578?auto=format&fit=crop&w=600&q=80';
  const initialImg = cat.imageUrl || cat.image || fallback;
  const [imgSrc, setImgSrc] = useState(initialImg);

  useEffect(() => {
    setImgSrc(cat.imageUrl || cat.image || fallback);
  }, [cat.imageUrl, cat.image]);

  return (
    <Link
      href={`/products?category=${encodeURIComponent(cat.slug)}`}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(30, 77, 43, 0.15)';
          e.currentTarget.style.borderColor = 'var(--color-gold)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.05)';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
      >
        {/* Category Thumbnail */}
        <div style={{ height: '180px', width: '100%', position: 'relative', backgroundColor: '#F3EBD9', overflow: 'hidden' }}>
          <img
            src={imgSrc}
            alt={cat.name}
            onError={() => {
              if (imgSrc !== fallback) {
                setImgSrc(fallback);
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
          />
          {cat.badge && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: 'rgba(30, 77, 43, 0.9)',
                color: '#ffffff',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 800,
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              {cat.icon && <span>{cat.icon}</span>}
              <span>{cat.badge}</span>
            </div>
          )}
        </div>

        {/* Category Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <h3 
            style={{ 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              color: 'var(--color-forest)', 
              marginBottom: '0.5rem',
              lineHeight: '1.3'
            }}
          >
            {cat.name}
          </h3>
          <p 
            style={{ 
              fontSize: '0.88rem', 
              color: 'var(--color-text-muted)', 
              lineHeight: '1.5',
              marginBottom: '1.5rem',
              flexGrow: 1
            }}
          >
            {cat.description}
          </p>

          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid #F5EFE6',
              color: 'var(--color-forest)',
              fontWeight: 800,
              fontSize: '0.9rem'
            }}
          >
            <span>Explore Products</span>
            <div 
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--color-cream-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-forest)'
              }}
            >
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
