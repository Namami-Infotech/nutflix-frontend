export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl: string;
  keywords?: string[];
  status?: 'active' | 'inactive' | string;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  sellingPrice?: string | number | null;
  origin: string;
  weight: string;
  unit?: string;
  impactDescription: string;
  imageUrl: string;
  stock: number;
  rating: string;
  reviewCount: number;
  isFeatured: boolean;
  keywords?: string[];
  status?: 'active' | 'inactive' | string;
}

export interface ImpactMetric {
  id: number;
  metricKey: string;
  title: string;
  count: number;
  suffix: string;
  description: string;
}

export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  status?: 'active' | 'inactive' | string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItemInput {
  productId: number;
  quantity: number;
  price: string;
}

export interface OrderData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  notes?: string;
  items: OrderItemInput[];
  subtotal: number;
}

export interface MasterBanner {
  id: number;
  badgeText: string;
  title: string;
  highlightText?: string;
  subtitle?: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  imageUrl: string;
  featuredBadge: string;
  featuredTitle: string;
  featuredSubtitle: string;
  displayOrder?: number;
  isActive?: boolean;
  status?: 'active' | 'inactive' | string;
}

export interface PaymentType {
  id: number;
  name: string; // e.g. 'Online', 'Cash'
  code: string; // e.g. 'online', 'cash'
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
  gstNumber?: string;
  status?: 'active' | 'inactive' | string;
  createdAt?: string;
}

export interface Address {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state?: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Enquiry {
  id: number;
  customId?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'pending' | 'contacted' | 'resolved' | 'closed';
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

