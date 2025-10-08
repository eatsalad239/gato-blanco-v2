import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  Users,
  Ticket,
  CurrencyDollar
} from '@phosphor-icons/react';
import { Event } from '../types';
import { useLanguageStore, translations } from '../lib/translations';
import { formatPrice } from '../lib/pricing';
import { toast } from 'sonner';

interface EventBookingDialogProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

export function EventBookingDialog({ event, open, onClose }: EventBookingDialogProps) {
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage.code];
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!event) return null;

  const spotsLeft = event.capacity - event.currentBookings;
  const maxTickets = Math.min(spotsLeft, 10); // Max 10 tickets per booking
  const totalCost = event.entryFee * ticketQuantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(
        currentLanguage.code === 'en' 
          ? `Successfully booked ${ticketQuantity} ticket(s) for ${event.name.en}!`
          : `¡Reserva exitosa de ${ticketQuantity} boleto(s) para ${event.name.es}!`
      );
      
      // Reset form and close
      setCustomerInfo({ name: '', email: '', phone: '' });
      setTicketQuantity(1);
      onClose();
    } catch (error) {
      toast.error(
        currentLanguage.code === 'en' 
          ? 'Booking failed. Please try again.'
          : 'Error en la reserva. Inténtalo de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket size={24} className="text-accent" />
            {t.booking.eventBooking}
          </DialogTitle>
          <DialogDescription>
            {event.name[currentLanguage.code]}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
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
                <span>{spotsLeft} spots left</span>
              </div>
              <div className="flex items-center gap-2">
                <CurrencyDollar size={16} className="text-muted-foreground" />
                <span>{formatPrice(event.entryFee)} per ticket</span>
              </div>
            </div>
            
            {event.drinks?.included && (
              <Badge className="bg-accent/10 text-accent border-accent/20">
                🍹 Drinks Included
              </Badge>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ticket Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">{t.booking.ticketQuantity}</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                  disabled={ticketQuantity <= 1}
                >
                  -
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={maxTickets}
                  value={ticketQuantity}
                  onChange={(e) => setTicketQuantity(Math.min(maxTickets, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="text-center w-20"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTicketQuantity(Math.min(maxTickets, ticketQuantity + 1))}
                  disabled={ticketQuantity >= maxTickets}
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground">
                  (max {maxTickets})
                </span>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.booking.name}</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t.booking.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t.booking.phone}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            {/* Total Cost */}
            <div className="flex justify-between items-center text-lg font-semibold p-3 bg-accent/10 rounded-lg">
              <span>Total:</span>
              <span className="text-accent">{formatPrice(totalCost)}</span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || spotsLeft < ticketQuantity}
              className="w-full gap-2"
            >
              <Ticket size={16} />
              {isSubmitting 
                ? (currentLanguage.code === 'en' ? 'Processing...' : 'Procesando...')
                : `${t.booking.submit} (${formatPrice(totalCost)})`
              }
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}