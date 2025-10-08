import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Users, 
  MusicNote, 
  Smiley, 
  Microphone,
  Star,
  Ticket
} from '@phosphor-icons/react';
import { Event } from '../types';
import { useLanguageStore, translations } from '../lib/translations';
import { formatPrice } from '../lib/pricing';
import { upcomingEvents } from '../data/content';
import { EventBookingDialog } from './EventBookingDialog';

interface EventCardProps {
  event: Event;
  onBook: (event: Event) => void;
}

function EventCard({ event, onBook }: EventCardProps) {
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage.code];
  
  const spotsLeft = event.capacity - event.currentBookings;
  const isSoldOut = spotsLeft <= 0;
  
  const getEventIcon = () => {
    switch (event.type) {
      case 'live-music':
        return <MusicNote size={20} className="text-primary" />;
      case 'comedy':
        return <Smiley size={20} className="text-accent" />;
      case 'karaoke':
        return <Microphone size={20} className="text-secondary" />;
      case 'party':
        return <Star size={20} className="text-yellow-500" />;
      default:
        return <Calendar size={20} className="text-muted-foreground" />;
    }
  };
  
  const getEventTypeColor = () => {
    switch (event.type) {
      case 'live-music':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'comedy':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'karaoke':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'party':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'special':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-xl leading-tight">
              {event.name[currentLanguage.code]}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getEventTypeColor()}>
                <div className="flex items-center gap-1">
                  {getEventIcon()}
                  {t.events[event.type] || event.type}
                </div>
              </Badge>
              {event.ageRestriction && (
                <Badge variant="outline" className="text-xs">
                  {event.ageRestriction}+
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {formatPrice(event.entryFee)}
            </div>
            {event.drinks?.included && (
              <div className="text-xs text-accent">
                {t.events.included}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {event.description[currentLanguage.code]}
        </p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="text-muted-foreground" />
            <span>{event.capacity} {t.events.capacity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ticket size={16} className="text-muted-foreground" />
            <span className={isSoldOut ? 'text-destructive' : 'text-accent'}>
              {isSoldOut ? t.events.soldOut : `${spotsLeft} ${t.events.spotsLeft}`}
            </span>
          </div>
        </div>
        
        {event.features && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{t.events.features}:</h4>
            <div className="flex flex-wrap gap-1">
              {event.features[currentLanguage.code].map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {event.drinks?.specials && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">{t.events.drinkSpecials}:</h4>
            <div className="space-y-1">
              {event.drinks.specials.map((special, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span>{special.name}</span>
                  <span className="font-mono">{formatPrice(special.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <Button 
          onClick={() => onBook(event)}
          disabled={isSoldOut}
          className="w-full gap-2"
          variant={isSoldOut ? "secondary" : "default"}
        >
          <Ticket size={16} />
          {isSoldOut ? t.events.soldOut : t.events.bookNow}
        </Button>
      </CardContent>
    </Card>
  );
}

export function EventsSection() {
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage.code];
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
  const now = new Date();
  const upcoming = upcomingEvents.filter(event => new Date(event.date) >= now);
  const past = upcomingEvents.filter(event => new Date(event.date) < now);

  const handleBookEvent = (event: Event) => {
    setSelectedEvent(event);
    setBookingDialogOpen(true);
  };

  const closeBookingDialog = () => {
    setBookingDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">{t.events.title}</h2>
        <p className="text-lg text-muted-foreground">{t.events.subtitle}</p>
      </div>
      
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="upcoming">{t.events.upcoming}</TabsTrigger>
          <TabsTrigger value="past">{t.events.past}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-6">
          {upcoming.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No upcoming events scheduled</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcoming.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onBook={handleBookEvent}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-6">
          {past.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No past events to show</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {past.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onBook={handleBookEvent}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <EventBookingDialog
        event={selectedEvent}
        open={bookingDialogOpen}
        onClose={closeBookingDialog}
      />
    </div>
  );
}