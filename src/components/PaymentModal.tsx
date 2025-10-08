import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  DeviceMobile, 
  ShieldCheck, 
  AppleLogo,
  GoogleLogo,
  Lock
} from '@phosphor-icons/react';
import { useLanguageStore, translations } from '../lib/translations';
import { formatPrice } from '../lib/pricing';
import { toast } from 'sonner';

interface PaymentModalProps {
  total: number;
  currency: 'COP' | 'USD';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  orderType: 'coffee' | 'service';
  onCustomerInfo?: (info: { name: string; email: string; phone: string }) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  total,
  currency,
  isOpen,
  onClose,
  onSuccess,
  orderType,
  onCustomerInfo
}) => {
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage.code];
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async (method: 'card' | 'apple' | 'google') => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would integrate with:
      // - Stripe for card payments
      // - Apple Pay API for Apple Pay
      // - Google Pay API for Google Pay
      // - Local Colombian payment processors like PSE, Nequi, etc.
      
      toast.success(`Payment successful! ${formatPrice(total, currency, false)} charged via ${method}`);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplePay = () => {
    // Check if Apple Pay is available
    if ((window as any).ApplePaySession && (window as any).ApplePaySession.canMakePayments()) {
      handlePayment('apple');
    } else {
      toast.error('Apple Pay is not available on this device');
    }
  };

  const handleGooglePay = () => {
    // Check if Google Pay is available
    if (window.google && window.google.payments) {
      handlePayment('google');
    } else {
      toast.error('Google Pay is not available on this browser');
    }
  };

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Pass customer info back to parent component
    if (onCustomerInfo) {
      onCustomerInfo({
        name: cardData.name,
        email: cardData.email,
        phone: cardData.phone
      });
    }
    
    handlePayment('card');
  };

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts: string[] = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock size={20} className="text-accent" />
            Secure Payment
          </CardTitle>
          <CardDescription>
            Complete your {orderType} purchase - {formatPrice(total, currency, false)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose Payment Method</Label>
            
            {/* Apple Pay */}
            <Button
              onClick={handleApplePay}
              disabled={isProcessing}
              className="w-full h-12 bg-black hover:bg-black/90 text-white border border-gray-300 flex items-center gap-3"
            >
              <AppleLogo size={20} weight="fill" />
              <span className="font-medium">Pay with Apple Pay</span>
            </Button>

            {/* Google Pay */}
            <Button
              onClick={handleGooglePay}
              disabled={isProcessing}
              variant="outline"
              className="w-full h-12 border-2 flex items-center gap-3"
            >
              <GoogleLogo size={20} />
              <span className="font-medium">Pay with Google Pay</span>
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or pay with card</span>
              </div>
            </div>

            {/* Card Payment Form */}
            <form onSubmit={handleCardPayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    number: formatCardNumber(e.target.value) 
                  }))}
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    value={cardData.expiry}
                    onChange={(e) => setCardData(prev => ({ 
                      ...prev, 
                      expiry: formatExpiry(e.target.value) 
                    }))}
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => setCardData(prev => ({ 
                      ...prev, 
                      cvv: e.target.value.replace(/[^0-9]/g, '') 
                    }))}
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  type="text"
                  placeholder="John Doe"
                  value={cardData.name}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    name: e.target.value 
                  }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={cardData.email}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    email: e.target.value 
                  }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+57 300 123 4567"
                  value={cardData.phone}
                  onChange={(e) => setCardData(prev => ({ 
                    ...prev, 
                    phone: e.target.value 
                  }))}
                />
              </div>

              {/* Security Badge */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <ShieldCheck size={16} className="text-accent" />
                <span>Your payment information is encrypted and secure</span>
              </div>

              {/* Payment Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total:</span>
                  <span className="text-xl font-bold text-accent">
                    {formatPrice(total, currency, false)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} />
                        Pay Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Type declarations for payment APIs
declare global {
  interface Window {
    ApplePaySession?: any;
    google?: {
      payments?: any;
    };
  }
}