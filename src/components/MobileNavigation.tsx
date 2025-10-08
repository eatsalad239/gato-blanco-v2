import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  House, 
  Coffee, 
  Calendar, 
  Info, 
  ShoppingCart,
  Plus
} from '@phosphor-icons/react';
import { useLanguageStore, translations } from '../lib/translations';
import { useCart } from '../hooks/useCart';
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
  const { getItemCount } = useCart();
  const isMobile = useIsMobile();
  const itemCount = getItemCount();

  if (!isMobile) return null;

  const navItems = [
    { id: 'home', label: t.nav.home, icon: House },
    { id: 'menu', label: t.nav.menu, icon: Coffee },
    { id: 'services', label: t.nav.services, icon: Calendar },
    { id: 'about', label: t.nav.about, icon: Info }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50 px-2 py-2 safe-area-inset-bottom">
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
              className={`flex-col h-auto py-2 px-3 gap-1 min-w-0 ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
              <span className="text-xs leading-none">{item.label}</span>
            </Button>
          );
        })}
        
        {/* Cart Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onCartOpen}
          className="flex-col h-auto py-2 px-3 gap-1 min-w-0 text-muted-foreground hover:text-foreground relative"
        >
          <div className="relative">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center p-0 min-w-0">
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