import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Wine, Lightning, Atom, Fire } from '@phosphor-icons/react';
import { MenuItem } from '../types';
import { useLanguageStore, translations } from '../lib/translations';
import { formatPrice, detectUserType, getCurrency } from '../lib/pricing';
import { GRINGO_MULTIPLIER } from '../data/content';
import { useCart } from '../hooks/useCart';
import { motion } from 'framer-motion';

interface MenuCardProps {
  item: MenuItem;
  showAvailability?: boolean;
}

export function MenuCard({ item, showAvailability = true }: MenuCardProps) {
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage?.code || 'en'];
  const { addToCart } = useCart();

  const isGringo = detectUserType(currentLanguage?.code || 'en');
  const currency = getCurrency(isGringo);
  const finalPrice = isGringo ? item.basePrice * GRINGO_MULTIPLIER : item.basePrice;

  const isAlcoholic = ['liquor', 'cocktail', 'beer', 'wine'].includes(item.category);
  const currentTime = new Date().getHours();
  
  // Check if item is available based on time
  const isAvailable = () => {
    if (item.availability?.allDay) return true;
    if (!item.availability?.startTime) return true;
    
    const startHour = parseInt(item.availability.startTime.split(':')[0]);
    const endHour = item.availability.endTime ? 
      parseInt(item.availability.endTime.split(':')[0]) : 24;
    
    // Handle overnight availability (e.g., 20:00 - 02:00)
    if (endHour < startHour) {
      return currentTime >= startHour || currentTime <= endHour;
    }
    
    return currentTime >= startHour && currentTime <= endHour;
  };

  const available = isAvailable();

  const getCategoryIcon = () => {
    switch (item.category) {
      case 'liquor':
      case 'cocktail':
        return <Lightning size={16} className="text-nuclear-blue" weight="fill" />;
      case 'wine':
        return <Wine size={16} className="text-plasma-blue" />;
      case 'beer':
        return <Fire size={16} className="text-electric-cyan" weight="fill" />;
      case 'coffee':
        return <Atom size={16} className="text-nuclear-blue" weight="fill" />;
      default:
        return <Lightning size={16} className="text-electric-cyan" weight="fill" />;
    }
  };

  const getCategoryColor = () => {
    switch (item.category) {
      case 'liquor':
        return 'bg-nuclear-blue/20 text-nuclear-blue border-nuclear-blue nuclear-glow';
      case 'cocktail':
        return 'bg-plasma-blue/20 text-plasma-blue border-plasma-blue nuclear-glow';
      case 'beer':
        return 'bg-electric-cyan/20 text-electric-cyan border-electric-cyan nuclear-glow';
      case 'wine':
        return 'bg-nuclear-blue/30 text-nuclear-blue border-nuclear-blue nuclear-glow';
      case 'coffee':
        return 'bg-nuclear-blue/25 text-nuclear-blue border-nuclear-blue nuclear-glow';
      case 'food':
        return 'bg-electric-cyan/20 text-electric-cyan border-electric-cyan nuclear-glow';
      case 'pastry':
        return 'bg-plasma-blue/20 text-plasma-blue border-plasma-blue nuclear-glow';
      default:
        return 'bg-nuclear-blue/15 text-nuclear-blue border-nuclear-blue nuclear-glow';
    }
  };

  const cardVariants = {
    hover: {
      scale: 1.05,
      rotateY: 5
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.3)",
        "0 0 30px rgba(59, 130, 246, 0.6)",
        "0 0 20px rgba(59, 130, 246, 0.3)"
      ]
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Card className={`h-full nuclear-card transition-all ${!available ? 'opacity-60' : ''}`}>
        <motion.div variants={glowVariants} animate="animate" transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <CardTitle className="text-lg leading-tight nuclear-text">
                  ⚡ {item.name[currentLanguage?.code || 'en']} ⚡
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getCategoryColor()}>
                    <div className="flex items-center gap-1 font-bold">
                      {getCategoryIcon()}
                      {item.category?.toUpperCase() || 'UNKNOWN'}
                    </div>
                  </Badge>
                  {isAlcoholic && item.alcoholContent && (
                    <Badge variant="outline" className="text-xs nuclear-border text-electric-cyan">
                      🔥 {item.alcoholContent}% {t.menu.alcoholContent}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <motion.div 
                  className="text-xl font-black nuclear-text"
                  animate={{
                    scale: [1, 1.1, 1],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  💰 {formatPrice(finalPrice, currency, isGringo)}
                  {isGringo && <span className="text-xs text-blue-600 dark:text-blue-400 ml-2">(Gringo Special)</span>}
                </motion.div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              🚀 {item.description[currentLanguage?.code || 'en']} ⚡
            </p>
            
            {showAvailability && item.availability && !item.availability.allDay && (
              <div className="flex items-center gap-2 text-xs text-electric-cyan font-medium">
                <Clock size={14} />
                <span>
                  ⏰ {t.menu.availableFrom} {item.availability.startTime}
                  {item.availability.endTime && ` - ${item.availability.endTime}`}
                </span>
              </div>
            )}
            
            {isAlcoholic && (
              <div className="text-xs text-destructive font-bold nuclear-border rounded px-2 py-1">
                ⚠️ {t.menu.ageRestriction} ⚠️
              </div>
            )}
            
            <Button
              onClick={() => {
                addToCart(item, finalPrice, 1);
              }}
              disabled={!available}
              className={`w-full gap-2 font-bold ${available ? 'nuclear-button' : ''}`}
              variant={available ? "default" : "secondary"}
            >
              <Plus size={16} weight="bold" />
              {available ? `⚡ ${t.menu.addToCart} ⚡` : '🚫 Not Available'}
            </Button>
          </CardContent>
        </motion.div>
      </Card>
    </motion.div>
  );
}