// pages/api/checkout-webhook.ts
import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: { bodyParser: false }, // ⛔️ disable body parsing for raw Stripe signature verification
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig!, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Handle successful checkout
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const message = `
🧾 *Нове замовлення (тестовий Stripe)*  
👤 Ім'я: ${session?.customer_details?.name || '—'}  
📧 Email: ${session?.customer_email || '—'}  
💳 Метод: ${session?.payment_method_types?.[0] || '—'}  
🧾 Послуга: ${session?.metadata?.service || '—'}  
💰 Сума: ${(session.amount_total || 0) / 100} zł
    `;

    const form = new FormData();
    form.append('chat_id', TELEGRAM_CHAT_ID);
    form.append('text', message);
    form.append('parse_mode', 'Markdown');

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        body: form as any,
      });
      console.log('✅ Telegram notification sent');
    } catch (err) {
      console.error('❌ Telegram error:', err);
    }
  }

  res.status(200).end('ok');
}