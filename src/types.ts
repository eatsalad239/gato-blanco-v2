export interface CoffeeItem {
  id: string;
  name: { en: string; es: string };
  description: { en: string; es: string };
  basePrice: number; // in COP
  category: 'coffee' | 'food' | 'pastry';
  image?: string;
}

export interface Service {
  id: string;
  name: { en: string; es: string };
  description: { en: string; es: string };
  basePriceCOP: number;
  category: 'tourism' | 'classes' | 'events';
  duration: string;
  image?: string;
  highlights: { en: string[]; es: string[] };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isGringo: boolean;
  totalSpent: number;
  orders: Order[];
  bookings: Booking[];
}

export interface Order {
  id: string;
  customerId: string;
  items: { itemId: string; quantity: number; price: number }[];
  total: number;
  currency: 'COP' | 'USD';
  status: 'pending' | 'confirmed' | 'completed';
  timestamp: number;
  type: 'pickup' | 'delivery';
}

export interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  date: string;
  time: string;
  participants: number;
  total: number;
  currency: 'COP' | 'USD';
  status: 'pending' | 'confirmed' | 'completed';
  timestamp: number;
}

export interface Language {
  code: 'en' | 'es';
  name: string;
  flag: string;
}

export interface PricingTier {
  isGringo: boolean;
  multiplier: number;
  currency: 'COP' | 'USD';
}