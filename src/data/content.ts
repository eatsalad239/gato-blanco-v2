import { MenuItem, Service, Event } from '../types';

export const EXCHANGE_RATE = 4200; // COP per USD (approximate current rate)
export const GRINGO_MULTIPLIER = 1.5; // 50% markup for gringos

// All menu items including coffee, food, and liquor
export const fullMenu: MenuItem[] = [
  // Coffee & Non-Alcoholic
  {
    id: 'cafe-americano',
    name: { en: 'Americano', es: 'Café Americano' },
    description: { 
      en: 'Classic Colombian coffee, smooth and bold', 
      es: 'Café colombiano clásico, suave y fuerte' 
    },
    basePrice: 4500,
    category: 'coffee',
    availability: { allDay: true }
  },
  {
    id: 'cafe-con-leche',
    name: { en: 'Café con Leche', es: 'Café con Leche' },
    description: { 
      en: 'Traditional Colombian coffee with steamed milk', 
      es: 'Café colombiano tradicional con leche espumada' 
    },
    basePrice: 5500,
    category: 'coffee',
    availability: { allDay: true }
  },
  {
    id: 'cortado',
    name: { en: 'Cortado', es: 'Cortado' },
    description: { 
      en: 'Espresso cut with warm milk, perfect balance', 
      es: 'Espresso cortado con leche tibia, equilibrio perfecto' 
    },
    basePrice: 6000,
    category: 'coffee',
    availability: { allDay: true }
  },
  {
    id: 'cold-brew',
    name: { en: 'Cold Brew', es: 'Café Frío' },
    description: { 
      en: 'Smooth cold-brewed Colombian coffee', 
      es: 'Café colombiano suave preparado en frío' 
    },
    basePrice: 7000,
    category: 'coffee',
    availability: { allDay: true }
  },

  // Food
  {
    id: 'arepa-queso',
    name: { en: 'Cheese Arepa', es: 'Arepa de Queso' },
    description: { 
      en: 'Traditional corn arepa filled with local cheese', 
      es: 'Arepa de maíz tradicional rellena de queso local' 
    },
    basePrice: 8000,
    category: 'food',
    availability: { allDay: true }
  },
  {
    id: 'empanada',
    name: { en: 'Empanada', es: 'Empanada' },
    description: { 
      en: 'Crispy pastry filled with seasoned meat', 
      es: 'Masa crujiente rellena de carne sazonada' 
    },
    basePrice: 3500,
    category: 'food',
    availability: { allDay: true }
  },
  {
    id: 'patacones',
    name: { en: 'Patacones', es: 'Patacones' },
    description: { 
      en: 'Twice-fried plantains with guacamole and hogao', 
      es: 'Plátanos verdes fritos dos veces con guacamole y hogao' 
    },
    basePrice: 12000,
    category: 'food',
    availability: { allDay: true }
  },
  {
    id: 'bandeja-paisa-mini',
    name: { en: 'Mini Bandeja Paisa', es: 'Bandeja Paisa Mini' },
    description: { 
      en: 'Small version of the traditional Antioquian platter', 
      es: 'Versión pequeña del plato tradicional antioqueño' 
    },
    basePrice: 18000,
    category: 'food',
    availability: { allDay: true }
  },

  // Pastries
  {
    id: 'buñuelo',
    name: { en: 'Buñuelo', es: 'Buñuelo' },
    description: { 
      en: 'Sweet fried dough ball, Colombian favorite', 
      es: 'Bolita de masa dulce frita, favorito colombiano' 
    },
    basePrice: 2500,
    category: 'pastry',
    availability: { allDay: true }
  },
  {
    id: 'tres-leches',
    name: { en: 'Tres Leches Cake', es: 'Torta Tres Leches' },
    description: { 
      en: 'Moist sponge cake soaked in three types of milk', 
      es: 'Bizcocho húmedo empapado en tres tipos de leche' 
    },
    basePrice: 9500,
    category: 'pastry',
    availability: { allDay: true }
  },

  // Colombian Spirits & Liquor
  {
    id: 'aguardiente-antioqueno',
    name: { en: 'Aguardiente Antioqueño', es: 'Aguardiente Antioqueño' },
    description: { 
      en: 'Traditional anise-flavored spirit from Antioquia', 
      es: 'Licor tradicional con sabor a anís de Antioquia' 
    },
    basePrice: 8000,
    category: 'liquor',
    alcoholContent: 29,
    availability: { startTime: '18:00', endTime: '02:00' }
  },
  {
    id: 'ron-viejo-de-caldas',
    name: { en: 'Ron Viejo de Caldas', es: 'Ron Viejo de Caldas' },
    description: { 
      en: 'Premium Colombian aged rum', 
      es: 'Ron colombiano premium añejado' 
    },
    basePrice: 12000,
    category: 'liquor',
    alcoholContent: 40,
    availability: { startTime: '18:00', endTime: '02:00' }
  },
  {
    id: 'whisky-shot',
    name: { en: 'Whisky Shot', es: 'Shot de Whisky' },
    description: { 
      en: 'Premium whisky shot for the evening', 
      es: 'Shot de whisky premium para la noche' 
    },
    basePrice: 15000,
    category: 'liquor',
    alcoholContent: 40,
    availability: { startTime: '20:00', endTime: '02:00' }
  },

  // Beer
  {
    id: 'club-colombia',
    name: { en: 'Club Colombia', es: 'Club Colombia' },
    description: { 
      en: 'Premium Colombian lager beer', 
      es: 'Cerveza lager colombiana premium' 
    },
    basePrice: 6000,
    category: 'beer',
    alcoholContent: 4.7,
    availability: { startTime: '16:00', endTime: '02:00' }
  },
  {
    id: 'poker',
    name: { en: 'Poker Beer', es: 'Cerveza Poker' },
    description: { 
      en: 'Classic Colombian beer, light and refreshing', 
      es: 'Cerveza colombiana clásica, ligera y refrescante' 
    },
    basePrice: 5000,
    category: 'beer',
    alcoholContent: 4.2,
    availability: { startTime: '16:00', endTime: '02:00' }
  },
  {
    id: 'corona',
    name: { en: 'Corona', es: 'Corona' },
    description: { 
      en: 'Mexican beer with lime, gringo favorite', 
      es: 'Cerveza mexicana con limón, favorita de gringos' 
    },
    basePrice: 8000,
    category: 'beer',
    alcoholContent: 4.5,
    availability: { startTime: '16:00', endTime: '02:00' }
  },

  // Wine
  {
    id: 'vino-tinto-colombia',
    name: { en: 'Colombian Red Wine', es: 'Vino Tinto Colombiano' },
    description: { 
      en: 'Local red wine from Colombian vineyards', 
      es: 'Vino tinto local de viñedos colombianos' 
    },
    basePrice: 45000,
    category: 'wine',
    alcoholContent: 13,
    availability: { startTime: '17:00', endTime: '02:00' }
  },

  // Cocktails
  {
    id: 'caipirinha-colombiana',
    name: { en: 'Colombian Caipirinha', es: 'Caipirinha Colombiana' },
    description: { 
      en: 'Aguardiente-based cocktail with lime and panela', 
      es: 'Cóctel a base de aguardiente con limón y panela' 
    },
    basePrice: 18000,
    category: 'cocktail',
    alcoholContent: 15,
    availability: { startTime: '19:00', endTime: '02:00' }
  },
  {
    id: 'mojito-cafe',
    name: { en: 'Coffee Mojito', es: 'Mojito de Café' },
    description: { 
      en: 'Unique mojito with cold brew coffee and mint', 
      es: 'Mojito único con café frío y hierbabuena' 
    },
    basePrice: 20000,
    category: 'cocktail',
    alcoholContent: 12,
    availability: { startTime: '19:00', endTime: '02:00' }
  },
  {
    id: 'gringo-especial',
    name: { en: 'Gringo Especial', es: 'Gringo Especial' },
    description: { 
      en: 'House special cocktail for international visitors', 
      es: 'Cóctel especial de la casa para visitantes internacionales' 
    },
    basePrice: 25000,
    category: 'cocktail',
    alcoholContent: 18,
    availability: { startTime: '20:00', endTime: '02:00' }
  }
];

// Legacy export for backward compatibility
export const coffeeMenu = fullMenu.filter(item => 
  ['coffee', 'food', 'pastry'].includes(item.category)
) as any[];

export const services: Service[] = [
  // Tourism Services
  {
    id: 'city-tour',
    name: { en: 'Medellín City Tour', es: 'Tour por Medellín' },
    description: { 
      en: 'Explore the transformation of Medellín with local insights', 
      es: 'Explora la transformación de Medellín con perspectivas locales' 
    },
    basePriceCOP: 120000,
    category: 'tourism',
    duration: '4 hours',
    capacity: 12,
    highlights: {
      en: ['Comuna 13 Graffiti Tour', 'Cable Car Rides', 'Local Food Tasting', 'English Guide'],
      es: ['Tour de Grafitis Comuna 13', 'Paseos en Teleférico', 'Degustación Local', 'Guía Bilingüe']
    }
  },
  {
    id: 'coffee-farm',
    name: { en: 'Coffee Farm Experience', es: 'Experiencia Finca Cafetera' },
    description: { 
      en: 'Full day coffee farm visit with harvesting and tasting', 
      es: 'Visita de día completo a finca cafetera con cosecha y cata' 
    },
    basePriceCOP: 180000,
    category: 'tourism',
    duration: '8 hours',
    capacity: 8,
    highlights: {
      en: ['Coffee Harvesting', 'Processing Workshop', 'Professional Tasting', 'Transportation Included'],
      es: ['Cosecha de Café', 'Taller de Procesamiento', 'Cata Profesional', 'Transporte Incluido']
    }
  },
  {
    id: 'pablo-escobar-tour',
    name: { en: 'Pablo Escobar Historical Tour', es: 'Tour Histórico Pablo Escobar' },
    description: { 
      en: 'Educational tour about Medellín\'s transformation post-cartel era', 
      es: 'Tour educativo sobre la transformación de Medellín post-era del cartel' 
    },
    basePriceCOP: 150000,
    category: 'tourism',
    duration: '5 hours',
    capacity: 10,
    highlights: {
      en: ['Historical Context', 'Transformation Story', 'Local Perspectives', 'Responsible Tourism'],
      es: ['Contexto Histórico', 'Historia de Transformación', 'Perspectivas Locales', 'Turismo Responsable']
    }
  },
  {
    id: 'guatape-day-trip',
    name: { en: 'Guatapé Day Trip', es: 'Excursión a Guatapé' },
    description: { 
      en: 'Visit the colorful town and climb El Peñón rock', 
      es: 'Visita el pueblo colorido y escala la piedra El Peñón' 
    },
    basePriceCOP: 200000,
    category: 'tourism',
    duration: '10 hours',
    capacity: 6,
    highlights: {
      en: ['El Peñón Climb', 'Colorful Zócalos', 'Boat Ride', 'Traditional Lunch'],
      es: ['Subida al Peñón', 'Zócalos Coloridos', 'Paseo en Lancha', 'Almuerzo Tradicional']
    }
  },

  // Classes
  {
    id: 'spanish-beginner',
    name: { en: 'Spanish for Beginners', es: 'Español para Principiantes' },
    description: { 
      en: 'Learn essential Spanish with focus on Colombian expressions', 
      es: 'Aprende español esencial con enfoque en expresiones colombianas' 
    },
    basePriceCOP: 80000,
    category: 'classes',
    duration: '2 hours',
    capacity: 8,
    highlights: {
      en: ['Conversational Focus', 'Colombian Slang', 'Cultural Context', 'Small Groups'],
      es: ['Enfoque Conversacional', 'Jerga Colombiana', 'Contexto Cultural', 'Grupos Pequeños']
    }
  },
  {
    id: 'spanish-advanced',
    name: { en: 'Advanced Spanish & Paisa Culture', es: 'Español Avanzado y Cultura Paisa' },
    description: { 
      en: 'Deep dive into Paisa culture and advanced Spanish', 
      es: 'Inmersión profunda en la cultura paisa y español avanzado' 
    },
    basePriceCOP: 120000,
    category: 'classes',
    duration: '3 hours',
    capacity: 6,
    highlights: {
      en: ['Paisa Expressions', 'Cultural Immersion', 'Advanced Grammar', 'Local History'],
      es: ['Expresiones Paisas', 'Inmersión Cultural', 'Gramática Avanzada', 'Historia Local']
    }
  },
  {
    id: 'salsa-class',
    name: { en: 'Salsa Dancing Class', es: 'Clase de Salsa' },
    description: { 
      en: 'Learn authentic Colombian salsa from local instructors', 
      es: 'Aprende salsa colombiana auténtica con instructores locales' 
    },
    basePriceCOP: 60000,
    category: 'classes',
    duration: '1.5 hours',
    capacity: 20,
    availability: { days: ['wed', 'fri', 'sat'], startTime: '20:00', endTime: '21:30' },
    highlights: {
      en: ['Professional Instructors', 'All Skill Levels', 'Partner Rotation', 'Live Music'],
      es: ['Instructores Profesionales', 'Todos los Niveles', 'Rotación de Parejas', 'Música en Vivo']
    }
  },
  {
    id: 'bachata-class',
    name: { en: 'Bachata Dancing Class', es: 'Clase de Bachata' },
    description: { 
      en: 'Sensual bachata lessons in a fun environment', 
      es: 'Lecciones de bachata sensual en un ambiente divertido' 
    },
    basePriceCOP: 55000,
    category: 'classes',
    duration: '1.5 hours',
    capacity: 16,
    availability: { days: ['thu', 'sat'], startTime: '19:00', endTime: '20:30' },
    highlights: {
      en: ['Sensual Movement', 'Beginner Friendly', 'Great Music', 'Social Dancing'],
      es: ['Movimiento Sensual', 'Amigable para Principiantes', 'Buena Música', 'Baile Social']
    }
  },

  // Events & Social
  {
    id: 'language-exchange',
    name: { en: 'Language Exchange Night', es: 'Noche de Intercambio de Idiomas' },
    description: { 
      en: 'Practice Spanish & English with locals and expats', 
      es: 'Practica español e inglés con locales y expatriados' 
    },
    basePriceCOP: 25000,
    category: 'events',
    duration: '3 hours',
    capacity: 50,
    availability: { days: ['tue', 'thu'], startTime: '19:00', endTime: '22:00', recurring: 'weekly' },
    highlights: {
      en: ['Conversation Groups', 'Cultural Games', 'Networking', 'Welcome Drink'],
      es: ['Grupos de Conversación', 'Juegos Culturales', 'Networking', 'Bebida de Bienvenida']
    }
  },
  {
    id: 'gringo-meetup',
    name: { en: 'Weekly Gringo Meetup', es: 'Encuentro Semanal de Gringos' },
    description: { 
      en: 'Connect with fellow expats and digital nomads', 
      es: 'Conecta con otros expatriados y nómadas digitales' 
    },
    basePriceCOP: 20000,
    category: 'events',
    duration: '2 hours',
    capacity: 30,
    availability: { days: ['sun'], startTime: '16:00', endTime: '18:00', recurring: 'weekly' },
    highlights: {
      en: ['Networking', 'Local Tips Sharing', 'Social Games', 'Coffee Included'],
      es: ['Networking', 'Compartir Tips Locales', 'Juegos Sociales', 'Café Incluido']
    }
  },

  // Party & Nightlife
  {
    id: 'friday-party-night',
    name: { en: 'Friday Party Night', es: 'Noche de Fiesta Viernes' },
    description: { 
      en: 'Weekly party with DJ, dancing, and premium drinks', 
      es: 'Fiesta semanal con DJ, baile y bebidas premium' 
    },
    basePriceCOP: 40000,
    category: 'party',
    duration: '6 hours',
    capacity: 80,
    ageRestriction: 18,
    availability: { days: ['fri'], startTime: '22:00', endTime: '04:00', recurring: 'weekly' },
    highlights: {
      en: ['Live DJ', 'Dance Floor', 'Premium Bar', 'International Crowd', 'Late Night Vibes'],
      es: ['DJ en Vivo', 'Pista de Baile', 'Bar Premium', 'Ambiente Internacional', 'Ambiente Nocturno']
    }
  },
  {
    id: 'saturday-salsa-night',
    name: { en: 'Saturday Salsa Night', es: 'Noche de Salsa Sábado' },
    description: { 
      en: 'Live salsa music and dancing with professional performers', 
      es: 'Música de salsa en vivo y baile con artistas profesionales' 
    },
    basePriceCOP: 50000,
    category: 'party',
    duration: '5 hours',
    capacity: 60,
    ageRestriction: 18,
    availability: { days: ['sat'], startTime: '21:00', endTime: '02:00', recurring: 'weekly' },
    highlights: {
      en: ['Live Salsa Band', 'Professional Dancers', 'Dance Lessons', 'Authentic Experience'],
      es: ['Banda de Salsa en Vivo', 'Bailarines Profesionales', 'Clases de Baile', 'Experiencia Auténtica']
    }
  },
  {
    id: 'karaoke-night',
    name: { en: 'Karaoke Night', es: 'Noche de Karaoke' },
    description: { 
      en: 'Sing your heart out in Spanish and English', 
      es: 'Canta a todo pulmón en español e inglés' 
    },
    basePriceCOP: 30000,
    category: 'events',
    duration: '4 hours',
    capacity: 40,
    availability: { days: ['wed'], startTime: '20:00', endTime: '00:00', recurring: 'weekly' },
    highlights: {
      en: ['Bilingual Songs', 'Private Rooms Available', 'Cocktail Specials', 'Fun Atmosphere'],
      es: ['Canciones Bilingües', 'Salas Privadas Disponibles', 'Especiales de Cócteles', 'Ambiente Divertido']
    }
  },

  // VIP Services
  {
    id: 'vip-table-service',
    name: { en: 'VIP Table Service', es: 'Servicio de Mesa VIP' },
    description: { 
      en: 'Premium table service with bottle service and dedicated waitstaff', 
      es: 'Servicio premium de mesa con servicio de botellas y mesero dedicado' 
    },
    basePriceCOP: 300000,
    category: 'vip',
    duration: '4 hours',
    capacity: 8,
    ageRestriction: 18,
    availability: { days: ['fri', 'sat'], startTime: '21:00', endTime: '01:00' },
    highlights: {
      en: ['Premium Location', 'Bottle Service', 'Dedicated Waitstaff', 'Exclusive Access'],
      es: ['Ubicación Premium', 'Servicio de Botellas', 'Mesero Dedicado', 'Acceso Exclusivo']
    }
  },
  {
    id: 'private-event-hosting',
    name: { en: 'Private Event Hosting', es: 'Organización de Eventos Privados' },
    description: { 
      en: 'Custom private events for groups with full venue access', 
      es: 'Eventos privados personalizados para grupos con acceso completo al lugar' 
    },
    basePriceCOP: 1500000,
    category: 'vip',
    duration: '6 hours',
    capacity: 100,
    highlights: {
      en: ['Venue Buyout', 'Custom Menu', 'Professional Staff', 'Sound System', 'Photography'],
      es: ['Alquiler Completo', 'Menú Personalizado', 'Personal Profesional', 'Sistema de Sonido', 'Fotografía']
    }
  }
];

export const upcomingEvents: Event[] = [
  {
    id: 'live-music-friday',
    name: { en: 'Live Colombian Rock', es: 'Rock Colombiano en Vivo' },
    description: { 
      en: 'Local Colombian rock band performing hits and originals', 
      es: 'Banda de rock colombiana local interpretando éxitos y originales' 
    },
    type: 'live-music',
    date: '2024-12-27',
    startTime: '21:00',
    endTime: '01:00',
    entryFee: 35000,
    capacity: 70,
    currentBookings: 23,
    ageRestriction: 18,
    features: {
      en: ['Live Band', 'Original Music', 'Dancing', 'Bar Open'],
      es: ['Banda en Vivo', 'Música Original', 'Baile', 'Bar Abierto']
    },
    drinks: {
      included: false,
      specials: [
        { name: 'Beer Bucket (6)', price: 25000 },
        { name: 'Aguardiente Shot', price: 6000 }
      ]
    }
  },
  {
    id: 'new-years-party',
    name: { en: 'New Year\'s Eve Mega Party', es: 'Mega Fiesta de Año Nuevo' },
    description: { 
      en: 'Ring in 2025 with the biggest party in Zona Rosa', 
      es: 'Recibe el 2025 con la fiesta más grande de la Zona Rosa' 
    },
    type: 'special',
    date: '2024-12-31',
    startTime: '22:00',
    endTime: '06:00',
    entryFee: 120000,
    capacity: 150,
    currentBookings: 67,
    ageRestriction: 18,
    features: {
      en: ['Live DJ', 'Countdown Celebration', 'Premium Bar', 'Champagne Toast', 'Late Night Food'],
      es: ['DJ en Vivo', 'Celebración de Cuenta Regresiva', 'Bar Premium', 'Brindis con Champagne', 'Comida Nocturna']
    },
    drinks: {
      included: true,
      specials: [
        { name: 'Champagne Bottle', price: 80000 },
        { name: 'VIP Package', price: 200000 }
      ]
    }
  },
  {
    id: 'comedy-night-english',
    name: { en: 'Stand-Up Comedy Night (English)', es: 'Noche de Stand-Up Comedy (Inglés)' },
    description: { 
      en: 'English-speaking comedians from around the world', 
      es: 'Comediantes de habla inglesa de todo el mundo' 
    },
    type: 'comedy',
    date: '2025-01-10',
    startTime: '20:00',
    endTime: '22:30',
    entryFee: 40000,
    capacity: 50,
    currentBookings: 12,
    ageRestriction: 18,
    features: {
      en: ['International Comedians', 'English Language', 'Intimate Setting', 'Bar Available'],
      es: ['Comediantes Internacionales', 'Idioma Inglés', 'Ambiente Íntimo', 'Bar Disponible']
    },
    drinks: {
      included: false,
      specials: [
        { name: '2-for-1 Cocktails', price: 30000 }
      ]
    }
  }
];