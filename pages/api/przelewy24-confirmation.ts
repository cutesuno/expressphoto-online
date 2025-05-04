// /api/create-przelewy24-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { name, email, details, time, serviceId, amount } = req.body;

  const merchantId = process.env.P24_MERCHANT_ID!;
  const posId = process.env.P24_POS_ID!;
  const crc = process.env.P24_CRC!;

  const sessionId = crypto.randomUUID();
  const amountInGrosze = Math.round(amount * 100); // PLN to grosze

  const payload = {
    merchantId,
    posId,
    sessionId,
    amount: amountInGrosze,
    currency: 'PLN',
    description: `Замовлення: ${details}`,
    email,
    country: 'PL',
    language: 'pl',
    urlReturn: `${process.env.BASE_URL}/success`,
    urlStatus: `${process.env.BASE_URL}/api/payment-status`,
    sign: createSignature(sessionId, posId, amountInGrosze, crc)
  };

  const response = await fetch('https://secure.przelewy24.pl/api/v1/transaction/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok) {
    return res.status(500).json({ error: 'Failed to create payment session', details: result });
  }

  return res.status(200).json({ redirectUrl: result.data.token_url });
}

function createSignature(sessionId: string, posId: string, amount: number, crc: string) {
  const str = `${sessionId}|${posId}|${amount}|PLN|${crc}`;
  return crypto.createHash('sha384').update(str).digest('hex');
}
