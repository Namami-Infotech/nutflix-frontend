'use client';

import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80';

export function resolveImageUrl(url?: string | null, fallback = DEFAULT_FALLBACK): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }
  const clean = url.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }
  const backendBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api').replace(/\/api\/?$/, '');
  return `${backendBase}${clean.startsWith('/') ? clean : `/${clean}`}`;
}

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
  alt: string;
  priority?: boolean;
  aspectRatio?: string | number;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt,
  priority = false,
  aspectRatio,
  containerClassName = '',
  containerStyle,
  style,
  className = '',
  objectFit = 'cover',
  onLoad,
  onError,
  ...restProps
}) => {
  const resolvedInitial = resolveImageUrl(src, fallbackSrc);
  const [currentSrc, setCurrentSrc] = useState<string>(resolvedInitial);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const resolved = resolveImageUrl(src, fallbackSrc);
    setCurrentSrc(resolved);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
    setIsLoaded(true);
    if (onError) onError(e);
  };

  return (
    <div
      className={`optimized-image-container ${containerClassName}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        aspectRatio: aspectRatio ? String(aspectRatio) : undefined,
        backgroundColor: '#f8f5f0',
        ...containerStyle,
      }}
    >
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt || 'Product Image'}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // @ts-ignore
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`optimized-image-element ${className}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          display: 'block',
          ...style,
        }}
        {...restProps}
      />
    </div>
  );
};

export default OptimizedImage;
