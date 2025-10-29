export type WhopCheckoutParams = {
  planId: string;
  metadata?: Record<string, any>;
  redirectUrl: string;
  customerEmail?: string;
};

/**
 * Initiates a Whop checkout session
 * Creates a checkout session via the serverless API and redirects the user to Whop's hosted checkout
 */
export async function startWhopCheckout(params: WhopCheckoutParams): Promise<void> {
  const { planId, metadata, redirectUrl, customerEmail } = params;
  
  // Add customer email to metadata if provided
  const checkoutMetadata = {
    ...metadata,
    ...(customerEmail && { customerEmail }),
  };

  // Call serverless function to create checkout session
  const resp = await fetch('/api/whop-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      planId, 
      metadata: checkoutMetadata, 
      redirectUrl 
    }),
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`Failed to create checkout session: ${errorData.error || resp.statusText}`);
  }

  const { checkoutUrl } = await resp.json();

  if (!checkoutUrl) {
    throw new Error('No checkout URL returned from server');
  }

  // Redirect to Whop's hosted checkout page
  window.location.href = checkoutUrl;
}
