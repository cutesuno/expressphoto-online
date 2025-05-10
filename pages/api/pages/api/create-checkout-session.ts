import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import Stripe from 'stripe';
import { v2 as cloudinary } from 'cloudinary';

export const config = {
  api: { bodyParser: false }, // Вимкнено bodyParser для form-data
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-04-30.basil',
});

// Cloudinary конфігурація
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const TEMP_DIR = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ uploadDir: TEMP_DIR, keepExtensions: true });

  const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const { name, email, service, quantity, total, language } = fields;
  const file = files.file as formidable.File;

  if (!name || !email || !service || !quantity || !total) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Завантажити файл у Cloudinary
  let uploadedUrl = '';
  try {
    if (file && file.filepath) {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'orders',
        resource_type: 'auto',
        public_id: file.originalFilename?.split('.')[0],
      });
      uploadedUrl = result.secure_url;
    }
  } catch (err) {
    console.error('❌ Cloudinary upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }

  // Створення сесії Stripe
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: service as string,
              description: `Клієнт: ${name}, Email: ${email}`,
            },
            unit_amount: Math.round(parseFloat(total as string) * 100),
          },
          quantity: parseInt(quantity as string),
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?lang=${language}&sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?canceled=true`,
      metadata: {
        name: name as string,
        email: email as string,
        service: service as string,
        quantity: quantity.toString(),
        fileUrl: uploadedUrl,
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe session error:', err);
    return res.status(500).json({ error: 'Stripe session creation failed' });
  }
}