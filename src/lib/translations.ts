import { create } from 'zustand';
import { Language } from '../types';

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇨🇴' }
];

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLanguage: languages[1], // Default to Spanish
  setLanguage: (language) => set({ currentLanguage: language }),
}));

export const translations = {
  en: {
    nav: {
      home: 'Home',
      menu: 'Menu',
      services: 'Services',
      about: 'About',
      admin: 'Admin'
    },
    hero: {
      title: 'Gato Blanco',
      subtitle: 'Premium Coffee & Gringo Services',
      description: 'Experience authentic Colombian coffee culture in the heart of Zona Rosa, Medellín. From specialty coffee to exclusive gringo services.',
      cta: 'Explore Services'
    },
    menu: {
      title: 'Coffee Menu',
      subtitle: 'Authentic Colombian Coffee Experience',
      addToCart: 'Add to Cart',
      viewCart: 'View Cart',
      checkout: 'Checkout'
    },
    services: {
      title: 'Gringo Services',
      subtitle: 'Exclusive experiences for international visitors',
      duration: 'Duration',
      book: 'Book Now',
      from: 'From'
    },
    cart: {
      title: 'Your Order',
      empty: 'Your cart is empty',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      remove: 'Remove'
    },
    booking: {
      title: 'Book Service',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone (optional)',
      date: 'Date',
      time: 'Time',
      participants: 'Participants',
      submit: 'Confirm Booking',
      success: 'Booking confirmed! We\'ll contact you soon.'
    },
    about: {
      title: 'About Gato Blanco',
      story: 'Located in the vibrant Zona Rosa district of Medellín, Gato Blanco represents the perfect fusion of traditional Colombian coffee culture and modern gringo-friendly services. Our partnership with Gringo Connection brings you authentic local experiences designed specifically for international visitors.',
      location: 'Zona Rosa, Medellín',
      hours: 'Mon-Sun: 7AM - 10PM'
    },
    admin: {
      title: 'Admin Dashboard',
      customers: 'Customers',
      orders: 'Orders',
      bookings: 'Bookings',
      revenue: 'Revenue',
      gringoRevenue: 'Gringo Revenue',
      localRevenue: 'Local Revenue'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      menu: 'Menú',
      services: 'Servicios',
      about: 'Nosotros',
      admin: 'Admin'
    },
    hero: {
      title: 'Gato Blanco',
      subtitle: 'Café Premium y Servicios para Gringos',
      description: 'Experimenta la auténtica cultura del café colombiano en el corazón de la Zona Rosa, Medellín. Desde café especializado hasta servicios exclusivos para gringos.',
      cta: 'Explorar Servicios'
    },
    menu: {
      title: 'Menú de Café',
      subtitle: 'Auténtica Experiencia de Café Colombiano',
      addToCart: 'Agregar al Carrito',
      viewCart: 'Ver Carrito',
      checkout: 'Pagar'
    },
    services: {
      title: 'Servicios para Gringos',
      subtitle: 'Experiencias exclusivas para visitantes internacionales',
      duration: 'Duración',
      book: 'Reservar Ahora',
      from: 'Desde'
    },
    cart: {
      title: 'Tu Pedido',
      empty: 'Tu carrito está vacío',
      total: 'Total',
      checkout: 'Proceder al Pago',
      remove: 'Eliminar'
    },
    booking: {
      title: 'Reservar Servicio',
      name: 'Nombre Completo',
      email: 'Correo Electrónico',
      phone: 'Teléfono (opcional)',
      date: 'Fecha',
      time: 'Hora',
      participants: 'Participantes',
      submit: 'Confirmar Reserva',
      success: '¡Reserva confirmada! Te contactaremos pronto.'
    },
    about: {
      title: 'Acerca de Gato Blanco',
      story: 'Ubicado en el vibrante distrito de la Zona Rosa de Medellín, Gato Blanco representa la fusión perfecta entre la cultura tradicional del café colombiano y los servicios modernos para gringos. Nuestra alianza con Gringo Connection te trae experiencias locales auténticas diseñadas específicamente para visitantes internacionales.',
      location: 'Zona Rosa, Medellín',
      hours: 'Lun-Dom: 7AM - 10PM'
    },
    admin: {
      title: 'Panel de Administración',
      customers: 'Clientes',
      orders: 'Pedidos',
      bookings: 'Reservas',
      revenue: 'Ingresos',
      gringoRevenue: 'Ingresos Gringos',
      localRevenue: 'Ingresos Locales'
    }
  }
};