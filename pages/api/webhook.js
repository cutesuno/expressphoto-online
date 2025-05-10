import { buffer } from 'micro';
import Stripe from 'stripe';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: { bodyParser: false }, // ВАЖЛИВО: для валідації підпису Stripe
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_IDS = (process.env.TELEGRAM_CHAT_IDS || '').split(',');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const rawBody = await buffer(req);
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('❌ Invalid Stripe signature:', err.message);
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

    const message = `
🧾 *Нове замовлення (Stripe)*  
👤 Ім’я: ${name}  
💳 Метод: ${payment}  
📦 Послуга: ${service} – ${qty}x  
💰 Сума: ${amount} zł
    `.trim();

    for (const chatId of TELEGRAM_CHAT_IDS) {
      const form = new FormData();
      form.append('chat_id', chatId.trim());
      form.append('text', message);
      form.append('parse_mode', 'Markdown');

      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          body: form,
        });
        const result = await tgRes.text();
        console.log('✅ Telegram sent to', chatId, result);
      } catch (err) {
        console.error(`❌ Telegram error for chat ${chatId}:`, err.message);
      }
    }
  }

  res.status(200).send('ok');
}