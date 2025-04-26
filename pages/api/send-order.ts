import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File as FormidableFile } from 'formidable';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Метод не дозволено' });
    return;
  }

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      res.status(500).json({ message: 'Form parsing failed' });
      return;
    }

    try {
      const name = fields.name?.toString() || 'немає імені';
      const email = fields.email?.toString() || 'немає email/телефону';
      const details = fields.details?.toString() || 'немає деталей';
      const time = fields.time?.toString() || 'час не вказано';

      const message = `
🛒 НОВЕ ЗАМОВЛЕННЯ
───────────────
👤 Ім'я: ${name}
📧 Емейл або телефон: ${email}
📝 Деталі: ${details}
🕒 Час замовлення: ${time}
`;

      const file = files.file as FormidableFile;

      if (file && file.filepath) {
        // Якщо є файл — надсилаємо файл із caption
        const stream = fs.createReadStream(file.filepath);
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID!);
        formData.append('document', stream, file.originalFilename || 'file');
        formData.append('caption', message);

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, formData, {
          headers: formData.getHeaders(),
        });
      } else {
        // Якщо файлу немає — надсилаємо просто текст
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        });
      }

      res.status(200).json({ message: 'OK' });
    } catch (error) {
      console.error('Telegram send error:', error);
      res.status(500).json({ message: 'Failed to send to Telegram' });
    }
  });
}