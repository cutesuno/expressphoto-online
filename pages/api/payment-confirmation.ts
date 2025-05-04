// pages/api/payment-confirmation.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    // TODO: optionally verify signature/hash from P24
    const isPaid = body.status === 'success' || body.status === 'TRUE';

    if (isPaid) {
      const { name, email, details, time, service, quantity, total } = body;

      const text = `✨ *Нове замовлення (оплачено)* ✨\n
Сервіс: ${service}\n
Кількість: ${quantity}\n
💲 Сума: ${total} zł\n
👤 Ім’я: ${name}\n
📧 Email/тел: ${email}\n
📅 Час отримання: ${time}\n
📝 Деталі: ${details}`;

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'Markdown'
        })
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Payment confirm error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
