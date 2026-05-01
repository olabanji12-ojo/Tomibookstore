import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Product, ProductVariant, CartItem, CartContextType } from '../types';

const STORAGE_KEY = 'good_things_cart_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isHydrated = useRef(false);
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    isHydrated.current = true;
  }, []);

  useEffect(() => {
    if (isHydrated.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (product: Product, variant: ProductVariant | null = null, selectedSize?: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => 
        item.product.id === product.id && 
        JSON.stringify(item.variant) === JSON.stringify(variant) &&
        item.selectedSize === selectedSize
      );
      
      if (existing) {
        return prev.map(item => 
          (item.product.id === product.id && JSON.stringify(item.variant) === JSON.stringify(variant) && item.selectedSize === selectedSize)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, variant, selectedSize }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (!existing) return prev;

      const newQty = existing.quantity + delta;
      
      if (newQty <= 0) {
        return prev.filter(item => item.product.id !== productId);
      }

      return prev.map(item => 
        item.product.id === productId ? { ...item, quantity: newQty } : item
      );
    });
  };

  const getItemQuantity = (productId: string) => {
    return cartItems.find(item => item.product.id === productId)?.quantity || 0;
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, getItemQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
