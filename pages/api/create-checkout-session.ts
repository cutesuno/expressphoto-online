// pages/api/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, service, quantity, total, language } = req.body;

  console.log('🔥 Creating session for:', { name, email, service, quantity, total, language });

  if (!name || !email || !service || !quantity || !total) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
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
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe error:', err);
    return res.status(500).json({ error: 'Stripe session creation failed' });
  }
}