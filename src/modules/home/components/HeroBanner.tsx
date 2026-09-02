'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play, Pencil } from 'lucide-react';
import { MasterBanner } from '@/types';
import { EditBannerModal } from './EditBannerModal';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface HeroBannerProps {
  banners?: MasterBanner[];
  autoScrollInterval?: number; // default 5000ms
  onUpdateBanner?: (updatedBanner: MasterBanner) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  banners = [],
  autoScrollInterval = 4500,
  onUpdateBanner,
}) => {
  const [activeBanners, setActiveBanners] = useState<MasterBanner[]>(banners);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (banners && banners.length > 0) {
      setActiveBanners(banners);
    }
  }, [banners]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activeBanners.length);
  }, [activeBanners.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + activeBanners.length) % activeBanners.length);
  }, [activeBanners.length]);

  // Auto-scroll Timer (Fast 3s interval)
  useEffect(() => {
    if (isPaused || activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, autoScrollInterval);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, activeBanners.length, autoScrollInterval]);

  // Keyboard navigation support (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  if (!currentBanner) {
    return null;
  }

  const handleSaveBanner = (updatedBanner: MasterBanner) => {
    setActiveBanners((prev) =>
      prev.map((b) => (b.id === updatedBanner.id ? updatedBanner : b))
    );
    if (onUpdateBanner) {
      onUpdateBanner(updatedBanner);
    }
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#faf8f5',
        overflow: 'hidden',
      }}
    >
      {/* Smooth Sliding Track Container */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
          transition: 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
          willChange: 'transform',
        }}
      >
        {activeBanners.map((banner, index) => {
          const isFirstOrActive = index === 0 || index === currentIndex;
          const imgElement = (
            <OptimizedImage
              src={banner.imageUrl}
              alt={banner.title || `Hero Banner ${index + 1}`}
              priority={isFirstOrActive}
              draggable={false}
              className="hero-banner-img"
              style={{
                userSelect: 'none',
              }}
            />
          );

          return (
            <div
              key={banner.id || `banner-${index}`}
              style={{
                flex: '0 0 100%',
                minWidth: '100%',
                maxWidth: '100%',
              }}
            >
              {banner.ctaLink ? (
                <Link href={banner.ctaLink} style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
                  {imgElement}
                </Link>
              ) : (
                imgElement
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Carousel Navigation Bar over Image */}
      {activeBanners.length > 1 && (
        <div className="hero-banner-controls">
          {/* Slide Dots / Progress */}
          <div className="hero-banner-dots">
            {activeBanners.map((banner, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={banner.id || `dot-${idx}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to banner ${idx + 1}`}
                  className={`hero-banner-dot ${isActive ? 'active' : ''}`}
                />
              );
            })}
          </div>

          <span className="hero-banner-counter">
            0{currentIndex + 1} / 0{activeBanners.length}
          </span>

          {/* Controls: Prev, Pause/Play toggle, Next */}
          <div className="hero-banner-btns">
            <button
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
              className="hero-banner-btn hero-banner-playbtn"
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? <Play className="hero-banner-icon" size={14} /> : <Pause className="hero-banner-icon" size={14} />}
            </button>

            <button
              onClick={prevSlide}
              aria-label="Previous Banner"
              className="hero-banner-btn"
            >
              <ChevronLeft className="hero-banner-icon" size={16} />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next Banner"
              className="hero-banner-btn"
            >
              <ChevronRight className="hero-banner-icon" size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Edit Banner Modal */}
      <EditBannerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        banner={currentBanner}
        onSave={handleSaveBanner}
      />

      {/* Responsive Styles */}
      <style jsx global>{`
        .hero-banner-img {
          width: 100%;
          height: auto;
          display: block;
        }

        .hero-banner-controls {
          position: absolute;
          bottom: 0.75rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: rgba(15, 41, 30, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-pill, 40px);
          padding: 0.3rem 0.8rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          max-width: calc(100% - 1.5rem);
          box-sizing: border-box;
          transition: all 0.25s ease;
        }

        .hero-banner-dots {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .hero-banner-dot {
          height: 6px;
          width: 8px;
          border-radius: 3px;
          background-color: rgba(255, 255, 255, 0.35);
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
        }

        .hero-banner-dot.active {
          width: 24px;
          background-color: var(--color-gold, #c89d66);
        }

        .hero-banner-counter {
          font-size: 0.72rem;
          color: #ffffff;
          opacity: 0.85;
          font-weight: 700;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }

        .hero-banner-btns {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .hero-banner-btn {
          background-color: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border: none;
          border-radius: 50%;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.15s ease;
          padding: 0;
          flex-shrink: 0;
        }

        .hero-banner-btn:hover {
          background-color: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .hero-banner-playbtn {
          border-radius: var(--radius-pill, 40px);
          width: auto;
          padding: 0 0.4rem;
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .hero-banner-img {
            min-height: 240px;
            height: 240px;
            object-fit: cover;
            object-position: center;
          }

          .hero-banner-controls {
            bottom: 0.5rem;
            padding: 0.22rem 0.6rem;
            gap: 0.5rem;
          }

          .hero-banner-dot {
            height: 5px;
            width: 7px;
          }

          .hero-banner-dot.active {
            width: 18px;
          }

          .hero-banner-counter {
            font-size: 0.65rem;
          }

          .hero-banner-btn {
            width: 22px;
            height: 22px;
          }

          .hero-banner-icon {
            width: 12px;
            height: 12px;
          }
        }

        @media (max-width: 480px) {
          .hero-banner-img {
            min-height: 220px;
            height: 220px;
            object-fit: cover;
            object-position: center;
          }

          .hero-banner-controls {
            bottom: 0.35rem;
            padding: 0.15rem 0.45rem;
            gap: 0.35rem;
            border-radius: 20px;
            max-width: calc(100% - 0.75rem);
          }

          .hero-banner-dots {
            gap: 0.25rem;
          }

          .hero-banner-dot {
            height: 4px;
            width: 5px;
            border-radius: 2px;
          }

          .hero-banner-dot.active {
            width: 14px;
          }

          .hero-banner-counter {
            font-size: 0.58rem;
          }

          .hero-banner-btns {
            gap: 0.25rem;
          }

          .hero-banner-btn {
            width: 19px;
            height: 19px;
          }

          .hero-banner-icon {
            width: 10px;
            height: 10px;
          }
        }

        @media (max-width: 360px) {
          .hero-banner-img {
            min-height: 195px;
            height: 200px;
            object-fit: cover;
            object-position: center;
          }

          .hero-banner-controls {
            bottom: 0.25rem;
            padding: 0.12rem 0.35rem;
            gap: 0.25rem;
          }

          .hero-banner-counter {
            font-size: 0.52rem;
          }

          .hero-banner-btn {
            width: 17px;
            height: 17px;
          }

          .hero-banner-icon {
            width: 9px;
            height: 9px;
          }
        }
      `}</style>
    </section>
  );
};
