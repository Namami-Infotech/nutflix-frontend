import axios from 'axios';
import { Category, Product, ImpactMetric, Review, OrderData, MasterBanner, PaymentType, Address } from '@/types';

export type { Category, Product, ImpactMetric, Review, OrderData, MasterBanner, PaymentType, Address };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================= FAST SWR CACHE LAYER =================
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const MEMORY_CACHE = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute fresh TTL, Stale-While-Revalidate after

export function getCachedData<T>(key: string): T | null {
  // 1. Check memory cache
  const mem = MEMORY_CACHE.get(key);
  if (mem) return mem.data;

  // 2. Check localStorage cache
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`nutflix_cache_${key}`);
      if (stored) {
        const parsed: CacheEntry<T> = JSON.parse(stored);
        MEMORY_CACHE.set(key, parsed);
        return parsed.data;
      }
    } catch (e) {}
  }
  return null;
}

export function setCachedData<T>(key: string, data: T) {
  const entry: CacheEntry<T> = { data, timestamp: Date.now() };
  MEMORY_CACHE.set(key, entry);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`nutflix_cache_${key}`, JSON.stringify(entry));
    } catch (e) {}
  }
}

export function invalidateApiCache(prefix?: string) {
  if (!prefix) {
    MEMORY_CACHE.clear();
    if (typeof window !== 'undefined') {
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.startsWith('nutflix_cache_')) localStorage.removeItem(k);
        });
      } catch (e) {}
    }
    return;
  }

  Array.from(MEMORY_CACHE.keys()).forEach((k) => {
    if (k.includes(prefix)) MEMORY_CACHE.delete(k);
  });

  if (typeof window !== 'undefined') {
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(`nutflix_cache_${prefix}`) || k.includes(prefix)) {
          localStorage.removeItem(k);
        }
      });
    } catch (e) {}
  }
}

// ================= COOKIE & TOKEN HELPERS =================
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return null;
}

export function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function getUserFromCookie(): any | null {
  if (typeof window === 'undefined') return null;
  const cookieUser = getCookie('nutflix_user') || getCookie('user');
  if (cookieUser) {
    try {
      return JSON.parse(cookieUser);
    } catch (e) {
      // ignore
    }
  }
  try {
    const localUser = localStorage.getItem('nutflix_user') || localStorage.getItem('user');
    if (localUser) {
      return JSON.parse(localUser);
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export function setUserCookie(user: any, days = 7) {
  if (typeof window === 'undefined') return;
  const json = JSON.stringify(user);
  setCookie('nutflix_user', json, days);
  setCookie('user', json, days);
  try {
    localStorage.setItem('nutflix_user', json);
    localStorage.setItem('user', json);
  } catch (e) {}
}

export async function logoutUser() {
  if (typeof window !== 'undefined') {
    try {
      await api.post('/users/logout');
    } catch (e) {
      console.warn('Backend logout call error:', e);
    }

    localStorage.removeItem('nutflix_accessToken');
    localStorage.removeItem('nutflix_refreshToken');
    localStorage.removeItem('nutflix_user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    deleteCookie('accessToken');
    deleteCookie('nutflix_accessToken');
    deleteCookie('refreshToken');
    deleteCookie('nutflix_refreshToken');
    deleteCookie('user');
    deleteCookie('nutflix_user');
    window.dispatchEvent(new Event('authChange'));
    window.dispatchEvent(new Event('storage'));
  }
}

// Get Auth Token from Cookies or LocalStorage
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = getCookie('accessToken') || getCookie('nutflix_accessToken');
  if (token) return token;
  try {
    return localStorage.getItem('accessToken') || localStorage.getItem('nutflix_accessToken') || null;
  } catch (e) {
    return null;
  }
}

// Get Refresh Token from Cookies or LocalStorage
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = getCookie('refreshToken') || getCookie('nutflix_refreshToken');
  if (token) return token;
  try {
    return localStorage.getItem('refreshToken') || localStorage.getItem('nutflix_refreshToken') || null;
  } catch (e) {
    return null;
  }
}

// Automatically attach JWT Token from Cookies or LocalStorage to every API request
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export async function fetchCategories(params?: { includeInactive?: boolean }): Promise<Category[]> {
  const cacheKey = `categories_${JSON.stringify(params || {})}`;
  const cached = getCachedData<Category[]>(cacheKey);

  const networkPromise = (async () => {
    const query = new URLSearchParams();
    if (params?.includeInactive) query.append('includeInactive', 'true');
    const queryString = query.toString() ? `?${query.toString()}` : '';

    try {
      const res = await api.get(`/categories${queryString}`);
      if (res.data && Array.isArray(res.data.data)) {
        setCachedData(cacheKey, res.data.data);
        return res.data.data;
      }
    } catch (error) {
      try {
        const res = await axios.get(`/api/categories${queryString}`, { timeout: 4000 });
        if (res.data && Array.isArray(res.data.data)) {
          setCachedData(cacheKey, res.data.data);
          return res.data.data;
        }
      } catch (e) {}
    }
    return cached || [];
  })();

  if (cached && cached.length > 0) {
    return cached;
  }
  return await networkPromise;
}

export async function fetchProducts(params?: { category?: string; featured?: boolean; search?: string; page?: number; limit?: number; includeInactive?: boolean }): Promise<Product[]> {
  const cacheKey = `products_${JSON.stringify(params || {})}`;
  const cached = getCachedData<Product[]>(cacheKey);

  const networkPromise = (async () => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.featured) query.append('featured', 'true');
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.includeInactive) query.append('includeInactive', 'true');

    try {
      const res = await api.get(`/products?${query.toString()}`);
      if (res.data) {
        const prods = Array.isArray(res.data.data) ? res.data.data : res.data.data?.products;
        if (Array.isArray(prods)) {
          setCachedData(cacheKey, prods);
          return prods;
        }
      }
    } catch (error) {
      try {
        const res = await axios.get(`/api/products?${query.toString()}`, { timeout: 4000 });
        if (res.data) {
          const prods = Array.isArray(res.data.data) ? res.data.data : res.data.data?.products;
          if (Array.isArray(prods)) {
            setCachedData(cacheKey, prods);
            return prods;
          }
        }
      } catch (e) {}
    }
    return cached || [];
  })();

  if (cached && cached.length > 0) {
    return cached;
  }
  return await networkPromise;
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const cacheKey = `product_${slug}`;
  const cached = getCachedData<Product>(cacheKey);

  const networkPromise = (async () => {
    try {
      const res = await api.get(`/products/${slug}`);
      if (res.data && res.data.data) {
        setCachedData(cacheKey, res.data.data);
        return res.data.data;
      }
    } catch (error) {
      try {
        const res = await axios.get(`/api/products/${slug}`, { timeout: 4000 });
        if (res.data && res.data.data) {
          setCachedData(cacheKey, res.data.data);
          return res.data.data;
        }
      } catch (e) {}
    }
    return cached || null;
  })();

  if (cached) {
    return cached;
  }
  return await networkPromise;
}

export async function fetchImpactMetrics(): Promise<ImpactMetric[]> {
  const cacheKey = 'impact_metrics';
  const cached = getCachedData<ImpactMetric[]>(cacheKey);

  const networkPromise = (async () => {
    try {
      const res = await api.get('/impact');
      if (res.data && Array.isArray(res.data.data)) {
        setCachedData(cacheKey, res.data.data);
        return res.data.data;
      }
    } catch (error) {
      try {
        const res = await axios.get('/api/impact', { timeout: 4000 });
        if (res.data && Array.isArray(res.data.data)) {
          setCachedData(cacheKey, res.data.data);
          return res.data.data;
        }
      } catch (e) {}
    }
    return cached || [];
  })();

  if (cached && cached.length > 0) {
    return cached;
  }
  return await networkPromise;
}

let LOCAL_REVIEWS_STORE: Review[] = [];

export async function fetchReviews(productId?: number): Promise<Review[]> {
  const url = productId ? `/reviews?productId=${productId}` : '/reviews';
  try {
    const res = await api.get(url);
    if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
  } catch (error) {
    try {
      const res = await axios.get(`/api/reviews${productId ? `?productId=${productId}` : ''}`);
      if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (e) {}
  }
  if (productId) {
    return LOCAL_REVIEWS_STORE.filter((r) => Number(r.productId) === Number(productId));
  }
  return LOCAL_REVIEWS_STORE;
}

export async function submitReview(reviewData: {
  productId: number;
  orderNumber: string;
  author: string;
  rating: number;
  title?: string;
  comment: string;
}): Promise<{ success: boolean; data?: { review: Review; updatedRating: string | number; updatedReviewCount: number }; message?: string }> {
  try {
    const res = await api.post('/reviews', reviewData);
    if (res.data && res.data.success) {
      return res.data;
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      return { success: false, message: error.response.data.message };
    }
    try {
      const res = await axios.post('/api/reviews', reviewData);
      if (res.data && res.data.success) {
        return res.data;
      }
      if (res.data && res.data.message) {
        return { success: false, message: res.data.message };
      }
    } catch (e: any) {
      if (e?.response?.data?.message) {
        return { success: false, message: e.response.data.message };
      }
    }
  }

  // Fallback in-memory logic
  const cleanOrderNum = (reviewData.orderNumber || '').trim().toUpperCase();
  if (!cleanOrderNum) {
    return { success: false, message: 'Order Number is required to submit a review.' };
  }

  // Check if duplicate review for this orderNumber & productId
  const existing = LOCAL_REVIEWS_STORE.find(
    (r: any) => r.orderNumber === cleanOrderNum && Number(r.productId) === Number(reviewData.productId)
  );
  if (existing) {
    return {
      success: false,
      message: `You have already submitted a review for this product on Order #${cleanOrderNum}.`,
    };
  }

  const newReview: Review = {
    id: Date.now(),
    productId: reviewData.productId,
    author: reviewData.author,
    rating: reviewData.rating,
    title: reviewData.title || 'Customer Review',
    comment: reviewData.comment,
    verified: true,
    createdAt: new Date().toISOString(),
  };

  (newReview as any).orderNumber = cleanOrderNum;
  LOCAL_REVIEWS_STORE.unshift(newReview);

  const prodReviews = LOCAL_REVIEWS_STORE.filter((r) => Number(r.productId) === Number(reviewData.productId));
  const avg = (prodReviews.reduce((acc, curr) => acc + curr.rating, 0) / prodReviews.length).toFixed(1);

  return {
    success: true,
    message: 'Review submitted successfully',
    data: {
      review: newReview,
      updatedRating: avg,
      updatedReviewCount: prodReviews.length,
    },
  };
}


export async function fetchBanners(params?: { includeInactive?: boolean }): Promise<MasterBanner[]> {
  const cacheKey = `banners_${JSON.stringify(params || {})}`;
  const cached = getCachedData<MasterBanner[]>(cacheKey);

  const networkPromise = (async () => {
    const query = new URLSearchParams();
    if (params?.includeInactive) query.append('includeInactive', 'true');
    const queryString = query.toString() ? `?${query.toString()}` : '';

    try {
      const res = await api.get(`/banners${queryString}`);
      if (res.data && Array.isArray(res.data.data)) {
        setCachedData(cacheKey, res.data.data);
        return res.data.data;
      }
    } catch (error) {
      try {
        const res = await axios.get(`/api/banners${queryString}`, { timeout: 4000 });
        if (res.data && Array.isArray(res.data.data)) {
          setCachedData(cacheKey, res.data.data);
          return res.data.data;
        }
      } catch (e) {}
    }
    return cached || [];
  })();

  if (cached && cached.length > 0) {
    return cached;
  }
  return await networkPromise;
}

export async function submitOrder(orderData: any) {
  const resolvedPaymentMethod = orderData.paymentMethod || (orderData.paymentType === 'cash' ? 'Cash on Delivery' : 'Online / UPI Payment');
  const payload = {
    ...orderData,
    customerEmail: (orderData.customerEmail || '').toLowerCase().trim(),
    paymentType: orderData.paymentType || (orderData.paymentMethod === 'Cash on Delivery' ? 'cash' : 'online'),
    paymentMethod: resolvedPaymentMethod,
  };

  try {
    const res = await api.post('/orders', payload);
    if (res.data && res.data.data) {
      const createdOrder = res.data.data;
      // Save backend's official generated order (with backend orderNumber & DB id)
      LOCAL_ORDERS_STORE.unshift(createdOrder);
      if (typeof window !== 'undefined') {
        try {
          const existing = JSON.parse(localStorage.getItem('nutflix_user_orders') || '[]');
          existing.unshift(createdOrder);
          localStorage.setItem('nutflix_user_orders', JSON.stringify(existing));
        } catch (e) {}
      }
      return res.data;
    }
  } catch (error) {
    console.warn('Backend API unavailable. Creating local fallback order.');
  }

  // Fallback offline order generation (only when backend is unreachable)
  const fallbackOrderObj = {
    id: Date.now(),
    orderNumber: 'NTX-' + Math.floor(100000 + Math.random() * 900000),
    customerName: orderData.customerName,
    customerEmail: (orderData.customerEmail || '').toLowerCase().trim(),
    shippingAddress: orderData.shippingAddress,
    paymentMethod: resolvedPaymentMethod,
    paymentType: orderData.paymentType || 'online',
    totalAmount: String(orderData.totalAmount || '0.00'),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    items: orderData.items || [],
  };

  LOCAL_ORDERS_STORE.unshift(fallbackOrderObj);
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem('nutflix_user_orders') || '[]');
      existing.unshift(fallbackOrderObj);
      localStorage.setItem('nutflix_user_orders', JSON.stringify(existing));
    } catch (e) {}
  }

  return {
    success: true,
    message: 'Order created successfully!',
    data: fallbackOrderObj,
  };
}

// ================= RAZORPAY INTEGRATION =================
export async function getRazorpayKey(): Promise<string> {
  try {
    const res = await api.get('/payment/razorpay/key');
    if (res.data?.data?.keyId) {
      return res.data.data.keyId;
    }
  } catch (e) {
    console.warn('Failed to fetch Razorpay key from backend, using fallback.');
  }
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RqJtOyGfDiW0vw';
}

export async function createRazorpayOrder(orderParams: {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}) {
  try {
    const res = await api.post('/payment/razorpay/create-order', orderParams);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || {
      success: false,
      message: error?.message || 'Failed to initialize Razorpay payment',
    };
  }
}

export async function verifyRazorpayPayment(paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderData: any;
}) {
  try {
    const res = await api.post('/payment/razorpay/verify', paymentData);
    if (res.data && res.data.data) {
      const confirmedOrder = res.data.data;
      LOCAL_ORDERS_STORE.unshift(confirmedOrder);
      if (typeof window !== 'undefined') {
        try {
          const existing = JSON.parse(localStorage.getItem('nutflix_user_orders') || '[]');
          existing.unshift(confirmedOrder);
          localStorage.setItem('nutflix_user_orders', JSON.stringify(existing));
        } catch (e) {}
      }
      return res.data;
    }
    return res.data;
  } catch (error: any) {
    return error?.response?.data || {
      success: false,
      message: error?.message || 'Payment verification failed',
    };
  }
}

export async function loginUser(credentials: { email: string; password: string }) {

  try {
    const res = await api.post('/users/login', credentials);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || {
      success: false,
      message: 'Unable to connect to login server.',
    };
  }
}

export async function sendOtpApi(data: { phone: string; purpose: 'signup' | 'login'; name?: string; email?: string }) {
  try {
    const res = await api.post('/users/send-otp', data);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || {
      success: false,
      message: error?.message || 'Failed to send OTP. Please try again.',
    };
  }
}

export async function verifyOtpSignupApi(data: { name: string; email: string; phone: string; otp: string; password?: string }) {
  try {
    const res = await api.post('/users/verify-otp-signup', data);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || {
      success: false,
      message: error?.message || 'Failed to verify OTP & create account.',
    };
  }
}

export async function verifyOtpLoginApi(data: { phone: string; otp: string }) {
  try {
    const res = await api.post('/users/verify-otp-login', data);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || {
      success: false,
      message: error?.message || 'Failed to verify OTP & sign in.',
    };
  }
}

export async function registerUser(userData: { name: string; email: string; password: string; phone?: string }) {
  try {
    const res = await api.post('/users/register', userData);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || {
      success: false,
      message: 'Unable to connect to registration server.',
    };
  }
}

export async function refreshAuthToken(refreshToken: string) {
  try {
    const res = await api.post('/users/refresh', { refreshToken });
    return res.data;
  } catch (error: any) {
    return error?.response?.data || {
      success: false,
      message: 'Unable to refresh authentication token.',
    };
  }
}

let LOCAL_ORDERS_STORE: any[] = [];

function getStoredLocalOrders(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('nutflix_user_orders') || '[]');
  } catch (e) {
    return [];
  }
}

export async function fetchAllOrders(params?: { status?: string; startDate?: string; endDate?: string; search?: string }) {
  const stored = getStoredLocalOrders();
  const allLocal = [...stored, ...LOCAL_ORDERS_STORE];
  const uniqueMap = new Map();
  allLocal.forEach(item => {
    if (!uniqueMap.has(item.id || item.orderNumber)) {
      uniqueMap.set(item.id || item.orderNumber, item);
    }
  });
  const mergedLocal = Array.from(uniqueMap.values());

  const query = new URLSearchParams();
  if (params?.status && params.status !== 'all') query.set('status', params.status);
  if (params?.startDate) query.set('startDate', params.startDate);
  if (params?.endDate) query.set('endDate', params.endDate);
  if (params?.search) query.set('search', params.search);

  const qs = query.toString() ? `?${query.toString()}` : '';

  try {
    const res = await api.get(`/orders/all-orders${qs}`);
    let backendOrders: any[] = [];
    if (res.data && Array.isArray(res.data.data)) {
      backendOrders = res.data.data;
    } else {
      const fallbackRes = await api.get(`/orders${qs}`);
      if (fallbackRes.data && Array.isArray(fallbackRes.data.data)) {
        backendOrders = fallbackRes.data.data;
      }
    }

    const backendIds = new Set(backendOrders.map((o: any) => o.id || o.orderNumber));
    const extraLocal = mergedLocal.filter((o: any) => !backendIds.has(o.id || o.orderNumber));
    return [...backendOrders, ...extraLocal];
  } catch (error) {
    return mergedLocal;
  }
}

export async function fetchAdminOrders() {
  const stored = getStoredLocalOrders();
  const allLocal = [...stored, ...LOCAL_ORDERS_STORE];
  const uniqueMap = new Map();
  allLocal.forEach(item => {
    if (!uniqueMap.has(item.id || item.orderNumber)) {
      uniqueMap.set(item.id || item.orderNumber, item);
    }
  });
  const mergedLocal = Array.from(uniqueMap.values());

  try {
    const res = await api.get('/orders/all-orders');
    let backendOrders: any[] = [];
    if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      backendOrders = res.data.data;
    } else {
      const fallbackRes = await api.get('/orders');
      if (fallbackRes.data && Array.isArray(fallbackRes.data.data) && fallbackRes.data.data.length > 0) {
        backendOrders = fallbackRes.data.data;
      }
    }

    const backendIds = new Set(backendOrders.map((o: any) => o.id || o.orderNumber));
    const extraLocal = mergedLocal.filter((o: any) => !backendIds.has(o.id || o.orderNumber));
    return [...backendOrders, ...extraLocal];
  } catch (error) {
    return mergedLocal;
  }
}

export async function fetchMyOrders() {
  const token = getAuthToken();
  let cleanEmail = '';
  const storedUser = getUserFromCookie();
  if (storedUser && storedUser.email) {
    cleanEmail = (storedUser.email || '').toLowerCase().trim();
  }

  if (token) {
    try {
      const res = await api.get('/orders/get-myOrders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && Array.isArray(res.data.data)) {
        const backendOrders = res.data.data;
        const stored = getStoredLocalOrders();
        const combined = [...stored, ...LOCAL_ORDERS_STORE];
        const filteredLocal = combined.filter(o => {
          const oEmail = (o.customerEmail || '').toLowerCase().trim();
          return !cleanEmail || oEmail === cleanEmail;
        });

        const backendIds = new Set(backendOrders.map((o: any) => o.id || o.orderNumber));
        const extraLocal = filteredLocal.filter((o: any) => !backendIds.has(o.id || o.orderNumber));

        return [...backendOrders, ...extraLocal];
      }
    } catch (e) {}
  }

  return fetchUserOrders(cleanEmail || 'user@nutflix.com');
}

export async function fetchUserOrders(email: string) {
  const cleanEmail = (email || '').toLowerCase().trim();
  const stored = getStoredLocalOrders();
  const combined = [...stored, ...LOCAL_ORDERS_STORE];

  const filteredLocal = combined.filter(o => {
    const oEmail = (o.customerEmail || '').toLowerCase().trim();
    return !cleanEmail || oEmail === cleanEmail || oEmail === 'user@nutflix.com';
  });

  const uniqueMap = new Map();
  filteredLocal.forEach(item => {
    if (!uniqueMap.has(item.id || item.orderNumber)) {
      uniqueMap.set(item.id || item.orderNumber, item);
    }
  });
  const mergedLocal = Array.from(uniqueMap.values());

  try {
    const res = await api.get(`/orders/user/${encodeURIComponent(cleanEmail)}`);
    if (res.data && Array.isArray(res.data.data)) {
      const backendOrders = res.data.data;
      const backendIds = new Set(backendOrders.map((o: any) => o.id || o.orderNumber));
      const extraLocal = mergedLocal.filter((o: any) => !backendIds.has(o.id || o.orderNumber));
      return [...backendOrders, ...extraLocal];
    }
    return mergedLocal;
  } catch (error) {
    return mergedLocal;
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  // Update in-memory
  const target = LOCAL_ORDERS_STORE.find(o => o.id === orderId);
  if (target) target.status = status;

  // Update in localStorage
  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem('nutflix_user_orders') || '[]');
      const updated = stored.map((o: any) => o.id === orderId ? { ...o, status } : o);
      localStorage.setItem('nutflix_user_orders', JSON.stringify(updated));
    } catch (e) {}
  }

  try {
    const res = await api.patch(`/orders/${orderId}/status`, { status });
    return res.data;
  } catch (error) {
    return { success: true, message: `Status updated to ${status}` };
  }
}

// ================= CART API MODULE =================
export async function fetchCartApi() {
  const token = getAuthToken();
  if (!token) {
    console.warn('🔑 fetchCartApi: No accessToken found in Cookies or LocalStorage (User is not logged in)');
    return null;
  }
  console.log('🍪 Token fetched from Cookie / LocalStorage and sent with fetchCartApi:', token);
  try {
    const res = await api.get('/cart');
    return res.data?.data ?? [];
  } catch (e: any) {
    console.error('fetchCartApi Error:', e?.response?.data || e?.message || e);
    try {
      const fallbackRes = await axios.get('http://localhost:5000/api/cart', { headers: { Authorization: `Bearer ${token}` } });
      return fallbackRes.data?.data ?? [];
    } catch (fallbackErr) {
      return null;
    }
  }
}

export async function addToCartApi(productId: number, quantity: number = 1) {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await api.post('/cart/add', { productId, quantity });
    return res.data?.data || null;
  } catch (e) {
    return null;
  }
}

export async function updateCartQuantityApi(productId: number, quantity: number) {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await api.put('/cart/update', { productId, quantity });
    return res.data?.data || null;
  } catch (e) {
    return null;
  }
}

export async function removeFromCartApi(productId: number) {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await api.delete(`/cart/remove/${productId}`);
    return res.data?.data || null;
  } catch (e) {
    return null;
  }
}

export async function clearCartApi() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await api.delete('/cart/clear');
    return res.data?.data || [];
  } catch (e) {
    return [];
  }
}

export async function syncCartApi(items: Array<{ productId: number; quantity: number }>) {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await api.post('/cart/sync', { items });
    return res.data?.data || null;
  } catch (e) {
    return null;
  }
}

export async function createProduct(productData: any) {
  try {
    const res = await api.post('/products', productData);
    invalidateApiCache('product');
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to create product' };
  }
}

export async function updateProduct(id: number, productData: any) {
  try {
    const res = await api.put(`/products/${id}`, productData);
    invalidateApiCache('product');
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to update product' };
  }
}

export async function deleteProduct(id: number) {
  try {
    const res = await api.delete(`/products/${id}`);
    invalidateApiCache('product');
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to delete product' };
  }
}

export async function createBanner(bannerData: any) {
  try {
    const res = await api.post('/banners', bannerData);
    invalidateApiCache('banners');
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to create banner' };
  }
}

export async function updateBanner(id: number, bannerData: any) {
  try {
    const res = await api.put(`/banners/${id}`, bannerData);
    invalidateApiCache('banners');
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to update banner' };
  }
}

export async function deleteBanner(id: number) {
  try {
    const res = await api.delete(`/banners/${id}`);
    invalidateApiCache('banners');
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to delete banner' };
  }
}

export async function fetchUsers() {
  try {
    const res = await api.get('/users');
    return res.data?.data || [];
  } catch (error) {
    return [];
  }
}

export async function createCategory(categoryData: any) {
  try {
    const res = await api.post('/categories', categoryData);
    invalidateApiCache('categories');
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to create category' };
  }
}

export async function updateCategory(id: number, categoryData: any) {
  try {
    const res = await api.put(`/categories/${id}`, categoryData);
    invalidateApiCache('categories');
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to update category' };
  }
}

export async function deleteCategory(id: number) {
  try {
    const res = await api.delete(`/categories/${id}`);
    invalidateApiCache('categories');
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to delete category' };
  }
}

export async function deleteUser(id: number) {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to delete user' };
  }
}

export async function updateUserStatic(id: number, isStatic: boolean) {
  try {
    const res = await api.patch(`/users/${id}/static`, { static: isStatic });
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to update user static status' };
  }
}

export async function updateUserStatus(id: number, status: string) {
  try {
    const res = await api.patch(`/users/${id}/status`, { status });
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to update user status' };
  }
}

export async function updateUserProfileApi(id: number, profileData: { name?: string; email?: string; address?: string; gstNumber?: string }) {
  try {
    const res = await api.put(`/users/profile/${id}`, profileData);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to update profile' };
  }
}

export async function deleteReview(id: number) {
  try {
    const res = await api.delete(`/reviews/${id}`);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to delete review' };
  }
}

export async function deleteOrder(id: number) {
  try {
    const res = await api.delete(`/orders/${id}`);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to delete order' };
  }
}

let LOCAL_PAYMENT_TYPES: PaymentType[] = [
  { id: 1, name: 'Online', code: 'online', status: 'active' },
  { id: 2, name: 'Cash', code: 'cash', status: 'active' },
];

export async function fetchPaymentTypes(): Promise<PaymentType[]> {
  try {
    const res = await api.get('/payment-types');
    return res.data.data && res.data.data.length > 0 ? res.data.data : LOCAL_PAYMENT_TYPES;
  } catch (e) {
    return LOCAL_PAYMENT_TYPES;
  }
}

export async function updatePaymentTypeStatus(id: number, status: 'active' | 'inactive') {
  try {
    const res = await api.patch(`/payment-types/${id}/status`, { status });
    const target = LOCAL_PAYMENT_TYPES.find(p => p.id === id);
    if (target) target.status = status;
    return res.data;
  } catch (e) {
    const target = LOCAL_PAYMENT_TYPES.find(p => p.id === id);
    if (target) target.status = status;
    return { success: true, message: `Payment type status updated to ${status}` };
  }
}

export function base64ToFile(base64Data: string, filename = 'image.jpg'): File {
  try {
    const arr = base64Data.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1] || arr[0]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch (e) {
    console.error('Error converting base64 to file:', e);
    return new File([], filename, { type: 'image/jpeg' });
  }
}

export async function uploadImage(fileOrBase64: File | string): Promise<{ success: boolean; url?: string; message?: string }> {
  try {
    let fileToUpload: File;
    if (typeof fileOrBase64 === 'string') {
      if (fileOrBase64.startsWith('http://') || fileOrBase64.startsWith('https://') || (fileOrBase64.startsWith('/') && !fileOrBase64.startsWith('data:'))) {
        return { success: true, url: fileOrBase64 };
      }
      fileToUpload = base64ToFile(fileOrBase64, `upload-${Date.now()}.jpg`);
    } else {
      fileToUpload = fileOrBase64;
    }

    const formData = new FormData();
    formData.append('image', fileToUpload);

    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data && res.data.data?.url) {
      return { success: true, url: res.data.data.url, message: res.data.message };
    }
    if (res.data && res.data.url) {
      return { success: true, url: res.data.url, message: res.data.message };
    }
    return { success: false, message: res.data?.message || 'Failed to upload image' };
  } catch (error: any) {
    console.error('Image upload error:', error);
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to upload image to server',
    };
  }
}

export function formatWeightAndUnit(weight?: string | number, unit?: string): string {
  if (!weight && !unit) return '250g';
  const weightStr = String(weight || '').trim();
  const unitStr = String(unit || '').trim();

  if (/[a-zA-Z]/.test(weightStr)) {
    return weightStr;
  }

  if (unitStr) {
    return `${weightStr}${unitStr}`;
  }

  if (/^\d+(\.\d+)?$/.test(weightStr)) {
    const num = Number(weightStr);
    if (num >= 1000) {
      return `${num / 1000}kg`;
    }
    return `${weightStr}g`;
  }

  return weightStr || '250g';
}

export function getProductPrices(product?: { price?: string | number; sellingPrice?: string | number | null } | null) {
  if (!product) {
    return {
      regularPrice: 0,
      salePrice: null,
      currentPrice: 0,
      hasDiscount: false,
      discountPercent: 0,
      savings: 0,
    };
  }

  const regularPrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || '0')) || 0;
  let salePriceNum: number | null = null;

  if (product.sellingPrice !== undefined && product.sellingPrice !== null && product.sellingPrice !== '') {
    const parsed = typeof product.sellingPrice === 'number' ? product.sellingPrice : parseFloat(String(product.sellingPrice));
    if (!isNaN(parsed) && parsed > 0) {
      salePriceNum = parsed;
    }
  }

  const hasDiscount = salePriceNum !== null && salePriceNum < regularPrice;
  const currentPrice = hasDiscount ? (salePriceNum as number) : regularPrice;
  const discountPercent = hasDiscount && regularPrice > 0 ? Math.round(((regularPrice - (salePriceNum as number)) / regularPrice) * 100) : 0;
  const savings = hasDiscount ? (regularPrice - (salePriceNum as number)) : 0;

  return {
    regularPrice,
    salePrice: salePriceNum,
    currentPrice,
    hasDiscount,
    discountPercent,
    savings,
  };
}

export function formatPrice(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') return '0';
  const numericValue = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, ''));
  if (isNaN(numericValue)) return '0';
  if (numericValue % 1 === 0) {
    return numericValue.toString();
  }
  return numericValue.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

export function formatCurrency(amount: number | string | null | undefined, currencySymbol: string = '₹'): string {
  return `${currencySymbol}${formatPrice(amount)}`;
}

// ================= ADDRESS MANAGEMENT API =================

export async function fetchMyAddresses(): Promise<Address[]> {
  try {
    const res = await api.get('/addresses');
    if (res.data && Array.isArray(res.data.data)) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('nutflix_saved_addresses', JSON.stringify(res.data.data));
      }
      return res.data.data;
    }
  } catch (error) {
    // Fallback to local storage
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('nutflix_saved_addresses');
      if (cached) {
        const parsed: Address[] = JSON.parse(cached);
        return parsed.filter((a) => !a.isDeleted);
      }
    } catch (e) {}
  }

  return [];
}

export async function createAddress(addressData: {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}): Promise<Address | null> {
  try {
    const res = await api.post('/addresses', addressData);
    if (res.data && res.data.data) {
      // Refresh local cache
      await fetchMyAddresses();
      return res.data.data;
    }
  } catch (error) {
    // Fallback local storage creation
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('nutflix_saved_addresses');
      const list: Address[] = cached ? JSON.parse(cached) : [];
      const isFirst = list.filter((a) => !a.isDeleted).length === 0;
      const isDefault = Boolean(addressData.isDefault || isFirst);

      if (isDefault) {
        list.forEach((a) => {
          a.isDefault = false;
        });
      }

      const newAddr: Address = {
        id: Date.now(),
        userId: 0,
        fullName: addressData.fullName,
        phone: addressData.phone,
        streetAddress: addressData.streetAddress,
        city: addressData.city,
        state: addressData.state || '',
        postalCode: addressData.postalCode,
        country: addressData.country || 'India',
        isDefault,
        isDeleted: false,
        createdAt: new Date().toISOString(),
      };

      list.push(newAddr);
      localStorage.setItem('nutflix_saved_addresses', JSON.stringify(list));
      return newAddr;
    } catch (e) {}
  }

  return null;
}

export async function updateAddress(
  id: number,
  addressData: {
    fullName?: string;
    phone?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    isDefault?: boolean;
  }
): Promise<Address | null> {
  try {
    const res = await api.put(`/addresses/${id}`, addressData);
    if (res.data && res.data.data) {
      await fetchMyAddresses();
      return res.data.data;
    }
  } catch (error) {
    // Fallback local storage update
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('nutflix_saved_addresses');
      const list: Address[] = cached ? JSON.parse(cached) : [];
      const index = list.findIndex((a) => a.id === id);

      if (index !== -1) {
        if (addressData.isDefault) {
          list.forEach((a) => {
            a.isDefault = false;
          });
        }
        list[index] = {
          ...list[index],
          ...addressData,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('nutflix_saved_addresses', JSON.stringify(list));
        return list[index];
      }
    } catch (e) {}
  }

  return null;
}

export async function deleteAddress(id: number): Promise<boolean> {
  try {
    const res = await api.delete(`/addresses/${id}`);
    if (res.data && res.data.success) {
      await fetchMyAddresses();
      return true;
    }
  } catch (error) {
    // Fallback local storage soft-delete
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('nutflix_saved_addresses');
      const list: Address[] = cached ? JSON.parse(cached) : [];
      const index = list.findIndex((a) => a.id === id);

      if (index !== -1) {
        const wasDefault = list[index].isDefault;
        list[index].isDeleted = true;
        list[index].isDefault = false;

        if (wasDefault) {
          const remaining = list.filter((a) => !a.isDeleted);
          if (remaining.length > 0) {
            remaining[0].isDefault = true;
          }
        }

        localStorage.setItem('nutflix_saved_addresses', JSON.stringify(list));
        return true;
      }
    } catch (e) {}
  }

  return false;
}

export async function setDefaultAddress(id: number): Promise<Address | null> {
  try {
    const res = await api.patch(`/addresses/${id}/default`);
    if (res.data && res.data.data) {
      await fetchMyAddresses();
      return res.data.data;
    }
  } catch (error) {
    // Fallback
  }

  return updateAddress(id, { isDefault: true });
}


