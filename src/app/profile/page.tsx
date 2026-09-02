'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  ShoppingCart,
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
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  Check,
  Loader2,
} from 'lucide-react';
import {
  fetchUserOrders,
  fetchMyOrders,
  updateOrderStatus,
  fetchCartApi,
  updateCartQuantityApi,
  removeFromCartApi,
  logoutUser,
  getUserFromCookie,
  setUserCookie,
  getAuthToken,
  submitReview,
  formatPrice,
  deleteUser,
  Address,
  fetchMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '@/lib/api';
import { AddressModal } from '@/modules/checkout/components/AddressModal';
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

  const [mounted, setMounted] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);

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

  // Saved Addresses State & Modal
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [loadingUserAddresses, setLoadingUserAddresses] = useState<boolean>(false);
  const [isProfileAddressModalOpen, setIsProfileAddressModalOpen] = useState<boolean>(false);
  const [profileAddressToEdit, setProfileAddressToEdit] = useState<Address | null>(null);

  const loadProfileAddresses = async () => {
    setLoadingUserAddresses(true);
    try {
      const list = await fetchMyAddresses();
      setUserAddresses((list || []).filter((a) => !a.isDeleted));
    } catch (e) {
      // ignore
    } finally {
      setLoadingUserAddresses(false);
    }
  };

  const handleOpenProfileAddAddress = () => {
    if (userAddresses.length >= 4) {
      showToast('Maximum limit reached: You can save up to 4 delivery addresses only. Please edit or delete an existing address.');
      return;
    }
    setProfileAddressToEdit(null);
    setIsProfileAddressModalOpen(true);
  };

  const handleStartProfileEdit = (addr: Address) => {
    setProfileAddressToEdit(addr);
    setIsProfileAddressModalOpen(true);
  };

  const handleDeleteProfileAddress = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const ok = await deleteAddress(id);
      if (ok) {
        showToast('Address deleted successfully.');
        await loadProfileAddresses();
      }
    } catch (err: any) {
      showToast('Failed to delete address');
    }
  };

  const handleSetDefaultProfileAddress = async (id: number) => {
    try {
      await setDefaultAddress(id);
      showToast('Default delivery address updated.');
      await loadProfileAddresses();
    } catch (err: any) {
      showToast('Failed to set default address');
    }
  };

  // Collapsible Orders State
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

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

  const syncAuthData = () => {
    if (typeof window === 'undefined') return;
    const token = getAuthToken();
    if (!token) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
      const storedUser = getUserFromCookie();
      if (storedUser) {
        setUserData(storedUser);
        setEditPhone(storedUser.phone || '');
        setEditAddress(storedUser.address || '');
        setEditGst(storedUser.gstNumber || '');
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam === 'cart' || tabParam === 'orders' || tabParam === 'settings') {
        setActiveTab(tabParam);
      }

      syncAuthData();
      loadProfileAddresses();

      const handleAuthUpdate = () => {
        syncAuthData();
        loadProfileAddresses();
      };
      window.addEventListener('authChange', handleAuthUpdate);
      window.addEventListener('storage', handleAuthUpdate);
      return () => {
        window.removeEventListener('authChange', handleAuthUpdate);
        window.removeEventListener('storage', handleAuthUpdate);
      };
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

  const handleDeleteAccount = async () => {
    if (!userData?.id) {
      showToast('Unable to identify user account. Please sign in again.');
      return;
    }
    setIsDeletingAccount(true);
    try {
      const res = await deleteUser(Number(userData.id));
      if (res && (res.success || res.status === 'inactive' || res.statusCode === 200)) {
        showToast('Your account has been deleted.');
        setDeleteModalOpen(false);
        await logoutUser();
        setIsAuthenticated(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('authChange'));
          window.dispatchEvent(new Event('storage'));
        }
        setTimeout(() => {
          window.location.href = '/';
        }, 800);
      } else {
        showToast(res?.message || 'Failed to delete account. Please try again.');
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Error deleting account.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fcf8f2', color: 'var(--color-forest)', fontFamily: 'var(--font-sans)', paddingBottom: '4rem' }}>
      {/* Dynamic Profile Responsive Styles */}
      <style>{`
        .profile-header-bar {
          background-color: var(--color-forest);
          color: #fff;
          padding: 1rem 1.5rem;
          border-bottom: 2px solid var(--color-gold);
        }
        .profile-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .profile-header-title {
          font-weight: 900;
          font-size: 1.05rem;
          letter-spacing: 0.04em;
          text-align: right;
          color: #ffffff;
        }
        .profile-main-wrapper {
          max-width: 1200px;
          margin: 1.75rem auto;
          padding: 0 1.25rem;
        }
        .profile-user-card {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 1.5rem 1.75rem;
          border: 1px solid #e2d5c3;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.25rem;
        }
        .profile-user-left {
          display: flex;
          align-items: center;
          gap: 1.15rem;
          flex: 1 1 auto;
          min-width: 200px;
        }
        .profile-avatar-circle {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background-color: var(--color-forest);
          color: var(--color-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.5rem;
          box-shadow: 0 4px 15px rgba(22, 35, 26, 0.2);
          flex-shrink: 0;
        }
        .profile-user-name {
          margin: 0 0 0.2rem;
          font-size: 1.3rem;
          font-weight: 900;
          color: var(--color-forest);
          word-break: break-word;
        }
        .profile-user-meta {
          font-size: 0.85rem;
          color: #666;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .profile-actions-wrapper {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .profile-delete-btn {
          background-color: #fff;
          color: #dc2626;
          border: 1px solid #fca5a5;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
        }
        .profile-delete-btn:hover {
          background-color: #fef2f2;
          border-color: #ef4444;
          color: #b91c1c;
        }
        .profile-logout-btn {
          background-color: #fef2f2;
          color: #ef4444;
          border: 1px solid #fca5a5;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s ease;
        }
        .profile-logout-btn:hover {
          background-color: #fee2e2;
        }
        .profile-tabs-scroll {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 1.75rem;
          border-bottom: 2px solid #e2d5c3;
          padding-bottom: 0.75rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .profile-tabs-scroll::-webkit-scrollbar {
          display: none;
        }
        .profile-tab-pill {
          padding: 0.7rem 1.3rem;
          border-radius: 12px;
          border: 1.5px solid transparent;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          white-space: nowrap;
          transition: all 0.2s ease;
          flex-shrink: 0;
          text-decoration: none;
        }
        .profile-tab-pill.active {
          background-color: var(--color-forest);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(22, 35, 26, 0.2);
          border-color: var(--color-forest);
        }
        .profile-tab-pill.inactive {
          background-color: #ffffff;
          color: var(--color-forest);
          border-color: #e2d5c3;
        }
        .profile-tab-pill.inactive:hover {
          background-color: var(--color-cream-light);
          border-color: var(--color-gold);
        }
        .order-card-box {
          background-color: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2d5c3;
          padding: 1.25rem 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        .order-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr) auto;
          gap: 1rem;
          align-items: center;
          border-bottom: 1px solid #eee;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }
        .order-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #eee;
          padding-top: 1rem;
          flex-wrap: wrap;
          gap: 0.85rem;
        }
        .order-action-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          align-items: center;
        }
        .cart-item-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #fdfbf7;
          padding: 0.9rem 1.15rem;
          border-radius: 12px;
          border: 1px solid #f0e6d8;
          flex-wrap: wrap;
          gap: 0.85rem;
        }
        .cart-checkout-bar {
          border-top: 2px solid #e2d5c3;
          padding-top: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        @media (max-width: 768px) {
          .profile-header-bar {
            padding: 0.85rem 1rem !important;
          }
          .profile-header-title {
            font-size: 0.88rem !important;
            letter-spacing: 0.02em !important;
          }
          .profile-main-wrapper {
            margin: 1rem auto !important;
            padding: 0 0.85rem !important;
          }
          .profile-user-card {
            padding: 1.15rem 1rem !important;
            gap: 1rem !important;
          }
          .profile-avatar-circle {
            width: 48px !important;
            height: 48px !important;
            font-size: 1.25rem !important;
          }
          .profile-user-name {
            font-size: 1.15rem !important;
          }
          .profile-user-meta {
            font-size: 0.78rem !important;
          }
          .profile-actions-wrapper {
            width: 100% !important;
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          .profile-delete-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 0.6rem !important;
          }
          .profile-logout-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 0.6rem !important;
          }
          .profile-tabs-scroll {
            gap: 0.45rem !important;
            margin-bottom: 1.25rem !important;
            padding-bottom: 0.6rem !important;
          }
          .profile-tab-pill {
            padding: 0.55rem 0.95rem !important;
            font-size: 0.82rem !important;
            border-radius: 10px !important;
          }
          .order-card-box {
            padding: 1rem !important;
          }
          .order-meta-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 0.75rem 0.5rem !important;
          }
          .order-meta-grid > div:nth-child(4) {
            grid-column: 1 / -1 !important;
          }
          .order-meta-grid > div:nth-child(5) {
            grid-column: 1 / -1 !important;
          }
          .order-footer-row {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .order-action-buttons {
            width: 100% !important;
          }
          .order-action-buttons button {
            flex: 1 1 auto !important;
            justify-content: center !important;
            padding: 0.55rem 0.75rem !important;
          }
          .cart-item-flex {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .cart-item-right-actions {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
            border-top: 1px dashed #e8e0d5 !important;
            padding-top: 0.65rem !important;
          }
          .cart-checkout-bar {
            flex-direction: column !important;
            align-items: stretch !important;
            text-align: center !important;
          }
          .cart-checkout-bar a {
            width: 100% !important;
            justify-content: center !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

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
      <div className="profile-header-bar">
        <div className="profile-header-inner">
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--color-gold)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
            <ArrowLeft size={16} /> Back to Store
          </Link>
          <div className="profile-header-title">
            MY ACCOUNT & ORDERS
          </div>
        </div>
      </div>

      {!mounted ? (
        <div className="profile-main-wrapper" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      ) : !isAuthenticated ? (
        <div className="profile-main-wrapper" style={{ textAlign: 'center', maxWidth: '560px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2.5rem 1.5rem', border: '1px solid #e2d5c3', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginTop: '2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f5efe6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--color-forest)' }}>
              <User size={32} />
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-forest)', marginBottom: '0.65rem' }}>
              Please Sign In
            </h2>
            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              You must be logged in to view your profile details, order history, and account settings.
            </p>
            <button
              onClick={() => setLoginModalOpen(true)}
              style={{
                backgroundColor: 'var(--color-forest)',
                color: 'var(--color-gold)',
                padding: '0.8rem 2.2rem',
                borderRadius: '30px',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(22,35,26,0.25)',
                transition: 'all 0.2s ease',
                width: '100%',
                maxWidth: '280px'
              }}
            >
              Sign In / Register
            </button>
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
              }
              if (typeof window !== 'undefined') {
                window.location.href = '/';
              }
            }}
          />
        </div>
      ) : (
        <div className="profile-main-wrapper">
          {/* User Card */}
          <div className="profile-user-card">
            <div className="profile-user-left">
              <div className="profile-avatar-circle">
                {userData.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h1 className="profile-user-name">{userData.name || 'Valued Customer'}</h1>
                <div className="profile-user-meta">
                  <span style={{ wordBreak: 'break-all' }}>{userData.email}</span>
                  <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', flexShrink: 0 }}>
                    {userData.role || 'USER'}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-actions-wrapper">
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="profile-delete-btn"
                title="Delete your account"
              >
                <Trash2 size={15} /> Delete Account
              </button>
              <button
                onClick={handleLogout}
                className="profile-logout-btn"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="profile-tabs-scroll">
            {!isAdmin ? (
              <button
                onClick={() => setActiveTab('orders')}
                className={`profile-tab-pill ${activeTab === 'orders' ? 'active' : 'inactive'}`}
              >
                <Package size={17} /> My Orders ({orders.length})
              </button>
            ) : (
              <Link
                href="/admin"
                className="profile-tab-pill"
                style={{
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  borderColor: '#fde68a'
                }}
              >
                <ShieldCheck size={17} color="#d97706" /> Go to Admin Dashboard
              </Link>
            )}

            <button
              onClick={() => setActiveTab('cart')}
              className={`profile-tab-pill ${activeTab === 'cart' ? 'active' : 'inactive'}`}
            >
              <ShoppingCart size={17} /> My Cart ({cartItems.length})
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`profile-tab-pill ${activeTab === 'settings' ? 'active' : 'inactive'}`}
            >
              <User size={17} /> Profile & Address
            </button>
          </div>

          {/* TAB 1: MY ORDERS HISTORY */}
          {activeTab === 'orders' && (
            <div>
              {isAdmin ? (
                <div style={{ backgroundColor: '#fff', padding: '2.5rem 1.5rem', borderRadius: '16px', border: '1px solid #e2d5c3', textAlign: 'center' }}>
                  <ShieldCheck size={48} color="#d97706" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-forest)' }}>Administrator Account</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                    You are currently signed in as an Administrator. Customer orders and order fulfillment tracking are managed in the central Admin Suite.
                  </p>
                  <Link href="/admin" style={{ backgroundColor: 'var(--color-forest)', color: '#fff', padding: '0.8rem 1.6rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    Open Admin Dashboard <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '1.15rem', color: 'var(--color-forest)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    📦 Order History & Tracking Details
                  </h2>

                  {loadingOrders ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#666', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2d5c3' }}>Loading order history...</div>
                  ) : orders.length === 0 ? (
                    <div style={{ backgroundColor: '#fff', padding: '2.5rem 1.5rem', borderRadius: '16px', border: '1px solid #e2d5c3', textAlign: 'center' }}>
                      <Package size={44} color="var(--color-gold)" style={{ marginBottom: '0.85rem' }} />
                      <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.15rem', fontWeight: 900 }}>No Past Orders Found</h3>
                      <p style={{ color: '#666', fontSize: '0.88rem', marginBottom: '1.5rem' }}>You haven't placed any orders yet. Explore our handcrafted dry fruits collection!</p>
                      <Link href="/" style={{ backgroundColor: 'var(--color-forest)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 800, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        Browse Products <ArrowRight size={16} />
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {orders.map((ord) => {
                        const isExpanded = !!expandedOrders[ord.id];
                        const items = Array.isArray(ord.items) && ord.items.length > 0 ? ord.items : [];
                        const primaryItem = items[0] || {
                          name: `Order #${ord.orderNumber || ord.id}`,
                          imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=200&q=80',
                          price: ord.totalAmount,
                          quantity: 1
                        };
                        const totalItemsQty = items.reduce((sum: number, it: any) => sum + (it.quantity || 1), 0);
                        const additionalItemsCount = items.length > 1 ? items.length - 1 : 0;

                        const statusColor =
                          ord.status === 'delivered' ? '#10b981' :
                            ord.status === 'shipped' ? '#3b82f6' :
                              ord.status === 'cancelled' ? '#ef4444' :
                                ord.status === 'returned' ? '#f97316' : '#8b5cf6';

                        return (
                          <div
                            key={ord.id}
                            className="order-card-box"
                            style={{
                              transition: 'all 0.25s ease',
                              border: isExpanded ? '1.5px solid var(--color-gold)' : '1px solid #e2d5c3'
                            }}
                          >
                            {/* Always Visible Accordion Header: Item Image, Name, Total, Status & Chevron */}
                            <div
                              onClick={() => toggleOrderExpand(ord.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                gap: '0.75rem',
                                userSelect: 'none'
                              }}
                            >
                              {/* Left: Product Image + Product Name */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', overflow: 'hidden', flex: '1 1 auto' }}>
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                  <img
                                    src={primaryItem.imageUrl || 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=200&q=80'}
                                    alt={primaryItem.name || 'Product'}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).onerror = null;
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=200&q=80';
                                    }}
                                    style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e8e2d5' }}
                                  />
                                  {additionalItemsCount > 0 && (
                                    <span style={{
                                      position: 'absolute',
                                      bottom: '-3px',
                                      right: '-3px',
                                      backgroundColor: 'var(--color-forest)',
                                      color: 'var(--color-gold)',
                                      fontSize: '0.62rem',
                                      fontWeight: 900,
                                      padding: '1px 5px',
                                      borderRadius: '10px',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                    }}>
                                      +{additionalItemsCount}
                                    </span>
                                  )}
                                </div>

                                <div style={{ overflow: 'hidden' }}>
                                  <h3 style={{ margin: '0 0 0.15rem', fontSize: '0.95rem', fontWeight: 900, color: 'var(--color-forest)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                    {primaryItem.name || `Order ${ord.orderNumber}`}
                                  </h3>
                                  <div style={{ fontSize: '0.75rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 800, color: '#444' }}>{ord.orderNumber}</span>
                                    <span>•</span>
                                    <span>{new Date(ord.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span>•</span>
                                    <span>{totalItemsQty} item{totalItemsQty > 1 ? 's' : ''}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Total Amount, Status Badge & Expand/Collapse Toggle */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--color-forest)' }}>
                                    ₹{formatPrice(ord.totalAmount || 0)}
                                  </div>
                                  <span style={{
                                    display: 'inline-block',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '12px',
                                    fontSize: '0.65rem',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    backgroundColor: statusColor + '20',
                                    color: statusColor,
                                    border: `1px solid ${statusColor}`
                                  }}>
                                    {ord.status}
                                  </span>
                                </div>

                                <div style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '50%',
                                  backgroundColor: isExpanded ? 'var(--color-forest)' : '#f5efe6',
                                  color: isExpanded ? '#ffffff' : 'var(--color-forest)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s ease',
                                  flexShrink: 0
                                }}>
                                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                              </div>
                            </div>

                            {/* Collapsible Body (Opens on Click / Collapse) */}
                            {isExpanded && (
                              <div style={{ borderTop: '1px solid #eee', marginTop: '0.85rem', paddingTop: '0.85rem', animation: 'fadeIn 0.2s ease-out' }}>
                                {/* Detailed Meta Grid */}
                                <div className="order-meta-grid" style={{ marginBottom: '0.85rem', paddingBottom: '0.85rem' }}>
                                  <div>
                                    <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Order ID</span>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--color-forest)', wordBreak: 'break-all' }}>{ord.orderNumber}</div>
                                  </div>

                                  <div>
                                    <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Placed On</span>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#333' }}>
                                      {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </div>
                                  </div>

                                  <div>
                                    <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Total Paid</span>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--color-forest)' }}>
                                      ₹{formatPrice(ord.totalAmount || 0)}
                                    </div>
                                  </div>

                                  <div>
                                    <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', fontWeight: 800, display: 'block' }}>Payment Method</span>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb' }}>
                                      💳 {ord.paymentMethod?.split('(')[0]?.trim() || (ord.paymentType === 'cash' ? 'Cash on Delivery' : 'Online / UPI')}
                                    </div>
                                    {(ord.transactionId || ord.razorpayPaymentId || (ord.paymentMethod && ord.paymentMethod.includes('pay_'))) && (
                                      <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700, fontFamily: 'monospace', marginTop: '2px', wordBreak: 'break-all' }}>
                                        Txn: {ord.transactionId || ord.razorpayPaymentId || ord.paymentMethod.match(/pay_[a-zA-Z0-9]+/)?.[0]}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Full Items List */}
                                <div style={{ marginBottom: '0.85rem' }}>
                                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#777', textTransform: 'uppercase', fontWeight: 800 }}>Items Breakdown ({items.length})</h4>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {items.map((item: any, idx: number) => (
                                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fdfbf7', padding: '0.55rem 0.75rem', borderRadius: '10px', border: '1px solid #f0e6d8', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
                                          <img
                                            src={item.imageUrl || 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=200&q=80'}
                                            alt={item.name || 'Product'}
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).onerror = null;
                                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=200&q=80';
                                            }}
                                            style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                                          />
                                          <div style={{ overflow: 'hidden' }}>
                                            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-forest)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.name || `Product #${item.productId}`}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#666' }}>Qty: {item.quantity} unit(s)</div>
                                          </div>
                                        </div>
                                        <div style={{ fontWeight: 900, fontSize: '0.88rem', color: 'var(--color-forest)', flexShrink: 0 }}>
                                          ₹{formatPrice((parseFloat(item.price) || 0) * (item.quantity || 1))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Shipping Address & Action Buttons */}
                                <div className="order-footer-row">
                                  <div style={{ fontSize: '0.78rem', color: '#555', flex: '1 1 220px' }}>
                                    📍 <strong>Shipping Address:</strong> {ord.shippingAddress}
                                  </div>

                                  <div className="order-action-buttons">
                                    {ord.status !== 'cancelled' && ord.status !== 'inactive' && ord.status !== 'delivered' && ord.status !== 'returned' && (
                                      <button
                                        onClick={() => {
                                          setTrackingOrder(ord);
                                          setIsTrackerOpen(true);
                                        }}
                                        style={{
                                          padding: '0.45rem 0.85rem',
                                          borderRadius: '8px',
                                          border: 'none',
                                          backgroundColor: 'var(--color-forest)',
                                          color: '#ffffff',
                                          fontWeight: 800,
                                          fontSize: '0.78rem',
                                          cursor: 'pointer',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '0.35rem',
                                          boxShadow: '0 2px 6px rgba(22,35,26,0.15)'
                                        }}
                                      >
                                        <Truck size={14} color="var(--color-gold)" /> Track Order Status
                                      </button>
                                    )}

                                    {ord.status !== 'cancelled' && ord.status !== 'returned' && ord.status !== 'delivered' && (
                                      <button
                                        onClick={() => handleCancelOrder(ord.id)}
                                        style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #fca5a5', backgroundColor: '#fef2f2', color: '#ef4444', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                                      >
                                        Cancel Order
                                      </button>
                                    )}

                                    {ord.status === 'delivered' && (
                                      <>
                                        <button
                                          onClick={() => openReviewModal(ord)}
                                          style={{
                                            padding: '0.45rem 0.8rem',
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
                                          <Star size={13} fill="#eab308" color="#eab308" /> Write Review
                                        </button>
                                        <button
                                          onClick={() => handleReturnOrder(ord.id)}
                                          style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #fed7aa', backgroundColor: '#fff7ed', color: '#ea580c', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                                        >
                                          Request Return
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
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
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2d5c3', padding: '1.5rem' }}>
              {/* Cart Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, color: 'var(--color-forest)' }}>
                  🛒 My Basket ({dbCartItems ? dbCartItems.length : cartItems.length} items)
                </h2>
              </div>

              {loadingDbCart ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#666' }}>
                  Fetching live cart items from Database API...
                </div>
              ) : (dbCartItems ? dbCartItems.length === 0 : cartItems.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <ShoppingCart size={44} color="var(--color-gold)" style={{ marginBottom: '0.85rem' }} />
                  <h3 style={{ margin: '0 0 0.4rem', fontWeight: 900, fontSize: '1.15rem' }}>Your Basket is Empty</h3>
                  <p style={{ color: '#666', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Add delicious dry fruits and cashews to your basket.</p>
                  <Link href="/" style={{ backgroundColor: 'var(--color-forest)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 800, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center' }}>
                    Explore Store
                  </Link>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                    {(dbCartItems && dbCartItems.length > 0 ? dbCartItems : cartItems.map(i => ({
                      productId: i.product.id,
                      name: i.product.name,
                      price: i.product.price,
                      imageUrl: i.product.imageUrl,
                      quantity: i.quantity
                    }))).map((item: any) => {
                      const priceNum = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
                      return (
                        <div key={item.productId || item.id} className="cart-item-flex">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', overflow: 'hidden' }}>
                            <img src={item.imageUrl} alt={item.name} style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
                            <div style={{ overflow: 'hidden' }}>
                              <h4 style={{ margin: '0 0 0.2rem', fontWeight: 900, color: 'var(--color-forest)', fontSize: '0.92rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{item.name}</h4>
                              <div style={{ fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 800 }}>₹{formatPrice(priceNum)}</div>
                              <div style={{ fontSize: '0.68rem', color: '#888' }}>ID: #{item.productId}</div>
                            </div>
                          </div>

                          <div className="cart-item-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#fff', padding: '0.2rem 0.5rem', borderRadius: '20px', border: '1px solid #ccc' }}>
                              <button onClick={() => handleDbCartUpdateQuantity(item.productId, item.quantity - 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 900, padding: '0 0.35rem' }}>-</button>
                              <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{item.quantity}</span>
                              <button onClick={() => handleDbCartUpdateQuantity(item.productId, item.quantity + 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 900, padding: '0 0.35rem' }}>+</button>
                            </div>

                            <div style={{ fontWeight: 900, fontSize: '0.95rem', color: 'var(--color-forest)' }}>
                              ₹{formatPrice(priceNum * item.quantity)}
                            </div>

                            <button onClick={() => handleDbCartRemoveItem(item.productId)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }} title="Remove item">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="cart-checkout-bar">
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-forest)' }}>
                      Total: <span style={{ color: 'var(--color-gold)' }}>
                        ₹{formatPrice(dbCartItems && dbCartItems.length > 0
                          ? dbCartItems.reduce((acc, i) => acc + ((typeof i.price === 'number' ? i.price : parseFloat(i.price) || 0) * i.quantity), 0)
                          : totalPrice
                        )}
                      </span>
                    </div>
                    <Link
                      href="/checkout"
                      style={{
                        backgroundColor: 'var(--color-forest)',
                        color: '#fff',
                        padding: '0.75rem 1.6rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 900,
                        fontSize: '0.92rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      Proceed to Checkout <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT & ADDRESS SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2d5c3', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '1.25rem', color: 'var(--color-forest)' }}>
                👤 Personal Information & Delivery Address
              </h2>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem', maxWidth: '600px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: '#333' }}>Full Name</label>
                  <input
                    type="text"
                    value={userData.name}
                    disabled
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: '#333' }}>Email Address</label>
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: '#333' }}>Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Enter 10-digit phone number"
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: '#333' }}>Primary Shipping Address</label>
                  <textarea
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    rows={3}
                    placeholder="Enter complete delivery street address, city, state, and pincode"
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem', color: '#333' }}>GST Number (Optional)</label>
                  <input
                    type="text"
                    value={editGst}
                    onChange={(e) => setEditGst(e.target.value)}
                    placeholder="e.g. 22AAAAA0000A1Z5"
                    style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: 'var(--color-forest)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    fontWeight: 900,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    marginTop: '0.35rem',
                    width: '100%'
                  }}
                >
                  Save Profile Changes
                </button>
              </form>

              {/* SAVED DELIVERY ADDRESSES SECTION */}
              <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2d5c3' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--color-forest)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={18} color="var(--color-gold)" /> Saved Delivery Addresses ({userAddresses.length}/4)
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.2rem 0 0 0' }}>
                      Manage your delivery addresses (Maximum 4 allowed).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenProfileAddAddress}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--color-forest)',
                      backgroundColor: 'rgba(200, 157, 102, 0.15)',
                      border: '1px solid var(--color-gold)',
                      borderRadius: '20px',
                      padding: '0.45rem 0.95rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={15} /> Add New Address {userAddresses.length > 0 ? `(${userAddresses.length}/4)` : ''}
                  </button>
                </div>

                {/* SAVED ADDRESS CARDS IN PROFILE */}
                {userAddresses.length === 0 ? (
                  <div style={{ padding: '2rem 1.5rem', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '1px dashed #ccc' }}>
                    <MapPin size={28} color="#999" style={{ marginBottom: '0.4rem' }} />
                    <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>No saved addresses yet</div>
                    <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '0.2rem', marginBottom: '1rem' }}>Add an address to speed up your checkout process.</div>
                    <button
                      type="button"
                      onClick={handleOpenProfileAddAddress}
                      style={{
                        backgroundColor: 'var(--color-forest)',
                        color: '#fff',
                        padding: '0.6rem 1.25rem',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Add Address
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {userAddresses.map((addr) => {
                      return (
                        <div
                          key={addr.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            padding: '1rem 1.25rem',
                            borderRadius: '12px',
                            border: addr.isDefault ? '2px solid var(--color-forest)' : '1px solid #e2e8f0',
                            backgroundColor: addr.isDefault ? '#f8faf8' : '#ffffff',
                            maxWidth: '650px',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                              <strong style={{ fontSize: '0.95rem', color: 'var(--color-forest)' }}>{addr.fullName}</strong>
                              {addr.isDefault ? (
                                <span style={{ fontSize: '0.68rem', backgroundColor: '#e2ece4', color: 'var(--color-forest)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 800 }}>
                                  DEFAULT ADDRESS
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultProfileAddress(addr.id)}
                                  style={{
                                    fontSize: '0.72rem',
                                    color: 'var(--color-gold)',
                                    backgroundColor: 'transparent',
                                    border: '1px dashed var(--color-gold)',
                                    padding: '0.1rem 0.5rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                  }}
                                >
                                  Set as default
                                </button>
                              )}
                              <span style={{ fontSize: '0.8rem', color: '#666', backgroundColor: '#f3f4f6', padding: '0.1rem 0.45rem', borderRadius: '6px' }}>
                                📞 {addr.phone}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.88rem', color: '#444', lineHeight: '1.4' }}>
                              {addr.streetAddress}, {addr.city} {addr.state ? `, ${addr.state}` : ''} - <strong>{addr.postalCode}</strong>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.75rem' }}>
                            <button
                              type="button"
                              title="Edit Address"
                              onClick={() => handleStartProfileEdit(addr)}
                              style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '0.45rem',
                                cursor: 'pointer',
                                color: 'var(--color-forest)',
                              }}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              title="Delete Address (Soft Delete)"
                              onClick={() => handleDeleteProfileAddress(addr.id)}
                              style={{
                                background: '#fff1f2',
                                border: '1px solid #fecdd3',
                                borderRadius: '8px',
                                padding: '0.45rem',
                                cursor: 'pointer',
                                color: '#e11d48',
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

                <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                  <h4 style={{ color: '#dc2626', fontSize: '0.95rem', fontWeight: 900, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Trash2 size={16} /> Danger Zone: Delete Account
                  </h4>
                  <p style={{ color: '#6b7280', fontSize: '0.82rem', marginBottom: '0.85rem', lineHeight: 1.5 }}>
                    Once you delete your account, your account status will be set to inactive and you will not be able to log in again without contacting support.
                  </p>
                  <button
                    type="button"
                    onClick={() => setDeleteModalOpen(true)}
                    style={{
                      backgroundColor: '#fff',
                      color: '#dc2626',
                      border: '1px solid #f87171',
                      padding: '0.65rem 1.25rem',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                  >
                    <Trash2 size={15} /> Delete My Account
                  </button>
                </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Order Delivery Tracker Modal */}
      <OrderTrackerModal
        order={trackingOrder}
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      {/* Delete Account Confirmation Modal */}
      {deleteModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '1.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', position: 'relative' }}>
            <button
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeletingAccount}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
            >
              <X size={20} />
            </button>

            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Trash2 size={24} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-forest)', margin: '0 0 0.5rem' }}>
              Delete Account
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Are you sure you want to delete your account <strong>{userData.name || userData.email || ''}</strong>?
              <br /><br />
              This action will mark your account as <strong>inactive</strong>. You will be logged out and cannot sign in again unless reactivated by support.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeletingAccount}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#374151', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#dc2626', color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', opacity: isDeletingAccount ? 0.7 : 1 }}
              >
                {isDeletingAccount ? (
                  <>Deleting...</>
                ) : (
                  <>
                    <Trash2 size={15} /> Yes, Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Modal for Delivered Orders */}
      {reviewModalOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}>
            <button
              onClick={() => setReviewModalOrder(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Star size={20} fill="#eab308" color="#eab308" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-forest)', margin: 0 }}>
                Write Verified Product Reviews
              </h3>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#666', marginBottom: '1.15rem' }}>
              Order <strong style={{ color: 'var(--color-forest)' }}>{reviewModalOrder.orderNumber || reviewModalOrder.customId}</strong> ({reviewModalOrder.items?.length || 1} Item{(reviewModalOrder.items?.length || 1) > 1 ? 's' : ''})
            </p>

            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {(reviewModalOrder.items && reviewModalOrder.items.length > 0 ? reviewModalOrder.items : [{ id: 1, productId: 1, name: 'Product' }]).map((item: any, idx: number) => {
                const pId = Number(item.productId || item.id || 1);
                const rData = itemsReviewData[pId] || { rating: 5, title: '', comment: '' };

                return (
                  <div key={pId || idx} style={{ backgroundColor: '#fcfbf8', borderRadius: '12px', border: '1px solid #e8e2d5', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80'}
                        alt={item.name || 'Product'}
                        style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd', flexShrink: 0 }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--color-forest)' }}>
                          {item.name || `Product #${pId}`}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Qty: {item.quantity || 1}</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem', color: '#444' }}>Rating for this product</label>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateItemReviewField(pId, 'rating', star)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.1rem' }}
                          >
                            <Star
                              size={22}
                              fill={star <= (rData.rating || 5) ? '#eab308' : '#e5e7eb'}
                              color={star <= (rData.rating || 5) ? '#eab308' : '#d1d5db'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={4}
                        placeholder="Write your review description for this product..."
                        value={rData.comment || ''}
                        onChange={(e) => updateItemReviewField(pId, 'comment', e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.88rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                );
              })}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setReviewModalOrder(null)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#666', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', flex: '1 1 auto' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-forest)', color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', flex: '1 1 auto' }}
                >
                  {submittingReview ? 'Submitting...' : 'Submit All Reviews'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Address Modal Popup */}
      <AddressModal
        isOpen={isProfileAddressModalOpen}
        onClose={() => setIsProfileAddressModalOpen(false)}
        addressToEdit={profileAddressToEdit}
        defaultName={userData.name || ''}
        defaultPhone={userData.phone || ''}
        onSaveSuccess={async () => {
          await loadProfileAddresses();
          showToast('Address saved successfully!');
        }}
      />
    </div>
  );
}
