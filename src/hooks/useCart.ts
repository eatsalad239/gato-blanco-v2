import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { generateId } from '../lib/pricing';

interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
  price: number;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [tip, setTipValue] = useState<number>(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('gato-blanco-cart');
    const savedTip = localStorage.getItem('gato-blanco-tip');

    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }

    if (savedTip) {
      try {
        setTipValue(parseFloat(savedTip));
      } catch (error) {
        console.error('Failed to parse tip from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gato-blanco-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save tip to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gato-blanco-tip', tip.toString());
  }, [tip]);

  const addToCart = (item: MenuItem, price: number, quantity: number = 1) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(cartItem => cartItem.item.id === item.id);

      if (existingItem) {
        return currentItems.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }

      return [...currentItems, {
        id: generateId(),
        item,
        quantity,
        price
      }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(currentItems =>
      currentItems.filter(item => item.id !== cartItemId)
    );
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setTipValue(0);
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const setTip = (tipAmount: number) => {
    setTipValue(tipAmount);
  };

  const getTip = () => {
    return tip;
  };

  const getTotalWithTip = () => {
    return getTotal() + getTip();
  };

  return {
    cartItems,
    tip,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    setTip,
    getTip,
    getTotalWithTip
  };
};
