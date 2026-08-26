import axios from 'axios';
import { Category, Product, ImpactMetric, Review, OrderData, MasterBanner, PaymentType } from '@/types';

export type { Category, Product, ImpactMetric, Review, OrderData, MasterBanner, PaymentType };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
      return null;
    }
  }
  return null;
}

export function setUserCookie(user: any, days = 7) {
  if (typeof window === 'undefined') return;
  const json = JSON.stringify(user);
  setCookie('nutflix_user', json, days);
  setCookie('user', json, days);
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
  }
}

// Get Auth Token exclusively from Cookies
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return getCookie('accessToken') || getCookie('nutflix_accessToken');
}

// Get Refresh Token exclusively from Cookies
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return getCookie('refreshToken') || getCookie('nutflix_refreshToken');
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

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await api.get('/categories');
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    try {
      const res = await axios.get('/api/categories');
      if (res.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (e) {}
  }
  return [];
}

export async function fetchProducts(params?: { category?: string; featured?: boolean; search?: string; page?: number; limit?: number }): Promise<Product[]> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.featured) query.append('featured', 'true');
  if (params?.search) query.append('search', params.search);
  if (params?.page) query.append('page', String(params.page));
  if (params?.limit) query.append('limit', String(params.limit));

  try {
    const res = await api.get(`/products?${query.toString()}`);
    if (res.data) {
      if (Array.isArray(res.data.data)) return res.data.data;
      if (res.data.data?.products) return res.data.data.products;
    }
  } catch (error) {
    try {
      const res = await axios.get(`/api/products?${query.toString()}`);
      if (res.data) {
        if (Array.isArray(res.data.data)) return res.data.data;
        if (res.data.data?.products) return res.data.data.products;
      }
    } catch (e) {}
  }
  return [];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await api.get(`/products/${slug}`);
    if (res.data && res.data.data) {
      return res.data.data;
    }
  } catch (error) {
    try {
      const res = await axios.get(`/api/products/${slug}`);
      if (res.data && res.data.data) {
        return res.data.data;
      }
    } catch (e) {}
  }
  return null;
}

export async function fetchImpactMetrics(): Promise<ImpactMetric[]> {
  try {
    const res = await api.get('/impact');
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    try {
      const res = await axios.get('/api/impact');
      if (res.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (e) {}
  }
  return [];
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


export async function fetchBanners(): Promise<MasterBanner[]> {
  try {
    const res = await api.get('/banners');
    if (res.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
  } catch (error) {
    try {
      const res = await axios.get('/api/banners');
      if (res.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (e) {}
  }
  return [];
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

export async function registerUser(userData: { name: string; email: string; password: string }) {
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
    const res = await api.get('/orders');
    if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
      return res.data.data;
    }
    return mergedLocal;
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
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to create product' };
  }
}

export async function updateProduct(id: number, productData: any) {
  try {
    const res = await api.put(`/products/${id}`, productData);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to update product' };
  }
}

export async function deleteProduct(id: number) {
  try {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to delete product' };
  }
}

export async function createBanner(bannerData: any) {
  try {
    const res = await api.post('/banners', bannerData);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to create banner' };
  }
}

export async function updateBanner(id: number, bannerData: any) {
  try {
    const res = await api.put(`/banners/${id}`, bannerData);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to update banner' };
  }
}

export async function deleteBanner(id: number) {
  try {
    const res = await api.delete(`/banners/${id}`);
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
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to create category' };
  }
}

export async function updateCategory(id: number, categoryData: any) {
  try {
    const res = await api.put(`/categories/${id}`, categoryData);
    return res.data;
  } catch (error: any) {
    return error?.response?.data || { success: false, message: 'Failed to update category' };
  }
}

export async function deleteCategory(id: number) {
  try {
    const res = await api.delete(`/categories/${id}`);
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
