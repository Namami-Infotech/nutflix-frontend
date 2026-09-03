'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { MasterBanner } from '@/types';
import { Pencil, Image as ImageIcon, Sparkles, Check, Upload, Info } from 'lucide-react';
import { uploadImage } from '@/lib/api';
import { ImageCropperModal } from '@/components/ui/ImageCropperModal';
interface EditBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner: MasterBanner;
  onSave: (updatedBanner: MasterBanner) => void;
}



export const EditBannerModal: React.FC<EditBannerModalProps> = ({
  isOpen,
  onClose,
  banner,
  onSave,
}) => {
  const [formData, setFormData] = useState<MasterBanner>(banner);

  // Image Cropper State
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  useEffect(() => {
    setFormData(banner);
  }, [banner, isOpen]);

  const handleChange = (field: keyof MasterBanner, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please choose a smaller image (under 5MB).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setCropperImageSrc(reader.result as string);
          setIsCropperOpen(true);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedData = { ...formData };
    if (updatedData.imageUrl && updatedData.imageUrl.startsWith('data:')) {
      const uploadRes = await uploadImage(updatedData.imageUrl);
      if (uploadRes.success && uploadRes.url) {
        updatedData.imageUrl = uploadRes.url;
      }
    }
    onSave(updatedData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Hero Banner" maxWidth="720px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Top Notification / Tip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: 'rgba(200, 157, 102, 0.12)',
            border: '1px solid var(--color-gold)',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            color: 'var(--color-forest)',
            fontSize: '0.88rem',
          }}
        >
          <Sparkles size={18} color="var(--color-gold-dark)" />
          <span>Update text, upload banner image, or adjust buttons for this hero banner slide.</span>
        </div>

        {/* Section 1: Main Banner Content */}
        <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.25rem', borderRadius: '16px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '1rem' }}>
            Main Header & Copy
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Badge Text</label>
              <input
                type="text"
                value={formData.badgeText || ''}
                onChange={(e) => handleChange('badgeText', e.target.value)}
                placeholder="e.g. Ethical Tanzanian Produce"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Highlight Text (Gold Color)</label>
              <input
                type="text"
                value={formData.highlightText || ''}
                onChange={(e) => handleChange('highlightText', e.target.value)}
                placeholder="e.g. Fuel the Change."
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Main Title Headline</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Taste the Difference,"
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* Section 2: Call to Actions */}
        <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.25rem', borderRadius: '16px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '1rem' }}>
            Call to Action Buttons
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Primary CTA Text</label>
              <input
                type="text"
                value={formData.ctaText || ''}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                placeholder="e.g. Shop Premium Produce"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Primary CTA Link</label>
              <input
                type="text"
                value={formData.ctaLink || ''}
                onChange={(e) => handleChange('ctaLink', e.target.value)}
                placeholder="e.g. #products"
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Secondary CTA Text (Optional)</label>
              <input
                type="text"
                value={formData.secondaryCtaText || ''}
                onChange={(e) => handleChange('secondaryCtaText', e.target.value)}
                placeholder="e.g. Discover Our Impact"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Secondary CTA Link</label>
              <input
                type="text"
                value={formData.secondaryCtaLink || ''}
                onChange={(e) => handleChange('secondaryCtaLink', e.target.value)}
                placeholder="e.g. /impact"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Visual Image & Featured Card */}
        <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.25rem', borderRadius: '16px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ImageIcon size={18} /> Right Visual & Featured Card Image
          </h4>

          {/* Direct Local Image Upload Zone */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Upload Banner Image from Computer / Phone</label>
            <div
              style={{
                border: '2px dashed var(--color-gold)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '14px',
                padding: '1.25rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                id="banner-image-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="banner-image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem' }}>
                <Upload size={26} color="var(--color-forest)" />
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-forest)' }}>
                  Click here to Upload Banner Image
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(200, 157, 102, 0.15)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-pill)', marginTop: '0.2rem' }}>
                  <Info size={14} color="var(--color-gold-dark)" />
                  Recommended Dimensions: <strong>1200 × 800 px</strong> (Aspect Ratio 3:2, Max Size: 5MB)
                </span>
              </label>
            </div>
          </div>

          {/* Active Image Preview */}
          {formData.imageUrl && (
            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.8rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
                <img
                  src={formData.imageUrl}
                  alt="Banner Preview"
                  style={{ width: '110px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--color-border)', flexShrink: 0 }}
                />
                <div style={{ overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-forest)', display: 'block' }}>Active Banner Image (Full Widescreen)</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block', maxWidth: '300px' }}>
                    {formData.imageUrl.startsWith('data:') ? 'Uploaded File from Device (Base64 Data)' : formData.imageUrl}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCropperImageSrc(formData.imageUrl);
                  setIsCropperOpen(true);
                }}
                style={{
                  backgroundColor: 'var(--color-cream-light)',
                  color: 'var(--color-forest)',
                  border: '1px solid var(--color-gold)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Crop / Adjust
              </button>
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Or Enter Direct Image URL</label>
            <input
              type="url"
              value={formData.imageUrl || ''}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder="https://images.unsplash.com/..."
              style={inputStyle}
              required
            />
          </div>



          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Featured Badge</label>
              <input
                type="text"
                value={formData.featuredBadge || ''}
                onChange={(e) => handleChange('featuredBadge', e.target.value)}
                placeholder="e.g. Featured Harvest"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Featured Title</label>
              <input
                type="text"
                value={formData.featuredTitle || ''}
                onChange={(e) => handleChange('featuredTitle', e.target.value)}
                placeholder="e.g. Jumbo Roasted Tanzanian Cashews"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Featured Subtitle</label>
            <input
              type="text"
              value={formData.featuredSubtitle || ''}
              onChange={(e) => handleChange('featuredSubtitle', e.target.value)}
              placeholder="e.g. Harvested by women farmers in Mtwara"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-border)',
              backgroundColor: '#ffffff',
              color: 'var(--color-text)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            style={{
              padding: '0.65rem 1.6rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Pencil size={16} />
            <span>Save Banner Changes</span>
          </button>
        </div>
      </form>

      {/* Banner Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={cropperImageSrc}
        aspect={1900 / 650}
        title="Crop Hero Banner Image (1900×650)"
        onCropComplete={(croppedDataUrl: string) => {
          handleChange('imageUrl', croppedDataUrl);
        }}
      />
    </Modal>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: 700,
  color: 'var(--color-forest)',
  marginBottom: '0.3rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.85rem',
  borderRadius: '10px',
  border: '1px solid var(--color-border)',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  backgroundColor: '#ffffff',
};
