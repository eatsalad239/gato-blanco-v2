import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quotes } from '@phosphor-icons/react';
import { useLanguageStore } from '../lib/translations';

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'New York, USA',
    rating: 5,
    text: 'Best coffee I\'ve had in Colombia! The authentic Colombian experience is incredible. Highly recommend!',
    textEs: '¡El mejor café que he probado en Colombia! La experiencia auténtica colombiana es increíble. ¡Muy recomendado!',
    avatar: '👩‍🦰'
  },
  {
    name: 'Carlos Mendoza',
    location: 'Medellín, Colombia',
    rating: 5,
    text: 'Perfecto café colombiano auténtico. Los baristas son expertos y el ambiente es increíble.',
    textEs: 'Perfecto café colombiano auténtico. Los baristas son expertos y el ambiente es increíble.',
    avatar: '👨'
  },
  {
    name: 'Emily Chen',
    location: 'London, UK',
    rating: 5,
    text: 'As a coffee enthusiast, this place exceeded all expectations. The beans are premium quality!',
    textEs: 'Como entusiasta del café, este lugar superó todas las expectativas. ¡Los granos son de calidad premium!',
    avatar: '👩'
  },
  {
    name: 'Diego Ramírez',
    location: 'Bogotá, Colombia',
    rating: 5,
    text: 'El mejor café de Zona Rosa. Sabor auténtico paisa que te transporta al corazón de Colombia.',
    textEs: 'El mejor café de Zona Rosa. Sabor auténtico paisa que te transporta al corazón de Colombia.',
    avatar: '👨‍🦱'
  },
];

export function CustomerTestimonials() {
  const { currentLanguage } = useLanguageStore();
  const isSpanish = currentLanguage?.code === 'es';

  return (
    <section className="py-20 bg-gradient-to-b from-white to-amber-50/30 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {isSpanish ? 'Lo Que Dicen Nuestros Clientes' : 'What Our Customers Say'}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {isSpanish
              ? 'Más de 500 clientes satisfechos desde 2024'
              : 'Over 500 satisfied customers since 2024'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow border-2 border-amber-100 dark:border-amber-900/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} weight="fill" className="text-amber-400" />
                    ))}
                  </div>
                  <Quotes size={24} className="text-amber-300 mb-3" weight="fill" />
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    {isSpanish ? testimonial.textEs : testimonial.text}
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

