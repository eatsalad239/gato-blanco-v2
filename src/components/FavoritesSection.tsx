import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sparkle } from '@phosphor-icons/react';
import { MenuCard } from './MenuCard';
import { useFavorites } from '../hooks/useFavorites';
import { fullMenu } from '../data/content';
import { useLanguageStore } from '../lib/translations';

export function FavoritesSection() {
  const { getFavoriteItems } = useFavorites();
  const { currentLanguage } = useLanguageStore();
  const favoriteItems = getFavoriteItems(fullMenu);
  const isSpanish = currentLanguage?.code === 'es';

  if (favoriteItems.length === 0) {
    return (
      <div className="text-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Heart size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" weight="regular" />
          <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">
            {isSpanish ? 'No tienes favoritos aún' : 'No favorites yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            {isSpanish 
              ? '¡Agrega artículos a tus favoritos haciendo clic en el corazón! ❤️'
              : 'Add items to favorites by clicking the heart! ❤️'
            }
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-2">
          <Heart size={32} className="text-red-500" weight="fill" />
          <h2 className="text-4xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            {isSpanish ? 'Tus Favoritos' : 'Your Favorites'}
          </h2>
          <Sparkle size={32} className="text-amber-500" weight="fill" />
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {isSpanish 
            ? `${favoriteItems.length} artículo${favoriteItems.length !== 1 ? 's' : ''} guardado${favoriteItems.length !== 1 ? 's' : ''}`
            : `${favoriteItems.length} item${favoriteItems.length !== 1 ? 's' : ''} saved`
          }
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <MenuCard item={item} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

