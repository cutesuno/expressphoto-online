// pages/api/payment-confirmation.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { merchantId, posId, sessionId, amount, currency, sign } = req.body;

  if (!sessionId || !amount || !currency || !sign) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    // 1. Verify payment with Przelewy24 API
    const verify = await fetch('https://secure.przelewy24.pl/api/v1/transaction/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.P24_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        sessionId,
        amount,
        currency,
      }),
    });

    const data = await verify.json();

    if (verify.ok && data.data && data.data.status === 'success') {
      // 2. Send message to Telegram
      const tgMessage = `✉️ Нове оплачене замовлення:\nSession ID: ${sessionId}\nСума: ${(amount / 100).toFixed(2)} PLN`;

      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: tgMessage,
        }),
      });

      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: 'Verification failed', details: data });
    }
  } catch (err) {
    console.error('Payment confirmation error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
