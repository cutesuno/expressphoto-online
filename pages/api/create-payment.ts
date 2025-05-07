// ✅ /pages/api/create-payment.ts — з Telegram інтеграцією
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

const TEMP_DIR = path.join(process.cwd(), 'tmp');
const ORDERS_PATH = path.join(TEMP_DIR, 'orders.json');
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);
if (!fs.existsSync(ORDERS_PATH)) fs.writeFileSync(ORDERS_PATH, JSON.stringify({}));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const form = formidable({ multiples: false, uploadDir: TEMP_DIR, keepExtensions: true });

  try {
    const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { name, email, details, time, service, quantity, total, language } = fields;
    const file = files.file as formidable.File;

    if (!name || !email || !service || !quantity || !total || !file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sessionId = `order-${Date.now()}`;

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
    // trigger rebuild

    // 🔔 Надіслати в Telegram
    const caption = `🧾 Нове замовлення #${sessionId}\n👤 ${name}\n📧 ${email}\n🕒 ${time}\n🧾 ${service} x${quantity} = ${total} zł\n📄 ${details}`;

    const tgForm = new FormData();
    tgForm.append('chat_id', TELEGRAM_CHAT_ID);
    tgForm.append('caption', caption);
    tgForm.append('document', fs.createReadStream(file.filepath), file.originalFilename || 'file');

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: tgForm as any,
    });

    return res.status(200).json({
      sessionId,
      redirectUrl: `https://expressphoto.vercel.app/order-success?lang=${language || 'uk'}&sessionId=${sessionId}`,
    });
  } catch (error) {
    console.error('Create-payment error:', error);
    return res.status(500).json({ error: 'Server error while processing form' });
  }
}
