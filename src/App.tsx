import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';
import { 
  Coffee, 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck
} from '@phosphor-icons/react';

import { LanguageSwitcher } from './components/LanguageSwitcher';
import { CoffeeCard } from './components/CoffeeCard';
import { ServiceCard } from './components/ServiceCard';
import { CartDrawer } from './components/CartDrawer';
import { BookingDialog } from './components/BookingDialog';

import { useLanguageStore, translations } from './lib/translations';
import { coffeeMenu, services } from './data/content';
import { Service } from './types';
import { detectUserType } from './lib/pricing';

function App() {
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage.code];
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  const isGringo = detectUserType(currentLanguage.code);

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setBookingDialogOpen(true);
  };

  const closeBookingDialog = () => {
    setBookingDialogOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-background coffee-pattern">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Coffee size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Gato Blanco</h1>
                  <p className="text-xs text-muted-foreground">Zona Rosa, Medellín</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isGringo && (
                <Badge className="bg-accent/10 text-accent border-accent/20 hidden sm:flex">
                  Premium Gringo Services
                </Badge>
              )}
              <LanguageSwitcher />
              <CartDrawer />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="home">{t.nav.home}</TabsTrigger>
            <TabsTrigger value="menu">{t.nav.menu}</TabsTrigger>
            <TabsTrigger value="services">{t.nav.services}</TabsTrigger>
            <TabsTrigger value="about">{t.nav.about}</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-12">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-6xl font-bold text-foreground">
                  {t.hero.title}
                </h1>
                <p className="text-xl sm:text-2xl text-secondary font-medium">
                  {t.hero.subtitle}
                </p>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t.hero.description}
                </p>
              </div>
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg"
                onClick={() => setActiveTab('services')}
              >
                {t.hero.cta}
              </Button>
            </section>

            {/* Quick Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <Star size={32} className="text-colombian-gold mx-auto" />
                  <CardTitle className="text-2xl">4.9/5</CardTitle>
                  <CardDescription>Customer Rating</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <ShieldCheck size={32} className="text-accent mx-auto" />
                  <CardTitle className="text-2xl">500+</CardTitle>
                  <CardDescription>Happy Gringos Served</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <Coffee size={32} className="text-primary mx-auto" />
                  <CardTitle className="text-2xl">Premium</CardTitle>
                  <CardDescription>Colombian Coffee</CardDescription>
                </CardHeader>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="menu" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">{t.menu.title}</h2>
              <p className="text-lg text-muted-foreground">{t.menu.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coffeeMenu.map((item) => (
                <CoffeeCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">{t.services.title}</h2>
              <p className="text-lg text-muted-foreground">{t.services.subtitle}</p>
              {isGringo && (
                <Badge className="bg-accent/10 text-accent border-accent/20 text-lg px-4 py-2">
                  🎯 Premium Pricing for International Visitors
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onBook={handleBookService}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold">{t.about.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {t.about.story}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary">
                        <MapPin size={20} />
                        <span className="font-semibold">Location</span>
                      </div>
                      <p className="text-muted-foreground">{t.about.location}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary">
                        <Clock size={20} />
                        <span className="font-semibold">Hours</span>
                      </div>
                      <p className="text-muted-foreground">{t.about.hours}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              © 2024 Gato Blanco x Gringo Connection
            </p>
            <p className="text-sm text-muted-foreground">
              Zona Rosa, Medellín - Premium Coffee & Gringo Services
            </p>
          </div>
        </div>
      </footer>

      <BookingDialog
        service={selectedService}
        open={bookingDialogOpen}
        onClose={closeBookingDialog}
      />
      
      <Toaster position="top-right" />
    </div>
  );
}

export default App;