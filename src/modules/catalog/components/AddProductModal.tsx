'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Product, Category } from '@/types';
import { PlusCircle, Image as ImageIcon, Sparkles, Check, Upload, Info } from 'lucide-react';

import { uploadImage, formatWeightAndUnit } from '@/lib/api';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddProduct: (newProduct: Product) => void;
}



import { ImageCropperModal } from '@/components/ui/ImageCropperModal';

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddProduct,
}) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 1);
  const [price, setPrice] = useState('9.99');
  const [weight, setWeight] = useState('250g');
  const [origin, setOrigin] = useState('Mtwara, Tanzania');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [impactDescription, setImpactDescription] = useState('');
  const [stock, setStock] = useState(100);
  const [isFeatured, setIsFeatured] = useState(true);

  // Image Cropper state
  const [cropperImageSrc, setCropperImageSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB limit. Please choose a smaller image.');
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
    let finalImageUrl = imageUrl;
    if (finalImageUrl.startsWith('data:')) {
      const uploadRes = await uploadImage(finalImageUrl);
      if (uploadRes.success && uploadRes.url) {
        finalImageUrl = uploadRes.url;
      }
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct: Product = {
      id: Date.now(),
      categoryId: Number(categoryId),
      name: name.trim(),
      slug,
      description: description || 'Freshly harvested artisanal Tanzanian produce, sourced directly with fair pay for local farming communities.',
      price: price.startsWith('₹') || price.startsWith('$') ? price.slice(1) : price,
      origin: origin || 'Tanzania',
      weight: formatWeightAndUnit(weight),
      impactDescription: impactDescription || 'Directly empowers local Tanzanian farmers and supports rural community development.',
      imageUrl: finalImageUrl,
      stock: Number(stock) || 50,
      rating: '5.00',
      reviewCount: 1,
      isFeatured,
    };

    onAddProduct(newProduct);
    onClose();

    // Reset form
    setName('');
    setDescription('');
    setImpactDescription('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Product" maxWidth="680px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
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
          <span>Add a new organic product or harvest collection item to your catalog.</span>
        </div>

        {/* Basic Info */}
        <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.25rem', borderRadius: '16px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '1rem' }}>
            Product Details
          </h4>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Swahili Cinnamon & Roasted Almonds"
              style={inputStyle}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Price (₹) *</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="11.99"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Weight / Pack Size</label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 250g"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Origin Location</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Pemba Island, Zanzibar"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Initial Stock Quantity</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                placeholder="100"
                style={inputStyle}
                min={0}
              />
            </div>
          </div>
        </div>

        {/* Product Media */}
        <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.25rem', borderRadius: '16px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ImageIcon size={18} /> Product Image Upload
          </h4>

          {/* Local File Upload Zone */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Upload Image from Device</label>
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
                id="product-image-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="product-image-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem' }}>
                <Upload size={26} color="var(--color-forest)" />
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-forest)' }}>
                  Click here to Upload Product Image
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(200, 157, 102, 0.15)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-pill)', marginTop: '0.2rem' }}>
                  <Info size={14} color="var(--color-gold-dark)" />
                  Recommended Dimensions: <strong>800 × 800 px</strong> (Square 1:1, Max Size: 3MB)
                </span>
              </label>
            </div>
          </div>

          {/* Active Image Preview */}
          {imageUrl && (
            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.8rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden' }}>
                <img
                  src={imageUrl}
                  alt="Product Preview"
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--color-border)', flexShrink: 0 }}
                />
                <div style={{ overflow: 'hidden' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-forest)', display: 'block' }}>Selected Product Image (1:1 Square)</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block', maxWidth: '300px' }}>
                    {imageUrl.startsWith('data:') ? 'Uploaded File from Device (Base64 Data)' : imageUrl}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCropperImageSrc(imageUrl);
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
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              style={inputStyle}
              required
            />
          </div>


        </div>

        {/* Descriptions & Impact */}
        <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.25rem', borderRadius: '16px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '1rem' }}>
            Description & Impact Statement
          </h4>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Product Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of taste, texture, and harvest notes..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Community & Social Impact</label>
            <input
              type="text"
              value={impactDescription}
              onChange={(e) => setImpactDescription(e.target.value)}
              placeholder="e.g. Directly funds 3 days of clean water access for local village schools."
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              id="isFeaturedCheck"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-forest)', cursor: 'pointer' }}
            />
            <label htmlFor="isFeaturedCheck" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-forest)', cursor: 'pointer' }}>
              Mark as Featured Product (Highlight on Homepage)
            </label>
          </div>
        </div>

        {/* Form Controls */}
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
            <PlusCircle size={18} />
            <span>Add Product to Catalog</span>
          </button>
        </div>

      </form>

      {/* Product Image Cropper Modal (Enforcing 1:1 Square) */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={cropperImageSrc}
        aspect={1}
        title="Crop Product Image (1:1 Square)"
        onCropComplete={(croppedDataUrl) => {
          setImageUrl(croppedDataUrl);
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
