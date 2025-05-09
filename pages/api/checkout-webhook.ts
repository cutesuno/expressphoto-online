// pages/api/checkout-webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import FormData from 'form-data';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const caption = `✅ Оплата успішна\n\nКлієнт: ${session.customer_details?.name}\nEmail: ${session.customer_details?.email}\nСума: ${session.amount_total! / 100} zł`;

    const tgForm = new FormData();
    tgForm.append('chat_id', process.env.TELEGRAM_CHAT_ID!);
    tgForm.append('text', caption);
    tgForm.append('parse_mode', 'Markdown');

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN!}/sendMessage`, {
      method: 'POST',
      body: tgForm as any,
    });
  }

  res.status(200).json({ received: true });
}