// ✅ Fully working Vercel-compatible upload handler
import type { NextApiRequest, NextApiResponse } from 'next';
const nextConnect = require('next-connect'); 
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: { bodyParser: false },
};

const TEMP_DIR = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

const handler = nextConnect();

handler.post((req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({ uploadDir: TEMP_DIR, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('❌ Parse error:', err);
      return res.status(500).json({ error: 'Parsing failed' });
    }

    const { name, email, details, time, service, quantity, total, language } = fields;
    const file = files.file as formidable.File;

    if (!name || !email || !service || !quantity || !total || !file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sessionId = `order-${Date.now()}`;
    const caption = `🧾 Нове замовлення #${sessionId}
👤 ${name}
📧 ${email}
🕒 ${time}
🧾 ${service} x${quantity} = ${total} zł
📄 ${details}`;

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
      console.error('❌ Telegram error:', err);
      return res.status(500).json({ error: 'Telegram failed' });
    }
  });
});

export default handler;