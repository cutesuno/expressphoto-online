// /pages/api/webhook.ts
import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import FormData from 'form-data';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
apiVersion: '2025-03-31.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const { customer_email, amount_total, metadata } = session;
    const name = metadata?.name || 'Без імені';
    const service = metadata?.service || 'Послуга';
    const time = metadata?.time || '-';
    const total = (amount_total || 0) / 100;

    const caption = `✅ Оплата підтверджена\n👤 ${name}\n📧 ${customer_email}\n🕒 ${time}\n🧾 ${service} = ${total} zł`;

    const tgForm = new FormData();
    tgForm.append('chat_id', process.env.TELEGRAM_CHAT_ID!);
    tgForm.append('text', caption);

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN!}/sendMessage`, {
      method: 'POST',
      body: tgForm as any,
    });
  }

  res.json({ received: true });
}