import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { startWompiCheckout } from '@/lib/payments/wompi';

interface PayButtonProps {
  totalCOP: number;
  email?: string;
}

export function PayButton({ totalCOP, email }: PayButtonProps) {
  const handlePayment = async () => {
    try {
      const reference = `gbc-${uuidv4()}`;
      const amountInCents = Math.round(totalCOP) * 100;
      const redirectUrl = `${location.origin}/thank-you.html?ref=${encodeURIComponent(reference)}`;
      
      await startWompiCheckout({
        amountInCents,
        currency: 'COP',
        reference,
        redirectUrl,
        customerEmail: email,
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Error al iniciar el pago. Por favor intente de nuevo.');
    }
  };

  return (
    <Button 
      size="lg" 
      className="nuclear-button px-10 py-4 text-xl font-bold"
      onClick={handlePayment}
    >
      💳 Pagar ahora
    </Button>
  );
}
