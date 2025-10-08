import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Wine } from '@phosphor-icons/react';
import { MenuItem } from '../types';
import { useLanguageStore, translations } from '../lib/translations';
import { formatPrice } from '../lib/pricing';
import { useCartStore } from '../lib/cart';

interface MenuCardProps {
  item: MenuItem;
  showAvailability?: boolean;
}

export function MenuCard({ item, showAvailability = true }: MenuCardProps) {
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage.code];
  const addToCart = useCartStore((state) => state.addItem);
  
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
      case 'wine':
        return <Wine size={16} className="text-amber-500" />;
      case 'beer':
        return <Wine size={16} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getCategoryColor = () => {
    switch (item.category) {
      case 'liquor':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cocktail':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'beer':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'wine':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'coffee':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'food':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pastry':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className={`h-full transition-all hover:shadow-lg ${!available ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg leading-tight">
              {item.name[currentLanguage.code]}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getCategoryColor()}>
                <div className="flex items-center gap-1">
                  {getCategoryIcon()}
                  {item.category}
                </div>
              </Badge>
              {isAlcoholic && item.alcoholContent && (
                <Badge variant="outline" className="text-xs">
                  {item.alcoholContent}% {t.menu.alcoholContent}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {formatPrice(item.basePrice)}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.description[currentLanguage.code]}
        </p>
        
        {showAvailability && item.availability && !item.availability.allDay && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock size={14} />
            <span>
              {t.menu.availableFrom} {item.availability.startTime}
              {item.availability.endTime && ` - ${item.availability.endTime}`}
            </span>
          </div>
        )}
        
        {isAlcoholic && (
          <div className="text-xs text-destructive font-medium">
            ⚠️ {t.menu.ageRestriction}
          </div>
        )}
        
        <Button 
          onClick={() => addToCart({ itemId: item.id, quantity: 1, price: item.basePrice })}
          disabled={!available}
          className="w-full gap-2"
          variant={available ? "default" : "secondary"}
        >
          <Plus size={16} />
          {available ? t.menu.addToCart : 'Not Available'}
        </Button>
      </CardContent>
    </Card>
  );
}