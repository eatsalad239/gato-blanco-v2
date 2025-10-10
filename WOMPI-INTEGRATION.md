# Wompi Payment Integration Guide

## Overview

This repository now includes a minimal Wompi hosted checkout integration for accepting COP payments. The integration uses Vercel serverless functions for signature generation and redirects users to Wompi's hosted checkout page.

## Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Browser   │─────▶│ Vercel Function  │─────▶│ Wompi Checkout  │
│ (PayButton) │      │ /api/wompi-      │      │  (Hosted Page)  │
│             │      │  signature       │      │                 │
└─────────────┘      └──────────────────┘      └─────────────────┘
       │                                                  │
       │                                                  │
       └──────────────────────────────────────────────────┘
                    Redirect after payment
                  (/thank-you.html?ref=...)
```

## Files Added

### 1. `vercel.json`
Vercel deployment configuration declaring:
- Build command and output directory
- Serverless function runtime (Node.js 20.x)

### 2. `api/wompi-signature.ts`
Serverless function that:
- Accepts POST requests with payment details
- Generates HMAC-SHA256 signature using `WOMPI_INTEGRITY_KEY`
- Returns signature for secure checkout

### 3. `src/lib/payments/wompi.ts`
Client-side helper that:
- Fetches signature from serverless function
- Creates and submits hidden form to Wompi checkout
- Includes all required fields (amount, currency, reference, etc.)

### 4. `src/components/PayButton.tsx`
React component that:
- Generates unique payment reference using UUID
- Calculates amount in cents
- Initiates Wompi checkout flow
- Currently configured for 20,000 COP test payment

### 5. `public/thank-you.html`
Static post-payment page that:
- Displays payment reference from URL query parameter
- Provides link back to home page
- Maintains consistent dark/cyan theme

### 6. `src/App.tsx`
Updated to include PayButton in home hero section alongside existing CTA buttons.

## Environment Variables

### Required for Vercel Deployment

Set these in the Vercel project settings (Environment Variables section):

#### Client-side (Build-time)
```bash
VITE_WOMPI_PUBLIC_KEY=pub_test_xxxxxxxxx  # or pub_prod_xxxxxxxxx
```
This is the public key from your Wompi account and will be embedded in the client-side bundle.

#### Server-side (Runtime)
```bash
WOMPI_INTEGRITY_KEY=test_integrity_xxxxxxxxx  # or prod_integrity_xxxxxxxxx
```
This is the secret integrity key used to sign transactions. **Never commit this value.**

### Getting Your Keys

1. Sign up at [https://wompi.co](https://wompi.co)
2. Navigate to your dashboard
3. Copy your:
   - **Public Key** → Set as `VITE_WOMPI_PUBLIC_KEY`
   - **Integrity Key** → Set as `WOMPI_INTEGRITY_KEY`

## Testing

### Test Keys (Sandbox)
Use Wompi's test credentials for development:
- Public key starts with `pub_test_`
- Integrity key starts with `test_integrity_`

### Test Flow
1. Visit the deployed site
2. Click "💳 Pagar ahora" on the home page
3. You'll be redirected to Wompi's checkout (test mode)
4. Use Wompi's test card numbers:
   - **Approved**: `4242 4242 4242 4242`
   - **Declined**: `4111 1111 1111 1111`
   - Any future date and any 3-digit CVC
5. After payment, you'll be redirected to `/thank-you.html?ref=gbc-xxxxx`

## Production Deployment

### Prerequisites
- Wompi production account with business verification
- Production public and integrity keys
- Vercel account connected to this repository

### Steps

1. **Configure Environment Variables in Vercel**
   ```bash
   # In Vercel Project Settings → Environment Variables
   VITE_WOMPI_PUBLIC_KEY=pub_prod_your_key
   WOMPI_INTEGRITY_KEY=prod_integrity_your_key
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
   - Verify redirect to Wompi checkout
   - Test a payment with production credentials

## Payment Flow

1. **User clicks "Pagar ahora"**
   - PayButton generates unique reference: `gbc-{uuid}`
   - Calculates amount in cents: `20000 * 100 = 2000000`

2. **Request signature from backend**
   - POST to `/api/wompi-signature`
   - Body: `{ amountInCents, currency: 'COP', reference }`
   - Response: `{ signature: 'hmac-sha256-hash' }`

3. **Redirect to Wompi**
   - Hidden form POSTs to `https://checkout.wompi.co/p/`
   - Includes: public key, amount, currency, reference, redirect URL, signature
   - User completes payment on Wompi's hosted page

4. **Redirect back to site**
   - After payment, Wompi redirects to: `/thank-you.html?ref={reference}`
   - Thank you page displays the reference

## Customization

### Changing the Test Amount

Edit `src/App.tsx`:
```tsx
<PayButton totalCOP={50000} />  // Change 20000 to desired amount
```

### Adding Customer Email

Edit where PayButton is used:
```tsx
<PayButton totalCOP={20000} email="customer@example.com" />
```

### Styling the Button

Edit `src/components/PayButton.tsx` - the button uses the `nuclear-button` class which matches the site's theme.

## Security Considerations

1. **Never expose integrity key client-side**
   - Always use `WOMPI_INTEGRITY_KEY` only in serverless functions
   - Never use `import.meta.env.WOMPI_INTEGRITY_KEY` in client code

2. **Public key is safe to expose**
   - `VITE_WOMPI_PUBLIC_KEY` is designed to be public
   - It's embedded in the client bundle

3. **Signature validation**
   - Wompi validates the signature server-side
   - Prevents tampering with payment amounts

4. **HTTPS required**
   - Wompi requires HTTPS for production
   - Vercel provides this automatically

## Troubleshooting

### "Server not configured" error
- The serverless function can't find `WOMPI_INTEGRITY_KEY`
- Check Vercel environment variables are set correctly
- Redeploy after adding environment variables

### "Failed to get signature" error
- Network issue reaching `/api/wompi-signature`
- Check browser console for details
- Verify the API function deployed correctly

### Payment amount shows incorrectly
- Remember: amount is in cents
- `totalCOP={20000}` = 20,000 COP (multiply by 100 internally)

### Redirect URL doesn't work
- Ensure `/thank-you.html` is in the `public/` directory
- Vite copies `public/` contents to `dist/` during build
- Verify the file exists in your deployment

## API Reference

### POST /api/wompi-signature

**Request Body:**
```json
{
  "amountInCents": 2000000,
  "currency": "COP",
  "reference": "gbc-abc-123-xyz"
}
```

**Success Response (200):**
```json
{
  "signature": "a1b2c3d4e5f6..."
}
```

**Error Responses:**
- `400`: Missing required fields
- `405`: Method not allowed (only POST accepted)
- `500`: Server configuration error or internal error

## Support

For Wompi-specific questions:
- Documentation: [https://docs.wompi.co](https://docs.wompi.co)
- Support: support@wompi.co

For integration issues:
- Check this guide
- Review browser console errors
- Check Vercel function logs

## Future Enhancements

Potential improvements for later:
- [ ] Add webhook handler to confirm payments server-side
- [ ] Store payment records in database
- [ ] Add payment status checking
- [ ] Support multiple payment amounts
- [ ] Add cart integration
- [ ] Email receipts
- [ ] Admin dashboard for payments
