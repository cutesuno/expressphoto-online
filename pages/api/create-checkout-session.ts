// pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import formidable from 'formidable';

export const config = {
  api: { bodyParser: false }, // disable body parser for formidable
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const form = formidable();

  form.parse(req, async (err, fields) => {
    if (err) {
      console.error('❌ Form parse error:', err);
      return res.status(400).json({ error: 'Form parse error' });
    }

    const name = fields.name?.toString() || '';
    const email = fields.email?.toString() || '';
    const details = fields.details?.toString() || '';
    const time = fields.time?.toString() || '';
    const service = fields.service?.toString() || '';
    const quantity = parseInt(fields.quantity?.toString() || '1');
    const total = parseFloat(fields.total?.toString() || '0');
    const language = fields.language?.toString() || 'uk';
    const fileUrl = fields.fileUrl?.toString() || '';

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'pln',
              product_data: {
                name: service,
                description: `Ім'я: ${name}, Email: ${email}, Час: ${time}`,
              },
              unit_amount: Math.round(total * 100),
            },
            quantity,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?lang=${language}&sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?canceled=true`,
        metadata: {
          name,
          email,
          details,
          time,
          service,
          quantity: quantity.toString(),
          fileUrl, // ✅ лінк на файл, що потім піде в Telegram
        },
      });

      return res.status(200).json({ url: session.url });
    } catch (err: any) {
      console.error('❌ Stripe session creation failed:', {
        message: err.message,
        stack: err.stack,
        raw: err.raw,
      });

      return res.status(500).json({ error: 'Stripe error', message: err.message });
    }
  });
}