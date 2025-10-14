import { MenuItem } from '../types';

/**
 * Specials targeted at first-time visitors (primarily gringos / English speakers).
 * These items can be offered at a discount or as complimentary promotions.
 */
export const gringoSpecials: MenuItem[] = [
  {
    id: 'welcome-drink',
    name: { en: 'Welcome Drink', es: 'Bebida de Bienvenida' },
    description: {
      en: 'Complimentary drink for first-time visitors of Gato Blanco.',
      es: 'Bebida de cortesia para los visitantes nuevos de Gato Blanco.',
    },
    basePrice: 0,
    category: 'special',
    availability: { allDay: true },
  },
  {
    id: 'language-exchange-pass',
    name: { en: 'Language Exchange Pass', es: 'Pase de Intercambio de Idiomas' },
    description: {
      en: 'Access to one Language Exchange event with one free drink.',
      es: 'Acceso a un evento de intercambio de idiomas con una bebida gratis.',
    },
    basePrice: 0,
    category: 'special',
    availability: { allDay: true },
  },
];

/**
 * Content for the Gringo Connection section, highlighting services for expats
 * and digital nomads. This can be used to render a dedicated page or modal.
 */
export const gringoConnectionInfo = {
  title: {
    en: 'The Gringo Connection',
    es: 'La Conexión Gringo',
  },
  tagline: {
    en: 'Your link to authentic Paisa culture and community.',
    es: 'Tu vinculo a la autentica cultura paisa y comunidad.',
  },
  description: {
    en:
      'The Gringo Connection partners with Gato Blanco to provide expats and digital nomads ' +
      'with coworking, salsa and Spanish classes, curated tours, and a safe space to connect. ' +
      'Founded by Daniel with owners Yeri and Dani, it was built to help newcomers experience ' +
      'Medellin like a local.',
    es:
      'La Conexión Gringo se asocia con Gato Blanco para ofrecer a expatriados y nómadas digitales ' +
      'espacios de coworking, clases de salsa y español, tours seleccionados y un lugar seguro para conectar. ' +
      'Fundada por Daniel con los dueños Yeri y Dani, fue creada para ayudar a los recien llegados a ' +
      'conocer Medellin como un local.',
  },
  perks: [
    {
      en: 'Coworking space with high-speed internet and coffee included.',
      es: 'Espacio de coworking con internet de alta velocidad y cafe incluido.',
    },
    {
      en: 'Weekly salsa and Spanish classes.',
      es: 'Clases semanales de salsa y espanol.',
    },
    {
      en: 'Curated tours to Guatape, coffee farms and local hotspots.',
      es: 'Tours seleccionados a Guatape, fincas cafeteras y lugares locales.',
    },
    {
      en: 'Networking events for expats and local entrepreneurs.',
      es: 'Eventos de networking para expatriados y emprendedores locales.',
    },
  ],
  

};
