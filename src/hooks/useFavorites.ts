import { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { toast } from 'sonner';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(id => typeof id === 'string')) {
          setFavorites(parsed);
        } else {
          localStorage.removeItem('favorites');
        }
      }
    } catch (e) {
      console.error('Failed to load favorites:', e);
      localStorage.removeItem('favorites');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
      // Handle quota exceeded
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded, clearing old data');
      }
    }
  }, [favorites]);

  const addFavorite = (itemId: string) => {
    setFavorites(prev => {
      if (prev.includes(itemId)) return prev;
      toast.success('Added to favorites! ❤️');
      return [...prev, itemId];
    });
  };

  const removeFavorite = (itemId: string) => {
    setFavorites(prev => {
      const updated = prev.filter(id => id !== itemId);
      toast.success('Removed from favorites');
      return updated;
    });
  };

  const toggleFavorite = (itemId: string) => {
    if (favorites.includes(itemId)) {
      removeFavorite(itemId);
    } else {
      addFavorite(itemId);
    }
  };

  const isFavorite = (itemId: string) => favorites.includes(itemId);

  const getFavoriteItems = (items: MenuItem[]) => {
    return items.filter(item => favorites.includes(item.id));
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoriteItems,
    favoriteCount: favorites.length
  };
}

