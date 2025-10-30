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
  currentLanguage: languages[0], // Default to English for global compatibility
  setLanguage: (language) => set({ currentLanguage: language }),
}));

export const translations = {
  en: {
    nav: {
      home: 'Home',
      menu: 'Menu',
      drinks: 'Drinks',
      services: 'Services',
      events: 'Events',
      about: 'About',
      admin: 'Admin'
    },
    hero: {
      title: 'Gato Blanco',
      subtitle: 'Coffee, Cocktails & Gringo Services',
      description: 'Experience authentic Colombian coffee culture by day, vibrant nightlife and exclusive gringo services by night in the heart of Zona Rosa, Medellín.',
      cta: 'Explore Services'
    },
    menu: {
      title: 'Menu',
      subtitle: 'From Colombian Coffee to Premium Cocktails',
      coffee: 'Coffee & Food',
      drinks: 'Drinks & Cocktails',
      liquor: 'Premium Spirits',
      beer: 'Beer Selection',
      wine: 'Wine Collection',
      addToCart: 'Add to Cart',
      viewCart: 'View Cart',
      checkout: 'Checkout',
      availableFrom: 'Available from',
      alcoholContent: 'ABV',
      ageRestriction: '18+ Only'
    },
    drinks: {
      title: 'Drinks & Nightlife',
      subtitle: 'Premium spirits and signature cocktails',
      cocktails: 'Signature Cocktails',
      beer: 'Beer Selection',
      spirits: 'Premium Spirits',
      wine: 'Wine Collection',
      happyHour: 'Happy Hour: 6PM - 8PM',
      lateNight: 'Late Night Service Until 2AM'
    },
    services: {
      title: 'Gringo Services',
      subtitle: 'Exclusive experiences for international visitors',
      tourism: 'Tourism & Tours',
      classes: 'Classes & Learning',
      events: 'Social Events',
      party: 'Party Services',
      vip: 'VIP Experiences',
      nightlife: 'Nightlife',
      duration: 'Duration',
      capacity: 'Max Capacity',
      book: 'Book Now',
      from: 'From',
      ageRestriction: 'Age Restriction'
    },
    events: {
      title: 'Upcoming Events',
      subtitle: 'Live music, parties, and special events',
      upcoming: 'This Week',
      past: 'Past Events',
      entryFee: 'Entry Fee',
      capacity: 'Capacity',
      spotsLeft: 'spots left',
      soldOut: 'Sold Out',
      bookNow: 'Book Tickets',
      features: 'Features',
      drinkSpecials: 'Drink Specials',
      included: 'Drinks Included',
      liveMusic: 'Live Music',
      party: 'Party Night',
      comedy: 'Comedy Show',
      karaoke: 'Karaoke Night',
      special: 'Special Event'
    },
    cart: {
      title: 'Your Order',
      yourCart: 'Your Cart',
      empty: 'Your cart is empty',
      emptyCart: 'Your cart is empty',
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
      success: 'Booking confirmed! We\'ll contact you soon.',
      eventBooking: 'Event Tickets',
      ticketQuantity: 'Number of Tickets'
    },
    about: {
      title: 'About Gato Blanco',
      story: 'Located in the vibrant Zona Rosa district of Medellín, Gato Blanco represents the perfect fusion of traditional Colombian coffee culture, modern nightlife, and gringo-friendly services. From morning coffee to late-night cocktails, we offer a complete experience. Our partnership with Gringo Connection brings you authentic local experiences designed specifically for international visitors.',
      location: 'Zona Rosa, Medellín',
      hours: 'Coffee: 7AM - 10PM | Bar: 6PM - 2AM',
      nightlife: 'Premium nightlife experience',
      events: 'Regular live events and parties'
    },
    admin: {
      title: 'Business Management Dashboard',
      overview: 'Overview',
      customers: 'Customers',
      orders: 'Orders',
      bookings: 'Bookings',
      events: 'Events',
      inventory: 'Inventory',
      analytics: 'Analytics',
      revenue: 'Revenue',
      gringoRevenue: 'Gringo Revenue',
      localRevenue: 'Local Revenue',
      dailySales: 'Daily Sales',
      topItems: 'Top Selling Items',
      eventAttendance: 'Event Attendance',
      lowStock: 'Low Stock Alerts',
      recentOrders: 'Recent Orders',
      upcomingBookings: 'Upcoming Bookings',
      customerStats: 'Customer Statistics',
      exportData: 'Export Data',
      settings: 'Settings'
    },
    payment: {
      applePay: 'Pay with Apple Pay',
      cardPayment: 'Pay with Card',
      cash: 'Pay Cash',
      processing: 'Processing Payment...',
      success: 'Payment Successful!',
      failed: 'Payment Failed'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      menu: 'Menú',
      drinks: 'Bebidas',
      services: 'Servicios',
      events: 'Eventos',
      about: 'Nosotros',
      admin: 'Admin'
    },
    hero: {
      title: 'Gato Blanco',
      subtitle: 'Café, Cócteles y Servicios para Gringos',
      description: 'Experimenta la auténtica cultura del café colombiano de día, vida nocturna vibrante y servicios exclusivos para gringos de noche en el corazón de la Zona Rosa, Medellín.',
      cta: 'Explorar Servicios'
    },
    menu: {
      title: 'Menú',
      subtitle: 'Desde Café Colombiano hasta Cócteles Premium',
      coffee: 'Café y Comida',
      drinks: 'Bebidas y Cócteles',
      liquor: 'Licores Premium',
      beer: 'Selección de Cervezas',
      wine: 'Colección de Vinos',
      addToCart: 'Agregar al Carrito',
      viewCart: 'Ver Carrito',
      checkout: 'Pagar',
      availableFrom: 'Disponible desde',
      alcoholContent: 'Grado Alcohólico',
      ageRestriction: 'Solo 18+'
    },
    drinks: {
      title: 'Bebidas y Vida Nocturna',
      subtitle: 'Licores premium y cócteles únicos',
      cocktails: 'Cócteles Únicos',
      beer: 'Selección de Cervezas',
      spirits: 'Licores Premium',
      wine: 'Colección de Vinos',
      happyHour: 'Hora Feliz: 6PM - 8PM',
      lateNight: 'Servicio Nocturno Hasta las 2AM'
    },
    services: {
      title: 'Servicios para Gringos',
      subtitle: 'Experiencias exclusivas para visitantes internacionales',
      tourism: 'Turismo y Tours',
      classes: 'Clases y Aprendizaje',
      events: 'Eventos Sociales',
      party: 'Servicios de Fiesta',
      vip: 'Experiencias VIP',
      nightlife: 'Vida Nocturna',
      duration: 'Duración',
      capacity: 'Capacidad Máxima',
      book: 'Reservar Ahora',
      from: 'Desde',
      ageRestriction: 'Restricción de Edad'
    },
    events: {
      title: 'Próximos Eventos',
      subtitle: 'Música en vivo, fiestas y eventos especiales',
      upcoming: 'Esta Semana',
      past: 'Eventos Pasados',
      entryFee: 'Entrada',
      capacity: 'Capacidad',
      spotsLeft: 'cupos disponibles',
      soldOut: 'Agotado',
      bookNow: 'Comprar Boletos',
      features: 'Características',
      drinkSpecials: 'Especiales de Bebidas',
      included: 'Bebidas Incluidas',
      liveMusic: 'Música en Vivo',
      party: 'Noche de Fiesta',
      comedy: 'Show de Comedia',
      karaoke: 'Noche de Karaoke',
      special: 'Evento Especial'
    },
    cart: {
      title: 'Tu Pedido',
      yourCart: 'Tu Carrito',
      empty: 'Tu carrito está vacío',
      emptyCart: 'Tu carrito está vacío',
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
      success: '¡Reserva confirmada! Te contactaremos pronto.',
      eventBooking: 'Boletos para Evento',
      ticketQuantity: 'Número de Boletos'
    },
    about: {
      title: 'Acerca de Gato Blanco',
      story: 'Ubicado en el vibrante distrito de la Zona Rosa de Medellín, Gato Blanco representa la fusión perfecta entre la cultura tradicional del café colombiano, la vida nocturna moderna y los servicios para gringos. Desde café matutino hasta cócteles nocturnos, ofrecemos una experiencia completa. Nuestra alianza con Gringo Connection te trae experiencias locales auténticas diseñadas específicamente para visitantes internacionales.',
      location: 'Zona Rosa, Medellín',
      hours: 'Café: 7AM - 10PM | Bar: 6PM - 2AM',
      nightlife: 'Experiencia de vida nocturna premium',
      events: 'Eventos en vivo y fiestas regulares'
    },
    admin: {
      title: 'Panel de Gestión Empresarial',
      overview: 'Resumen',
      customers: 'Clientes',
      orders: 'Pedidos',
      bookings: 'Reservas',
      events: 'Eventos',
      inventory: 'Inventario',
      analytics: 'Analíticas',
      revenue: 'Ingresos',
      gringoRevenue: 'Ingresos Gringos',
      localRevenue: 'Ingresos Locales',
      dailySales: 'Ventas Diarias',
      topItems: 'Artículos Más Vendidos',
      eventAttendance: 'Asistencia a Eventos',
      lowStock: 'Alertas de Stock Bajo',
      recentOrders: 'Pedidos Recientes',
      upcomingBookings: 'Próximas Reservas',
      customerStats: 'Estadísticas de Clientes',
      exportData: 'Exportar Datos',
      settings: 'Configuraciones'
    },
    payment: {
      applePay: 'Pagar con Apple Pay',
      cardPayment: 'Pagar con Tarjeta',
      cash: 'Pagar en Efectivo',
      processing: 'Procesando Pago...',
      success: '¡Pago Exitoso!',
      failed: 'Pago Fallido'
    }
  }
};