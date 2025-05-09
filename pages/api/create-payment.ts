// pages/api/create-payment.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
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
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ uploadDir: TEMP_DIR, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Failed to parse form' });
    }

    const { name, email, details, time, service, quantity, total, language } = fields;
    const file = files.file as File;

    if (!name || !email || !service || !quantity || !total || !file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sessionId = `order-${Date.now()}`;
    const caption = `🧾 Нове замовлення #${sessionId}\n👤 ${name}\n📧 ${email}\n🕒 ${time}\n🧾 ${service} x${quantity} = ${total} zł\n📄 ${details}`;

    const tgForm = new FormData();
    tgForm.append('chat_id', process.env.TELEGRAM_CHAT_ID!);
    tgForm.append('caption', caption);
    tgForm.append('document', fs.createReadStream(file.filepath), file.originalFilename || 'file');

    try {
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN!}/sendDocument`, {
        method: 'POST',
        body: tgForm as any,
      });

      return res.status(200).json({
        sessionId,
        redirectUrl: `https://expressphoto.vercel.app/order-success?lang=${language || 'uk'}&sessionId=${sessionId}`,
      });
    } catch (err) {
      console.error('Telegram error:', err);
      return res.status(500).json({ error: 'Failed to send to Telegram' });
    }
  });
}