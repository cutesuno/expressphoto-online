// pages/api/create-payment-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, email, name, details, time, serviceLabel } = req.body;

  if (!amount || !email || !name || !details || !time || !serviceLabel) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    // Створення сесії оплати
    const response = await fetch('https://secure.przelewy24.pl/api/v1/transaction/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.P24_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        merchantId: process.env.P24_MERCHANT_ID,
        posId: process.env.P24_POS_ID,
        sessionId,
        amount: Math.round(Number(amount) * 100), // у грошових одиницях (грош. x 100)
        currency: 'PLN',
        description: serviceLabel,
        email,
        client: name,
        country: 'PL',
        language: 'pl',
        urlReturn: process.env.P24_RETURN_URL,
        urlStatus: process.env.P24_STATUS_URL,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data || !data.data || !data.data.token) {
      return res.status(500).json({ error: 'Failed to create payment session', details: data });
    }

    const redirectUrl = `https://secure.przelewy24.pl/trnRequest/${data.data.token}`;

    res.status(200).json({ redirectUrl, sessionId });
  } catch (error) {
    console.error('Payment session creation failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
