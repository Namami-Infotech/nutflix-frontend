'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  FolderTree,
  Image as ImageIcon,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  CreditCard,
  Search,
  RefreshCw,
  Lock,
  CheckCircle,
  AlertCircle,
  Crown,
  Sparkles,
  Tag,
  Upload,
  Loader2,
  Plus,
  X,
  Menu
} from 'lucide-react';
import { ImageCropperModal } from '@/components/ui/ImageCropperModal';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import BrandLogo from '@/components/BrandLogo';
import {
  fetchAdminOrders,
  updateOrderStatus,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  fetchUsers,
  deleteUser,
  updateUserStatic,
  loginUser,
  fetchPaymentTypes,
  updatePaymentTypeStatus,
  uploadImage,
  PaymentType,
  logoutUser,
  getUserFromCookie,
  setUserCookie,
  setCookie,
  formatPrice
} from '@/lib/api';

import AdminSidebar, { SidebarItem } from './AdminSidebar';
import DashboardView from './DashboardView';
import UsersView from './UsersView';
import ProductsView from './ProductsView';
import CategoriesView from './CategoriesView';
import BannersView from './BannersView';
import NewOrdersView from './NewOrdersView';
import DeliveredOrdersView from './DeliveredOrdersView';
import CancelledOrdersView from './CancelledOrdersView';
import PaymentsView from './PaymentsView';

export default function AdminView() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [emailInput, setEmailInput] = useState('admin@nutflix.com');
  const [passwordInput, setPasswordInput] = useState('123456');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Menu
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');

  // Sidebar responsive collapse & mobile states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth <= 768) {
          setIsSidebarCollapsed(false);
        } else if (window.innerWidth <= 1024) {
          setIsSidebarCollapsed(true);
        } else {
          setIsSidebarCollapsed(false);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Master Data States
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [paymentTypesList, setPaymentTypesList] = useState<PaymentType[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Form States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    sellingPrice: '',
    stock: '100',
    categoryId: 1,
    imageUrl: '',
    description: '',
    origin: 'Kolkata Reserve',
    weight: '250',
    unit: 'g',
    isFeatured: true
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    imageUrl: ''
  });

  // Keywords Tag States
  const [productKeywords, setProductKeywords] = useState<string[]>([]);
  const [productKeywordInput, setProductKeywordInput] = useState('');
  const [categoryKeywords, setCategoryKeywords] = useState<string[]>([]);
  const [categoryKeywordInput, setCategoryKeywordInput] = useState('');

  const handleAddProductKeyword = () => {
    if (!productKeywordInput.trim()) return;
    const parts = productKeywordInput.split(',').map(s => s.trim()).filter(Boolean);
    setProductKeywords(prev => {
      const updated = Array.from(new Set([...prev, ...parts]));
      return updated.slice(0, 100);
    });
    setProductKeywordInput('');
  };

  const handleRemoveProductKeyword = (kwToRemove: string) => {
    setProductKeywords(prev => prev.filter(k => k.toLowerCase() !== kwToRemove.toLowerCase()));
  };

  const handleAddCategoryKeyword = () => {
    if (!categoryKeywordInput.trim()) return;
    const parts = categoryKeywordInput.split(',').map(s => s.trim()).filter(Boolean);
    setCategoryKeywords(prev => {
      const updated = Array.from(new Set([...prev, ...parts]));
      return updated.slice(0, 100);
    });
    setCategoryKeywordInput('');
  };

  const handleRemoveCategoryKeyword = (kwToRemove: string) => {
    setCategoryKeywords(prev => prev.filter(k => k.toLowerCase() !== kwToRemove.toLowerCase()));
  };

  // Upload Loading States
  const [uploadingProduct, setUploadingProduct] = useState(false);
  const [uploadingCategory, setUploadingCategory] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Admin Cropper States
  const [adminCropperOpen, setAdminCropperOpen] = useState(false);
  const [adminCropperSrc, setAdminCropperSrc] = useState<string | null>(null);
  const [adminCropperAspect, setAdminCropperAspect] = useState<number>(1);
  const [adminCropperTitle, setAdminCropperTitle] = useState('Crop Image');
  const [adminCropperTarget, setAdminCropperTarget] = useState<'product' | 'category' | 'banner'>('product');

  const handleProductFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size exceeds 5MB limit. Please choose an image under 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAdminCropperSrc(reader.result as string);
          setAdminCropperAspect(1); // 1:1 Square ratio for product
          setAdminCropperTitle('Crop Product Image (1:1 Square)');
          setAdminCropperTarget('product');
          setAdminCropperOpen(true);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleCategoryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size exceeds 5MB limit. Please choose an image under 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAdminCropperSrc(reader.result as string);
          setAdminCropperAspect(1); // 1:1 Square ratio for category
          setAdminCropperTitle('Crop Category Image (1:1 Square)');
          setAdminCropperTarget('category');
          setAdminCropperOpen(true);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size exceeds 5MB limit. Please choose an image under 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAdminCropperSrc(reader.result as string);
          setAdminCropperAspect(1900 / 650); // 1900x650 ratio for hero banner
          setAdminCropperTitle('Crop Hero Banner Image (1900×650)');
          setAdminCropperTarget('banner');
          setAdminCropperOpen(true);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [bannerForm, setBannerForm] = useState({
    badgeText: 'Premium Harvest Special',
    title: 'Handcrafted Premium Dry Fruits,',
    highlightText: 'Harvested With Care.',
    ctaText: 'Shop Premium Dry Fruits',
    ctaLink: '#products',
    imageUrl: ''
  });

  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    itemName?: string;
    itemType?: string;
    warningNote?: React.ReactNode;
    confirmText?: string;
    onConfirm: () => Promise<void> | void;
    isLoading?: boolean;
  }>({
    isOpen: false,
    title: '',
    onConfirm: () => {},
  });

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = getUserFromCookie();
      if (storedUser) {
        const isRoleAdmin = storedUser?.role?.toLowerCase() === 'admin';
        if (isRoleAdmin) {
          setIsAdminLoggedIn(true);
          setAdminUser(storedUser);
        } else {
          setIsAdminLoggedIn(false);
          setAdminUser(null);
        }
      }
    }
    setIsCheckingAuth(false);
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    setLoadingData(true);
    try {
      const [ordersRes, productsRes, categoriesRes, bannersRes, usersRes, paymentTypesRes] = await Promise.all([
        fetchAdminOrders(),
        fetchProducts({ includeInactive: true }),
        fetchCategories({ includeInactive: true }),
        fetchBanners({ includeInactive: true }),
        fetchUsers(),
        fetchPaymentTypes()
      ]);
      setOrders(ordersRes || []);
      setProducts(productsRes || []);
      setCategories(categoriesRes || []);
      setBanners(bannersRes || []);
      setUsersList(usersRes || []);
      setPaymentTypesList(paymentTypesRes || []);
    } catch (err) {
      console.error('Error loading master data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleTogglePaymentStatus = async (id: number, currentStatus: 'active' | 'inactive') => {
    const newStatus: 'active' | 'inactive' = currentStatus === 'active' ? 'inactive' : 'active';
    setPaymentTypesList(prev => prev.map(pt => pt.id === id ? { ...pt, status: newStatus } : pt));
    const res = await updatePaymentTypeStatus(id, newStatus);
    if (res.success) {
      showToast(`Payment method status updated to ${newStatus.toUpperCase()}`);
    } else {
      showToast('Failed to update payment status', 'error');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await loginUser({ email: emailInput.trim(), password: passwordInput });
      if (res.success && res.data) {
        const user = res.data.user;
        const isRoleAdmin = user?.role?.toLowerCase() === 'admin';
        if (!isRoleAdmin) {
          setLoginError('Access Denied: Only users with Admin role can access the Admin Panel.');
          return;
        }
        if (typeof window !== 'undefined') {
          setCookie('accessToken', res.data.accessToken);
          setCookie('nutflix_accessToken', res.data.accessToken);
          if (res.data.refreshToken) {
            setCookie('refreshToken', res.data.refreshToken);
            setCookie('nutflix_refreshToken', res.data.refreshToken);
          }
          setUserCookie(user);
        }
        setIsAdminLoggedIn(true);
        setAdminUser(user);
        showToast('Welcome back, Admin!');
      } else {
        setLoginError(res.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setLoginError('Server error during admin login.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch (e) {
      // ignore
    }
    if (typeof window !== 'undefined') {
      window.location.replace('/');
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order #${orderId} status updated to "${newStatus}"`);
    } else {
      showToast('Failed to update order status', 'error');
    }
  };

  // PRODUCT CRUD
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.imageUrl) {
      showToast('Please upload a product image first.', 'error');
      return;
    }

    const regPrice = parseFloat(productForm.price);
    if (isNaN(regPrice) || regPrice <= 0) {
      showToast('Please enter a valid regular price / MRP (greater than 0)', 'error');
      return;
    }

    if (productForm.sellingPrice !== undefined && productForm.sellingPrice !== '' && productForm.sellingPrice !== null) {
      const sellPrice = parseFloat(productForm.sellingPrice);
      if (isNaN(sellPrice) || sellPrice < 0) {
        showToast('Please enter a valid selling price', 'error');
        return;
      }
      if (sellPrice > regPrice) {
        showToast(`Selling price (₹${sellPrice}) cannot be greater than Regular Price / MRP (₹${regPrice})`, 'error');
        return;
      }
    }

    let finalImageUrl = productForm.imageUrl;
    if (finalImageUrl.startsWith('data:')) {
      showToast('Uploading product image to server...');
      const uploadRes = await uploadImage(finalImageUrl);
      if (uploadRes.success && uploadRes.url) {
        finalImageUrl = uploadRes.url;
      }
    }

    const cleanName = productForm.name.trim();
    let kwList = [...productKeywords];
    if (cleanName && !kwList.some(k => k.toLowerCase() === cleanName.toLowerCase())) {
      kwList.unshift(cleanName);
    }
    const finalKeywords = Array.from(new Set(kwList.map(k => k.trim()).filter(Boolean))).slice(0, 100);
    const payload = { ...productForm, imageUrl: finalImageUrl, stock: Number(productForm.stock) || 0, keywords: finalKeywords };

    if (editingProduct) {
      const res = await updateProduct(editingProduct.id, payload);
      if (res.success) {
        showToast('Product updated successfully!');
        setProductModalOpen(false);
        loadMasterData();
      } else {
        showToast(res.message || 'Failed to update product', 'error');
      }
    } else {
      const res = await createProduct(payload);
      if (res.success) {
        showToast('New product created!');
        setProductModalOpen(false);
        loadMasterData();
      } else {
        showToast(res.message || 'Failed to create product', 'error');
      }
    }
  };

  const handleDeleteProduct = (id: number) => {
    const prod = products.find(p => p.id === id);
    setDeleteConfirmModal({
      isOpen: true,
      title: 'Deactivate Product',
      itemName: prod?.name || `Product #${id}`,
      itemType: 'product',
      warningNote: 'This action will deactivate the product. You can activate it again anytime.',
      confirmText: 'Yes, Deactivate Product',
      onConfirm: async () => {
        setDeleteConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          const res = await deleteProduct(id);
          if (res.success) {
            showToast('Product status set to inactive');
            setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'inactive' } : p));
            setDeleteConfirmModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
          } else {
            showToast(res.message || 'Failed to deactivate product', 'error');
            setDeleteConfirmModal(prev => ({ ...prev, isLoading: false }));
          }
        } catch (err: any) {
          showToast(err?.message || 'Failed to deactivate product', 'error');
          setDeleteConfirmModal(prev => ({ ...prev, isLoading: false }));
        }
      }
    });
  };

  const handleActivateProduct = async (id: number) => {
    try {
      const res = await updateProduct(id, { status: 'active' });
      if (res.success) {
        showToast('Product activated successfully!');
        setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'active' } : p));
      } else {
        showToast(res.message || 'Failed to activate product', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to activate product', 'error');
    }
  };

  // CATEGORY CRUD
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.imageUrl) {
      showToast('Please upload a category image first.', 'error');
      return;
    }

    let finalImageUrl = categoryForm.imageUrl;
    if (finalImageUrl.startsWith('data:')) {
      showToast('Uploading category image to server...');
      const uploadRes = await uploadImage(finalImageUrl);
      if (uploadRes.success && uploadRes.url) {
        finalImageUrl = uploadRes.url;
      }
    }

    const cleanName = categoryForm.name.trim();
    let kwList = [...categoryKeywords];
    if (cleanName && !kwList.some(k => k.toLowerCase() === cleanName.toLowerCase())) {
      kwList.unshift(cleanName);
    }
    const finalKeywords = Array.from(new Set(kwList.map(k => k.trim()).filter(Boolean))).slice(0, 100);
    const payload = { ...categoryForm, imageUrl: finalImageUrl, keywords: finalKeywords };

    if (editingCategory) {
      const res = await updateCategory(editingCategory.id, payload);
      if (res.success) {
        showToast('Category updated!');
        setCategoryModalOpen(false);
        loadMasterData();
      } else {
        showToast(res.message || 'Failed to update category', 'error');
      }
    } else {
      const res = await createCategory(payload);
      if (res.success) {
        showToast('New Category added!');
        setCategoryModalOpen(false);
        loadMasterData();
      } else {
        showToast(res.message || 'Failed to add category', 'error');
      }
    }
  };

  const handleDeleteCategory = (id: number) => {
    const cat = categories.find(c => c.id === id);
    setDeleteConfirmModal({
      isOpen: true,
      title: 'Deactivate Category',
      itemName: cat?.name || `Category #${id}`,
      itemType: 'category',
      warningNote: 'This action will mark this category as inactive. You can activate it again anytime.',
      confirmText: 'Yes, Deactivate Category',
      onConfirm: async () => {
        setDeleteConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          const res = await deleteCategory(id);
          if (res.success) {
            showToast('Category status set to inactive');
            setCategories(prev => prev.map(c => c.id === id ? { ...c, status: 'inactive' } : c));
            setDeleteConfirmModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
          } else {
            showToast(res.message || 'Failed to deactivate category', 'error');
            setDeleteConfirmModal(prev => ({ ...prev, isLoading: false }));
          }
        } catch (err: any) {
          showToast(err?.message || 'Failed to deactivate category', 'error');
          setDeleteConfirmModal(prev => ({ ...prev, isLoading: false }));
        }
      }
    });
  };

  const handleActivateCategory = async (id: number) => {
    try {
      const res = await updateCategory(id, { status: 'active' });
      if (res.success) {
        showToast('Category activated successfully!');
        setCategories(prev => prev.map(c => c.id === id ? { ...c, status: 'active' } : c));
      } else {
        showToast(res.message || 'Failed to activate category', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to activate category', 'error');
    }
  };

  // BANNER CRUD
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingBanner) {
      const activeBannersCount = banners.filter(b => b.status !== 'inactive' && b.isActive !== false).length;
      if (activeBannersCount >= 10) {
        showToast('Maximum 10 active banners allowed. Please deactivate an existing banner first.', 'error');
        return;
      }
    }

    if (!bannerForm.imageUrl) {
      showToast('Please upload a banner image first.', 'error');
      return;
    }

    let finalImageUrl = bannerForm.imageUrl;
    if (finalImageUrl.startsWith('data:')) {
      showToast('Uploading banner image to server...');
      const uploadRes = await uploadImage(finalImageUrl);
      if (uploadRes.success && uploadRes.url) {
        finalImageUrl = uploadRes.url;
      }
    }

    const payload = { ...bannerForm, imageUrl: finalImageUrl };

    if (editingBanner) {
      const res = await updateBanner(editingBanner.id, payload);
      if (res.success) {
        showToast('Banner updated!');
        setBannerModalOpen(false);
        loadMasterData();
      } else {
        showToast(res.message || 'Failed to update banner', 'error');
      }
    } else {
      const res = await createBanner(payload);
      if (res.success) {
        showToast('New Hero Banner added!');
        setBannerModalOpen(false);
        loadMasterData();
      } else {
        showToast(res.message || 'Failed to add banner', 'error');
      }
    }
  };

  const handleDeleteBanner = (id: number) => {
    const b = banners.find(item => item.id === id);
    setDeleteConfirmModal({
      isOpen: true,
      title: 'Deactivate Banner',
      itemName: b?.title || `Banner #${id}`,
      itemType: 'banner',
      warningNote: 'This action will deactivate this banner. You can activate it again anytime.',
      confirmText: 'Yes, Deactivate Banner',
      onConfirm: async () => {
        setDeleteConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          const res = await deleteBanner(id);
          if (res.success) {
            showToast('Banner status set to inactive');
            setBanners(prev => prev.map(bItem => bItem.id === id ? { ...bItem, status: 'inactive', isActive: false } : bItem));
            setDeleteConfirmModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
          } else {
            showToast(res.message || 'Failed to deactivate banner', 'error');
            setDeleteConfirmModal(prev => ({ ...prev, isLoading: false }));
          }
        } catch (err: any) {
          showToast(err?.message || 'Failed to deactivate banner', 'error');
          setDeleteConfirmModal(prev => ({ ...prev, isLoading: false }));
        }
      }
    });
  };

  const handleActivateBanner = async (id: number) => {
    const activeBannersCount = banners.filter(b => b.status !== 'inactive' && b.isActive !== false).length;
    if (activeBannersCount >= 10) {
      showToast('Cannot activate banner. Maximum 10 active banners allowed. Please deactivate an existing banner first.', 'error');
      return;
    }

    try {
      const res = await updateBanner(id, { status: 'active', isActive: true });
      if (res.success) {
        showToast('Banner activated successfully!');
        setBanners(prev => prev.map(b => b.id === id ? { ...b, status: 'active', isActive: true } : b));
      } else {
        showToast(res.message || 'Failed to activate banner', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to activate banner', 'error');
    }
  };

  const handleDeleteUser = (id: number) => {
    const usr = usersList.find(u => u.id === id);
    setDeleteConfirmModal({
      isOpen: true,
      title: 'Deactivate User Account',
      itemName: usr?.name || usr?.email || `User #${id}`,
      itemType: 'user account',
      warningNote: 'This action will mark the user account as inactive.',
      confirmText: 'Yes, Deactivate User',
      onConfirm: async () => {
        setDeleteConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          const res = await deleteUser(id);
          if (res.success) {
            showToast('User status set to inactive');
            setUsersList(prev => prev.map(u => u.id === id ? { ...u, status: 'inactive' } : u));
            setDeleteConfirmModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
          } else {
            showToast(res.message || 'Failed to deactivate user', 'error');
            setDeleteConfirmModal(prev => ({ ...prev, isLoading: false }));
          }
        } catch (err: any) {
          showToast(err?.message || 'Failed to deactivate user', 'error');
          setDeleteConfirmModal(prev => ({ ...prev, isLoading: false }));
        }
      }
    });
  };

  const handleToggleUserStatic = async (id: number, isStatic: boolean) => {
    // Optimistic UI update
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, static: isStatic } : u));
    const res = await updateUserStatic(id, isStatic);
    if (res.success) {
      showToast(isStatic ? 'Static OTP mode activated (OTP: 123456, SMS bypass)' : 'Static OTP mode deactivated');
    } else {
      // Revert if failed
      setUsersList(prev => prev.map(u => u.id === id ? { ...u, static: !isStatic } : u));
      showToast(res.message || 'Failed to update static OTP mode', 'error');
    }
  };

  // CALCULATIONS
  const totalOrdersCount = orders.length;
  const newOrdersList = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled' && o.status !== 'returned');
  const deliveredOrdersList = orders.filter(o => o.status === 'delivered');
  const cancelledOrdersList = orders.filter(o => o.status === 'cancelled' || o.status === 'returned');

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled' && o.status !== 'returned')
    .reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);

  const paymentBreakdown = orders.reduce((acc: any, ord: any) => {
    const method = ord.paymentMethod || 'UPI';
    if (!acc[method]) acc[method] = { count: 0, total: 0 };
    acc[method].count += 1;
    acc[method].total += parseFloat(ord.totalAmount) || 0;
    return acc;
  }, {});

  // Sidebar Config
  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'users', label: 'Total Users', icon: Users, badge: null },
    { id: 'products', label: 'Total Products', icon: Package, badge: null },
    { id: 'categories', label: 'Total Categories', icon: FolderTree, badge: null },
    { id: 'banners', label: 'Banners Upload', icon: ImageIcon, badge: null },
    { id: 'new_orders', label: 'All Orders', icon: ShoppingBag, badge: null, color: '#3b82f6' },
    { id: 'delivered_orders', label: 'Delivered Orders', icon: CheckCircle2, badge: null, color: '#10b981' },
    { id: 'cancelled_orders', label: 'Cancelled / Returned', icon: XCircle, badge: null, color: '#ef4444' },
    { id: 'payments', label: 'Payment Types', icon: CreditCard, badge: null },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf7f2', color: '#1e293b', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 1000000,
          backgroundColor: toastMsg.type === 'error' ? '#ef4444' : '#10b981',
          color: '#fff',
          padding: '0.85rem 1.4rem',
          borderRadius: '12px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
          fontWeight: 800,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toastMsg.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          {toastMsg.text}
        </div>
      )}

      {isCheckingAuth || isLoggingOut ? (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0b1f16 0%, #112d20 50%, #0d1e15 100%)',
          color: '#fff',
          gap: '1rem'
        }}>
          <RefreshCw size={36} style={{ animation: 'spin 1s linear infinite', color: '#f59e0b' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
            {isLoggingOut ? 'Logging out of Admin...' : 'Verifying admin session...'}
          </span>
        </div>
      ) : !isAdminLoggedIn ? (
        /* PREMIUM ADMIN LOGIN SCREEN */
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0b1f16 0%, #112d20 50%, #0d1e15 100%)',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Background Glows */}
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

          <div style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            padding: '3rem 2.5rem',
            borderRadius: '24px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <BrandLogo width={180} height={55} variant="light" />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f291e', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
                Admin Portal
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                Enter credentials to access Nutflix E-Commerce management.
              </p>
            </div>

            {loginError && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '0.85rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: 700 }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.45rem', color: '#334155' }}>Admin Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@nutflix.com"
                  required
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.92rem', outline: 'none', transition: 'border-color 0.2s' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.45rem', color: '#334155' }}>Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '0.92rem', outline: 'none', transition: 'border-color 0.2s' }}
                />
              </div>

              <div style={{ backgroundColor: '#faf8f5', border: '1px solid #f0e6d8', padding: '0.9rem 1rem', borderRadius: '12px', fontSize: '0.78rem', color: '#475569', lineHeight: 1.6 }}>
                🔑 <strong>Default Credentials:</strong><br />
                Email: <code style={{ color: '#b45309', fontWeight: 800 }}>admin@nutflix.com</code> | Password: <code style={{ color: '#b45309', fontWeight: 800 }}>123456</code>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                style={{
                  background: 'linear-gradient(135deg, #0f291e 0%, #1a4332 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.95rem',
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '0.98rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(15, 41, 30, 0.3)',
                  transition: 'transform 0.2s'
                }}
              >
                {loginLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* FULL DASHBOARD LAYOUT WITH SIDEBAR */
        <div style={{ display: 'flex', height: '100vh', flexGrow: 1, overflow: 'hidden' }}>
          {/* SIDEBAR COMPONENT */}
          <AdminSidebar
            activeMenu={activeMenu}
            setActiveMenu={(menu) => { setActiveMenu(menu); setSearchQuery(''); }}
            sidebarItems={sidebarItems}
            adminUser={adminUser}
            onLogout={handleLogout}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            mobileOpen={mobileSidebarOpen}
            setMobileOpen={setMobileSidebarOpen}
          />

          {/* MAIN WORKSPACE PANEL */}
          <main style={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
            {/* Top Navigation Bar (Fixed at top) */}
            <header style={{
              backgroundColor: '#fff',
              borderBottom: '1px solid #e2e8f0',
              padding: '0.65rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                      setMobileSidebarOpen(!mobileSidebarOpen);
                    } else {
                      setIsSidebarCollapsed(!isSidebarCollapsed);
                    }
                  }}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.45rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1e293b',
                    transition: 'all 0.2s',
                  }}
                  title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                  <Menu size={18} />
                </button>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f291e', letterSpacing: '-0.02em', textTransform: 'capitalize' }}>
                  {sidebarItems.find(s => s.id === activeMenu)?.label || 'Dashboard'}
                </h2>
                {loadingData && (
                  <span style={{ fontSize: '0.72rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '8px', fontWeight: 700 }}>
                    Syncing data...
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Search Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#f8fafc', padding: '0.4rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', width: '200px' }}>
                  <Search size={15} color="#64748b" />
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', width: '100%', color: '#1e293b' }}
                  />
                </div>

                <button
                  onClick={loadMasterData}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                  }}
                >
                  <RefreshCw size={14} /> Sync Data
                </button>
              </div>
            </header>

            {/* View Table Area (Scrollable Body) */}
            <div style={{ padding: '1rem 1.25rem', flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', maxWidth: '100%', boxSizing: 'border-box' }}>
              {activeMenu === 'dashboard' && (
                <DashboardView
                  usersCount={usersList.length}
                  productsCount={products.length}
                  ordersCount={totalOrdersCount}
                  newOrdersCount={newOrdersList.length}
                  deliveredCount={deliveredOrdersList.length}
                  cancelledCount={cancelledOrdersList.length}
                  totalRevenue={totalRevenue}
                  recentOrders={orders}
                  onViewAllOrders={() => setActiveMenu('new_orders')}
                />
              )}

              {activeMenu === 'users' && (
                <UsersView
                  usersList={usersList}
                  searchQuery={searchQuery}
                  onDeleteUser={handleDeleteUser}
                  onToggleStatic={handleToggleUserStatic}
                />
              )}

              {activeMenu === 'products' && (
                <ProductsView
                  products={products}
                  categories={categories}
                  searchQuery={searchQuery}
                  onAddProduct={() => {
                    setEditingProduct(null);
                    setProductForm({ name: '', price: '', sellingPrice: '', stock: '100', categoryId: categories[0]?.id || 1, imageUrl: '', description: '', origin: 'Kolkata Reserve', weight: '250', unit: 'g', isFeatured: true });
                    setProductKeywords([]);
                    setProductKeywordInput('');
                    setProductModalOpen(true);
                  }}
                  onEditProduct={(prod) => {
                    setEditingProduct(prod);
                    setProductForm({ name: prod.name, price: prod.price, sellingPrice: prod.sellingPrice ? String(prod.sellingPrice) : '', stock: String(prod.stock ?? 100), categoryId: prod.categoryId || 1, imageUrl: prod.imageUrl, description: prod.description || '', origin: prod.origin || 'Kolkata Reserve', weight: prod.weight || '250', unit: prod.unit || 'g', isFeatured: Boolean(prod.isFeatured) });
                    const kws = Array.isArray(prod.keywords) ? prod.keywords : (prod.keywords ? JSON.parse(prod.keywords) : (prod.name ? [prod.name] : []));
                    setProductKeywords(kws);
                    setProductKeywordInput('');
                    setProductModalOpen(true);
                  }}
                  onDeleteProduct={handleDeleteProduct}
                  onActivateProduct={handleActivateProduct}
                />
              )}

              {activeMenu === 'categories' && (
                <CategoriesView
                  categories={categories}
                  searchQuery={searchQuery}
                  onAddCategory={() => {
                    setEditingCategory(null);
                    setCategoryForm({ name: '', slug: '', imageUrl: '' });
                    setCategoryKeywords([]);
                    setCategoryKeywordInput('');
                    setCategoryModalOpen(true);
                  }}
                  onEditCategory={(cat) => {
                    setEditingCategory(cat);
                    setCategoryForm({ name: cat.name, slug: cat.slug, imageUrl: cat.imageUrl });
                    const kws = Array.isArray(cat.keywords) ? cat.keywords : (cat.keywords ? JSON.parse(cat.keywords) : (cat.name ? [cat.name] : []));
                    setCategoryKeywords(kws);
                    setCategoryKeywordInput('');
                    setCategoryModalOpen(true);
                  }}
                  onDeleteCategory={handleDeleteCategory}
                  onActivateCategory={handleActivateCategory}
                />
              )}

              {activeMenu === 'banners' && (
                <BannersView
                  banners={banners}
                  searchQuery={searchQuery}
                  onAddBanner={() => {
                    setEditingBanner(null);
                    setBannerForm({ badgeText: 'Premium Harvest Special', title: '', highlightText: '', ctaText: 'Shop Premium Dry Fruits', ctaLink: '#products', imageUrl: '' });
                    setBannerModalOpen(true);
                  }}
                  onEditBanner={(b) => {
                    setEditingBanner(b);
                    setBannerForm({ badgeText: b.badgeText || '', title: b.title || '', highlightText: b.highlightText || '', ctaText: b.ctaText || 'Shop Now', ctaLink: b.ctaLink || '#products', imageUrl: b.imageUrl || '' });
                    setBannerModalOpen(true);
                  }}
                  onDeleteBanner={handleDeleteBanner}
                  onActivateBanner={handleActivateBanner}
                />
              )}

              {activeMenu === 'new_orders' && (
                <NewOrdersView orders={newOrdersList} searchQuery={searchQuery} onStatusChange={handleStatusChange} />
              )}

              {activeMenu === 'delivered_orders' && (
                <DeliveredOrdersView orders={deliveredOrdersList} searchQuery={searchQuery} />
              )}

              {activeMenu === 'cancelled_orders' && (
                <CancelledOrdersView orders={cancelledOrdersList} searchQuery={searchQuery} onStatusChange={handleStatusChange} />
              )}

              {activeMenu === 'payments' && (
                <PaymentsView
                  paymentBreakdown={paymentBreakdown}
                  paymentTypes={paymentTypesList}
                  orders={orders}
                  onTogglePaymentStatus={handleTogglePaymentStatus}
                  onStatusChange={handleStatusChange}
                  searchQuery={searchQuery}
                />
              )}
            </div>
          </main>
        </div>
      )}

      {/* PRODUCT FORM MODAL */}
      {productModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '820px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f291e' }}>
                  {editingProduct ? 'Edit Product Details' : 'Add New Product'}
                </h3>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Provide product details, pricing, weight unit, and image upload.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                style={{ border: 'none', background: '#f1f5f9', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden', margin: 0 }}>
              {/* Scrollable Body */}
              <div style={{ padding: '1.35rem 1.5rem', overflowY: 'auto', flexGrow: 1, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem', color: '#334155' }}>
                      Product Title *
                    </label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      required
                      placeholder="e.g. Swahili Roasted Cashews & Almonds"
                      style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem', color: '#334155' }}>
                      Select Category *
                    </label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: Number(e.target.value) })}
                      required
                      style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', backgroundColor: '#fff' }}
                    >
                      {categories.length === 0 ? (
                        <option value={1}>Default Category</option>
                      ) : (
                        categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* 2-Price Inputs: Regular Price (MRP) & Selling Price */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem', color: '#334155' }}>
                        Regular Price / MRP (₹) *
                      </label>
                      <input
                        type="text"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        required
                        placeholder="e.g. 999"
                        style={{ width: '100%', padding: '0.75rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                      <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                        Cut-through price (<s>₹999</s>)
                      </span>
                    </div>

                    <div>
                      {(() => {
                        const reg = parseFloat(productForm.price) || 0;
                        const sell = parseFloat(productForm.sellingPrice) || 0;
                        const isPriceInvalid = reg > 0 && sell > reg;

                        return (
                          <>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem', color: isPriceInvalid ? '#dc2626' : '#047857' }}>
                              Selling Price (₹)
                            </label>
                            <input
                              type="text"
                              value={productForm.sellingPrice}
                              onChange={(e) => setProductForm({ ...productForm, sellingPrice: e.target.value })}
                              placeholder="e.g. 799 (Optional)"
                              style={{
                                width: '100%',
                                padding: '0.75rem 0.85rem',
                                borderRadius: '10px',
                                border: isPriceInvalid ? '1.5px solid #ef4444' : '1.5px solid #10b981',
                                fontSize: '0.9rem',
                                outline: 'none',
                                backgroundColor: isPriceInvalid ? '#fef2f2' : '#f0fdf4',
                                color: isPriceInvalid ? '#b91c1c' : '#065f46',
                                fontWeight: 800,
                                boxSizing: 'border-box'
                              }}
                            />
                            <span style={{ fontSize: '0.7rem', color: isPriceInvalid ? '#dc2626' : '#059669', marginTop: '3px', display: 'block', fontWeight: isPriceInvalid ? 700 : 400 }}>
                              {isPriceInvalid ? '⚠️ Cannot exceed MRP' : 'Actual customer pay price'}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Calculated Live Discount Preview / Warning */}
                  {(() => {
                    const reg = parseFloat(productForm.price) || 0;
                    const sell = parseFloat(productForm.sellingPrice) || 0;
                    if (reg > 0 && sell > 0 && sell < reg) {
                      const pct = Math.round(((reg - sell) / reg) * 100);
                      const saved = formatPrice(reg - sell);
                      return (
                        <div style={{
                          backgroundColor: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          borderRadius: '10px',
                          padding: '0.6rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          color: '#065f46',
                          fontSize: '0.82rem',
                          fontWeight: 800
                        }}>
                          <span>🎉 Customer Discount: <strong style={{ color: '#047857', fontSize: '0.92rem' }}>{pct}% OFF</strong></span>
                          <span>Save ₹{saved}</span>
                        </div>
                      );
                    }
                    if (reg > 0 && sell > reg) {
                      return (
                        <div style={{
                          backgroundColor: '#fef2f2',
                          border: '1.5px solid #fca5a5',
                          borderRadius: '10px',
                          padding: '0.6rem 0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#b91c1c',
                          fontSize: '0.82rem',
                          fontWeight: 700
                        }}>
                          <span>⚠️ Selling price (₹{sell}) cannot be greater than Regular Price / MRP (₹{reg}).</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
                  {/* Upload Image Section */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem', color: '#334155' }}>
                      Product Image *
                    </label>

                    {/* Integrated File Upload & Preview Box */}
                    <div style={{
                      border: '2px dashed #0284c7',
                      backgroundColor: '#f0f9ff',
                      borderRadius: '14px',
                      padding: productForm.imageUrl && !uploadingProduct ? '0.75rem 1rem' : '1.25rem 1rem',
                      textAlign: 'center',
                      cursor: uploadingProduct ? 'wait' : 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      overflow: 'hidden'
                    }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductFileUpload}
                        id="product-upload-input"
                        disabled={uploadingProduct}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: uploadingProduct ? 'wait' : 'pointer', width: '100%', height: '100%', zIndex: 2 }}
                      />

                      {uploadingProduct ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', pointerEvents: 'none', padding: '0.5rem 0' }}>
                          <Loader2 size={24} color="#0284c7" style={{ animation: 'spin 1s linear infinite' }} />
                          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0369a1' }}>
                            Uploading image to server...
                          </span>
                        </div>
                      ) : productForm.imageUrl ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', textAlign: 'left', minWidth: 0 }}>
                          <img
                            src={productForm.imageUrl}
                            alt="Product Preview"
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', flexShrink: 0 }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div style={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f291e', display: 'block' }}>Image Uploaded ✓</span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block', maxWidth: '100%' }}>
                              {productForm.imageUrl.startsWith('data:') ? 'Uploaded Cropped Image (Base64)' : productForm.imageUrl}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700, display: 'inline-block', marginTop: '0.1rem' }}>
                              Click or drag new image to replace
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setProductForm(prev => ({ ...prev, imageUrl: '' }));
                            }}
                            style={{ zIndex: 3, padding: '0.35rem 0.65rem', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', flexShrink: 0 }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', pointerEvents: 'none' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Upload size={20} color="#0284c7" />
                          </div>
                          <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0369a1' }}>
                            Click or Drag Image File Here to Upload
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            Supports PNG, JPG, WEBP (Max 5MB)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Weight & Unit Section */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem', color: '#334155' }}>
                        Weight Amount *
                      </label>
                      <input
                        type="text"
                        value={productForm.weight}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                          setProductForm({ ...productForm, weight: val });
                        }}
                        maxLength={3}
                        required
                        placeholder="e.g. 250, 500, 1"
                        style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem', color: '#334155' }}>
                        Unit *
                      </label>
                      <select
                        value={productForm.unit}
                        onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                        required
                        style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', backgroundColor: '#fff' }}
                      >
                        <option value="g">Gram (g)</option>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="pack">Pack</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Full Width Sections (Spans across both columns) */}
                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  {/* Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem', color: '#334155' }}>
                      Description
                    </label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      rows={2}
                      placeholder="Provide details about origin, harvest notes..."
                      style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  {/* Keywords / Search Tags */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Tag size={14} color="#0284c7" /> Keywords / Search Tags
                      </label>
                      <span style={{ fontSize: '0.72rem', color: productKeywords.length >= 100 ? '#ef4444' : '#64748b', fontWeight: 700 }}>
                        {Math.min(100, (productForm.name.trim() && !productKeywords.some(k => k.toLowerCase() === productForm.name.trim().toLowerCase()) ? productKeywords.length + 1 : productKeywords.length))}/100 Max
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Type keyword and press Enter..."
                        value={productKeywordInput}
                        onChange={(e) => setProductKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            handleAddProductKeyword();
                          }
                        }}
                        style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                      <button
                        type="button"
                        onClick={handleAddProductKeyword}
                        style={{ padding: '0.65rem 1rem', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Add Tag
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '110px', overflowY: 'auto', padding: '0.4rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      {productForm.name.trim() && (
                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.73rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          📌 {productForm.name.trim()} <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>(Name Auto)</span>
                        </span>
                      )}
                      {productKeywords
                        .filter(k => k.toLowerCase() !== productForm.name.trim().toLowerCase())
                        .map((kw, idx) => (
                          <span key={idx} style={{ backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', padding: '0.2rem 0.55rem', borderRadius: '12px', fontSize: '0.73rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            #{kw}
                            <button type="button" onClick={() => handleRemoveProductKeyword(kw)} style={{ border: 'none', background: 'transparent', color: '#0369a1', cursor: 'pointer', fontWeight: 900, fontSize: '0.75rem', padding: 0, marginLeft: '0.1rem' }}>✕</button>
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#0f291e', color: '#ffffff', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '10px', fontWeight: 900, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(15, 41, 30, 0.25)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={16} /> {editingProduct ? 'Save Product Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY FORM MODAL */}
      {categoryModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '780px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f291e' }}>
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Create or update product category details and banner image.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(false)}
                style={{ border: 'none', background: '#f1f5f9', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveCategory} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden', margin: 0 }}>
              <div style={{ padding: '1.35rem 1.5rem', overflowY: 'auto', flexGrow: 1, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem', color: '#334155' }}>
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      required
                      placeholder="e.g. Organic Almonds"
                      style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem', color: '#334155' }}>
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                      required
                      placeholder="e.g. organic-almonds"
                      style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  {/* Keywords / Search Tags */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Tag size={14} color="#8b5cf6" /> Keywords / Search Tags
                      </label>
                      <span style={{ fontSize: '0.72rem', color: categoryKeywords.length >= 100 ? '#ef4444' : '#64748b', fontWeight: 700 }}>
                        {Math.min(100, (categoryForm.name.trim() && !categoryKeywords.some(k => k.toLowerCase() === categoryForm.name.trim().toLowerCase()) ? categoryKeywords.length + 1 : categoryKeywords.length))}/100 Max
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Type keyword and press Enter..."
                        value={categoryKeywordInput}
                        onChange={(e) => setCategoryKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            handleAddCategoryKeyword();
                          }
                        }}
                        style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCategoryKeyword}
                        style={{ padding: '0.65rem 1rem', backgroundColor: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Add Tag
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '110px', overflowY: 'auto', padding: '0.4rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      {categoryForm.name.trim() && (
                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.73rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          📌 {categoryForm.name.trim()} <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>(Name Auto)</span>
                        </span>
                      )}
                      {categoryKeywords
                        .filter(k => k.toLowerCase() !== categoryForm.name.trim().toLowerCase())
                        .map((kw, idx) => (
                          <span key={idx} style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', border: '1px solid #e9d5ff', padding: '0.2rem 0.55rem', borderRadius: '12px', fontSize: '0.73rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            #{kw}
                            <button type="button" onClick={() => handleRemoveCategoryKeyword(kw)} style={{ border: 'none', background: 'transparent', color: '#6b21a8', cursor: 'pointer', fontWeight: 900, fontSize: '0.75rem', padding: 0, marginLeft: '0.1rem' }}>✕</button>
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
                  {/* Upload Image Section */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem', color: '#334155' }}>
                      Category Cover Image *
                    </label>

                    {/* Integrated File Upload & Preview Box */}
                    <div style={{
                      border: '2px dashed #8b5cf6',
                      backgroundColor: '#f5f3ff',
                      borderRadius: '14px',
                      padding: categoryForm.imageUrl && !uploadingCategory ? '0.75rem 1rem' : '1.25rem 1rem',
                      textAlign: 'center',
                      cursor: uploadingCategory ? 'wait' : 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      overflow: 'hidden'
                    }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCategoryFileUpload}
                        id="category-upload-input"
                        disabled={uploadingCategory}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: uploadingCategory ? 'wait' : 'pointer', width: '100%', height: '100%', zIndex: 2 }}
                      />

                      {uploadingCategory ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', pointerEvents: 'none', padding: '0.5rem 0' }}>
                          <Loader2 size={24} color="#8b5cf6" style={{ animation: 'spin 1s linear infinite' }} />
                          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#6d28d9' }}>
                            Uploading image to server...
                          </span>
                        </div>
                      ) : categoryForm.imageUrl ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', textAlign: 'left', minWidth: 0 }}>
                          <img
                            src={categoryForm.imageUrl}
                            alt="Category Preview"
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #cbd5e1', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', flexShrink: 0 }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div style={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f291e', display: 'block' }}>Image Uploaded ✓</span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block', maxWidth: '100%' }}>
                              {categoryForm.imageUrl.startsWith('data:') ? 'Uploaded Cropped Image (Base64)' : categoryForm.imageUrl}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#8b5cf6', fontWeight: 700, display: 'inline-block', marginTop: '0.1rem' }}>
                              Click or drag new image to replace
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setCategoryForm(prev => ({ ...prev, imageUrl: '' }));
                            }}
                            style={{ zIndex: 3, padding: '0.35rem 0.65rem', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', flexShrink: 0 }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', pointerEvents: 'none' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Upload size={20} color="#8b5cf6" />
                          </div>
                          <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#6d28d9' }}>
                            Click or Drag Image File Here to Upload
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            Supports PNG, JPG, WEBP (Max 5MB)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#0f291e', color: '#ffffff', border: 'none', padding: '0.65rem 1.5rem', borderRadius: '10px', fontWeight: 900, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(15, 41, 30, 0.25)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={16} /> {editingCategory ? 'Save Category Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BANNER FORM MODAL */}
      {bannerModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '780px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f291e' }}>
                  {editingBanner ? 'Edit Banner' : 'Upload Banner'}
                </h3>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Update hero banner headlines and image file.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBannerModalOpen(false)}
                style={{ border: 'none', background: '#f1f5f9', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveBanner} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden', margin: 0 }}>
              {!editingBanner && banners.filter(b => b.status !== 'inactive' && b.isActive !== false).length >= 10 && (
                <div style={{ margin: '1rem 1.5rem 0', padding: '0.75rem 1rem', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderLeft: '4px solid #f59e0b', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#92400e' }}>
                  <AlertCircle size={16} color="#d97706" style={{ flexShrink: 0 }} />
                  <span>
                    <strong>Maximum 10 active banners reached:</strong> You cannot upload more active banners. Please deactivate an existing banner from the table first.
                  </span>
                </div>
              )}
              <div style={{ padding: '1.35rem 1.5rem', overflowY: 'auto', flexGrow: 1, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem', color: '#334155' }}>
                      Banner Main Title *
                    </label>
                    <input
                      type="text"
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                      required
                      placeholder="e.g. Handcrafted Premium Dry Fruits"
                      style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
                  {/* Upload Image Section */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.35rem', color: '#334155' }}>
                      Banner Image *
                    </label>

                    {/* Integrated File Upload & Preview Box */}
                    <div style={{
                      border: '2px dashed #f59e0b',
                      backgroundColor: '#fffbeb',
                      borderRadius: '14px',
                      padding: bannerForm.imageUrl && !uploadingBanner ? '0.75rem 1rem' : '1.25rem 1rem',
                      textAlign: 'center',
                      cursor: uploadingBanner ? 'wait' : 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      overflow: 'hidden'
                    }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerFileUpload}
                        id="banner-upload-input"
                        disabled={uploadingBanner}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: uploadingBanner ? 'wait' : 'pointer', width: '100%', height: '100%', zIndex: 2 }}
                      />

                      {uploadingBanner ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', pointerEvents: 'none', padding: '0.5rem 0' }}>
                          <Loader2 size={24} color="#f59e0b" style={{ animation: 'spin 1s linear infinite' }} />
                          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#b45309' }}>
                            Uploading image to server...
                          </span>
                        </div>
                      ) : bannerForm.imageUrl ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', textAlign: 'left', minWidth: 0 }}>
                          <img
                            src={bannerForm.imageUrl}
                            alt="Banner Preview"
                            style={{ width: '70px', height: '42px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', flexShrink: 0 }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=1600&q=80';
                            }}
                          />
                          <div style={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f291e', display: 'block' }}>Image Uploaded ✓</span>
                            <span style={{ fontSize: '0.72rem', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block', maxWidth: '100%' }}>
                              {bannerForm.imageUrl.startsWith('data:') ? 'Uploaded Cropped Image (Base64)' : bannerForm.imageUrl}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 700, display: 'inline-block', marginTop: '0.1rem' }}>
                              Click or drag new image to replace
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setBannerForm(prev => ({ ...prev, imageUrl: '' }));
                            }}
                            style={{ zIndex: 3, padding: '0.35rem 0.65rem', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', flexShrink: 0 }}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', pointerEvents: 'none' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Upload size={20} color="#d97706" />
                          </div>
                          <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#b45309' }}>
                            Click or Drag Image File Here to Upload
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                            Supports PNG, JPG, WEBP (Max 5MB)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setBannerModalOpen(false)}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#475569', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!editingBanner && banners.filter(b => b.status !== 'inactive' && b.isActive !== false).length >= 10}
                  style={{
                    backgroundColor: (!editingBanner && banners.filter(b => b.status !== 'inactive' && b.isActive !== false).length >= 10) ? '#94a3b8' : '#0f291e',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.65rem 1.5rem',
                    borderRadius: '10px',
                    fontWeight: 900,
                    fontSize: '0.88rem',
                    cursor: (!editingBanner && banners.filter(b => b.status !== 'inactive' && b.isActive !== false).length >= 10) ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(15, 41, 30, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Plus size={16} /> {editingBanner ? 'Save Banner Changes' : 'Upload Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Universal Image Cropper Modal */}
      <ImageCropperModal
        isOpen={adminCropperOpen}
        onClose={() => setAdminCropperOpen(false)}
        imageSrc={adminCropperSrc}
        aspect={adminCropperAspect}
        title={adminCropperTitle}
        targetType={adminCropperTarget}
        onCropComplete={async (croppedBase64) => {
          showToast('Uploading cropped image to server...');
          const uploadRes = await uploadImage(croppedBase64);
          const finalUrl = uploadRes.url || croppedBase64;

          if (adminCropperTarget === 'product') {
            setProductForm(prev => ({ ...prev, imageUrl: finalUrl }));
            showToast('Cropped product image uploaded & URL saved!');
          } else if (adminCropperTarget === 'category') {
            setCategoryForm(prev => ({ ...prev, imageUrl: finalUrl }));
            showToast('Cropped category image uploaded & URL saved!');
          } else if (adminCropperTarget === 'banner') {
            setBannerForm(prev => ({ ...prev, imageUrl: finalUrl }));
            showToast('Cropped banner image uploaded & URL saved!');
          }
        }}
      />

      {/* Universal Admin Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={() => {
          if (!deleteConfirmModal.isLoading) {
            setDeleteConfirmModal(prev => ({ ...prev, isOpen: false }));
          }
        }}
        onConfirm={deleteConfirmModal.onConfirm}
        title={deleteConfirmModal.title}
        itemName={deleteConfirmModal.itemName}
        itemType={deleteConfirmModal.itemType}
        warningNote={deleteConfirmModal.warningNote}
        confirmText={deleteConfirmModal.confirmText}
        isLoading={deleteConfirmModal.isLoading}
      />
    </div>
  );
}
