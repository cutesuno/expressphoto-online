import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  try {
    const {
      name,
      email,
      details,
      time,
      service,
      quantity,
      total,
      language,
      fileUrl,
    } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: { name: service },
            unit_amount: Math.round(parseFloat(total) * 100),
          },
          quantity: parseInt(quantity),
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
        fileUrl: fileUrl || '',
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
}