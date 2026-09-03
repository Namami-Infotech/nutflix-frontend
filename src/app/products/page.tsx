'use client';

import React, { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchCategories, fetchProducts, Category, Product, getCachedData } from '@/lib/api';
import { ProductGrid, CategoryFilter, ProductSort, SortOption, ProductDetailModal } from '@/modules/catalog';
import { Search, Sparkles, X, Loader2 } from 'lucide-react';

import { useDebounce } from '@/hooks/useDebounce';

const PAGE_SIZE = 16;

function CatalogContent() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || null;
  const initialSearch = searchParams.get('search') || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination state for On-Scroll Infinite Load
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      const [cats, prods] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
      ]);
      if (!isMounted) return;
      setCategories(cats);
      setProducts(prods);
      setLoading(false);
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Reset pagination when category, search, or sort changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCategory, debouncedSearchQuery, sortBy]);

  // Update selection if query param changes
  useEffect(() => {
    const catParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    if (catParam) setSelectedCategory(catParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParams]);

  const matchKeyword = (keywords: any, q: string) => {
    if (!keywords) return false;
    if (Array.isArray(keywords)) {
      return keywords.some(k => String(k).toLowerCase().includes(q));
    }
    if (typeof keywords === 'string') {
      try {
        const parsed = JSON.parse(keywords);
        if (Array.isArray(parsed)) {
          return parsed.some(k => String(k).toLowerCase().includes(q));
        }
      } catch (e) {}
      return keywords.toLowerCase().includes(q);
    }
    return false;
  };

  // Filter & Sort Logic using debounced keyword search
  const filteredProducts = products.filter((p) => {
    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat && p.categoryId !== cat.id) return false;
    }
    if (debouncedSearchQuery.trim()) {
      const q = debouncedSearchQuery.trim().toLowerCase();
      const productCategory = categories.find((c) => c.id === p.categoryId);
      const categoryName = productCategory ? productCategory.name.toLowerCase() : '';
      const categorySlug = productCategory ? productCategory.slug.toLowerCase() : '';

      return (
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.origin && p.origin.toLowerCase().includes(q)) ||
        matchKeyword(p.keywords, q) ||
        categoryName.includes(q) ||
        categorySlug.includes(q) ||
        (productCategory && matchKeyword(productCategory.keywords, q))
      );
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'price-high') return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const displayedProducts = sortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProducts.length;

  const loadMoreProducts = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, sortedProducts.length));
    }
  }, [hasMore, sortedProducts.length]);

  // Infinite Scroll Observer Target
  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts();
        }
      },
      { threshold: 0.1, rootMargin: '250px' }
    );

    observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, loadMoreProducts]);

  // Window scroll fallback listener
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore) return;
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 500
      ) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadMoreProducts]);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: 'var(--color-bg-light)', minHeight: '85vh', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <section className="page-header-banner" style={{ backgroundColor: 'var(--color-forest)', color: '#ffffff', padding: '4rem 0 3rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <span className="badge-impact" style={{ marginBottom: '1rem' }}>
            <Sparkles size={14} color="var(--color-gold)" /> Direct From Tanzanian Farmers
          </span>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '0.8rem' }}>
            {activeCategoryObj ? activeCategoryObj.name : 'All Products'}
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-cream)', lineHeight: '1.6' }}>
            {activeCategoryObj
              ? activeCategoryObj.description
              : 'Ethically harvested, organic, roasted cashews, single-origin Kilimanjaro Arabica coffee, raw wildflower honey, and Zanzibar spices.'}
          </p>
        </div>
      </section>

      {/* Catalog Main Container */}
      <div className="container catalog-container" style={{ paddingTop: '3rem' }}>
        {/* Category Filters */}
        <CategoryFilter
          categories={categories}
          selectedSlug={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Filter Controls Bar (Search + Sort + Count) */}
        <div className="products-filter-bar">
          {/* Live Search Input (Hidden on Mobile) */}
          <div className="products-search-box" style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
            <Search size={18} color="var(--color-forest)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by product name, category, or origin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 2.4rem 0.65rem 2.6rem',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--color-border)',
                backgroundColor: 'var(--color-bg-light)',
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

          <div className="products-sort-wrapper">
            <ProductSort sortBy={sortBy} onSortChange={setSortBy} />
          </div>
        </div>

        {/* Products Grid View */}
        <ProductGrid
          products={displayedProducts}
          isLoading={loading}
          onQuickView={setQuickViewProduct}
        />

        {/* On-Scroll Infinite Pagination Trigger */}
        <div ref={observerTarget} style={{ padding: '3rem 0 1rem', textAlign: 'center' }}>
          {hasMore ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                color: 'var(--color-forest)',
                fontWeight: 700,
                fontSize: '0.9rem',
                backgroundColor: '#ffffff',
                padding: '0.65rem 1.6rem',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Loader2 size={18} color="var(--color-gold)" style={{ animation: 'spin 1s linear infinite' }} />
              Loading more products... ({displayedProducts.length} of {sortedProducts.length})
            </div>
          ) : (
            sortedProducts.length > 0 && (
              <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                ✨ All {sortedProducts.length} products loaded
              </span>
            )
          )}
        </div>
      </div>

      {/* Quick View Product Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .products-filter-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.2rem;
          margin: 2rem 0;
          padding: 1rem 1.5rem;
          background-color: #ffffff;
          border-radius: 20px;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }

        .products-sort-wrapper {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .page-header-banner {
            display: none !important;
          }

          .catalog-container {
            padding-top: 1.25rem !important;
          }

          .products-filter-bar {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 0.25rem !important;
            margin: 0.25rem 0 1.2rem !important;
            display: flex !important;
            justify-content: flex-end !important;
            align-items: center !important;
          }

          .products-search-box {
            display: none !important;
          }

          .products-sort-wrapper {
            margin-left: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading products catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
