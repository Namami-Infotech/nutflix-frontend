'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fetchCategories, fetchProducts, fetchImpactMetrics, fetchReviews, fetchBanners } from '@/lib/api';
import { Category, Product, ImpactMetric, Review, MasterBanner } from '@/types';
import { HeroBanner } from '@/modules/home';
import { CategoryFilter, ProductGrid, ProductDetailModal, AddProductModal } from '@/modules/catalog';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetric[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [banners, setBanners] = useState<MasterBanner[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cats, prods, metrics, revs, bannerList] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
        fetchImpactMetrics(),
        fetchReviews(),
        fetchBanners(),
      ]);
      setCategories(cats);
      setProducts(prods);
      setImpactMetrics(metrics);
      setReviews(revs);
      setBanners(bannerList);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat && p.categoryId !== cat.id) return false;
    }
    return true;
  });

  // Maximum 32 products displayed on Home Page
  const displayedProducts = filteredProducts.slice(0, 32);
  const hasMoreProducts = filteredProducts.length > 32 || products.length > 32;

  return (
    <div>
      <HeroBanner banners={banners} />

      {/* Featured Catalog Section */}
      <section id="products" style={{ padding: '4rem 0 5rem', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '1.5rem',
              marginBottom: '2.2rem',
            }}
          >
            <div style={{ maxWidth: '680px' }}>
              <span className="badge-impact" style={{ marginBottom: '0.8rem' }}>
                Harvest Collections
              </span>
              <h2
                style={{
                  fontSize: '2.4rem',
                  fontWeight: 900,
                  color: 'var(--color-forest)',
                  marginBottom: '0.4rem',
                }}
              >
                Artisanal Tanzanian Produce
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>
                Hand-harvested, ethically sourced, and crafted for unparalleled flavor.
              </p>
            </div>

            <Link
              href="/products"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.6rem',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-pill)',
                whiteSpace: 'nowrap',
              }}
            >
              View More <ArrowRight size={18} />
            </Link>
          </div>

          <CategoryFilter
            categories={categories}
            selectedSlug={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <ProductGrid
            products={displayedProducts}
            isLoading={loading}
            onQuickView={setQuickViewProduct}
          />

          {hasMoreProducts && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Link
                href="/products"
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.85rem 2.2rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  borderRadius: 'var(--radius-pill)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                View More Products ({products.length} Items Available) <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        categories={categories}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}

