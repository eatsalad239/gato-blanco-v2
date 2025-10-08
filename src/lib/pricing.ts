import { EXCHANGE_RATE, GRINGO_MULTIPLIER } from '../data/content';

export const formatPrice = (priceInCOP: number, currency: 'COP' | 'USD', isGringo: boolean = false): string => {
  const finalPrice = isGringo ? priceInCOP * GRINGO_MULTIPLIER : priceInCOP;
  
  if (currency === 'USD') {
    const usdPrice = finalPrice / EXCHANGE_RATE;
    return `$${usdPrice.toFixed(2)}`;
  }
  
  return `$${finalPrice.toLocaleString('es-CO')} COP`;
};

export const detectUserType = (language: 'en' | 'es'): boolean => {
  return language === 'en';
};

export const getCurrency = (isGringo: boolean): 'COP' | 'USD' => {
  return isGringo ? 'USD' : 'COP';
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};