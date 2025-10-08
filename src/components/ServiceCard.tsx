import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, Calendar, Lightning, Atom, Rocket, Fire, Crown, Star } from '@phosphor-icons/react';
import { Service } from '../types';
import { useLanguageStore, translations } from '../lib/translations';
import { formatPrice, detectUserType, getCurrency } from '../lib/pricing';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage.code];
  
  const isGringo = detectUserType(currentLanguage.code);
  const currency = getCurrency(isGringo);
  const price = formatPrice(service.basePriceCOP, currency, isGringo);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tourism': return <Rocket size={20} className="text-nuclear-blue" weight="fill" />;
      case 'classes': return <Atom size={20} className="text-electric-cyan" weight="fill" />;
      case 'events': return <Lightning size={20} className="text-plasma-blue" weight="fill" />;
      case 'party': return <Fire size={20} className="text-nuclear-blue" weight="fill" />;
      case 'vip': return <Crown size={20} className="text-plasma-blue" weight="fill" />;
      case 'nightlife': return <Star size={20} className="text-electric-cyan" weight="fill" />;
      default: return <Lightning size={20} className="text-nuclear-blue" weight="fill" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tourism': return 'bg-nuclear-blue/20 text-nuclear-blue border-nuclear-blue nuclear-glow';
      case 'classes': return 'bg-electric-cyan/20 text-electric-cyan border-electric-cyan nuclear-glow';
      case 'events': return 'bg-plasma-blue/20 text-plasma-blue border-plasma-blue nuclear-glow';
      case 'party': return 'bg-nuclear-blue/25 text-nuclear-blue border-nuclear-blue nuclear-glow';
      case 'vip': return 'bg-plasma-blue/30 text-plasma-blue border-plasma-blue nuclear-glow';
      case 'nightlife': return 'bg-electric-cyan/25 text-electric-cyan border-electric-cyan nuclear-glow';
      default: return 'bg-nuclear-blue/15 text-nuclear-blue border-nuclear-blue nuclear-glow';
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.05,
      rotateY: 8,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 25px rgba(59, 130, 246, 0.4)",
        "0 0 40px rgba(59, 130, 246, 0.7)",
        "0 0 25px rgba(59, 130, 246, 0.4)"
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group h-full"
    >
      <Card className="nuclear-card overflow-hidden h-full">
        <motion.div variants={glowVariants} animate="animate">
          <div className="h-4 bg-gradient-to-r from-nuclear-blue via-electric-cyan to-plasma-blue"></div>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1">
                <CardTitle className="text-xl font-black nuclear-text flex items-center gap-3 mb-2">
                  <motion.div variants={pulseVariants} animate="animate">
                    {getCategoryIcon(service.category)}
                  </motion.div>
                  ⚡ {service.name[currentLanguage.code]} ⚡
                </CardTitle>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  🚀 {service.description[currentLanguage.code]} 🚀
                </CardDescription>
              </div>
              <Badge className={`${getCategoryColor(service.category)} text-xs font-bold border-2`}>
                {service.category.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-electric-cyan font-medium mt-3">
              <Clock size={16} weight="fill" />
              <span>⏰ {t.services.duration}: {service.duration}</span>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {service.highlights[currentLanguage.code].map((highlight, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center gap-3 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-2 h-2 bg-nuclear-blue rounded-full nuclear-glow"></div>
                    <span className="text-muted-foreground font-medium">⚡ {highlight}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t-2 border-nuclear-blue/50">
                <div className="text-right">
                  <div className="text-xs text-electric-cyan font-bold">{t.services.from}</div>
                  <motion.div 
                    className="text-3xl font-black nuclear-text"
                    animate={{
                      scale: [1, 1.1, 1],
                      transition: { duration: 2.5, repeat: Infinity }
                    }}
                  >
                    💰 {price}
                  </motion.div>
                </div>
                <Button 
                  onClick={() => onBook(service)}
                  className="nuclear-button gap-2 px-8 py-3 font-bold text-lg"
                >
                  <Calendar size={18} weight="fill" />
                  🚀 {t.services.book}
                </Button>
              </div>
            </div>
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  );
};