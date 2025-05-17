import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_IDS = process.env.TELEGRAM_CHAT_IDS!.split(',');
const TEMP_DIR = path.join(process.cwd(), 'tmp');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { sessionId } = req.body;

  if (!sessionId) return res.status(400).json({ error: 'Missing sessionId' });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const name = session.metadata?.name || '—';
    const email = session.metadata?.email || '—';
    const payment = session.payment_method_types?.[0] || '—';
    const service = session.metadata?.service || '—';
    const qty = session.metadata?.quantity || '1';
    const fileId = session.metadata?.fileId || '';
    const total = (session.amount_total! / 100).toFixed(2);
    const filePath = path.join(TEMP_DIR, fileId);

    const text = `
🧾 *Нове замовлення (Stripe)*  
👤 Ім’я: ${name}  
📧 Email: ${email}  
💳 Метод: ${payment}  
📦 Послуга: ${service} – ${qty}x  
💰 Сума: ${total} zł
    `.trim();

    for (const chatId of TELEGRAM_CHAT_IDS) {
      const form = new FormData();
      form.append('chat_id', chatId);
      form.append('parse_mode', 'Markdown');

      if (fileId && fs.existsSync(filePath)) {
        form.append('caption', text);
        form.append('document', fs.createReadStream(filePath));

        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
          method: 'POST',
          body: form as any,
        });

        fs.unlinkSync(filePath); // 🧹 Очистка
      } else {
        form.append('text', text);
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          body: form as any,
        });
      }
    }

    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('❌ Telegram send failed:', err.message);
    res.status(500).json({ error: 'Telegram send failed' });
  }
}