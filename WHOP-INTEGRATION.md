# Whop Payment Integration Guide

## Overview

This repository uses **Whop** for payment processing, digital product sales, and subscription management. The integration uses Vercel serverless functions to create checkout sessions and redirects users to Whop's hosted checkout page.

## Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Browser   │─────▶│ Vercel Function  │─────▶│   Whop API      │
│ (PayButton) │      │ /api/whop-       │      │  (Checkout      │
│             │      │  checkout        │      │   Session)      │
└─────────────┘      └──────────────────┘      └─────────────────┘
       │                       │                         │
       │                       └─────────────────────────┘
       │                         Returns checkout URL
       │
       └─────────────────────────────────────────────────▶
                   Redirect to Whop checkout page
                   
                          Complete payment
                              │
                              ▼
                   Redirect to /thank-you.html?ref=...
```

## Files Added/Modified

### 1. `vercel.json`
Vercel deployment configuration declaring:
- Build command and output directory
- Serverless function runtime (Node.js 20.x)

### 2. `api/whop-checkout.ts`
Serverless function that:
- Accepts POST requests with plan details
- Creates checkout sessions via Whop API
- Uses `WHOP_API_KEY` for authentication
- Returns checkout URL for redirect

### 3. `src/lib/payments/whop.ts`
Client-side helper that:
- Fetches checkout session from serverless function
- Redirects user to Whop's hosted checkout
- Handles errors gracefully

### 4. `src/components/PayButton.tsx`
React component that:
- Generates unique payment reference using UUID
- Initiates Whop checkout flow
- Supports optional plan ID override
- Configurable via `VITE_WHOP_PLAN_ID` environment variable

### 5. `public/thank-you.html`
Static post-payment page that:
- Displays payment reference from URL query parameter
- Provides link back to home page
- Maintains consistent dark/cyan theme

### 6. `src/App.tsx`
Updated to include PayButton in home hero section alongside existing CTA buttons.

### 7. `src/vite-end.d.ts`
TypeScript definitions for Whop environment variables.

## Environment Variables

### Required for Vercel Deployment

Set these in the Vercel project settings (Environment Variables section):

#### Server-side (Runtime)
```bash
WHOP_API_KEY=your_whop_api_key_here
```
This is the secret API key used to authenticate with Whop's API. **Never commit this value.**

Get your API key from the [Whop Developer Dashboard](https://whop.com/apps):
1. Navigate to your app settings
2. Go to the "Developers" section
3. Create or copy your API key

#### Client-side (Build-time)
```bash
VITE_WHOP_PLAN_ID=plan_xxxxxxxxx
```
This is the default plan ID that users will purchase. This will be embedded in the client-side bundle.

Get your plan ID from your Whop product/plan settings:
1. Go to your Whop dashboard
2. Navigate to Products
3. Select your product
4. Copy the Plan ID

## Testing

### Development Mode
1. Set environment variables locally in `.env.local`:
   ```bash
   WHOP_API_KEY=your_test_api_key
   VITE_WHOP_PLAN_ID=plan_test_xxxxx
   ```

2. Run the dev server:
   ```bash
   npm run dev
   ```

3. Visit `http://localhost:5173` and click "💳 Pagar ahora"

### Test Flow
1. Click the Pay button on the home page
2. You'll be redirected to Whop's checkout (test mode)
3. Complete the test payment using Whop's test credentials
4. After payment, you'll be redirected to `/thank-you.html?ref=gbc-xxxxx`

## Production Deployment

### Prerequisites
- Whop account with business verification
- Production API key from Whop dashboard
- Vercel account connected to this repository

### Steps

1. **Configure Environment Variables in Vercel**
   ```bash
   # In Vercel Project Settings → Environment Variables
   WHOP_API_KEY=your_production_api_key
   VITE_WHOP_PLAN_ID=plan_prod_your_plan_id
   ```

2. **Deploy to Vercel**
   ```bash
   # Option 1: Deploy via Vercel CLI
   vercel --prod
   
   # Option 2: Deploy via Git integration
   git push origin main  # Auto-deploys if Vercel integration enabled
   ```

3. **Verify Deployment**
   - Visit your deployed site
   - Click the Pay button
   - Verify redirect to Whop checkout
   - Test a payment with production credentials

## Payment Flow

1. **User clicks "Pagar ahora"**
   - PayButton generates unique reference: `gbc-{uuid}`
   - Collects plan ID from props or environment variable

2. **Request checkout session from backend**
   - POST to `/api/whop-checkout`
   - Body: `{ planId, metadata, redirectUrl }`
   - Server creates session via Whop API
   - Response: `{ checkoutUrl, sessionId }`

3. **Redirect to Whop**
   - Browser navigates to Whop's hosted checkout
   - User completes payment on Whop's secure page
   - Supports multiple payment methods

4. **Redirect back to site**
   - After payment, Whop redirects to: `/thank-you.html?ref={reference}`
   - Thank you page displays the reference

## Customization

### Using Different Plan IDs

You can override the default plan ID per button:

```tsx
<PayButton planId="plan_custom_id" amount={50000} />
```

### Adding Customer Email

```tsx
<PayButton planId="plan_xxxx" email="customer@example.com" />
```

### Custom Metadata

Modify `src/components/PayButton.tsx` to add custom metadata:

```tsx
await startWhopCheckout({
  planId: checkoutPlanId,
  metadata: {
    reference,
    customField: 'value',
    userId: 'user123',
  },
  redirectUrl,
  customerEmail: email,
});
```

## Webhooks

To receive real-time payment notifications, set up Whop webhooks:

1. **Configure Webhook in Whop Dashboard**
   - Go to your app settings
   - Navigate to Webhooks
   - Add endpoint: `https://your-domain.com/api/whop-webhook`
   - Subscribe to events: `payment.succeeded`, `payment.failed`

2. **Create Webhook Handler** (optional enhancement)
   Create `api/whop-webhook.ts`:
   ```typescript
   import type { VercelRequest, VercelResponse } from '@vercel/node';
   
   export default async function handler(req: VercelRequest, res: VercelResponse) {
     if (req.method !== 'POST') {
       return res.status(405).json({ error: 'Method not allowed' });
     }
     
     // Verify webhook signature (recommended)
     // Process webhook event
     const event = req.body;
     
     console.log('Whop webhook event:', event);
     
     // Handle different event types
     switch (event.type) {
       case 'payment.succeeded':
         // Update your database, send confirmation email, etc.
         break;
       case 'payment.failed':
         // Handle failed payment
         break;
     }
     
     res.status(200).json({ received: true });
   }
   ```

## API Reference

### POST /api/whop-checkout

Creates a new Whop checkout session.

**Request Body:**
```json
{
  "planId": "plan_xxxxxxxxx",
  "metadata": {
    "reference": "gbc-abc-123-xyz",
    "displayAmount": 20000,
    "source": "gato-blanco-website"
  },
  "redirectUrl": "https://your-site.com/thank-you.html?ref=gbc-abc-123-xyz"
}
```

**Success Response (200):**
```json
{
  "checkoutUrl": "https://whop.com/checkout/abc123...",
  "sessionId": "session_xxxxxxxxx"
}
```

**Error Responses:**
- `400`: Missing required fields (planId or redirectUrl)
- `405`: Method not allowed (only POST accepted)
- `500`: Server configuration error or Whop API error

## Security Considerations

1. **API Key Protection**
   - `WHOP_API_KEY` is only used server-side in serverless functions
   - Never expose API key in client-side code
   - Rotate keys regularly

2. **Plan ID is Safe to Expose**
   - `VITE_WHOP_PLAN_ID` is designed to be public
   - It's embedded in the client bundle
   - Cannot be used to charge without proper authentication

3. **Webhook Signature Verification**
   - Implement webhook signature verification in production
   - Prevents unauthorized webhook calls
   - Follow Whop's webhook security best practices

4. **HTTPS Required**
   - Whop requires HTTPS for production
   - Vercel provides this automatically

## Troubleshooting

### "Server not configured - WHOP_API_KEY missing"
- The serverless function can't find `WHOP_API_KEY`
- Check Vercel environment variables are set correctly
- Redeploy after adding environment variables

### "No plan ID configured"
- `VITE_WHOP_PLAN_ID` not set or component missing `planId` prop
- Set environment variable in Vercel or pass `planId` to component

### "Failed to create checkout session"
- Check Whop API key is valid
- Verify plan ID exists in your Whop account
- Check Vercel function logs for details

### Redirect URL doesn't work
- Ensure `/thank-you.html` is in the `public/` directory
- Vite copies `public/` contents to `dist/` during build
- Verify the file exists in your deployment

## Whop Features

Whop supports many advanced features:

- **Digital Products**: Sell digital downloads, courses, memberships
- **Subscriptions**: Recurring payments with flexible billing
- **Access Control**: Manage user access to content
- **Analytics**: Track sales, revenue, and customer data
- **Multiple Payment Methods**: Cards, wallets, and more
- **International Payments**: Accept payments globally
- **Affiliate System**: Built-in affiliate tracking

## Resources

- [Whop Official Documentation](https://docs.whop.com)
- [Whop API Reference](https://docs.whop.com/api-reference)
- [Whop Developer Dashboard](https://whop.com/apps)
- [Whop SDK Documentation](https://docs.whop.com/sdk)
- [Whop Webhooks Guide](https://docs.whop.com/webhooks)

## Support

For Whop-specific questions:
- Documentation: [https://docs.whop.com](https://docs.whop.com)
- Support: support@whop.com
- Discord: [Whop Developer Community](https://discord.gg/whop)

For integration issues:
- Check this guide
- Review browser console errors
- Check Vercel function logs

## Migration from Wompi

This integration replaces the previous Wompi implementation. Key differences:

| Feature | Wompi | Whop |
|---------|-------|------|
| Payment Method | Colombian payments (COP) | Global payments |
| Integration | Form POST with signature | API-based checkout sessions |
| Products | Simple payments | Digital products + subscriptions |
| Management | Basic | Full dashboard with analytics |

## Future Enhancements

Potential improvements:
- [ ] Webhook handler for payment confirmation
- [ ] Database integration for payment records
- [ ] Multiple product/plan support
- [ ] Cart integration for bulk purchases
- [ ] Email receipts via webhook
- [ ] Admin dashboard for payment tracking
- [ ] Subscription management UI
- [ ] Affiliate program integration
