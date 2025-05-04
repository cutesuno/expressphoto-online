// pages/api/create-payment.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const P24_API_URL = 'https://secure.przelewy24.pl/api/v1/transaction/register';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name,
    email,
    details,
    time,
    service,
    quantity,
    total,
  } = req.body;

  if (!name || !email || !service || !quantity || !total) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sessionId = `order-${Date.now()}`;
    const amountInCents = Math.round(Number(total) * 100);

    const payload = {
      merchantId: process.env.P24_MERCHANT_ID,
      posId: process.env.P24_POS_ID,
      sessionId,
      amount: amountInCents,
      currency: 'PLN',
      description: `Оплата за послугу: ${service}`,
      email,
      country: 'PL',
      language: 'pl',
      urlReturn: process.env.P24_RETURN_URL,
      urlStatus: process.env.P24_STATUS_URL,
      encoding: 'UTF-8',
    };

    const response = await fetch(P24_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.P24_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && result && result.data && result.data.token) {
      return res.status(200).json({
        redirectUrl: `https://secure.przelewy24.pl/trnRequest/${result.data.token}`,
        sessionId,
      });
    } else {
      return res.status(400).json({ error: 'Payment init failed', details: result });
    }
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
