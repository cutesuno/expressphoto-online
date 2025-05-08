import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: { bodyParser: false },
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
      console.error('❌ Form parse error:', err);
      return res.status(500).json({ error: 'Form parsing failed' });
    }

    const { name, email, details, time, service, quantity, total, language } = fields;
    const uploadedFile = files.file as File;

    if (!name || !email || !service || !quantity || !total || !uploadedFile) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sessionId = `order-${Date.now()}`;
    const caption = `🧾 Нове замовлення #${sessionId}
👤 ${name}
📧 ${email}
🕒 ${time}
🧾 ${service} x${quantity} = ${total} zł
📄 ${details}`;

    try {
      const tgForm = new FormData();
      tgForm.append('chat_id', process.env.TELEGRAM_CHAT_ID!);
      tgForm.append('caption', caption);
      tgForm.append('document', fs.createReadStream(uploadedFile.filepath), uploadedFile.originalFilename || 'file.jpg');

      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendDocument`, {
        method: 'POST',
        body: tgForm as any,
      });

      return res.status(200).json({
        sessionId,
        redirectUrl: `https://expressphoto.vercel.app/order-success?lang=${language || 'uk'}&sessionId=${sessionId}`,
      });
    } catch (error) {
      console.error('❌ Telegram error:', error);
      return res.status(500).json({ error: 'Telegram send failed' });
    }
  });
}