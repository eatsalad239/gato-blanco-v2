import { CoffeeItem, Service } from '../types';

export const EXCHANGE_RATE = 4200; // COP per USD (approximate current rate)

export const GRINGO_MULTIPLIER = 1.5; // 50% markup for gringos

export const coffeeMenu: CoffeeItem[] = [
  {
    id: 'cafe-americano',
    name: { en: 'Americano', es: 'Café Americano' },
    description: { 
      en: 'Classic Colombian coffee, smooth and bold', 
      es: 'Café colombiano clásico, suave y fuerte' 
    },
    basePrice: 4500,
    category: 'coffee'
  },
  {
    id: 'cafe-con-leche',
    name: { en: 'Café con Leche', es: 'Café con Leche' },
    description: { 
      en: 'Traditional Colombian coffee with steamed milk', 
      es: 'Café colombiano tradicional con leche espumada' 
    },
    basePrice: 5500,
    category: 'coffee'
  },
  {
    id: 'cortado',
    name: { en: 'Cortado', es: 'Cortado' },
    description: { 
      en: 'Espresso cut with warm milk, perfect balance', 
      es: 'Espresso cortado con leche tibia, equilibrio perfecto' 
    },
    basePrice: 6000,
    category: 'coffee'
  },
  {
    id: 'cold-brew',
    name: { en: 'Cold Brew', es: 'Café Frío' },
    description: { 
      en: 'Smooth cold-brewed Colombian coffee', 
      es: 'Café colombiano suave preparado en frío' 
    },
    basePrice: 7000,
    category: 'coffee'
  },
  {
    id: 'arepa-queso',
    name: { en: 'Cheese Arepa', es: 'Arepa de Queso' },
    description: { 
      en: 'Traditional corn arepa filled with local cheese', 
      es: 'Arepa de maíz tradicional rellena de queso local' 
    },
    basePrice: 8000,
    category: 'food'
  },
  {
    id: 'empanada',
    name: { en: 'Empanada', es: 'Empanada' },
    description: { 
      en: 'Crispy pastry filled with seasoned meat', 
      es: 'Masa crujiente rellena de carne sazonada' 
    },
    basePrice: 3500,
    category: 'food'
  },
  {
    id: 'buñuelo',
    name: { en: 'Buñuelo', es: 'Buñuelo' },
    description: { 
      en: 'Sweet fried dough ball, Colombian favorite', 
      es: 'Bolita de masa dulce frita, favorito colombiano' 
    },
    basePrice: 2500,
    category: 'pastry'
  },
  {
    id: 'tres-leches',
    name: { en: 'Tres Leches Cake', es: 'Torta Tres Leches' },
    description: { 
      en: 'Moist sponge cake soaked in three types of milk', 
      es: 'Bizcocho húmedo empapado en tres tipos de leche' 
    },
    basePrice: 9500,
    category: 'pastry'
  }
];

export const services: Service[] = [
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
    highlights: {
      en: ['Coffee Harvesting', 'Processing Workshop', 'Professional Tasting', 'Transportation Included'],
      es: ['Cosecha de Café', 'Taller de Procesamiento', 'Cata Profesional', 'Transporte Incluido']
    }
  },
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
    highlights: {
      en: ['Conversational Focus', 'Colombian Slang', 'Cultural Context', 'Small Groups'],
      es: ['Enfoque Conversacional', 'Jerga Colombiana', 'Contexto Cultural', 'Grupos Pequeños']
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
    highlights: {
      en: ['Professional Instructors', 'All Skill Levels', 'Partner Rotation', 'Live Music'],
      es: ['Instructores Profesionales', 'Todos los Niveles', 'Rotación de Parejas', 'Música en Vivo']
    }
  },
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
    highlights: {
      en: ['Networking', 'Local Tips Sharing', 'Social Games', 'Coffee Included'],
      es: ['Networking', 'Compartir Tips Locales', 'Juegos Sociales', 'Café Incluido']
    }
  }
];