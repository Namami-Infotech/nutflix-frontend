'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/modules/cart';
import {
  submitOrder,
  fetchPaymentTypes,
  PaymentType,
  Address,
  fetchMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getAuthToken,
  getUserFromCookie,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKey,
  getProductPrices,
  formatPrice,
} from '@/lib/api';
import { useAuth } from '@/modules/auth';
import {
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Truck,
  CreditCard,
  Banknote,
  User,
  Lock,
  AlertCircle,
  Loader2,
  Sparkles,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import Link from 'next/link';

import { AddressModal } from './AddressModal';

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
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>('online');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  // Address Selection & Dialog Modal States
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [addressToEdit, setAddressToEdit] = useState<Address | null>(null);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type?: 'error' | 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    if (addr.fullName) setCustomerName(addr.fullName);
    if (addr.phone) setCustomerPhone(addr.phone);
    if (addr.streetAddress) setShippingAddress(addr.streetAddress);
    if (addr.city) setCity(addr.city);
    if (addr.postalCode) setPostalCode(addr.postalCode);
  };

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const list = await fetchMyAddresses();
      const activeList = (list || []).filter((a) => !a.isDeleted);
      setSavedAddresses(activeList);

      if (activeList.length > 0) {
        // By default, pre-select the default address or first address
        const chosen = activeList.find((a) => a.isDefault) || activeList[0];
        handleSelectAddress(chosen);
      } else {
        const currentUser = user || getUserFromCookie();
        if (currentUser) {
          if (currentUser.name) setCustomerName((prev) => prev || currentUser.name || '');
          if (currentUser.email) setCustomerEmail((prev) => prev || currentUser.email || '');
          if (currentUser.phone) setCustomerPhone((prev) => prev || currentUser.phone || '');
          if (currentUser.address) setShippingAddress((prev) => prev || currentUser.address || '');
        }
      }
    } catch (err) {
      console.error('Error loading addresses:', err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    const currentUser = user || getUserFromCookie();
    if (currentUser?.email) {
      setCustomerEmail((prev) => prev || currentUser.email || '');
    }
    loadAddresses();
  }, [user]);

  const handleOpenAddModal = () => {
    if (savedAddresses.length >= 4) {
      showToast('Maximum limit reached: You can save up to 4 delivery addresses only. Please edit or delete an existing address.', 'error');
      return;
    }
    setAddressToEdit(null);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditModal = (addr: Address, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAddressToEdit(addr);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = async (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const success = await deleteAddress(id);
      if (success) {
        showToast('Address deleted successfully.', 'success');
        const updatedList = await fetchMyAddresses();
        const activeList = (updatedList || []).filter((a) => !a.isDeleted);
        setSavedAddresses(activeList);

        // If the deleted address was currently selected, select the first remaining active address
        if (selectedAddressId === id) {
          if (activeList.length > 0) {
            const nextAddr = activeList.find((a) => a.isDefault) || activeList[0];
            handleSelectAddress(nextAddr);
          } else {
            setSelectedAddressId(null);
            setShippingAddress('');
            setCity('');
            setPostalCode('');
          }
        }
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete address.', 'error');
    }
  };

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
      customerPhone: customerPhone.trim(),
      shippingAddress: fullAddress,
      paymentType: selectedPayment,
      totalAmount,
      items: items.map((item) => {
        const { currentPrice } = getProductPrices(item.product);
        return {
          productId: item.product.id,
          quantity: item.quantity,
          price: currentPrice,
          name: item.product.name,
          imageUrl: item.product.imageUrl,
        };
      }),
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
          customerPhone: customerPhone.trim() || user?.phone || '',
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

      // 2. Configure Razorpay Standard Checkout options with prefilled details
      const options = {
        key: keyId,
        amount: rzpOrderData.amount, // in paise
        currency: rzpOrderData.currency || 'INR',
        name: 'Nutflix Tanzania',
        description: `Order Checkout (₹${formatPrice(totalAmount)})`,
        order_id: rzpOrderData.id,
        prefill: {
          name: customerName.trim() || user?.name || '',
          email: customerEmail.trim() || user?.email || '',
          contact: customerPhone.trim() || user?.phone || '',
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
    <div className="checkout-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1rem' }}>
      <style>{`
        .checkout-page-container {
          box-sizing: border-box;
        }
        .checkout-grid-layout {
          display: grid;
          grid-template-columns: 1.55fr 1fr;
          gap: 2rem;
          align-items: flex-start;
        }
        .checkout-card {
          background-color: #ffffff;
          padding: 1.75rem;
          border-radius: 20px;
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          box-sizing: border-box;
        }
        .address-card-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1rem 1.15rem;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-sizing: border-box;
        }
        .address-card-item:hover {
          border-color: var(--color-gold) !important;
          transform: translateY(-1px);
        }
        .address-action-btn {
          border-radius: 8px;
          padding: 0.45rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .address-action-btn:hover {
          transform: scale(1.08);
        }
        @media (max-width: 900px) {
          .checkout-grid-layout {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .checkout-summary-card {
            position: static !important;
          }
        }
        @media (max-width: 600px) {
          .checkout-page-container {
            padding: 1.25rem 0.5rem;
          }
          .checkout-card {
            padding: 1.2rem 1rem;
            border-radius: 16px;
          }
          .checkout-summary-card {
            padding: 1.2rem 1rem !important;
            border-radius: 16px !important;
          }
          .address-card-item {
            padding: 0.85rem 0.9rem;
            gap: 0.5rem;
          }
        }
      `}</style>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--color-forest)', margin: 0 }}>
          Secure Checkout
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: '0.3rem 0 0 0' }}>
          Review your delivery details and choose a payment method.
        </p>
      </div>

      {errorMessage && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1.5px solid #ef4444',
            padding: '0.9rem 1.15rem',
            borderRadius: '12px',
            color: '#b91c1c',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <div>{errorMessage}</div>
        </div>
      )}

      <div className="checkout-grid-layout">
        {/* Form Left */}
        <form onSubmit={handleSubmit} className="checkout-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-forest)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={20} color="var(--color-gold)" />
              <span>1. Delivery Address & Contact</span>
            </h3>
            <button
              type="button"
              onClick={handleOpenAddModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--color-forest)',
                backgroundColor: 'rgba(200, 157, 102, 0.15)',
                border: '1px solid var(--color-gold)',
                borderRadius: '20px',
                padding: '0.4rem 0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Plus size={15} />
              <span>Add New Address {savedAddresses.length > 0 ? `(${savedAddresses.length}/4)` : ''}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Contact Information */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.35rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 0.95rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.92rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-forest)', marginBottom: '0.35rem' }}>
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '0.75rem 0.95rem', borderRadius: '10px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.92rem' }}
                />
              </div>
            </div>

            {/* SAVED ADDRESSES DIRECT LIST */}
            {savedAddresses.length > 0 ? (
              <div style={{ marginTop: '0.35rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#555', marginBottom: '0.65rem' }}>
                  Select Delivery Address ({savedAddresses.length}/4 saved):
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;

                    return (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectAddress(addr)}
                        className="address-card-item"
                        style={{
                          border: isSelected ? '2px solid var(--color-forest)' : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? '#f7faf7' : '#ffffff',
                          boxShadow: isSelected ? '0 2px 10px rgba(30, 77, 43, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                          {/* Radio Selector */}
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: isSelected ? '5px solid var(--color-forest)' : '2px solid #cbd5e1',
                              backgroundColor: '#fff',
                              flexShrink: 0,
                              marginTop: '3px',
                              transition: 'all 0.15s ease',
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                              <span style={{ fontWeight: 800, color: 'var(--color-forest)', fontSize: '0.92rem' }}>
                                {addr.fullName || customerName}
                              </span>
                              {addr.isDefault && (
                                <span style={{ fontSize: '0.65rem', backgroundColor: '#e2ece4', color: 'var(--color-forest)', padding: '0.12rem 0.45rem', borderRadius: '6px', fontWeight: 800 }}>
                                  DEFAULT
                                </span>
                              )}
                              <span style={{ fontSize: '0.78rem', color: '#555', backgroundColor: '#f3f4f6', padding: '0.1rem 0.4rem', borderRadius: '6px', fontWeight: 600 }}>
                                📞 {addr.phone}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#444', lineHeight: '1.45', wordBreak: 'break-word' }}>
                              {addr.streetAddress}, {addr.city} {addr.state ? `, ${addr.state}` : ''} - <strong>{addr.postalCode}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.5rem', flexShrink: 0 }}>
                          <button
                            type="button"
                            title="Edit Address"
                            onClick={(e) => handleOpenEditModal(addr, e)}
                            className="address-action-btn"
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              color: 'var(--color-forest)',
                            }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            title="Delete Address (Soft Delete)"
                            onClick={(e) => handleDeleteAddress(addr.id, e)}
                            className="address-action-btn"
                            style={{
                              background: '#fff1f2',
                              border: '1px solid #fecdd3',
                              color: '#e11d48',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '1.75rem 1.25rem',
                  borderRadius: '16px',
                  border: '1.5px dashed var(--color-gold)',
                  backgroundColor: '#fffdf9',
                  textAlign: 'center',
                  marginTop: '0.35rem',
                }}
              >
                <MapPin size={28} color="var(--color-gold)" style={{ marginBottom: '0.4rem' }} />
                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--color-forest)', margin: '0 0 0.3rem 0' }}>
                  No Delivery Address Saved Yet
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#666', margin: '0 0 1rem 0' }}>
                  Please add your delivery address to proceed with your order.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  style={{
                    backgroundColor: 'var(--color-forest)',
                    color: '#fff',
                    padding: '0.65rem 1.35rem',
                    borderRadius: '10px',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 12px rgba(30,77,43,0.18)',
                  }}
                >
                  <Plus size={16} />
                  <span>Add Delivery Address</span>
                </button>
              </div>
            )}
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
                <span>Pay with Razorpay • ₹{formatPrice(totalAmount)}</span>
              </>
            ) : (
              <>
                <Banknote size={18} />
                <span>Place COD Order • ₹{formatPrice(totalAmount)}</span>
              </>
            )}
          </button>
        </form>

        {/* Summary Right */}
        <div className="checkout-summary-card" style={{ backgroundColor: 'var(--color-cream-light)', padding: '1.75rem', borderRadius: '20px', border: '1px solid var(--color-border)', position: 'sticky', top: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-forest)', marginBottom: '1.2rem' }}>
            Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
            {items.map((item) => {
              const { currentPrice, regularPrice, hasDiscount } = getProductPrices(item.product);
              return (
                <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-forest)' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>Qty: {item.quantity} × ₹{formatPrice(currentPrice)}</span>
                        {hasDiscount && (
                          <span style={{ textDecoration: 'line-through', color: '#dc2626', fontSize: '0.72rem', opacity: 0.85 }}>
                            ₹{formatPrice(regularPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-forest)' }}>
                    ₹{formatPrice(currentPrice * item.quantity)}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
              <span>Subtotal</span>
              <span>₹{formatPrice(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
              <span>Shipping</span>
              <span>{shippingCost === 0 ? <strong style={{ color: '#276749' }}>FREE</strong> : `₹${formatPrice(shippingCost)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 900, color: 'var(--color-forest)', paddingTop: '0.6rem', borderTop: '1px solid var(--color-border)' }}>
              <span>Total</span>
              <span>₹{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Address Dialog / Modal Popup */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addressToEdit={addressToEdit}
        defaultName={customerName || user?.name || ''}
        defaultPhone={customerPhone || user?.phone || ''}
        onSaveSuccess={async (savedAddr) => {
          await loadAddresses();
          handleSelectAddress(savedAddr);
          showToast('Delivery address saved successfully!', 'success');
        }}
      />

      {/* Modern Floating Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999999,
            backgroundColor: toast.type === 'success' ? '#1b4332' : toast.type === 'info' ? '#1e3a8a' : '#2b1010',
            color: '#ffffff',
            padding: '0.85rem 1.35rem',
            borderRadius: '14px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            border: `1.5px solid ${toast.type === 'success' ? '#40916c' : toast.type === 'info' ? '#3b82f6' : '#ef4444'}`,
            fontSize: '0.9rem',
            fontWeight: 600,
            maxWidth: '92vw',
            animation: 'slideDownFade 0.25s ease-out',
          }}
        >
          <AlertCircle size={20} color={toast.type === 'success' ? '#52b788' : toast.type === 'info' ? '#60a5fa' : '#f87171'} style={{ flexShrink: 0 }} />
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              padding: '2px',
              marginLeft: '0.5rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
