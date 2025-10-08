import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, Calendar } from '@phosphor-icons/react';
import { Service } from '../types';
import { useLanguageStore, translations } from '../lib/translations';
import { formatPrice, detectUserType, getCurrency } from '../lib/pricing';

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
      case 'tourism': return <MapPin size={20} className="text-accent" />;
      case 'classes': return <Users size={20} className="text-secondary" />;
      case 'events': return <Calendar size={20} className="text-primary" />;
      default: return <Clock size={20} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tourism': return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'classes': return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      case 'events': return 'bg-primary/10 text-primary-foreground border-primary/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-border/50 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3 mb-2">
              {getCategoryIcon(service.category)}
              {service.name[currentLanguage.code]}
            </CardTitle>
            <CardDescription className="text-muted-foreground leading-relaxed">
              {service.description[currentLanguage.code]}
            </CardDescription>
          </div>
          <Badge className={`${getCategoryColor(service.category)} text-xs font-medium border`}>
            {service.category}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
          <Clock size={16} />
          <span>{t.services.duration}: {service.duration}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {service.highlights[currentLanguage.code].map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                <span className="text-muted-foreground">{highlight}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">{t.services.from}</div>
              <div className="text-2xl font-bold text-accent font-mono">
                {price}
              </div>
            </div>
            <Button 
              onClick={() => onBook(service)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 px-6"
            >
              <Calendar size={16} />
              {t.services.book}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};