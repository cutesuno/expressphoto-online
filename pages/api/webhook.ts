// pages/api/webhook.ts
import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import FormData from 'form-data';
import fetch from 'node-fetch';
import fs from 'fs';

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_IDS = process.env.TELEGRAM_CHAT_IDS!.split(',');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const rawBody = await buffer(req);
  const signature = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error('❌ Invalid signature:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const name = session.metadata?.name || '—';
    const email = session.metadata?.email || '—';
    const service = session.metadata?.service || '—';
    const quantity = session.metadata?.quantity || '1';
    const filePath = session.metadata?.filePath || '';
    const originalFilename = session.metadata?.originalFilename || 'file';
    const total = (session.amount_total! / 100).toFixed(2);

    const caption = `
🧾 *Нове замовлення (Stripe)*
👤 Ім’я: ${name}
📧 Email: ${email}
📦 Послуга: ${service} – ${quantity}x
💰 Сума: ${total} zł
`.trim();

    for (const chatId of TELEGRAM_CHAT_IDS) {
      try {
        if (filePath && fs.existsSync(filePath)) {
          const form = new FormData();
          form.append('chat_id', chatId);
          form.append('caption', caption);
          form.append('parse_mode', 'Markdown');
          form.append('document', fs.createReadStream(filePath), originalFilename);

          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: form as any,
          });
        } else {
          const form = new FormData();
          form.append('chat_id', chatId);
          form.append('text', caption);
          form.append('parse_mode', 'Markdown');

          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            body: form as any,
          });
        }
      } catch (err: any) {
        console.error('❌ Telegram send error:', err.message);
      }
    }
  }

  res.status(200).send('ok');
}
