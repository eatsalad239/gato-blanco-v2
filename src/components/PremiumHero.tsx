import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Coffee, Sparkle, MapPin, Star, ArrowRight } from '@phosphor-icons/react';
import { useLanguageStore } from '../lib/translations';

export function PremiumHero() {
  const { currentLanguage } = useLanguageStore();
  const isSpanish = currentLanguage?.code === 'es';

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Static Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-amber-200/20 via-orange-200/20 to-amber-300/20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700"
          >
            <Sparkle size={16} weight="fill" className="text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              {isSpanish ? '🏆 PREMIUM COLOMBIANO' : '🏆 PREMIUM COLOMBIAN'}
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
              {isSpanish ? 'CAFÉ COLOMBIANO' : 'COLOMBIAN COFFEE'}
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              {isSpanish ? 'AUTÉNTICO' : 'AUTHENTIC'}
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-xl sm:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isSpanish
              ? 'La experiencia más auténtica del café colombiano en el corazón de Zona Rosa, Medellín'
              : 'The most authentic Colombian coffee experience in the heart of Zona Rosa, Medellín'}
          </motion.p>

          {/* Features */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {[
              { icon: Coffee, text: isSpanish ? 'Granos Premium' : 'Premium Beans' },
              { icon: MapPin, text: 'Zona Rosa, Medellín' },
              { icon: Star, text: '⭐ 4.9/5 Rating' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <feature.icon size={20} className="text-amber-600" weight="fill" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              size="lg"
              className="group bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
            >
              {isSpanish ? 'Explorar Menú' : 'Explore Menu'}
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              {isSpanish ? 'Ver Servicios' : 'View Services'}
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {[
              { value: '1000+', label: isSpanish ? 'Tazas Servidas' : 'Cups Served' },
              { value: '4.9/5', label: isSpanish ? 'Calificación' : 'Rating' },
              { value: '500+', label: isSpanish ? 'Clientes Felices' : 'Happy Customers' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Subtle, non-looping */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
        </div>
      </motion.div>
    </div>
  );
}

