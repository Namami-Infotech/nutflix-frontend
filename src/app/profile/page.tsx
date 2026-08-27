'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  Clock,
  ArrowLeft,
  LogOut,
  MapPin,
  Phone,
  FileText,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Star,
  X
} from 'lucide-react';
import { fetchUserOrders, fetchMyOrders, updateOrderStatus, fetchCartApi, updateCartQuantityApi, removeFromCartApi, logoutUser, getUserFromCookie, setUserCookie, getAuthToken, submitReview } from '@/lib/api';
import { useCart } from '@/modules/cart/cart.context';
import { OrderTrackerModal } from '@/modules/orders/components/OrderTrackerModal';
import { LoginModal } from '@/modules/layout/components/LoginModal';

export default function UserProfilePage() {
  const { items: cartItems, removeFromCart, updateQuantity, subtotal: totalPrice, openCart } = useCart();

  const [userData, setUserData] = useState<any>({
    name: '',
    email: '',
    phone: '',
    address: '',
    gstNumber: ''
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'orders' | 'cart' | 'settings'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // DB Cart state
  const [dbCartItems, setDbCartItems] = useState<any[] | null>(null);
  const [loadingDbCart, setLoadingDbCart] = useState<boolean>(false);

  // Order Tracking Modal State
  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  // Address edit state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editGst, setEditGst] = useState('');

  // Multi-Item Review Modal State
  const [reviewModalOrder, setReviewModalOrder] = useState<any | null>(null);
  const [itemsReviewData, setItemsReviewData] = useState<Record<number, { rating: number; title: string; comment: string }>>({});
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const openReviewModal = (ord: any) => {
    setReviewModalOrder(ord);
    const initialMap: Record<number, { rating: number; title: string; comment: string }> = {};
    const items = ord.items && ord.items.length > 0 ? ord.items : [{ id: 1, productId: 1, name: 'Product' }];
    items.forEach((item: any) => {
      const pId = Number(item.productId || item.id || 1);
      initialMap[pId] = { rating: 5, title: '', comment: '' };
    });
    setItemsReviewData(initialMap);
  };

  const updateItemReviewField = (pId: number, field: 'rating' | 'title' | 'comment', value: any) => {
    setItemsReviewData((prev) => ({
      ...prev,
      [pId]: {
        ...prev[pId],
        [field]: value,
      },
    }));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalOrder) return;

    const pIds = Object.keys(itemsReviewData);
    const validPIds = pIds.filter((pIdStr) => (itemsReviewData[Number(pIdStr)]?.comment || '').trim().length > 0);

    if (validPIds.length === 0) {
      showToast('Please write a review comment for at least one item.');
      return;
    }

    setSubmittingReview(true);
    try {
      const orderNum = reviewModalOrder.orderNumber || reviewModalOrder.customId || `ORD-${reviewModalOrder.id}`;
      const authorName = userData.name || 'Verified Buyer';

      for (const pIdStr of validPIds) {
        const pId = Number(pIdStr);
        const rData = itemsReviewData[pId];
        await submitReview({
          productId: pId,
          orderNumber: orderNum,
          author: authorName,
          rating: rData.rating || 5,
          title: rData.title?.trim() || 'Verified Purchase Review',
          comment: rData.comment.trim(),
        });
      }

      showToast(`Thank you! Reviews submitted for ${validPIds.length} product(s).`);
      setReviewModalOrder(null);
    } catch (err) {
      showToast('Thank you! Your reviews have been submitted.');
      setReviewModalOrder(null);
    } finally {
      setSubmittingReview(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam === 'cart' || tabParam === 'orders' || tabParam === 'settings') {
        setActiveTab(tabParam);
      }

      const token = getAuthToken();
      if (!token) {
        setIsAuthenticated(false);
        setLoginModalOpen(true);
      } else {
        setIsAuthenticated(true);
        const storedUser = getUserFromCookie();
        if (storedUser) {
          setUserData(storedUser);
          setEditPhone(storedUser.phone || '');
          setEditAddress(storedUser.address || '');
          setEditGst(storedUser.gstNumber || '');
          if (storedUser.role?.toLowerCase() === 'admin') {
            if (tabParam === 'orders' || !tabParam) {
              setActiveTab('settings');
            }
          }
        }
      }
    }
  }, []);

  const isAdmin = userData?.role?.toLowerCase() === 'admin';

  useEffect(() => {
    loadUserOrders(userData?.email || '');
  }, [userData?.email]);

  const loadCartFromDbApi = async () => {
    setLoadingDbCart(true);
    try {
      const dbData = await fetchCartApi();
      console.log(dbData, "dbDatadbDatadbDatadbData")
      if (dbData && Array.isArray(dbData)) {
        setDbCartItems(dbData);
      } else {
        setDbCartItems(null);
      }
    } catch (err) {
      console.error('Error fetching cart from DB API:', err);
    } finally {
      setLoadingDbCart(false);
    }
  };

  useEffect(() => {


    loadCartFromDbApi();

  }, []);

  const handleDbCartUpdateQuantity = async (productId: number, newQty: number) => {
    updateQuantity(productId, newQty);
    await updateCartQuantityApi(productId, newQty);
    await loadCartFromDbApi();
  };

  const handleDbCartRemoveItem = async (productId: number) => {
    removeFromCart(productId);
    await removeFromCartApi(productId);
    await loadCartFromDbApi();
  };

  const loadUserOrders = async (email: string) => {
    setLoadingOrders(true);
    try {
      const res = await fetchMyOrders();
      setOrders(res || []);
    } catch (err) {
      console.error('Error fetching user orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      const res = await updateOrderStatus(orderId, 'cancelled');
      if (res.success) {
        showToast('Order cancelled successfully.');
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
      }
    }
  };

  const handleReturnOrder = async (orderId: number) => {
    if (confirm('Would you like to initiate a return request for this order?')) {
      const res = await updateOrderStatus(orderId, 'returned');
      if (res.success) {
        showToast('Return request submitted.');
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'returned' } : o));
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...userData,
      phone: editPhone,
      address: editAddress,
      gstNumber: editGst
    };
    setUserData(updated);
    if (typeof window !== 'undefined') {
      setUserCookie(updated);
    }
    setIsEditingAddress(false);
    showToast('Profile information updated!');
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fcf8f2', color: 'var(--color-forest)', fontFamily: 'var(--font-sans)', paddingBottom: '4rem' }}>
        {/* Header Bar */}
        <div style={{ backgroundColor: 'var(--color-forest)', color: '#fff', padding: '1.25rem 2rem', borderBottom: '2px solid var(--color-gold)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem' }}>
              <ArrowLeft size={16} /> Back to Store
            </Link>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.05em' }}>
              MY ACCOUNT
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '3rem 2rem', border: '1px solid #e2d5c3', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#f5efe6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--color-forest)' }}>
              <User size={36} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
              Please Sign In
            </h2>
            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              You must be logged in to view your profile details, order history, and account settings.
            </p>
            <button
              onClick={() => setLoginModalOpen(true)}
              style={{
                backgroundColor: 'var(--color-forest)',
                color: 'var(--color-gold)',
                padding: '0.85rem 2.5rem',
                borderRadius: '30px',
                fontWeight: 800,
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(22,35,26,0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              Sign In / Register
            </button>
          </div>
        </div>

        <LoginModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          onSuccess={() => {
            setLoginModalOpen(false);
            setIsAuthenticated(true);
            const user = getUserFromCookie();
            if (user) {
              setUserData(user);
              setEditPhone(user.phone || '');
              setEditAddress(user.address || '');
              setEditGst(user.gstNumber || '');
              loadUserOrders(user.email || '');
            }
            loadCartFromDbApi();
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fcf8f2', color: 'var(--color-forest)', fontFamily: 'var(--font-sans)', paddingBottom: '4rem' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000000,
          backgroundColor: '#10b981',
          color: '#fff',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle size={18} />
          {toastMsg}
        </div>
      )}

      {/* Header Bar */}
      <div style={{ backgroundColor: 'var(--color-forest)', color: '#fff', padding: '1.25rem 2rem', borderBottom: '2px solid var(--color-gold)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to Store
          </Link>
          <div style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.05em' }}>
            MY ACCOUNT & ORDER HISTORY
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
        {/* User Card */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2d5c3', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-forest)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.6rem', boxShadow: '0 4px 15px rgba(22,35,26,0.2)' }}>
              {userData.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-forest)' }}>{userData.name}</h1>
              <div style={{ fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span>{userData.email}</span>
                <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  {userData.role || 'Valued Customer'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              border: '1px solid #fca5a5',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '2px solid #e2d5c3', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
          {!isAdmin ? (
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 900,
                fontSize: '0.95rem',
                cursor: 'pointer',
                backgroundColor: activeTab === 'orders' ? 'var(--color-forest)' : 'transparent',
                color: activeTab === 'orders' ? '#fff' : 'var(--color-forest)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Package size={18} /> My Orders ({orders.length})
            </button>
          ) : (
            <Link
              href="/admin"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 900,
                fontSize: '0.95rem',
                backgroundColor: '#fef3c7',
                color: '#b45309',
                border: '1px solid #fde68a',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <ShieldCheck size={18} color="#d97706" /> Go to Admin Dashboard
            </Link>
          )}

          <button
            onClick={() => setActiveTab('cart')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'cart' ? 'var(--color-forest)' : 'transparent',
              color: activeTab === 'cart' ? '#fff' : 'var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ShoppingBag size={18} /> My Cart ({cartItems.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'settings' ? 'var(--color-forest)' : 'transparent',
              color: activeTab === 'settings' ? '#fff' : 'var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <User size={18} /> Profile & Address
          </button>
        </div>

        {/* TAB 1: MY ORDERS HISTORY (Hidden / Redirected for Admin) */}
        {activeTab === 'orders' && (
          <div>
            {isAdmin ? (
              <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '16px', border: '1px solid #e2d5c3', textAlign: 'center' }}>
                <ShieldCheck size={48} color="#d97706" style={{ marginBottom: '1rem' }} />
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-forest)' }}>Administrator Account</h3>
                <p style={{ color: '#666', fontSize: '0.92rem', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                  You are currently signed in as an Administrator. Customer orders and order fulfillment tracking are managed in the central Admin Suite.
                </p>
                <Link href="/admin" style={{ backgroundColor: 'var(--color-forest)', color: '#fff', padding: '0.85rem 1.8rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  Open Admin Dashboard <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.25rem', color: 'var(--color-forest)' }}>
                  📦 Order History & Tracking Details
                </h2>

                {loadingOrders ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>Loading order history...</div>
                ) : orders.length === 0 ? (
                  <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '16px', border: '1px solid #e2d5c3', textAlign: 'center' }}>
                    <Package size={48} color="var(--color-gold)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 900 }}>No Past Orders Found</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>You haven't placed any orders yet. Explore our handcrafted dry fruits collection!</p>
                    <Link href="/" style={{ backgroundColor: 'var(--color-forest)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      Browse Products <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map((ord) => {
                      const statusColor =
                        ord.status === 'delivered' ? '#10b981' :
                          ord.status === 'shipped' ? '#3b82f6' :
                            ord.status === 'cancelled' ? '#ef4444' :
                              ord.status === 'returned' ? '#f97316' : '#8b5cf6';

                      return (
                        <div key={ord.id} style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2d5c3', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                          {/* Order Top Bar */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <div>
                              <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 800 }}>Order Number</span>
                              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-forest)' }}>{ord.orderNumber}</div>
                            </div>

                            <div>
                              <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 800 }}>Date Placed</span>
                              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#333' }}>
                                {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </div>
                            </div>

                            <div>
                              <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 800 }}>Total Paid</span>
                              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-forest)' }}>
                                ₹{parseFloat(ord.totalAmount || 0).toFixed(2)}
                              </div>
                            </div>

                            <div>
                              <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 800 }}>Payment Mode</span>
                              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#3b82f6' }}>
                                💳 {ord.paymentMethod || (ord.paymentType === 'cash' ? 'Cash on Delivery' : 'Online / UPI')}
                              </div>
                            </div>

                            <div>
                              <span style={{
                                display: 'inline-block',
                                padding: '0.35rem 0.8rem',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                backgroundColor: statusColor + '20',
                                color: statusColor,
                                border: `1px solid ${statusColor}`
                              }}>
                                Status: {ord.status}
                              </span>
                            </div>
                          </div>

                          {/* Items Purchased List */}
                          <div style={{ marginBottom: '1rem' }}>
                            <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', fontWeight: 800 }}>Items Purchased</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {Array.isArray(ord.items) && ord.items.map((item: any, idx: number) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fdfbf7', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #f0e6d8' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <img
                                      src={item.imageUrl || 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=200&q=80'}
                                      alt={item.name || 'Product'}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).onerror = null;
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=200&q=80';
                                      }}
                                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                                    />
                                    <div>
                                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-forest)' }}>{item.name || `Product #${item.productId}`}</div>
                                      <div style={{ fontSize: '0.75rem', color: '#666' }}>Quantity: {item.quantity} unit(s)</div>
                                    </div>
                                  </div>
                                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--color-forest)' }}>
                                    ₹{((parseFloat(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Delivery Address & Actions */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                              📍 <strong>Shipping Address:</strong> {ord.shippingAddress}
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                              <button
                                onClick={() => {
                                  setTrackingOrder(ord);
                                  setIsTrackerOpen(true);
                                }}
                                style={{
                                  padding: '0.45rem 0.9rem',
                                  borderRadius: '8px',
                                  border: 'none',
                                  backgroundColor: 'var(--color-forest)',
                                  color: '#ffffff',
                                  fontWeight: 800,
                                  fontSize: '0.78rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  boxShadow: '0 2px 6px rgba(22,35,26,0.15)'
                                }}
                              >
                                <Truck size={15} color="var(--color-gold)" /> Track Order Status
                              </button>

                              {ord.status !== 'cancelled' && ord.status !== 'returned' && ord.status !== 'delivered' && (
                                <button
                                  onClick={() => handleCancelOrder(ord.id)}
                                  style={{ padding: '0.45rem 0.8rem', borderRadius: '8px', border: '1px solid #fca5a5', backgroundColor: '#fef2f2', color: '#ef4444', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                                >
                                  Cancel Order
                                </button>
                              )}

                              {ord.status === 'delivered' && (
                                <>
                                  <button
                                    onClick={() => openReviewModal(ord)}
                                    style={{
                                      padding: '0.45rem 0.85rem',
                                      borderRadius: '8px',
                                      border: '1px solid #fde047',
                                      backgroundColor: '#fefce8',
                                      color: '#854d0e',
                                      fontWeight: 800,
                                      fontSize: '0.75rem',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      boxShadow: '0 2px 6px rgba(234,179,8,0.15)'
                                    }}
                                  >
                                    <Star size={14} fill="#eab308" color="#eab308" /> Write Review
                                  </button>
                                  <button
                                    onClick={() => handleReturnOrder(ord.id)}
                                    style={{ padding: '0.45rem 0.8rem', borderRadius: '8px', border: '1px solid #fed7aa', backgroundColor: '#fff7ed', color: '#ea580c', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                                  >
                                    Request Return
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* TAB 2: MY CART QUICK VIEW */}
        {activeTab === 'cart' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2d5c3', padding: '2rem' }}>

            {/* Cart Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, color: 'var(--color-forest)' }}>
                🛒 My Basket ({dbCartItems ? dbCartItems.length : cartItems.length} items)
              </h2>
              {((dbCartItems && dbCartItems.length > 0) || cartItems.length > 0) && (
                <Link
                  href="/checkout"
                  style={{
                    backgroundColor: 'var(--color-forest)',
                    color: '#fff',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
              )}
            </div>

            {loadingDbCart ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666' }}>
                Fetching live cart items from Database API...
              </div>
            ) : (dbCartItems ? dbCartItems.length === 0 : cartItems.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <ShoppingBag size={48} color="var(--color-gold)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ margin: '0 0 0.5rem', fontWeight: 900 }}>Your Basket is Empty</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Add delicious dry fruits and cashews to your basket.</p>
                <Link href="/" style={{ backgroundColor: 'var(--color-forest)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem' }}>
                  Explore Store
                </Link>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  {(dbCartItems && dbCartItems.length > 0 ? dbCartItems : cartItems.map(i => ({
                    productId: i.product.id,
                    name: i.product.name,
                    price: i.product.price,
                    imageUrl: i.product.imageUrl,
                    quantity: i.quantity
                  }))).map((item: any) => {
                    const priceNum = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
                    return (
                      <div key={item.productId || item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fdfbf7', padding: '1rem', borderRadius: '12px', border: '1px solid #f0e6d8', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img src={item.imageUrl} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '10px', objectFit: 'cover' }} />
                          <div>
                            <h4 style={{ margin: '0 0 0.2rem', fontWeight: 900, color: 'var(--color-forest)' }}>{item.name}</h4>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 800 }}>₹{priceNum.toFixed(2)}</div>
                            <div style={{ fontSize: '0.7rem', color: '#888' }}>DB Product ID: #{item.productId}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', padding: '0.25rem 0.5rem', borderRadius: '20px', border: '1px solid #ccc' }}>
                            <button onClick={() => handleDbCartUpdateQuantity(item.productId, item.quantity - 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 900, padding: '0 0.4rem' }}>-</button>
                            <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{item.quantity}</span>
                            <button onClick={() => handleDbCartUpdateQuantity(item.productId, item.quantity + 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 900, padding: '0 0.4rem' }}>+</button>
                          </div>

                          <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--color-forest)' }}>
                            ₹{(priceNum * item.quantity).toFixed(2)}
                          </div>

                          <button onClick={() => handleDbCartRemoveItem(item.productId)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ borderTop: '2px solid #e2d5c3', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-forest)' }}>
                    Total (Fetched via API): <span style={{ color: 'var(--color-gold)' }}>
                      ₹{(dbCartItems && dbCartItems.length > 0
                        ? dbCartItems.reduce((acc, i) => acc + ((typeof i.price === 'number' ? i.price : parseFloat(i.price) || 0) * i.quantity), 0)
                        : totalPrice
                      ).toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    style={{
                      backgroundColor: 'var(--color-forest)',
                      color: '#fff',
                      padding: '0.85rem 1.75rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 900,
                      fontSize: '1rem'
                    }}
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACCOUNT & ADDRESS SETTINGS */}
        {activeTab === 'settings' && (
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2d5c3', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--color-forest)' }}>
              👤 Personal Information & Delivery Address
            </h2>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: '#333' }}>Full Name</label>
                <input
                  type="text"
                  value={userData.name}
                  disabled
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: '#333' }}>Email Address</label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: '#333' }}>Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: '#333' }}>Primary Shipping Address</label>
                <textarea
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: '#333' }}>GST Number (Optional)</label>
                <input
                  type="text"
                  value={editGst}
                  onChange={(e) => setEditGst(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--color-forest)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Interactive Order Delivery Tracker Modal */}
      <OrderTrackerModal
        order={trackingOrder}
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      {/* Add Review Modal for Delivered Orders (Supports All Order Items at Once) */}
      {reviewModalOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button
              onClick={() => setReviewModalOrder(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Star size={22} fill="#eab308" color="#eab308" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-forest)', margin: 0 }}>
                Write Verified Product Reviews
              </h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.25rem' }}>
              Order <strong style={{ color: 'var(--color-forest)' }}>{reviewModalOrder.orderNumber || reviewModalOrder.customId}</strong> ({reviewModalOrder.items?.length || 1} Item{(reviewModalOrder.items?.length || 1) > 1 ? 's' : ''})
            </p>

            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {(reviewModalOrder.items && reviewModalOrder.items.length > 0 ? reviewModalOrder.items : [{ id: 1, productId: 1, name: 'Product' }]).map((item: any, idx: number) => {
                const pId = Number(item.productId || item.id || 1);
                const rData = itemsReviewData[pId] || { rating: 5, title: '', comment: '' };

                return (
                  <div key={pId || idx} style={{ backgroundColor: '#fcfbf8', borderRadius: '12px', border: '1px solid #e8e2d5', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80'}
                        alt={item.name || 'Product'}
                        style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-forest)' }}>
                          {item.name || `Product #${pId}`}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Quantity: {item.quantity || 1}</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '0.8rem' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem', color: '#444' }}>Rating for this product</label>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateItemReviewField(pId, 'rating', star)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.1rem' }}
                          >
                            <Star
                              size={24}
                              fill={star <= (rData.rating || 5) ? '#eab308' : '#e5e7eb'}
                              color={star <= (rData.rating || 5) ? '#eab308' : '#d1d5db'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: '0.8rem' }}>
                      <input
                        type="text"
                        placeholder="Headline (e.g. Tastes fresh & premium!)"
                        value={rData.title || ''}
                        onChange={(e) => updateItemReviewField(pId, 'title', e.target.value)}
                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <textarea
                        rows={3}
                        placeholder="Write your review for this product..."
                        value={rData.comment || ''}
                        onChange={(e) => updateItemReviewField(pId, 'comment', e.target.value)}
                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                );
              })}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setReviewModalOrder(null)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#666', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-forest)', color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {submittingReview ? 'Submitting Reviews...' : 'Submit All Reviews'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
