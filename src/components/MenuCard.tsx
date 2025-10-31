import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Wine, Lightning, Atom, Fire, Heart } from '@phosphor-icons/react';
import { MenuItem } from '../types';
import { useLanguageStore, translations } from '../lib/translations';
import { formatPrice, detectUserType, getCurrency } from '../lib/pricing';
import { GRINGO_MULTIPLIER } from '../data/content';
import { useCart } from '../hooks/useCart';
import { useFavorites } from '../hooks/useFavorites';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface MenuCardProps {
  item: MenuItem;
  showAvailability?: boolean;
}

export function MenuCard({ item, showAvailability = true }: MenuCardProps) {
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage?.code || 'en'];
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const favorite = isFavorite(item.id);

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

  // Debug availability
  console.log('📊', item.name.en, 'Available:', available, 'Time:', currentTime, 'Hours:', item.availability?.startTime, '-', item.availability?.endTime);

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

  // Removed infinite glow animation - just use static shadow

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Card className={`h-full transition-all border-2 ${available ? 'border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-xl shadow-md' : 'opacity-60 border-gray-300 dark:border-gray-700'}`}>
        <div>
          <CardHeader className="pb-3 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight font-bold bg-gradient-to-r from-amber-700 to-orange-700 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent flex-1">
                    {item.name[currentLanguage?.code || 'en']}
                  </CardTitle>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="flex-shrink-0 p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                    aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart 
                      size={20} 
                      weight={favorite ? "fill" : "regular"}
                      className={favorite ? "text-red-500" : "text-gray-400"}
                    />
                  </button>
                </div>
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
                <div className="text-xl font-black">
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                    {formatPrice(finalPrice, currency, isGringo)}
                  </span>
                  {isGringo && <span className="text-xs text-blue-600 dark:text-blue-400 ml-2 block">(Gringo Special)</span>}
                </div>
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                  if (available) {
                    addToCart(item, finalPrice, 1);
                    toast.success(
                      currentLanguage?.code === 'es' 
                        ? `¡${item.name.es} agregado al carrito!` 
                        : `${item.name.en} added to cart!`,
                      { duration: 2000 }
                    );
                  } else {
                    toast.error(
                      currentLanguage?.code === 'es'
                        ? 'Este artículo no está disponible en este momento'
                        : 'This item is not available right now'
                    );
                  }
                } catch (error) {
                  toast.error(
                    currentLanguage?.code === 'es'
                      ? 'Error al agregar al carrito'
                      : 'Failed to add to cart'
                  );
                }
              }}
              disabled={!available}
              className={`w-full gap-2 font-bold min-h-[44px] touch-manipulation transition-all ${
                available 
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl active:scale-95' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
              variant={available ? "default" : "secondary"}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Plus size={16} weight="bold" />
              {available ? t.menu.addToCart : (currentLanguage?.code === 'es' ? 'No Disponible' : 'Not Available')}
            </Button>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}