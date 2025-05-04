// pages/api/verify-payment.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sessionId, amount, formData } = req.body;

  if (!sessionId || !amount) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const verifyResponse = await fetch('https://secure.przelewy24.pl/api/v1/transaction/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.P24_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        sessionId,
        amount: parseInt(amount),
        currency: 'PLN',
      }),
    });

    const result = await verifyResponse.json();

    if (verifyResponse.ok && result?.data?.status === 'success') {
      if (formData && TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: `
📥 НОВЕ ОПЛАЧЕНЕ ЗАМОВЛЕННЯ:
👤 Імʼя: ${formData.name}
📧 Email/телефон: ${formData.email}
🕘 Час: ${formData.time}
📝 Деталі: ${formData.details}
📦 Послуга: ${formData.service || '—'}
💳 Сума: ${amount} PLN
          `.trim(),
          }),
        });
      }

      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false, details: result });
    }
  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}