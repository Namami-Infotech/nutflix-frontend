'use client';

import React, { useState, useCallback } from 'react';
import Cropper, { Point, Area } from 'react-easy-crop';
import { Modal } from './Modal';
import { ZoomIn, ZoomOut, RotateCcw, Crop as CropIcon, Check, X } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  aspect?: number; // 1 for Square (Product), 16/6 or 3/1 for Banner, or undefined for Free
  title?: string;
  onCropComplete: (croppedImageBase64: string) => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  aspect = 1,
  title = 'Crop Image',
  onCropComplete,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [currentAspect, setCurrentAspect] = useState<number | undefined>(aspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync aspect when modal opens or aspect prop changes
  React.useEffect(() => {
    setCurrentAspect(aspect);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  }, [aspect, imageSrc, isOpen]);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const handleCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedBase64);
      onClose();
    } catch (e) {
      console.error('Error cropping image:', e);
      alert('Failed to crop image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="680px" zIndex={99999}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Aspect Ratio Selector if not forced to fixed */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-forest)' }}>
            Crop Aspect Ratio:
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setCurrentAspect(1920 / 650)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: (currentAspect && Math.abs(currentAspect - 1920 / 650) < 0.05) ? 'var(--color-forest)' : '#f1f5f9',
                color: (currentAspect && Math.abs(currentAspect - 1920 / 650) < 0.05) ? '#ffffff' : '#334155',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              1920×650 (Low Height Banner)
            </button>
            <button
              type="button"
              onClick={() => setCurrentAspect(1920 / 800)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: (currentAspect && Math.abs(currentAspect - 1920 / 800) < 0.05) ? 'var(--color-forest)' : '#f1f5f9',
                color: (currentAspect && Math.abs(currentAspect - 1920 / 800) < 0.05) ? '#ffffff' : '#334155',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              1920×800 (Medium Banner)
            </button>
            <button
              type="button"
              onClick={() => setCurrentAspect(1)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: currentAspect === 1 ? 'var(--color-forest)' : '#f1f5f9',
                color: currentAspect === 1 ? '#ffffff' : '#334155',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              1:1 Square (Product)
            </button>
          </div>
        </div>

        {/* Cropper Container Area */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '340px',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={currentAspect}
            onCropChange={onCropChange}
            onCropComplete={handleCropComplete}
            onZoomChange={onZoomChange}
            showGrid={true}
          />
        </div>

        {/* Zoom & Adjustment Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
            style={iconBtnStyle}
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.05}
            aria-label="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ flex: 1, accentColor: 'var(--color-forest)', cursor: 'pointer' }}
          />

          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
            style={iconBtnStyle}
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>

          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setCrop({ x: 0, y: 0 });
            }}
            style={iconBtnStyle}
            title="Reset Zoom"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-border)',
              backgroundColor: '#ffffff',
              color: 'var(--color-text)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={createCroppedImage}
            disabled={isProcessing}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: 'var(--color-forest)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: isProcessing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 14px rgba(15, 41, 30, 0.25)',
            }}
          >
            <CropIcon size={16} />
            <span>{isProcessing ? 'Cropping...' : 'Apply Crop & Save'}</span>
          </button>
        </div>

      </div>
    </Modal>
  );
};

const iconBtnStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  backgroundColor: '#f1f5f9',
  border: '1px solid #cbd5e1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#334155',
  cursor: 'pointer',
};

// Canvas Helper to Extract Cropped Image Data URL with Max Dimension Scaling & JPEG Compression
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = imageSrc;
  });

  // Calculate scaled target dimensions (Max 1920px for Full HD resolution)
  const maxDim = 1920;
  let targetWidth = pixelCrop.width;
  let targetHeight = pixelCrop.height;

  if (targetWidth > maxDim || targetHeight > maxDim) {
    if (targetWidth > targetHeight) {
      targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
      targetWidth = maxDim;
    } else {
      targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
      targetHeight = maxDim;
    }
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return canvas.toDataURL('image/jpeg', 0.82);
}
