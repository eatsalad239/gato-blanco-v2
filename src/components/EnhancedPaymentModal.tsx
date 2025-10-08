import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  DeviceMobile,
  Money,
  ShieldCheck,
  Warning,
  CheckCircle,
  Lightning,
  CurrencyDollar,
  ArrowLeft,
  Lock
} from '@phosphor-icons/react';

import { usePayments, PaymentMethod, PaymentRequest } from '../lib/payments';
import { notificationService } from '../lib/notifications';
import { useBusiness } from '../lib/business';
import { useLanguageStore, translations } from '../lib/translations';
import { detectUserType } from '../lib/pricing';

interface EnhancedPaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  currency: 'COP' | 'USD';
  orderId?: string;
  bookingId?: string;
  customerId: string;
  description: string;
  onSuccess?: (transactionId: string) => void;
}

export function EnhancedPaymentModal({
  open,
  onClose,
  amount,
  currency,
  orderId,
  bookingId,
  customerId,
  description,
  onSuccess
}: EnhancedPaymentModalProps) {
  const payments = usePayments();
  const business = useBusiness();
  const { currentLanguage } = useLanguageStore();
  const t = translations[currentLanguage.code];
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod['type']>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState(4000);
  const [convertedAmount, setConvertedAmount] = useState(amount);
  const [fees, setFees] = useState(0);
  const [applePayAvailable, setApplePayAvailable] = useState(false);
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);
  
  const isGringo = detectUserType(currentLanguage.code);

  // Initialize payment options
  useEffect(() => {
    const initializePayment = async () => {
      const [applePayReady, googlePayReady, rate] = await Promise.all([
        payments.isApplePayAvailable(),
        payments.isGooglePayAvailable(),
        payments.getExchangeRate()
      ]);
      
      setApplePayAvailable(applePayReady);
      setGooglePayAvailable(googlePayReady);
      setExchangeRate(rate);
      
      // Calculate converted amount and fees
      const converted = await payments.convertCurrency(amount, currency, currency === 'COP' ? 'USD' : 'COP');
      setConvertedAmount(converted);
      
      const calculatedFees = payments.calculateFees(amount, currency, isGringo, selectedMethod);
      setFees(calculatedFees);
    };

    if (open) {
      initializePayment();
    }
  }, [open, amount, currency, selectedMethod, isGringo]);

  // Format currency display
  const formatCurrency = (amount: number, currency: 'COP' | 'USD') => {
    return new Intl.NumberFormat(currentLanguage.code === 'es' ? 'es-CO' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };

  // Validate form
  const isFormValid = () => {
    if (selectedMethod === 'cash') return true;
    if (selectedMethod === 'apple_pay' || selectedMethod === 'google_pay') return true;
    
    return cardDetails.number.length >= 16 && 
           cardDetails.expiry.length === 5 && 
           cardDetails.cvv.length >= 3 && 
           cardDetails.name.length > 0;
  };

  // Process payment
  const handlePayment = async () => {
    setProcessing(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      let paymentMethod: PaymentMethod;
      
      switch (selectedMethod) {
        case 'apple_pay':
          paymentMethod = { type: 'apple_pay' };
          break;
        case 'google_pay':
          paymentMethod = { type: 'google_pay' };
          break;
        case 'cash':
          paymentMethod = { type: 'cash' };
          break;
        default:
          paymentMethod = {
            type: 'card',
            cardNumber: cardDetails.number.replace(/\s/g, ''),
            expiryDate: cardDetails.expiry,
            cvv: cardDetails.cvv,
            holderName: cardDetails.name
          };
      }

      const paymentRequest: PaymentRequest = {
        amount,
        currency,
        orderId,
        bookingId,
        customerId,
        description,
        method: paymentMethod
      };

      const result = await payments.processPayment(paymentRequest);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        setSuccess(`Payment successful! Transaction ID: ${result.transactionId}`);
        
        // Notify success
        notificationService.paymentSuccessful(amount, currency);
        
        // Call success callback
        if (onSuccess && result.transactionId) {
          onSuccess(result.transactionId);
        }
        
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setSuccess(null);
          setProgress(0);
        }, 2000);
        
      } else {
        setError(result.error || 'Payment failed');
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  // Reset form when closing
  const handleClose = () => {
    if (!processing) {
      setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
      setError(null);
      setSuccess(null);
      setProgress(0);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md nuclear-card">
        <DialogHeader>
          <DialogTitle className="nuclear-text flex items-center gap-2">
            <Lightning size={20} />
            💳 Secure Payment
          </DialogTitle>
          <DialogDescription>
            Complete your payment securely using your preferred method
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Amount:</span>
              <span className="text-lg font-bold nuclear-text">
                {formatCurrency(amount, currency)}
              </span>
            </div>
            
            {currency !== (currency === 'COP' ? 'USD' : 'COP') && (
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>≈ {formatCurrency(convertedAmount, currency === 'COP' ? 'USD' : 'COP')}</span>
                <span>Rate: 1 USD = {exchangeRate} COP</span>
              </div>
            )}
            
            {fees > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span>Processing Fee:</span>
                <span>{formatCurrency(fees, currency)}</span>
              </div>
            )}
            
            {isGringo && (
              <Badge className="bg-plasma-blue/20 text-plasma-blue border-plasma-blue w-full justify-center">
                💎 Premium Gringo Service
              </Badge>
            )}
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Payment Method</Label>
            
            <div className="grid grid-cols-2 gap-3">
              {applePayAvailable && (
                <Button
                  variant={selectedMethod === 'apple_pay' ? 'default' : 'outline'}
                  className="h-12 flex flex-col nuclear-button"
                  onClick={() => setSelectedMethod('apple_pay')}
                >
                  <DeviceMobile size={20} />
                  <span className="text-xs">Apple Pay</span>
                </Button>
              )}
              
              <Button
                variant={selectedMethod === 'card' ? 'default' : 'outline'}
                className="h-12 flex flex-col nuclear-button"
                onClick={() => setSelectedMethod('card')}
              >
                <CreditCard size={20} />
                <span className="text-xs">Credit Card</span>
              </Button>
              
              <Button
                variant={selectedMethod === 'cash' ? 'default' : 'outline'}
                className="h-12 flex flex-col nuclear-button"
                onClick={() => setSelectedMethod('cash')}
              >
                <Money size={20} />
                <span className="text-xs">Cash</span>
              </Button>
            </div>
          </div>

          {/* Card Details Form */}
          <AnimatePresence>
            {selectedMethod === 'card' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formatCardNumber(cardDetails.number)}
                    onChange={(e) => setCardDetails(prev => ({
                      ...prev,
                      number: e.target.value.replace(/\s/g, '')
                    }))}
                    maxLength={19}
                    className="nuclear-border"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails(prev => ({
                        ...prev,
                        expiry: formatExpiry(e.target.value)
                      }))}
                      maxLength={5}
                      className="nuclear-border"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails(prev => ({
                        ...prev,
                        cvv: e.target.value.replace(/\D/g, '')
                      }))}
                      maxLength={4}
                      className="nuclear-border"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    className="nuclear-border"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock size={16} />
            <span>Your payment is secured with 256-bit SSL encryption</span>
          </div>

          {/* Error/Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert className="border-red-500 bg-red-500/10">
                  <Warning size={16} />
                  <AlertDescription className="text-red-500">
                    {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
            
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert className="border-green-500 bg-green-500/10">
                  <CheckCircle size={16} />
                  <AlertDescription className="text-green-500">
                    {success}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress Bar */}
          {processing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing payment...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={processing}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              onClick={handlePayment}
              disabled={!isFormValid() || processing || !!success}
              className="flex-1 nuclear-button"
            >
              {processing ? (
                <>
                  <ArrowLeft size={16} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : success ? (
                <>
                  <CheckCircle size={16} className="mr-2" />
                  Complete!
                </>
              ) : (
                <>
                  <ShieldCheck size={16} className="mr-2" />
                  Pay {formatCurrency(amount + fees, currency)}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}