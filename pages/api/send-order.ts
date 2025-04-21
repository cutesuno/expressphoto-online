import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

  const form = new formidable.IncomingForm({ keepExtensions: true, multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Помилка парсингу форми' });

    const name = fields.name?.toString() || '—';
    const email = fields.email?.toString() || '—';
    const details = fields.details?.toString() || '—';
    const file = files.file as File | undefined;

    const text = `📸 НОВЕ ЗАМОВЛЕННЯ\n\n👤 ${name}\n📧 ${email}\n📝 ${details}`;

    try {
      // Надсилаємо текстове повідомлення
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
        })
      });

      // Якщо прикріплений файл — надсилаємо його
      if (file) {
        const fileStream = fs.createReadStream(file.filepath);
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        formData.append('document', fileStream, file.originalFilename || 'file');

        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
          method: 'POST',
          body: formData as any,
        });
      }

      res.status(200).json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Помилка надсилання' });
    }
  });
}