import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import FormData from 'form-data';
import fetch from 'node-fetch';
import https from 'https';

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
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

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
    const payment = session.payment_method_types?.[0] || '—';
    const service = session.metadata?.service || '—';
    const qty = session.metadata?.quantity || '1';
    const total = (session.amount_total! / 100).toFixed(2);
    const fileUrl = session.metadata?.fileUrl || '';

    const text = `
🧾 *Нове замовлення (Stripe)*  
👤 Ім’я: ${name}  
📧 Email: ${email}  
💳 Метод: ${payment}  
📦 Послуга: ${service} – ${qty}x  
💰 Сума: ${total} zł
    `.trim();

    try {
      for (const chatId of TELEGRAM_CHAT_IDS) {
        const form = new FormData();
        form.append('chat_id', chatId);
        form.append('parse_mode', 'Markdown');

        if (fileUrl) {
          console.log('📎 fileUrl:', fileUrl);

          const buffer = await new Promise<Buffer>((resolve, reject) => {
            https.get(fileUrl, (res) => {
              const chunks: Uint8Array[] = [];
              res.on('data', (chunk) => chunks.push(chunk));
              res.on('end', () => resolve(Buffer.concat(chunks)));
            }).on('error', reject);
          });

          form.append('caption', text);
          form.append('document', buffer, {
            filename: 'order-file',
            contentType: 'application/octet-stream',
          });

          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
            method: 'POST',
            body: form as any,
          });
        } else {
          form.append('text', text);
          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            body: form as any,
          });
        }
      }

      console.log('✅ Telegram sent successfully');
    } catch (err: any) {
      console.error('❌ Telegram send error:', err.message);
    }
  }

  res.status(200).send('ok');
}