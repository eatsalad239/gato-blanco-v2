export interface MenuItem {
  id: string;
  name: { en: string; es: string };
  description: { en: string; es: string };
  basePrice: number; // in COP
  category: 'coffee' | 'food' | 'pastry' | 'liquor' | 'cocktail' | 'beer' | 'wine';
  image?: string;
  alcoholContent?: number; // percentage for alcoholic items
  availability?: {
    allDay?: boolean;
    startTime?: string; // "18:00" for evening only
    endTime?: string;
    days?: string[]; // ["fri", "sat"] for weekend only
  };
}

// Keep for backward compatibility
export interface CoffeeItem extends MenuItem {
  category: 'coffee' | 'food' | 'pastry';
}

export interface Service {
  id: string;
  name: { en: string; es: string };
  description: { en: string; es: string };
  basePriceCOP: number;
  category: 'tourism' | 'classes' | 'events' | 'party' | 'vip' | 'nightlife';
  duration: string;
  image?: string;
  highlights: { en: string[]; es: string[] };
  capacity?: number;
  ageRestriction?: number;
  availability?: {
    days?: string[]; // ["fri", "sat"] 
    startTime?: string; // "20:00"
    endTime?: string; // "02:00"
    recurring?: 'weekly' | 'monthly' | 'special';
  };
}

export interface Event {
  id: string;
  name: { en: string; es: string };
  description: { en: string; es: string };
  type: 'party' | 'live-music' | 'karaoke' | 'comedy' | 'language-exchange' | 'special';
  date: string;
  startTime: string;
  endTime: string;
  entryFee: number; // in COP
  capacity: number;
  currentBookings: number;
  ageRestriction: number;
  features: { en: string[]; es: string[] };
  drinks?: {
    included?: boolean;
    specials?: { name: string; price: number }[];
  };
}

export interface Inventory {
  id: string;
  itemId: string;
  quantity: number;
  minStock: number;
  supplier?: string;
  lastRestocked: string;
  cost: number; // purchase cost in COP
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

export interface Analytics {
  period: 'day' | 'week' | 'month';
  revenue: {
    total: number;
    byCategory: Record<string, number>;
    byCurrency: { COP: number; USD: number };
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    gringoPercentage: number;
  };
  topItems: {
    itemId: string;
    quantity: number;
    revenue: number;
  }[];
  events: {
    attendance: number;
    revenue: number;
  };
}