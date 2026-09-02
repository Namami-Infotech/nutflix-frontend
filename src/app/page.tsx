'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fetchCategories, fetchProducts, fetchImpactMetrics, fetchReviews, fetchBanners, getCachedData } from '@/lib/api';
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
    let isMounted = true;

    async function loadEssentialData() {
      // Fetch primary above-the-fold data in parallel
      const [cats, prods, bannerList] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
        fetchBanners(),
      ]);

      if (!isMounted) return;
      setCategories(cats);
      setProducts(prods);
      setBanners(bannerList);
      setLoading(false);

      // Fetch non-critical metrics & reviews in background
      Promise.all([fetchImpactMetrics(), fetchReviews()]).then(([metrics, revs]) => {
        if (!isMounted) return;
        setImpactMetrics(metrics);
        setReviews(revs);
      });
    }

    loadEssentialData();

    return () => {
      isMounted = false;
    };
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

  // Maximum 12 products displayed on Home Page (3 rows of 4)
  const displayedProducts = filteredProducts.slice(0, 12);
  const hasMoreProducts = filteredProducts.length >= 12;

  return (
    <div>
      <HeroBanner banners={banners} />

      {/* Featured Catalog Section */}
      <section id="products" style={{ padding: '2rem 0 5rem', backgroundColor: '#ffffff' }}>
        <div className="container">
          {/* Section Header */}
          <div style={{ marginBottom: '2.2rem' }}>
            <div style={{ maxWidth: '680px' }}>
              {/* <span className="badge-impact" style={{ marginBottom: '0.8rem' }}>
                Harvest Collections
              </span> */}
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

          {/* View More Button Aligned to Bottom Right (Only shown when > 12 products exist) */}
          {hasMoreProducts && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
              <Link
                href={selectedCategory ? `/products?category=${selectedCategory}` : '/products'}
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.85rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-pill)',
                  whiteSpace: 'nowrap',
                  textDecoration: 'none',
                }}
              >
                View More <ArrowRight size={18} />
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

