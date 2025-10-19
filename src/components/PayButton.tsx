import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { startWhopCheckout } from '@/lib/payments/whop';

interface PayButtonProps {
  planId?: string;
  amount?: number;
  email?: string;
}

/**
 * PayButton component for initiating Whop checkout
 * @param planId - Whop plan ID to purchase (defaults to env variable)
 * @param amount - Optional amount for display purposes
 * @param email - Optional customer email
 */
export function PayButton({ planId, amount, email }: PayButtonProps) {
  const handlePayment = async () => {
    try {
      const reference = `gbc-${uuidv4()}`;
      const checkoutPlanId = planId || import.meta.env.VITE_WHOP_PLAN_ID;
      
      if (!checkoutPlanId) {
        throw new Error('No plan ID configured. Please set VITE_WHOP_PLAN_ID or provide planId prop.');
      }

      const redirectUrl = `${location.origin}/thank-you.html?ref=${encodeURIComponent(reference)}`;
      
      await startWhopCheckout({
        planId: checkoutPlanId,
        metadata: {
          reference,
          ...(amount && { displayAmount: amount }),
          source: 'gato-blanco-website',
        },
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
