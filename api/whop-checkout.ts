import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const { planId, metadata, redirectUrl } = req.body || {};
    
    if (!planId || !redirectUrl) {
      return res.status(400).json({ error: 'Missing required fields: planId and redirectUrl' });
    }
    
    const whopApiKey = process.env.WHOP_API_KEY;
    if (!whopApiKey) {
      return res.status(500).json({ error: 'Server not configured - WHOP_API_KEY missing' });
    }

    // Create checkout session using Whop API
    const response = await fetch('https://api.whop.com/api/v5/checkout_sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whopApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: planId,
        metadata: metadata || {},
        redirect_url: redirectUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Whop API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to create checkout session',
        details: errorData 
      });
    }

    const checkoutSession = await response.json();
    
    res.status(200).json({
      checkoutUrl: checkoutSession.checkout_url,
      sessionId: checkoutSession.id,
    });
  } catch (e) {
    console.error('Checkout session creation error:', e);
    res.status(500).json({ error: 'Internal error' });
  }
}
