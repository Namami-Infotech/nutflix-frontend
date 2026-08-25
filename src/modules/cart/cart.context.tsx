'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, fetchCartApi, addToCartApi, updateCartQuantityApi, removeFromCartApi, clearCartApi, syncCartApi } from '@/lib/api';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  freeShippingThreshold: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_MIN = 30.0;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function loadCartData() {
      const dbCart = await fetchCartApi();
      if (dbCart && Array.isArray(dbCart)) {
        const formatted = dbCart.map((dbItem: any) => ({
          product: {
            id: dbItem.productId || dbItem.id,
            name: dbItem.name,
            price: String(dbItem.price),
            imageUrl: dbItem.imageUrl,
            weight: dbItem.weight || '250g',
            slug: dbItem.slug || '',
          } as Product,
          quantity: dbItem.quantity,
        }));
        setItems(formatted);
      } else {
        setItems([]);
      }
      setIsLoaded(true);
    }

    loadCartData();
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsOpen(true);
    // Sync to backend DB if logged in
    addToCartApi(product.id, quantity);
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
    // Sync to backend DB if logged in
    removeFromCartApi(productId);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
    // Sync to backend DB if logged in
    updateCartQuantityApi(productId, quantity);
  };

  const clearCart = () => {
    setItems([]);
    // Sync to backend DB if logged in
    clearCartApi();
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        freeShippingThreshold: FREE_SHIPPING_MIN,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
