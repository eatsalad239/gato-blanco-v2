import { create } from 'zustand';
import { MenuItem } from '../types';
import { generateId } from './pricing';

interface CartItem {
  id: string;
  itemId: string;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: { itemId: string; quantity: number; price: number }) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find(cartItem => cartItem.itemId === item.itemId);
      
      if (existingItem) {
        return {
          items: state.items.map(cartItem =>
            cartItem.itemId === item.itemId
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          )
        };
      }
      
      return {
        items: [...state.items, {
          id: generateId(),
          ...item
        }]
      };
    });
  },
  
  removeItem: (cartItemId) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== cartItemId)
    }));
  },
  
  updateQuantity: (cartItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(cartItemId);
      return;
    }
    
    set((state) => ({
      items: state.items.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    }));
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  getTotal: () => {
    const state = get();
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getItemCount: () => {
    const state = get();
    return state.items.reduce((count, item) => count + item.quantity, 0);
  }
}));