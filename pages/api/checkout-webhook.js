// pages/api/checkout-webhook.js
import { buffer } from 'micro';
import Stripe from 'stripe';

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_IDS = [
  process.env.TELEGRAM_CHAT_ID_1,
  process.env.TELEGRAM_CHAT_ID_2,
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const message = `
🧾 *Нове замовлення (тестовий Stripe)*  
👤 Ім'я: ${session.metadata?.name || '—'}  
📧 Email: ${session.metadata?.email || '—'}  
💳 Метод: ${session.payment_method_types?.[0] || '—'}  
🧾 Послуга: ${session.metadata?.service || '—'}  
📦 Кількість: ${session.metadata?.quantity || '1'}  
💰 Сума: ${(session.amount_total || 0) / 100} zł
    `;

    await Promise.all(
      TELEGRAM_CHAT_IDS.map((chatId) =>
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        })
      )
    );
  }

  res.status(200).end('ok');
}