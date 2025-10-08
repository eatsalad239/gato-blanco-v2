import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Service } from '../types';
import { useLanguageStore, translations } from '../lib/translations';
import { formatPrice, detectUserType, getCurrency, generateId } from '../lib/pricing';
import { useAdmin } from '../hooks/useAdmin';
import { toast } from 'sonner';
import { Calendar, User, Phone, Envelope, Users } from '@phosphor-icons/react';
import { PaymentModal } from './PaymentModal';

interface BookingDialogProps {
  service: Service | null;
  open: boolean;
  onClose: () => void;
}

export const BookingDialog: React.FC<BookingDialogProps> = ({ service, open, onClose }) => {
  const { currentLanguage } = useLanguageStore();
  const { addBooking } = useAdmin();
  const t = translations[currentLanguage.code];
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    participants: '1'
  });

  const isGringo = detectUserType(currentLanguage.code);
  const currency = getCurrency(isGringo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;

    // Validate form
    if (!formData.name || !formData.email || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Open payment modal
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (!service) return;

    // Save booking to admin system
    addBooking({
      serviceId: service.id,
      date: formData.date,
      time: formData.time,
      participants: parseInt(formData.participants),
      total: totalPrice,
      currency,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      isGringo
    });

    toast.success(t.booking.success);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      participants: '1'
    });
    
    setPaymentModalOpen(false);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!service) return null;

  const totalPrice = service.basePriceCOP * (isGringo ? 1.5 : 1) * parseInt(formData.participants || '1');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar size={24} className="text-accent" />
            {t.booking.title}
          </DialogTitle>
          <DialogDescription>
            {service.name[currentLanguage.code]} - {service.duration}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User size={16} />
              {t.booking.name}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              placeholder="Juan Pérez"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Envelope size={16} />
              {t.booking.email}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              placeholder="juan@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone size={16} />
              {t.booking.phone}
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+57 300 123 4567"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">{t.booking.date}</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">{t.booking.time}</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants" className="flex items-center gap-2">
              <Users size={16} />
              {t.booking.participants}
            </Label>
            <Input
              id="participants"
              type="number"
              min="1"
              max="10"
              value={formData.participants}
              onChange={(e) => handleInputChange('participants', e.target.value)}
              required
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total:</span>
              <span className="text-xl font-bold text-accent font-mono">
                {formatPrice(totalPrice, currency, false)}
              </span>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Continue to Payment
            </Button>
          </div>
        </form>
      </DialogContent>
      
      <PaymentModal
        total={totalPrice}
        currency={currency}
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        orderType="service"
      />
    </Dialog>
  );
};