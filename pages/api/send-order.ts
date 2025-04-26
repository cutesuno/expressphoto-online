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

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

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
      const name = fields.name?.toString() || 'undefined';
      const email = fields.email?.toString() || 'undefined';
      const details = fields.details?.toString() || 'undefined';
      const time = fields.time?.toString() || 'undefined';

      const message = `
📸 НОВЕ ЗАМОВЛЕННЯ
👤 Ім'я: ${name}
📧 Email/Телефон: ${email}
📝 Деталі: ${details}
⏰ Час замовлення: ${time}
`;

      const file = (files.file as FormidableFile[])[0];

      console.log('FILES:', files);
      console.log('FILE object:', file);

      const formData = new FormData();
      formData.append('chat_id', TELEGRAM_CHAT_ID);
      formData.append('caption', message.trim());

      if (file && file.filepath) {
        const stream = fs.createReadStream(file.filepath);
        formData.append('document', stream, file.originalFilename || 'file');

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, formData, {
          headers: formData.getHeaders(),
        });

        console.log('Файл і текст надіслані!');
      } else {
        // Якщо файлу немає — просто надсилаємо текст
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        });

        console.log('Тільки текст надісланий!');
      }

      res.status(200).json({ message: 'OK' });
    } catch (error) {
      console.error('Telegram error:', error);
      res.status(500).json({ message: 'Failed to send to Telegram' });
    }
  });
}