import { buffer } from 'micro';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_IDS = process.env.TELEGRAM_CHAT_IDS!.split(',');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const rawBody = await buffer(req);
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature!, webhookSecret);
  } catch (err) {
    console.error('❌ Stripe signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const name = session.metadata?.name || '—';
    const email = session.metadata?.email || '—';
    const service = session.metadata?.service || '—';
    const qty = session.metadata?.quantity || '1';
    const filename = session.metadata?.filename || '';
    const amount = (session.amount_total / 100).toFixed(2);

    const caption = `
🧾 *Нове замовлення (Stripe)*  
👤 Ім’я: ${name}  
📧 Email: ${email}  
📦 Послуга: ${service} – ${qty}x  
💰 Сума: ${amount} zł
`.trim();

    const filePath = path.join(process.cwd(), 'tmp', filename);

    try {
      for (const chatId of TELEGRAM_CHAT_IDS) {
        const form = new FormData();
        form.append('chat_id', chatId);
        form.append('parse_mode', 'Markdown');
        form.append('caption', caption);

        if (filename && fs.existsSync(filePath)) {
          form.append('document', fs.createReadStream(filePath), filename);
          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: form,
          });
        } else {
          form.append('text', caption);
          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            body: form,
          });
        }
      }

      console.log('✅ Telegram message sent');
    } catch (err) {
      console.error('❌ Telegram error:', err.message);
    }
  }

  res.status(200).send('ok');
}