'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/modules/cart';
import {
  submitOrder,
  uploadImage,
  formatPrice,
} from '@/lib/api';
import {
  ArrowLeft,
  CheckCircle2,
  UploadCloud,
  Loader2,
  AlertCircle,
  QrCode,
  PackageCheck,
  X,
  Camera,
} from 'lucide-react';

export default function PayQrPage() {
  const router = useRouter();
  const { clearCart } = useCart();

  const [mounted, setMounted] = useState<boolean>(false);
  const [orderDraft, setOrderDraft] = useState<any>(null);
  const [qrScreenshotFile, setQrScreenshotFile] = useState<File | null>(null);
  const [qrScreenshotPreview, setQrScreenshotPreview] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [orderComplete, setOrderComplete] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('pending_qr_order');
        if (stored) {
          setOrderDraft(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to parse pending QR order:', err);
      }
    }
  }, []);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File size exceeds 10MB limit.');
        return;
      }
      setErrorMessage('');
      setQrScreenshotFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setQrScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // reset input value so re-selecting the same file/retaking photo triggers change
    e.target.value = '';
  };

  const handleRemoveScreenshot = () => {
    setQrScreenshotFile(null);
    setQrScreenshotPreview('');
  };

  const handleCompleteQrPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!qrScreenshotFile) {
      setErrorMessage('Please upload a screenshot or take a photo of your payment confirmation.');
      return;
    }

    if (!orderDraft || !orderDraft.orderPayload) {
      setErrorMessage('Order details not found. Please return to checkout and try again.');
      return;
    }

    setLoading(true);

    try {
      // 1. Upload screenshot to backend/uploads/QR
      const uploadRes = await uploadImage(qrScreenshotFile, 'QR');
      if (!uploadRes.success || !uploadRes.url) {
        setLoading(false);
        setErrorMessage(uploadRes.message || 'Failed to upload payment screenshot. Please try again.');
        return;
      }

      // 2. Submit order with QR payment and screenshot URL (No UTR field)
      const res = await submitOrder({
        ...orderDraft.orderPayload,
        paymentType: 'qr',
        paymentMethod: 'Pay with QR Code',
        paymentScreenshot: uploadRes.url,
      });

      setLoading(false);

      if (res.success && res.data) {
        setOrderComplete(res.data);
        clearCart();
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('pending_qr_order');
        }
      } else {
        setErrorMessage(res.message || 'Failed to place QR Code order.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || 'Error processing QR Code payment order.');
    }
  };

  if (!mounted) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-forest)" />
      </div>
    );
  }

  // Order Confirmed State
  if (orderComplete) {
    return (
      <div style={{ minHeight: '80vh', backgroundColor: '#fcf8f2', padding: '3.5rem 1rem' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '2.5rem 1.75rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
              border: '1px solid #e2d5c3',
            }}
          >
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: 'rgba(200, 157, 102, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <CheckCircle2 size={42} color="var(--color-forest)" />
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-forest)', margin: '0 0 0.5rem' }}>
              Order Placed Successfully!
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Thank you, <strong>{orderComplete.customerName}</strong>! Your order number is{' '}
              <strong style={{ color: 'var(--color-forest)' }}>
                #{orderComplete.orderNumber || orderComplete.customId || orderComplete.id}
              </strong>.
            </p>

            <div
              style={{
                backgroundColor: '#f8faf8',
                borderRadius: '16px',
                border: '1px solid #d1e7dd',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0f5132', fontWeight: 800, fontSize: '0.92rem' }}>
                <PackageCheck size={18} /> Payment Screenshot Uploaded
              </div>
              <p style={{ fontSize: '0.82rem', color: '#555', margin: '0 0 0.85rem' }}>
                Our verification team will confirm your UPI payment proof shortly and dispatch your package.
              </p>

              {orderComplete.paymentScreenshot && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={orderComplete.paymentScreenshot}
                    alt="Payment Screenshot Proof"
                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #ccc' }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#666' }}>Screenshot attached to order record</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/profile"
                style={{
                  backgroundColor: 'var(--color-forest)',
                  color: '#ffffff',
                  padding: '0.8rem 1.6rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                View My Orders
              </Link>
              <Link
                href="/"
                style={{
                  backgroundColor: '#ffffff',
                  color: 'var(--color-forest)',
                  border: '1.5px solid var(--color-forest)',
                  padding: '0.8rem 1.6rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalAmount = orderDraft?.totalAmount || 0;
  const items = orderDraft?.items || [];
  const shippingAddress = orderDraft?.shippingAddress;

  return (
    <div style={{ minHeight: '92vh', backgroundColor: '#fcf8f2', padding: '1.75rem 1rem 3.5rem' }}>
      <style>{`
        .pay-qr-wrapper {
          max-width: 1040px;
          margin: 0 auto;
        }
        .pay-qr-grid {
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          gap: 1.75rem;
          align-items: stretch;
        }
        .pay-qr-card {
          background-color: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2d5c3;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
        }
        .pay-qr-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px dashed #cbd5e1;
          border-radius: 14px;
          padding: 1.75rem 1rem;
          background-color: #fafaf9;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }
        .pay-qr-dropzone:hover {
          border-color: var(--color-forest);
          background-color: #f7faf7;
        }
        @media (max-width: 880px) {
          .pay-qr-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .pay-qr-card {
            padding: 1.4rem 1.15rem;
          }
        }
      `}</style>

      <div className="pay-qr-wrapper">
        {/* Top bar with Back Link & Secure Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <Link
            href="/checkout"
            style={{
              textDecoration: 'none',
              color: 'var(--color-forest)',
              fontWeight: 800,
              fontSize: '0.88rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#ffffff',
              padding: '0.45rem 0.9rem',
              borderRadius: '20px',
              border: '1px solid #e2d5c3',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <ArrowLeft size={16} /> Back to Checkout
          </Link>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="pay-qr-grid">
          {/* Left Column: QR Code & Payment Instructions */}
          <div className="pay-qr-card" style={{ textAlign: 'center' }}>
            {/* Header */}
            <div style={{ marginBottom: '1.15rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(200, 157, 102, 0.15)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-forest)',
                  marginBottom: '0.6rem',
                }}
              >
                <QrCode size={26} />
              </div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-forest)', margin: '0 0 0.25rem' }}>
                Scan UPI QR Code
              </h1>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Scan using Google Pay, PhonePe, Paytm or any UPI app
              </p>

              {/* Amount Badge */}
              <div
                style={{
                  display: 'inline-block',
                  marginTop: '0.85rem',
                  padding: '0.5rem 1.35rem',
                  borderRadius: '30px',
                  backgroundColor: 'var(--color-forest)',
                  color: 'var(--color-gold)',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  letterSpacing: '0.3px',
                  boxShadow: '0 3px 10px rgba(22, 35, 26, 0.15)',
                }}
              >
                Amount to Pay: ₹{formatPrice(totalAmount)}
              </div>
            </div>

            {/* QR Box */}
            <div
              style={{
                backgroundColor: '#fbfcf9',
                border: '1.5px dashed var(--color-gold)',
                borderRadius: '16px',
                padding: '1.15rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.15rem',
              }}
            >
              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 3px 12px rgba(0,0,0,0.06)',
                  border: '1px solid #f1f5f9',
                  marginBottom: '0.85rem',
                }}
              >
                <img
                  src="/images/qr-code.jpg"
                  alt="UPI QR Code"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/qr-1789384287719-24192059.jpg';
                  }}
                  style={{
                    width: '185px',
                    height: '185px',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>

              {/* Supported Apps */}
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                Accepted UPI Apps:
              </div>
           
            </div>

            {/* Micro Steps */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                padding: '0.75rem 0.9rem',
                textAlign: 'left',
                fontSize: '0.78rem',
                color: '#475569',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
                border: '1px solid #e2e8f0',
              }}
            >
              <div><strong>Step 1:</strong> Scan QR code with any UPI app & complete ₹{formatPrice(totalAmount)}.</div>
              <div><strong>Step 2:</strong> Take a screenshot or capture photo of the payment confirmation.</div>
              <div><strong>Step 3:</strong> Upload image from gallery or capture with camera to place your order.</div>
            </div>
          </div>

          {/* Right Column: Order Summary & Screenshot Upload Form */}
          <div className="pay-qr-card">
            {/* Order Summary Snippet */}
            <div
              style={{
                backgroundColor: '#fbfcf9',
                border: '1px solid #e2d5c3',
                borderRadius: '14px',
                padding: '1rem 1.15rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-forest)' }}>
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--color-forest)' }}>
                  ₹{formatPrice(totalAmount)}
                </span>
              </div>

              {shippingAddress && (
                <div style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: '1.4' }}>
                  <strong>Delivering to:</strong> {shippingAddress.fullName || orderDraft?.customerName} • {shippingAddress.city}, {shippingAddress.state || ''} - {shippingAddress.postalCode}
                </div>
              )}
            </div>

            <form onSubmit={handleCompleteQrPayment} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ marginBottom: '1.25rem', flex: 1 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: 'var(--color-forest)',
                    marginBottom: '0.25rem',
                  }}
                >
                  Upload Payment Screenshot or Photo <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 0.75rem' }}>
                  Upload transaction screenshot from your gallery or use camera to snap payment proof.
                </p>

                {qrScreenshotPreview ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.9rem 1.1rem',
                      backgroundColor: '#f0fdf4',
                      borderRadius: '14px',
                      border: '1.5px solid #22c55e',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img
                        src={qrScreenshotPreview}
                        alt="Payment Proof Preview"
                        style={{
                          width: '58px',
                          height: '58px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid #bbf7d0',
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#166534', fontWeight: 800, fontSize: '0.86rem' }}>
                          <CheckCircle2 size={16} color="#16a34a" /> Payment Proof Attached
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#15803d' }}>
                          Ready to verify & place order
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveScreenshot}
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.45rem 0.75rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <X size={14} /> Change / Remove
                    </button>
                  </div>
                ) : (
                  <label className="pay-qr-dropzone">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif,image/*"
                      onChange={handleScreenshotChange}
                      style={{ display: 'none' }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.65rem',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(200, 157, 102, 0.16)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-forest)',
                        }}
                      >
                        <UploadCloud size={24} />
                      </div>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(22, 35, 26, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-forest)',
                        }}
                      >
                        <Camera size={22} />
                      </div>
                    </div>

                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '0.35rem' }}>
                      Upload Screenshot or Open Camera
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.4rem' }}>
                      Click or tap to choose screenshot from gallery or take photo with camera
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Supports JPG, PNG, WEBP (Max 10MB)
                    </span>
                  </label>
                )}
              </div>

              {errorMessage && (
                <div
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecdd3',
                    borderRadius: '12px',
                    padding: '0.75rem 0.9rem',
                    fontSize: '0.82rem',
                    color: '#991b1b',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !qrScreenshotFile}
                style={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: !qrScreenshotFile ? '#e2e8f0' : 'var(--color-forest)',
                  color: !qrScreenshotFile ? '#94a3b8' : '#ffffff',
                  fontWeight: 800,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: !qrScreenshotFile || loading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: qrScreenshotFile && !loading ? '0 4px 16px rgba(22, 35, 26, 0.22)' : 'none',
                  transition: 'all 0.2s ease',
                  marginTop: 'auto',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Uploading Proof & Placing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Confirm Payment & Place Order</span>
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.72rem', color: '#94a3b8' }}>
                Your order is confirmed immediately upon submitting proof.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
