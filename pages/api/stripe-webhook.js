// pages/api/stripe-webhook.js
import { buffer } from 'micro';
import Stripe from 'stripe';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_IDS = process.env.TELEGRAM_CHAT_IDS?.split(',') || [];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const rawBody = await buffer(req);
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('❌ Invalid signature:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const name = session.customer_details?.name || '—';
    const email = session.customer_email || '—';
    const method = session.payment_method_types?.[0] || '—';
    const service = session.metadata?.service || '—';
    const quantity = session.metadata?.quantity || '1';
    const amount = (session.amount_total / 100).toFixed(2);

    const message = `
🧾 *Нове замовлення (Stripe)*  
👤 Ім’я: ${name}  
📧 Email: ${email}  
💳 Метод: ${method}  
📦 Послуга: ${service} – ${quantity}x  
💰 Сума: ${amount} zł
    `.trim();

    const form = new FormData();
    form.append('parse_mode', 'Markdown');
    form.append('text', message);

    for (const chatId of TELEGRAM_CHAT_IDS) {
      form.set('chat_id', chatId);
      try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          body: form,
        });
        const out = await res.text();
        console.log('✅ Sent to Telegram:', out);
      } catch (err) {
        console.error('❌ Telegram send error:', err.message);
      }
    }
  }

  res.status(200).send('ok');
}