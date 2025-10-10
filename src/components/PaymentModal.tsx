import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Lock,
  CheckCircle,
  XCircle
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
  const t = translations[currentLanguage?.code || 'en'];
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google' | 'cash'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    // Customer info callback
    if (onCustomerInfo) {
      onCustomerInfo({
        name: cardData.name || 'Anonymous Customer',
        email: cardData.email || 'anonymous@example.com',
        phone: cardData.phone
      });
    }

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment success (90% success rate for demo)
      if (Math.random() > 0.1) {
        setPaymentStatus('success');
        toast.success(t.payment.success);
        setTimeout(() => {
          onSuccess();
          onClose();
          resetForm();
        }, 1500);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      setPaymentStatus('failed');
      toast.error(t.payment.failed);
      setTimeout(() => {
        setPaymentStatus('idle');
        setIsProcessing(false);
      }, 2000);
    }
  };

  const handleApplePay = async () => {
    toast.info('Apple Pay integration would be implemented here');
    handlePayment();
  };

  const handleGooglePay = async () => {
    toast.info('Google Pay integration would be implemented here');
    handlePayment();
  };

  const handleCashPayment = () => {
    if (onCustomerInfo) {
      onCustomerInfo({
        name: cardData.name || 'Cash Customer',
        email: cardData.email || 'cash@gatoblanco.com',
        phone: cardData.phone
      });
    }
    
    toast.success('Cash payment recorded - please pay at counter');
    onSuccess();
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setCardData({ number: '', expiry: '', cvv: '', name: '', email: '', phone: '' });
    setPaymentStatus('idle');
    setIsProcessing(false);
  };

  const formatCardNumber = (value: string) => {
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

  const isFormValid = () => {
    if (paymentMethod === 'cash') {
      return cardData.name && cardData.email;
    }
    if (paymentMethod === 'card') {
      return cardData.number && cardData.expiry && cardData.cvv && cardData.name && cardData.email;
    }
    return cardData.name && cardData.email;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold nuclear-text">
            💳 Payment Checkout 💳
          </DialogTitle>
          <DialogDescription>
            Complete your order for {currency === 'USD' ? `$${(total / 4200).toFixed(2)}` : `$${total.toLocaleString('es-CO')} COP`}
          </DialogDescription>
        </DialogHeader>

        {paymentStatus === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg">{t.payment.processing}</p>
          </div>
        )}

        {paymentStatus === 'success' && (
          <div className="text-center py-8">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <p className="text-lg text-green-600">{t.payment.success}</p>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="text-center py-8">
            <XCircle size={64} className="text-red-500 mx-auto mb-4" />
            <p className="text-lg text-red-600">{t.payment.failed}</p>
          </div>
        )}

        {paymentStatus === 'idle' && (
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Payment Method</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant={paymentMethod === 'apple' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('apple')}
                  className="h-16 flex-col gap-2"
                >
                  <AppleLogo size={24} />
                  <span className="text-xs">Apple Pay</span>
                </Button>
                
                <Button
                  variant={paymentMethod === 'google' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('google')}
                  className="h-16 flex-col gap-2"
                >
                  <GoogleLogo size={24} />
                  <span className="text-xs">Google Pay</span>
                </Button>
                
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="h-16 flex-col gap-2"
                >
                  <CreditCard size={24} />
                  <span className="text-xs">Card</span>
                </Button>
                
                <Button
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('cash')}
                  className="h-16 flex-col gap-2"
                >
                  <DeviceMobile size={24} />
                  <span className="text-xs">Cash</span>
                </Button>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer-name">Full Name *</Label>
                  <Input
                    id="customer-name"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-email">Email *</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={cardData.email}
                    onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="customer-phone">Phone (optional)</Label>
                  <Input
                    id="customer-phone"
                    value={cardData.phone}
                    onChange={(e) => setCardData({ ...cardData, phone: e.target.value })}
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Card Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="card-expiry">Expiry Date</Label>
                      <Input
                        id="card-expiry"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="card-cvv">CVV</Label>
                      <Input
                        id="card-cvv"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Cash Payment Instructions</h3>
                <p className="text-sm text-muted-foreground">
                  Please proceed to the counter to complete your cash payment. Your order will be prepared once payment is received.
                </p>
              </div>
            )}

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="nuclear-text">{currency === 'USD' ? `$${(total / 4200).toFixed(2)}` : `$${total.toLocaleString('es-CO')} COP`}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <ShieldCheck size={16} className="text-green-500" />
                  <span className="text-xs text-muted-foreground">Secure payment processing</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (paymentMethod === 'apple') handleApplePay();
                  else if (paymentMethod === 'google') handleGooglePay();
                  else if (paymentMethod === 'cash') handleCashPayment();
                  else handlePayment();
                }}
                disabled={!isFormValid() || isProcessing}
                className="flex-1 nuclear-button"
              >
                {paymentMethod === 'cash' ? 'Record Cash Payment' : `Pay ${currency === 'USD' ? `$${(total / 4200).toFixed(2)}` : `$${total.toLocaleString('es-CO')} COP`}`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};