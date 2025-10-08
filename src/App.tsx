import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightning, 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck,
  UserCheck,
  Wine,
  Calendar as CalendarIcon,
  MusicNote,
  Coffee,
  Atom,
  Rocket,
  Fire,
  Sparkle,
  Crown
} from '@phosphor-icons/react';

import { LanguageSwitcher } from './components/LanguageSwitcher';
import { MenuCard } from './components/MenuCard';
import { ServiceCard } from './components/ServiceCard';
import { CartDrawer } from './components/CartDrawer';
import { BookingDialog } from './components/BookingDialog';
import { EnhancedAdminDashboard } from './components/EnhancedAdminDashboard';
import { FullStackDashboard } from './components/FullStackDashboard';
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
  const [coffeeEnergy, setCoffeeEnergy] = useState(0);
  const isMobile = useIsMobile();
  
  const isGringo = detectUserType(currentLanguage.code);

  // Coffee energy animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCoffeeEnergy(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setBookingDialogOpen(true);
  };

  const closeBookingDialog = () => {
    setBookingDialogOpen(false);
    setSelectedService(null);
  };

  const nuclearVariants = {
    initial: { scale: 0.8, opacity: 0, rotateY: -180 },
    animate: { scale: 1, opacity: 1, rotateY: 0 },
    exit: { scale: 0.8, opacity: 0, rotateY: 180 }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`min-h-screen bg-background power-pattern ${isMobile ? 'pb-20' : ''}`}>
      {/* PREMIUM NAVIGATION BAR */}
      <nav className="border-b-2 border-nuclear-blue bg-card/80 backdrop-blur-xl sticky top-0 z-50 nuclear-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              className="flex items-center gap-4"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-14 h-14 bg-gradient-to-br from-nuclear-blue to-electric-cyan rounded-full flex items-center justify-center nuclear-glow"
                  animate={pulseVariants.animate}
                >
                  <Lightning size={32} className="text-primary-foreground" weight="fill" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-black nuclear-text">🇨🇴 GATO BLANCO 🇨🇴</h1>
                  <p className="text-sm text-electric-cyan font-medium">CAFÉ COLOMBIANO PREMIUM</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 sm:gap-4"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              {/* Coffee Meter */}
              <div className="hidden sm:flex items-center gap-2 bg-card/50 rounded-lg px-3 py-1 nuclear-border">
                <Coffee size={16} className="text-nuclear-blue" />
                <div className="w-16 h-2 bg-deep-space rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-nuclear-blue to-electric-cyan"
                    style={{ width: `${coffeeEnergy}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-xs text-electric-cyan font-mono">{coffeeEnergy}%</span>
              </div>
              
              {isGringo && (
                <Badge className="bg-plasma-blue/20 text-plasma-blue border-plasma-blue nuclear-glow hidden sm:flex">
                  <Crown size={14} className="mr-1" />
                  VISITANTE VIP PREMIUM
                </Badge>
              )}
              <LanguageSwitcher />
              {!isMobile && <CartDrawer />}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdminMode(!isAdminMode)}
                className="gap-2 nuclear-button"
              >
                <UserCheck size={16} />
                <span className="hidden sm:inline">{isAdminMode ? 'EXIT ADMIN' : '🚀 ADMIN'}</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {isAdminMode ? (
          <motion.div
            initial={nuclearVariants.initial}
            animate={nuclearVariants.animate}
            exit={nuclearVariants.exit}
            transition={{ duration: 0.6 }}
          >
            <FullStackDashboard />
          </motion.div>
        ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          {!isMobile && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid nuclear-border bg-card/50 backdrop-blur-sm">
                <TabsTrigger value="home" className="text-xs sm:text-sm nuclear-button">🏠 {t.nav.home}</TabsTrigger>
                <TabsTrigger value="menu" className="text-xs sm:text-sm nuclear-button">☕ {t.nav.menu}</TabsTrigger>
                <TabsTrigger value="drinks" className="text-xs sm:text-sm nuclear-button">🍹 {t.nav.drinks}</TabsTrigger>
                <TabsTrigger value="services" className="text-xs sm:text-sm nuclear-button">⚡ {t.nav.services}</TabsTrigger>
                <TabsTrigger value="events" className="text-xs sm:text-sm nuclear-button">🎉 {t.nav.events}</TabsTrigger>
                <TabsTrigger value="about" className="text-xs sm:text-sm nuclear-button">ℹ️ {t.nav.about}</TabsTrigger>
              </TabsList>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <TabsContent value="home" className="space-y-12">
              <motion.section 
                className="text-center space-y-8 py-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-6">
                  <motion.h1 
                    className="text-5xl sm:text-8xl font-black nuclear-text"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(59, 130, 246, 0.5)",
                        "0 0 40px rgba(59, 130, 246, 0.8)",
                        "0 0 20px rgba(59, 130, 246, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ☕ CAFÉ COLOMBIANO PREMIUM ☕
                  </motion.h1>
                  <motion.p 
                    className="text-2xl sm:text-4xl text-electric-cyan font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    🇨🇴 AUTÉNTICA EXPERIENCIA PAISA 🇨🇴
                  </motion.p>
                  <motion.p 
                    className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Experience the authentic Colombian coffee culture in the heart of Zona Rosa, Medellín! 
                    Our expert baristas create artisanal beverages with the finest Colombian beans, 
                    bringing you the true paisa spirit! 🇨🇴☕
                  </motion.p>
                </div>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-6 justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Button 
                    size="lg" 
                    className="nuclear-button px-10 py-4 text-xl font-bold"
                    onClick={() => setActiveTab('services')}
                  >
                    <Coffee size={24} className="mr-2" />
                    🇨🇴 DESCUBRIR SERVICIOS
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="nuclear-button px-10 py-4 text-xl gap-3"
                    onClick={() => setActiveTab('events')}
                  >
                    <MusicNote size={24} />
                    🎵 EVENTOS PAISAS
                  </Button>
                </motion.div>
              </motion.section>

              {/* NUCLEAR STATS GRID */}
              <motion.section 
                className="grid grid-cols-1 md:grid-cols-4 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, staggerChildren: 0.1 }}
              >
                {[
                  { icon: Star, value: "⭐ 4.9/5", label: "CALIFICACIÓN PREMIUM", color: "text-yellow-400" },
                  { icon: Coffee, value: "☕ 1000+", label: "TAZAS SERVIDAS", color: "text-nuclear-blue" },
                  { icon: Lightning, value: "🇨🇴 AUTÉNTICO", label: "CAFÉ COLOMBIANO", color: "text-electric-cyan" },
                  { icon: Sparkle, value: "✨ LEGENDARIO", label: "SABOR PAISA", color: "text-plasma-blue" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, rotateY: 180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                  >
                    <Card className="text-center nuclear-card">
                      <CardHeader>
                        <motion.div
                          animate={pulseVariants.animate}
                          className={`${stat.color} mx-auto`}
                        >
                          <stat.icon size={40} weight="fill" />
                        </motion.div>
                        <CardTitle className="text-3xl nuclear-text">{stat.value}</CardTitle>
                        <CardDescription className="text-electric-cyan font-bold">{stat.label}</CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </motion.section>
            </TabsContent>
          </AnimatePresence>

          <TabsContent value="menu" className="space-y-8">
            <motion.div 
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-4xl font-black nuclear-text">🇨🇴 MENÚ COLOMBIANO 🇨🇴</h2>
              <p className="text-xl text-electric-cyan">SABORES AUTÉNTICOS DE COLOMBIA</p>
            </motion.div>
            
            <Tabs defaultValue="coffee" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 nuclear-border">
                <TabsTrigger value="coffee" className="nuclear-button">☕ COFFEE</TabsTrigger>
                <TabsTrigger value="food" className="nuclear-button">🍕 FOOD</TabsTrigger>
                <TabsTrigger value="pastries" className="nuclear-button">🥐 PASTRIES</TabsTrigger>
                <TabsTrigger value="nonalcoholic" className="nuclear-button">🥤 ALL DAY</TabsTrigger>
              </TabsList>
              
              <TabsContent value="coffee" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => item.category === 'coffee').map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <MenuCard item={item} />
                  </motion.div>
                ))}
              </TabsContent>
              
              <TabsContent value="food" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => item.category === 'food').map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <MenuCard item={item} />
                  </motion.div>
                ))}
              </TabsContent>
              
              <TabsContent value="pastries" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => item.category === 'pastry').map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <MenuCard item={item} />
                  </motion.div>
                ))}
              </TabsContent>
              
              <TabsContent value="nonalcoholic" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => ['coffee', 'food', 'pastry'].includes(item.category)).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <MenuCard item={item} />
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="drinks" className="space-y-8">
            <motion.div 
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-4xl font-black nuclear-text">🍹 CÓCTELES ARTESANALES 🍹</h2>
              <p className="text-xl text-electric-cyan">BEBIDAS PREMIUM COLOMBIANAS</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Badge className="bg-nuclear-blue/20 text-nuclear-blue border-nuclear-blue nuclear-glow">
                  🍹 HAPPY HOUR SPECIALS
                </Badge>
                <Badge className="bg-plasma-blue/20 text-plasma-blue border-plasma-blue nuclear-glow">
                  🌙 MIDNIGHT LOUNGE
                </Badge>
              </div>
            </motion.div>
            
            <Tabs defaultValue="cocktails" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 nuclear-border">
                <TabsTrigger value="cocktails" className="nuclear-button">🍸 COCKTAILS</TabsTrigger>
                <TabsTrigger value="beer" className="nuclear-button">🍺 BEER</TabsTrigger>
                <TabsTrigger value="spirits" className="nuclear-button">🥃 SPIRITS</TabsTrigger>
                <TabsTrigger value="wine" className="nuclear-button">🍷 WINE</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cocktails" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => item.category === 'cocktail').map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, rotateZ: -45 }}
                    animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <MenuCard item={item} />
                  </motion.div>
                ))}
              </TabsContent>
              
              <TabsContent value="beer" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => item.category === 'beer').map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, rotateZ: -45 }}
                    animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <MenuCard item={item} />
                  </motion.div>
                ))}
              </TabsContent>
              
              <TabsContent value="spirits" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => item.category === 'liquor').map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, rotateZ: -45 }}
                    animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <MenuCard item={item} />
                  </motion.div>
                ))}
              </TabsContent>
              
              <TabsContent value="wine" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullMenu.filter(item => item.category === 'wine').map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8, rotateZ: -45 }}
                    animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <MenuCard item={item} />
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="events" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <EventsSection />
            </motion.div>
          </TabsContent>

          <TabsContent value="services" className="space-y-8">
            <motion.div 
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-4xl font-black nuclear-text">🇨🇴 SERVICIOS PREMIUM 🇨🇴</h2>
              <p className="text-xl text-electric-cyan">EXPERIENCIAS EXCLUSIVAS PARA EXTRANJEROS</p>
              {isGringo && (
                <Badge className="bg-plasma-blue/20 text-plasma-blue border-plasma-blue nuclear-glow text-lg px-6 py-3">
                  <Crown size={20} className="mr-2" />
                  🎯 PRECIOS VIP PREMIUM
                </Badge>
              )}
            </motion.div>
            
            <Tabs defaultValue="tourism" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 nuclear-border">
                <TabsTrigger value="tourism" className="nuclear-button">🌎 TOURISM</TabsTrigger>
                <TabsTrigger value="classes" className="nuclear-button">📚 CLASSES</TabsTrigger>
                <TabsTrigger value="events" className="nuclear-button">🎉 EVENTS</TabsTrigger>
                <TabsTrigger value="party" className="nuclear-button">🎊 PARTY</TabsTrigger>
                <TabsTrigger value="vip" className="nuclear-button">👑 VIP</TabsTrigger>
                <TabsTrigger value="nightlife" className="nuclear-button">🌙 NIGHTLIFE</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tourism" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.filter(service => service.category === 'tourism').map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -100, rotateY: -90 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <ServiceCard 
                      service={service} 
                      onBook={handleBookService}
                    />
                  </motion.div>
                ))}
              </TabsContent>
              
              <TabsContent value="classes" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.filter(service => service.category === 'classes').map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -100, rotateY: -90 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <ServiceCard 
                      service={service} 
                      onBook={handleBookService}
                    />
                  </motion.div>
                ))}
              </TabsContent>
              
              <TabsContent value="events" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.filter(service => service.category === 'events').map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -100, rotateY: -90 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <ServiceCard 
                      service={service} 
                      onBook={handleBookService}
                    />
                  </motion.div>
                ))}
              </TabsContent>
              
              <TabsContent value="party" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.filter(service => service.category === 'party').map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -100, rotateY: -90 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <ServiceCard 
                      service={service} 
                      onBook={handleBookService}
                    />
                  </motion.div>
                ))}
              </TabsContent>
              
              <TabsContent value="vip" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.filter(service => service.category === 'vip').map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -100, rotateY: -90 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <ServiceCard 
                      service={service} 
                      onBook={handleBookService}
                    />
                  </motion.div>
                ))}
              </TabsContent>
              
              <TabsContent value="nightlife" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {services.filter(service => service.category === 'nightlife').map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -100, rotateY: -90 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <ServiceCard 
                      service={service} 
                      onBook={handleBookService}
                    />
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="about" className="space-y-8">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden nuclear-card">
                <div className="h-4 bg-gradient-to-r from-nuclear-blue via-electric-cyan to-plasma-blue"></div>
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl sm:text-4xl font-black nuclear-text">
                    ☕ REVOLUCIÓN CAFETERA ☕
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Welcome to the most authentic Colombian coffee experience in Zona Rosa! 🇨🇴 
                    Our premium café celebrates the rich heritage of Colombian coffee culture 
                    while creating unforgettable experiences for visitors from around the world. 
                    We blend traditional paisa hospitality with modern service excellence! ☕🎉
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                    {[
                      { icon: MapPin, title: "UBICACIÓN PRIVILEGIADA", text: "Corazón de Zona Rosa, Medellín 🗺️", color: "text-nuclear-blue" },
                      { icon: Clock, title: "HORARIOS EXTENDIDOS", text: "Abierto hasta muy tarde ⏰", color: "text-electric-cyan" },
                      { icon: MusicNote, title: "VIDA NOCTURNA PAISA", text: "Música en vivo y ambiente auténtico 🎵", color: "text-plasma-blue" },
                      { icon: CalendarIcon, title: "EVENTOS ESPECIALES", text: "Experiencias culturales diarias 🎉", color: "text-nuclear-blue" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <div className={`flex items-center gap-3 ${item.color}`}>
                          <item.icon size={24} weight="fill" />
                          <span className="font-bold">{item.title}</span>
                        </div>
                        <p className="text-muted-foreground font-medium">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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

      <footer className={`border-t-2 border-nuclear-blue nuclear-glow mt-16 ${isMobile ? 'mb-20' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <p className="text-electric-cyan font-bold text-lg">
              🇨🇴 © 2024 GATO BLANCO - CAFÉ COLOMBIANO AUTÉNTICO 🇨🇴
            </p>
            <p className="text-nuclear-blue font-medium">
              ☕ Zona Rosa, Medellín - Café Premium & Servicios para Visitantes ☕
            </p>
            <div className="flex justify-center gap-4 text-plasma-blue">
              <Coffee size={20} />
              <Wine size={20} />
              <MusicNote size={20} />
              <CalendarIcon size={20} />
              <MapPin size={20} />
            </div>
          </motion.div>
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