export type WompiCheckoutParams = {
  amountInCents: number;
  currency: 'COP';
  reference: string;
  redirectUrl: string;
  customerEmail?: string;
};

export async function startWompiCheckout(params: WompiCheckoutParams) {
  const { amountInCents, currency, reference, redirectUrl, customerEmail } = params;
  const resp = await fetch('/api/wompi-signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amountInCents, currency, reference }),
  });
  if (!resp.ok) throw new Error('Failed to get signature');
  const { signature } = await resp.json();

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://checkout.wompi.co/p/';
  form.style.display = 'none';

  const fields: Record<string, string> = {
    'public-key': import.meta.env.VITE_WOMPI_PUBLIC_KEY!,
    'amount-in-cents': String(amountInCents),
    'currency': currency,
    'reference': reference,
    'redirect-url': redirectUrl,
    'signature:integrity': signature,
  };

  if (customerEmail) {
    fields['customer-email'] = customerEmail;
  }

  for (const [key, value] of Object.entries(fields)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
