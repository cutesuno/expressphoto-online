import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export const config = {
  api: {
    bodyParser: true, // бо ми НЕ використовуємо formidable
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Only POST allowed');

  const { name, email, service, quantity, total, language, fileBase64, filename } = req.body;

  if (!name || !email || !service || !quantity || !total) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Зберігаємо файл на сервер (тимчасово — або можна передати base64 далі)
  if (fileBase64 && filename) {
    const buffer = Buffer.from(fileBase64, 'base64');
    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'tmp', filename);
    await fs.mkdir(path.join(process.cwd(), 'tmp'), { recursive: true });
    await fs.writeFile(filePath, buffer);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'pln',
          product_data: {
            name: service,
            description: `Клієнт: ${name}, Email: ${email}`,
          },
          unit_amount: Math.round(parseFloat(total) * 100),
        },
        quantity: parseInt(quantity),
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?lang=${language}&sessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?canceled=true`,
    metadata: {
      service,
      name,
      email,
      quantity: quantity.toString(),
      filename: filename || '',
    },
  });

  return res.status(200).json({ url: session.url });
}