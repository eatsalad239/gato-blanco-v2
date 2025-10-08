import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Plus } from '@phosphor-icons/react';
import { CoffeeItem } from '../types';
import { useLanguageStore, translations } from '../lib/translations';
import { formatPrice, detectUserType, getCurrency } from '../lib/pricing';
import { useCart } from '../hooks/useCart';
import { toast } from 'sonner';

interface CoffeeCardProps {
  item: CoffeeItem;
}

export const CoffeeCard: React.FC<CoffeeCardProps> = ({ item }) => {
  const { currentLanguage } = useLanguageStore();
  const { addToCart } = useCart();
  const t = translations[currentLanguage.code];
  
  const isGringo = detectUserType(currentLanguage.code);
  const currency = getCurrency(isGringo);
  const price = formatPrice(item.basePrice, currency, isGringo);

  const handleAddToCart = () => {
    const numericPrice = isGringo 
      ? (item.basePrice * 1.5) / 4200 
      : item.basePrice * 1.5;
    
    addToCart(item, numericPrice);
    toast.success(`${item.name[currentLanguage.code]} ${t.menu.addToCart.toLowerCase()}`);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'coffee': return 'bg-primary/10 text-primary';
      case 'food': return 'bg-secondary/10 text-secondary-foreground';
      case 'pastry': return 'bg-accent/10 text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Coffee size={20} className="text-primary" />
              {item.name[currentLanguage.code]}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {item.description[currentLanguage.code]}
            </CardDescription>
          </div>
          <Badge className={`${getCategoryColor(item.category)} text-xs font-medium`}>
            {item.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary font-mono">
            {price}
          </div>
          <Button 
            onClick={handleAddToCart}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Plus size={16} />
            {t.menu.addToCart}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};