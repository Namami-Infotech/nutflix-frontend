'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/modules/cart';
import { submitOrder, fetchPaymentTypes, PaymentType, getAuthToken, createRazorpayOrder, verifyRazorpayPayment, getRazorpayKey } from '@/lib/api';
import { useAuth } from '@/modules/auth';
import { ShoppingBag, ShieldCheck, CheckCircle2, ArrowRight, Truck, CreditCard, Banknote, User, Lock, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Dynamically load Razorpay standard Checkout script
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const CheckoutForm: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { isLoggedIn, user, openLoginModal } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>('online');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      if (user.name && !customerName) setCustomerName(user.name);
      if (user.email && !customerEmail) setCustomerEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    // Preload Razorpay SDK script in the background
    loadRazorpayScript();

    async function loadPayments() {
      try {
        const types = await fetchPaymentTypes();
        const active = (types || []).filter((t) => t.status === 'active');
        setPaymentTypes(active);
        if (active.length > 0) {
          setSelectedPayment((prev) => (active.some((t) => t.code === prev) ? prev : active[0].code));
        } else {
          setSelectedPayment('');
        }
      } catch (err) {
        console.error('Error loading payment types:', err);
      }
    }
    loadPayments();
  }, []);

  const shippingCost = subtotal >= 30 ? 0 : 3.99;
  const totalAmount = subtotal + shippingCost;
  const isOnlineActive = paymentTypes.some((t) => t.code === 'online');
  const isCashActive = paymentTypes.some((t) => t.code === 'cash');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setErrorMessage('');

    if (!selectedPayment) {
      setErrorMessage('Please select a payment method.');
      return;
    }

    const fullAddress = `${shippingAddress.trim()}, ${city.trim()}, ${postalCode.trim()}`;

    const orderPayload = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      shippingAddress: fullAddress,
      paymentType: selectedPayment,
      totalAmount,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: parseFloat(item.product.price),
        name: item.product.name,
        imageUrl: item.product.imageUrl,
      })),
    };

    // If Cash on Delivery is selected
    if (selectedPayment === 'cash') {
      setLoading(true);
      try {
        const res = await submitOrder(orderPayload);
        setLoading(false);
        if (res.success && res.data) {
          setOrderComplete(res.data);
          clearCart();
        } else {
          setErrorMessage(res.message || 'Failed to place Cash on Delivery order.');
        }
      } catch (err: any) {
        setLoading(false);
        setErrorMessage(err?.message || 'Error processing COD order.');
      }
      return;
    }

    // Razorpay Online Gateway Checkout Flow
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !(window as any).Razorpay) {
      setLoading(false);
      setErrorMessage('Unable to load Razorpay payment gateway. Please check your internet connection or try again.');
      return;
    }

    try {
      // 1. Create Razorpay Order on Backend
      const orderRes = await createRazorpayOrder({
        amount: totalAmount,
        currency: 'INR',
        receipt: `nutflix_${Date.now()}`,
        notes: {
          customerName: orderPayload.customerName,
          customerEmail: orderPayload.customerEmail,
          address: fullAddress,
        },
      });

      if (!orderRes || (!orderRes.id && !orderRes.data?.id)) {
        setLoading(false);
        setErrorMessage(orderRes?.message || 'Could not initialize payment with Razorpay.');
        return;
      }

      const rzpOrderData = orderRes.data || orderRes;
      const keyId = rzpOrderData.keyId || (await getRazorpayKey()) || 'rzp_test_RqJtOyGfDiW0vw';

      // 2. Configure Razorpay Standard Checkout options
      const options = {
        key: keyId,
        amount: rzpOrderData.amount, // in paise
        currency: rzpOrderData.currency || 'INR',
        name: 'Nutflix Tanzania',
        description: `Order Checkout (₹${totalAmount.toFixed(2)})`,
        order_id: rzpOrderData.id,
        prefill: {
          name: customerName,
          email: customerEmail,
        },
        theme: {
          color: '#1b4332',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            setLoading(true);
            // 3. Verify Razorpay Payment Signature on Backend & Confirm Order
            const verifyRes = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: orderPayload,
            });

            setLoading(false);
            if (verifyRes && (verifyRes.success || verifyRes.data)) {
              setOrderComplete(verifyRes.data || verifyRes);
              clearCart();
            } else {
              setErrorMessage(verifyRes?.message || 'Payment verification failed. Please contact support if your account was charged.');
            }
          } catch (err: any) {
            setLoading(false);
            setErrorMessage(err?.message || 'Error confirming payment verification.');
          }
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      razorpayInstance.on('payment.failed', (response: any) => {
        setLoading(false);
        setErrorMessage(response?.error?.description || 'Payment was unsuccessful or cancelled by user.');
      });

      razorpayInstance.open();
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || 'An unexpected error occurred during Razorpay checkout.');
    }
  };

  if (!mounted) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ padding: '3rem 2rem', backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Loader2 size={32} className="animate-spin" color="var(--color-forest)" />
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Loading checkout securely...</p>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', maxWidth: '640px', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2.5rem 1.5rem',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-gold-light)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <CheckCircle2 size={42} color="var(--color-gold)" />
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.6rem' }}>
            Asante Sana! Order Confirmed
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Thank you, <strong>{orderComplete.customerName}</strong>! Your order number is{' '}
            <strong style={{ color: 'var(--color-forest)' }}>#{orderComplete.orderNumber || orderComplete.customId || orderComplete.id}</strong>.
          </p>

          {(orderComplete.transactionId || orderComplete.razorpayPaymentId) && (
            <div
              style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #10b981',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                color: '#065f46',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}
            >
              ✅ <strong>Transaction ID:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{orderComplete.transactionId || orderComplete.razorpayPaymentId}</span>
            </div>
          )}

          <div
            style={{
              backgroundColor: 'var(--color-cream-light)',
              padding: '1.2rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              color: 'var(--color-forest)',
              marginBottom: '2rem',
              textAlign: 'left',
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: '0.4rem' }}>🌟 Impact Created with this Order:</div>
            <div>• Directly supported smallholder farmer households</div>
            <div>• Funded sustainable community farming in Tanzania</div>
          </div>

          <Link href="/" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <span>Continue Shopping</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const token = getAuthToken();
  const authenticated = Boolean(token || isLoggedIn);
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  if (isAdmin) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', maxWidth: '600px', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '3rem 2rem',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              border: '2px solid #ef4444',
            }}
          >
            <ShieldCheck size={36} color="#dc2626" />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.6rem' }}>
            Checkout Disabled for Admin
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
            You are currently logged in as an <strong>Administrator ({user?.email})</strong>. Placing customer orders is disabled for admin accounts. You can manage existing orders and products in the Admin Dashboard.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              href="/admin"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '0.95rem', borderRadius: '12px', textDecoration: 'none' }}
            >
              <span>Go to Admin Dashboard</span>
              <ArrowRight size={18} />
            </Link>

            <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--color-forest)', fontWeight: 700, textDecoration: 'underline', marginTop: '0.5rem' }}>
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', maxWidth: '580px', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '3rem 2rem',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(200, 157, 102, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              border: '2px solid var(--color-gold)',
            }}
          >
            <Lock size={32} color="var(--color-forest)" />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.6rem' }}>
            Sign In Required for Checkout
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Please sign in or create an account to securely complete your order, receive instant tracking, and access your order history.
          </p>

          <button
            type="button"
            onClick={() => openLoginModal(undefined, 'Please sign in or create an account to proceed to checkout.')}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem', borderRadius: '14px', marginBottom: '1rem' }}
          >
            <User size={18} />
            <span>Sign In / Create Account</span>
            <ArrowRight size={18} />
          </button>

          <div>
            <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--color-forest)', fontWeight: 700, textDecoration: 'underline' }}>
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '1rem' }}>
          Your Basket is Empty
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Add some delicious ethical Tanzanian cashews, coffee, or honey before checking out.
        </p>
        <Link href="/" className="btn-primary">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '1.8rem' }}>
        Secure Checkout
      </h1>

      {errorMessage && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1.5px solid #ef4444',
            padding: '1rem 1.25rem',
            borderRadius: '14px',
            color: '#b91c1c',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <AlertCircle size={22} style={{ flexShrink: 0 }} />
          <div>{errorMessage}</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2.5rem', alignItems: 'flex-start' }}>
        {/* Form Left */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '24px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '1.25rem' }}>
            1. Contact & Shipping Details
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="jane@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                Street Address *
              </label>
              <input
                type="text"
                required
                placeholder="123 Kindness Way"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: '1 1 140px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="London / Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.95rem' }}
                />
              </div>
              <div style={{ flex: '1 1 140px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.4rem' }}>
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="400001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.95rem' }}
                />
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-forest)', marginTop: '1.8rem', marginBottom: '1rem' }}>
            2. Select Payment Method
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
            {/* Razorpay Online Option */}
            {isOnlineActive && (
              <div
                onClick={() => setSelectedPayment('online')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.15rem',
                  borderRadius: '14px',
                  border: selectedPayment === 'online' ? '2px solid var(--color-gold)' : '1.5px solid var(--color-border)',
                  backgroundColor: selectedPayment === 'online' ? 'var(--color-gold-light)' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="radio"
                  name="paymentType"
                  checked={selectedPayment === 'online'}
                  onChange={() => setSelectedPayment('online')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-gold)', cursor: 'pointer' }}
                />
                <CreditCard size={26} color="var(--color-forest)" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--color-forest)' }}>
                      Razorpay Secure Payment
                    </span>
                    <span style={{ backgroundColor: '#2563eb', color: '#ffffff', fontSize: '0.68rem', fontWeight: 800, padding: '2px 7px', borderRadius: '6px' }}>
                      UPI / Cards / NetBanking
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Pay securely via Google Pay, PhonePe, Paytm, BHIM, Cards & NetBanking
                  </div>
                </div>
              </div>
            )}

            {/* Cash on Delivery Option */}
            {isCashActive && (
              <div
                onClick={() => setSelectedPayment('cash')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.15rem',
                  borderRadius: '14px',
                  border: selectedPayment === 'cash' ? '2px solid var(--color-gold)' : '1.5px solid var(--color-border)',
                  backgroundColor: selectedPayment === 'cash' ? 'var(--color-gold-light)' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="radio"
                  name="paymentType"
                  checked={selectedPayment === 'cash'}
                  onChange={() => setSelectedPayment('cash')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-gold)', cursor: 'pointer' }}
                />
                <Banknote size={26} color="var(--color-forest)" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--color-forest)' }}>
                    Cash on Delivery (COD)
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Pay with cash upon delivery at your doorstep
                  </div>
                </div>
              </div>
            )}

            {/* No active payment methods alert */}
            {!isOnlineActive && !isCashActive && (
              <div style={{ padding: '1rem 1.2rem', borderRadius: '14px', border: '1.5px dashed #fca5a5', backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <AlertCircle size={20} />
                <span>Currently no payment methods are enabled. Please contact support.</span>
              </div>
            )}
          </div>

          {isOnlineActive && (
            <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', fontSize: '0.82rem', color: '#1e40af', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={16} />
              <span>256-Bit SSL Encrypted & Secured by Razorpay Gateway</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isAdmin || !selectedPayment}
            className="btn-primary"
            style={{
              width: '100%',
              height: '52px',
              fontSize: '1rem',
              fontWeight: 800,
              justifyContent: 'center',
              backgroundColor: isAdmin || !selectedPayment ? '#e2e8f0' : undefined,
              color: isAdmin || !selectedPayment ? '#94a3b8' : undefined,
              cursor: isAdmin || !selectedPayment ? 'not-allowed' : 'pointer',
              border: isAdmin || !selectedPayment ? '1px solid #cbd5e1' : undefined,
              boxShadow: isAdmin || !selectedPayment ? 'none' : undefined,
              gap: '0.6rem',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : isAdmin ? (
              'Admin (Cannot Place Order)'
            ) : !selectedPayment ? (
              'No Payment Method Available'
            ) : selectedPayment === 'online' ? (
              <>
                <CreditCard size={18} />
                <span>Pay with Razorpay • ₹{totalAmount.toFixed(2)}</span>
              </>
            ) : (
              <>
                <Banknote size={18} />
                <span>Place COD Order • ₹{totalAmount.toFixed(2)}</span>
              </>
            )}
          </button>
        </form>

        {/* Summary Right */}
        <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.75rem', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '1.2rem' }}>
            Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
            {items.map((item) => (
              <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-forest)' }}>{item.product.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Qty: {item.quantity} × ₹{parseFloat(item.product.price).toFixed(2)}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-forest)' }}>
                  ₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
              <span>Shipping</span>
              <span>{shippingCost === 0 ? <strong style={{ color: '#276749' }}>FREE</strong> : `₹${shippingCost.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 900, color: 'var(--color-forest)', paddingTop: '0.6rem', borderTop: '1px solid var(--color-border)' }}>
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
