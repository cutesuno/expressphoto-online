import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const rawBody = await buffer(req);
  const signature = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error('❌ Invalid Stripe signature:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const name = session.metadata?.name || '—';
    const service = session.metadata?.service || '—';
    const fileUrl = session.metadata?.fileUrl;
    const amount = (session.amount_total || 0) / 100;

    const message = `
🧾 *Нове замовлення*
👤 Ім’я: ${name}
📦 Послуга: ${service}
💰 Сума: ${amount} zł
`.trim();

    for (const chatId of TELEGRAM_CHAT_IDS) {
      const form = new FormData();
      form.append('chat_id', chatId);
      form.append('parse_mode', 'Markdown');

      if (fileUrl && fileUrl.startsWith('http')) {
        form.append('document', fileUrl);
        form.append('caption', message);
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
          method: 'POST',
          body: form as any,
        });
      } else {
        form.append('text', message);
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          body: form as any,
        });
      }
    }

    console.log('✅ Telegram message sent');
  }

  res.status(200).send('ok');
}