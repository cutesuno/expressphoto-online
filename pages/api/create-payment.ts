// ✅ /pages/api/create-payment.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // важливо для form-data
  },
};

const TEMP_DIR = path.join(process.cwd(), 'tmp');
const ORDERS_PATH = path.join(TEMP_DIR, 'orders.json');

// Ensure tmp dir and orders file exist
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);
if (!fs.existsSync(ORDERS_PATH)) fs.writeFileSync(ORDERS_PATH, JSON.stringify({}));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const form = formidable({ multiples: false, uploadDir: TEMP_DIR, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'File parsing error' });

    const { name, email, details, time, service, quantity, total, language } = fields;
    const file = files.file as formidable.File;

    if (!name || !email || !service || !quantity || !total || !file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sessionId = `order-${Date.now()}`;

    // Save order to JSON
    const orders = JSON.parse(fs.readFileSync(ORDERS_PATH, 'utf-8'));
    orders[sessionId] = {
      name,
      email,
      details,
      time,
      service,
      quantity,
      total,
      language,
      filePath: file.filepath,
      originalFilename: file.originalFilename,
    };
    fs.writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2));

    // Return mock redirect URL (Przelewy24 додамо після верифікації)
    return res.status(200).json({
      sessionId,
      redirectUrl: `https://expressphoto.vercel.app/order-success?lang=${language || 'uk'}&sessionId=${sessionId}`,
    });
  });
} 

// Потребує: npm i formidable