import { useReducer, useEffect } from 'react';
import { MenuItem } from '../types';
import { generateId } from '../lib/pricing';

interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  isLoaded: boolean;
}

type CartAction =
  | { type: 'LOAD_CART'; items: CartItem[] }
  | { type: 'ADD_ITEM'; item: MenuItem; price: number; quantity: number }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADED' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'LOAD_CART':
      return { ...state, items: action.items, isLoaded: true };

    case 'ADD_ITEM': {
      const existing = state.items.find(cartItem => cartItem.item.id === action.item.id);
      let newItems;

      if (existing) {
        console.log('📦 Item exists, increasing quantity');
        newItems = state.items.map(cartItem =>
          cartItem.item.id === action.item.id
            ? { ...cartItem, quantity: cartItem.quantity + action.quantity }
            : cartItem
        );
      } else {
        console.log('🆕 Adding new item to cart');
        newItems = [...state.items, {
          id: generateId(),
          item: action.item,
          quantity: action.quantity,
          price: action.price
        }];
      }

      console.log('🛍️ New cart size:', newItems.length);
      return { ...state, items: newItems };
    }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(item => item.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.id ? { ...item, quantity: action.quantity } : item
        )
      };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.id) };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'SET_LOADED':
      return { ...state, isLoaded: true };

    default:
      return state;
  }
};

// Production-ready cart with useReducer
export const useCart = () => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoaded: false
  });

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const items = JSON.parse(saved);
        dispatch({ type: 'LOAD_CART', items });
      } else {
        dispatch({ type: 'SET_LOADED' });
      }
    } catch (e) {
      console.error('Failed to load cart');
      dispatch({ type: 'SET_LOADED' });
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (state.isLoaded) {
      try {
        localStorage.setItem('cart', JSON.stringify(state.items));
      } catch (e) {
        console.error('Failed to save cart');
      }
    }
  }, [state.items, state.isLoaded]);

  const addToCart = (item: MenuItem, price: number, quantity: number = 1) => {
    console.log('🛒 ADDING TO CART:', item.name.en, 'Price:', price, 'Current cart size:', state.items.length);
    dispatch({ type: 'ADD_ITEM', item, price, quantity });
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log('📝 Updating quantity:', id, 'to', quantity);
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotal = () => {
    return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    cartItems: state.items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getItemCount
  };
};
