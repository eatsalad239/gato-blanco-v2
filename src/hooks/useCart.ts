import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { generateId } from '../lib/pricing';

interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
  price: number;
}

// Simple working cart
export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart');
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (e) {
        console.error('Failed to save cart');
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = (item: MenuItem, price: number, quantity: number = 1) => {
    console.log('Adding item:', item.name.en, 'price:', price);
    setCartItems(prev => {
      const existing = prev.find(cartItem => cartItem.item.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prev, {
        id: generateId(),
        item,
        quantity,
        price
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotal,
    getItemCount
  };
};
