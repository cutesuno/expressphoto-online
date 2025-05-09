// ✅ Stripe API endpoint with payment session creation
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const TEMP_DIR = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const form = formidable({ uploadDir: TEMP_DIR, keepExtensions: true });

  const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const { name, email, service, quantity, total, language } = fields;
  if (!name || !email || !service || !quantity || !total) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${req.headers.origin}/order-success?lang=${language}&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
      customer_email: String(email),
      line_items: [
        {
          price_data: {
            currency: 'pln',
            unit_amount: Math.round(Number(total) * 100),
            product_data: {
              name: `${service} x${quantity}`,
              description: `Замовник: ${name}`,
            },
          },
          quantity: 1,
        },
      ],
    });

    return res.status(200).json({ redirectUrl: session.url });
  } catch (error) {
    console.error('[Stripe error]', error);
    return res.status(500).json({ error: 'Stripe session failed' });
  }
}