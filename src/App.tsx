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
  ShieldCheck,
  UserCheck,
  Wine,
  Calendar as CalendarIcon,
  MusicNote
} from '@phosphor-icons/react';

import { LanguageSwitcher } from './components/LanguageSwitcher';
import { MenuCard } from './components/MenuCard';
import { ServiceCard } from './components/ServiceCard';
import { CartDrawer } from './components/CartDrawer';
import { BookingDialog } from './components/BookingDialog';
import { EnhancedAdminDashboard } from './components/EnhancedAdminDashboard';
import { MobileNavigation } from './components/MobileNavigation';
import { EventsSection } from './components/EventsSection';

import { useLanguageStore, translations } from './lib/translations';
import { fullMenu, services } from './data/content';
import { Service } from './types';
import { detectUserType } from './lib/pricing';
import { useIsMobile } from './hooks/use-mobile';

function App() {
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage.code];
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const isMobile = useIsMobile();
  
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
    <div className={`min-h-screen bg-background coffee-pattern ${isMobile ? 'pb-20' : ''}`}>
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
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
            
            <div className="flex items-center gap-2 sm:gap-4">
              {isGringo && (
                <Badge className="bg-accent/10 text-accent border-accent/20 hidden sm:flex">
                  Premium Gringo Services
                </Badge>
              )}
              <LanguageSwitcher />
              {!isMobile && <CartDrawer />}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdminMode(!isAdminMode)}
                className="gap-2 border-primary/20 hover:border-primary hover:bg-primary/5"
              >
                <UserCheck size={16} />
                <span className="hidden sm:inline">{isAdminMode ? 'Exit Admin' : t.nav.admin}</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {isAdminMode ? (
          <EnhancedAdminDashboard />
        ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          {!isMobile && (
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="home" className="text-xs sm:text-sm">{t.nav.home}</TabsTrigger>
              <TabsTrigger value="menu" className="text-xs sm:text-sm">{t.nav.menu}</TabsTrigger>
              <TabsTrigger value="drinks" className="text-xs sm:text-sm">{t.nav.drinks}</TabsTrigger>
              <TabsTrigger value="services" className="text-xs sm:text-sm">{t.nav.services}</TabsTrigger>
              <TabsTrigger value="events" className="text-xs sm:text-sm">{t.nav.events}</TabsTrigger>
              <TabsTrigger value="about" className="text-xs sm:text-sm">{t.nav.about}</TabsTrigger>
            </TabsList>
          )}

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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-lg"
                  onClick={() => setActiveTab('services')}
                >
                  {t.hero.cta}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-3 text-lg gap-2"
                  onClick={() => setActiveTab('events')}
                >
                  <CalendarIcon size={20} />
                  View Events
                </Button>
              </div>
            </section>

            {/* Quick Stats */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

              <Card className="text-center">
                <CardHeader>
                  <Wine size={32} className="text-purple-500 mx-auto" />
                  <CardTitle className="text-2xl">Night Life</CardTitle>
                  <CardDescription>Cocktails & Events</CardDescription>
                </CardHeader>
              </Card>
            </section>
          </TabsContent>

          <TabsContent value="menu" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">{t.menu.title}</h2>
              <p className="text-lg text-muted-foreground">{t.menu.subtitle}</p>
            </div>
            
            <Tabs defaultValue="coffee" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="coffee">{t.menu.coffee}</TabsTrigger>
                <TabsTrigger value="food">Food</TabsTrigger>
                <TabsTrigger value="pastries">Pastries</TabsTrigger>
                <TabsTrigger value="nonalcoholic">All Day</TabsTrigger>
              </TabsList>
              
              <TabsContent value="coffee" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => item.category === 'coffee').map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </TabsContent>
              
              <TabsContent value="food" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => item.category === 'food').map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </TabsContent>
              
              <TabsContent value="pastries" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => item.category === 'pastry').map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </TabsContent>
              
              <TabsContent value="nonalcoholic" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => ['coffee', 'food', 'pastry'].includes(item.category)).map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="drinks" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">{t.drinks.title}</h2>
              <p className="text-lg text-muted-foreground">{t.drinks.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  🍹 {t.drinks.happyHour}
                </Badge>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  🌙 {t.drinks.lateNight}
                </Badge>
              </div>
            </div>
            
            <Tabs defaultValue="cocktails" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="cocktails">{t.drinks.cocktails}</TabsTrigger>
                <TabsTrigger value="beer">{t.drinks.beer}</TabsTrigger>
                <TabsTrigger value="spirits">{t.drinks.spirits}</TabsTrigger>
                <TabsTrigger value="wine">{t.drinks.wine}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cocktails" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => item.category === 'cocktail').map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </TabsContent>
              
              <TabsContent value="beer" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => item.category === 'beer').map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </TabsContent>
              
              <TabsContent value="spirits" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => item.category === 'liquor').map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </TabsContent>
              
              <TabsContent value="wine" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => item.category === 'wine').map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="events" className="space-y-8">
            <EventsSection />
          </TabsContent>

          <TabsContent value="services" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">{t.services.title}</h2>
              <p className="text-lg text-muted-foreground">{t.services.subtitle}</p>
              {isGringo && (
                <Badge className="bg-accent/10 text-accent border-accent/20 text-base sm:text-lg px-4 py-2">
                  🎯 Premium Pricing for International Visitors
                </Badge>
              )}
            </div>
            
            <Tabs defaultValue="tourism" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="tourism">{t.services.tourism}</TabsTrigger>
                <TabsTrigger value="classes">{t.services.classes}</TabsTrigger>
                <TabsTrigger value="events">{t.services.events}</TabsTrigger>
                <TabsTrigger value="party">{t.services.party}</TabsTrigger>
                <TabsTrigger value="vip">{t.services.vip}</TabsTrigger>
                <TabsTrigger value="nightlife">{t.services.nightlife}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tourism" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.filter(service => service.category === 'tourism').map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onBook={handleBookService}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="classes" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.filter(service => service.category === 'classes').map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onBook={handleBookService}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="events" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.filter(service => service.category === 'events').map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onBook={handleBookService}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="party" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.filter(service => service.category === 'party').map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onBook={handleBookService}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="vip" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.filter(service => service.category === 'vip').map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onBook={handleBookService}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="nightlife" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.filter(service => service.category === 'nightlife').map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onBook={handleBookService}
                  />
                ))}
              </TabsContent>
            </Tabs>
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
                  <CardTitle className="text-2xl sm:text-3xl font-bold">{t.about.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
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
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-accent">
                        <MusicNote size={20} />
                        <span className="font-semibold">Nightlife</span>
                      </div>
                      <p className="text-muted-foreground">{t.about.nightlife}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-secondary">
                        <CalendarIcon size={20} />
                        <span className="font-semibold">Events</span>
                      </div>
                      <p className="text-muted-foreground">{t.about.events}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        )}
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCartOpen={() => setCartOpen(true)}
      />

      <footer className={`border-t border-border/50 mt-16 ${isMobile ? 'mb-20' : ''}`}>
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