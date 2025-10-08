import { useKV } from '@github/spark/hooks';
import { CoffeeItem } from '../types';
import { generateId } from '../lib/pricing';

interface CartItem {
  id: string;
  item: CoffeeItem;
  quantity: number;
  price: number;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useKV<CartItem[]>('cart-items', []);

  const addToCart = (item: CoffeeItem, price: number, quantity: number = 1) => {
    setCartItems(currentItems => {
      const items = currentItems || [];
      const existingItem = items.find(cartItem => cartItem.item.id === item.id);
      
      if (existingItem) {
        return items.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      
      return [...items, {
        id: generateId(),
        item,
        quantity,
        price
      }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(currentItems => 
      (currentItems || []).filter(item => item.id !== cartItemId)
    );
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    
    setCartItems(currentItems =>
      (currentItems || []).map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotal = () => {
    return (cartItems || []).reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return (cartItems || []).reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cartItems: cartItems || [],
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount
  };
};