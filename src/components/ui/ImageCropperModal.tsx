'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Cropper, { Point, Area } from 'react-easy-crop';
import { Modal } from './Modal';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Crop as CropIcon, 
  Square, 
  RectangleHorizontal,
  Loader2,
  Check
} from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  aspect?: number; // 1 for Square (Product & Category), 1900/600 for Banner
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
  const [currentAspect, setCurrentAspect] = useState<number>(aspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync aspect when modal opens or aspect prop changes
  useEffect(() => {
    if (isOpen) {
      setCurrentAspect(aspect || 1);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
    }
  }, [aspect, imageSrc, isOpen]);

  const onCropChange = (newCrop: Point) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const handleCropComplete = useCallback((_croppedArea: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
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

  const isBanner = Math.abs(currentAspect - 1900 / 650) < 0.05;
  const isSquare = Math.abs(currentAspect - 1) < 0.05;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="720px" zIndex={99999}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        
        {/* Aspect Ratio Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          backgroundColor: '#f8fafc',
          padding: '0.65rem 0.9rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-forest)' }}>
              Aspect Ratio:
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
              ({isSquare ? '1:1 Square' : '1900×650 Banner'})
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Banner 1900x650 Button */}
            <button
              type="button"
              onClick={() => {
                setCurrentAspect(1900 / 650);
                setZoom(1);
                setCrop({ x: 0, y: 0 });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.42rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: isBanner ? 'var(--color-forest)' : '#ffffff',
                color: isBanner ? '#ffffff' : '#334155',
                border: isBanner ? '1px solid var(--color-forest)' : '1px solid #cbd5e1',
                boxShadow: isBanner ? '0 2px 8px rgba(15, 41, 30, 0.2)' : '0 1px 2px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <RectangleHorizontal size={14} />
              <span>1900×650 (Hero Banner)</span>
              {isBanner && <Check size={13} style={{ marginLeft: '2px' }} />}
            </button>

            {/* Product & Category 1:1 Square Button */}
            <button
              type="button"
              onClick={() => {
                setCurrentAspect(1);
                setZoom(1);
                setCrop({ x: 0, y: 0 });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.42rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: isSquare ? 'var(--color-forest)' : '#ffffff',
                color: isSquare ? '#ffffff' : '#334155',
                border: isSquare ? '1px solid var(--color-forest)' : '1px solid #cbd5e1',
                boxShadow: isSquare ? '0 2px 8px rgba(15, 41, 30, 0.2)' : '0 1px 2px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Square size={13} />
              <span>1:1 Square (Product & Category)</span>
              {isSquare && <Check size={13} style={{ marginLeft: '2px' }} />}
            </button>
          </div>
        </div>

        {/* Cropper Container Area */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '380px',
            backgroundColor: '#0a0f1d',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
            border: '1px solid #1e293b',
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          padding: '0.5rem 0.9rem',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', minWidth: '45px' }}>
            Zoom:
          </span>

          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))}
            style={iconBtnStyle}
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.05}
            aria-label="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{
              flex: 1,
              accentColor: 'var(--color-forest)',
              cursor: 'pointer',
              height: '6px',
            }}
          />

          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, +(z + 0.2).toFixed(2)))}
            style={iconBtnStyle}
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>

          <span style={{
            fontSize: '0.74rem',
            fontWeight: 800,
            color: '#1e293b',
            backgroundColor: '#ffffff',
            padding: '0.2rem 0.5rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            minWidth: '48px',
            textAlign: 'center',
          }}>
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setCrop({ x: 0, y: 0 });
            }}
            style={iconBtnStyle}
            title="Reset Zoom & Position"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.25rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.65rem 1.35rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={createCroppedImage}
            disabled={isProcessing}
            style={{
              padding: '0.65rem 1.6rem',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              backgroundColor: 'var(--color-forest)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: isProcessing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(15, 41, 30, 0.28)',
              opacity: isProcessing ? 0.75 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Cropping & Saving...</span>
              </>
            ) : (
              <>
                <CropIcon size={16} />
                <span>Apply Crop & Save</span>
              </>
            )}
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
  backgroundColor: '#ffffff',
  border: '1px solid #cbd5e1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#334155',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
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

  return canvas.toDataURL('image/jpeg', 0.85);
}
