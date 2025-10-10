import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { amountInCents, currency, reference } = req.body || {};
    if (!amountInCents || !currency || !reference) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const integrityKey = process.env.WOMPI_INTEGRITY_KEY;
    if (!integrityKey) return res.status(500).json({ error: 'Server not configured' });

    const payload = `${amountInCents}${currency}${reference}`;
    const signature = crypto.createHmac('sha256', integrityKey).update(payload).digest('hex');

    res.status(200).json({ signature });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal error' });
  }
}
