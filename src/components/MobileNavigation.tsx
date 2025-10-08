import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  House, 
  Coffee, 
  Calendar, 
  Info, 
  ShoppingCart,
  Wine,
  MusicNote
} from '@phosphor-icons/react';
import { useLanguageStore, translations } from '../lib/translations';
import { useCartStore } from '../lib/cart';
import { useIsMobile } from '../hooks/use-mobile';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCartOpen: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  onCartOpen 
}) => {
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage.code];
  const itemCount = useCartStore((state) => state.getItemCount());
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const navItems = [
    { id: 'home', label: t.nav.home, icon: House },
    { id: 'menu', label: t.nav.menu, icon: Coffee },
    { id: 'drinks', label: t.nav.drinks, icon: Wine },
    { id: 'services', label: t.nav.services, icon: Calendar },
    { id: 'events', label: t.nav.events, icon: MusicNote }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50 px-1 py-1 safe-area-inset-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(item.id)}
              className={`flex-col h-auto py-1 px-2 gap-1 min-w-0 text-xs ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
              <span className="text-xs leading-none">{item.label}</span>
            </Button>
          );
        })}
        
        {/* Cart Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onCartOpen}
          className="flex-col h-auto py-1 px-2 gap-1 min-w-0 text-muted-foreground hover:text-foreground relative text-xs"
        >
          <div className="relative">
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center p-0 min-w-0">
                {itemCount > 9 ? '9+' : itemCount}
              </Badge>
            )}
          </div>
          <span className="text-xs leading-none">Cart</span>
        </Button>
      </div>
    </div>
  );
};