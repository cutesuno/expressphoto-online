import { buffer } from 'micro';
import Stripe from 'stripe';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: { bodyParser: false }, // ВАЖЛИВО: Stripe потребує raw body
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_IDS = process.env.TELEGRAM_CHAT_IDS?.split(',') || []; // можна декілька ID

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const rawBody = await buffer(req);
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const name = session.customer_details?.name || '—';
    const email = session.customer_email || '—';
    const payment = session.payment_method_types?.[0] || '—';
    const service = session.metadata?.service || '—';
    const qty = session.metadata?.quantity || '1';
    const amount = (session.amount_total / 100).toFixed(2);

    const text = `
🧾 *Нове замовлення (Stripe)*  
👤 Ім’я: ${name}  
💳 Метод: ${payment}  
📦 Послуга: ${service} – ${qty}x  
💰 Сума: ${amount} zł
    `.trim();

    const form = new FormData();
    form.append('parse_mode', 'Markdown');
    form.append('text', text);

    try {
      for (const chatId of TELEGRAM_CHAT_IDS) {
        form.set('chat_id', chatId);
        const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          body: form,
        });
        const result = await tgRes.text();
        console.log('✅ Telegram sent to', chatId, result);
      }
    } catch (err) {
      console.error('❌ Telegram error:', err.message);
    }
  }

  res.status(200).send('ok');
}