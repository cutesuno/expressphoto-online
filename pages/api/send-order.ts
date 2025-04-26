import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile } from 'formidable';
import fs from 'fs/promises'; // тут важливо використовувати промісову версію
import FormData from 'form-data';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не дозволено' });
  }

  const form = formidable({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ message: 'Form parsing error' });
    }

    try {
      const name = fields.name?.toString() || 'Не вказано';
      const email = fields.email?.toString() || 'Не вказано';
      const details = fields.details?.toString() || 'Не вказано';
      const time = fields.time?.toString() || 'Не вказано';

      const caption = `
📸 НОВЕ ЗАМОВЛЕННЯ
👤 Ім'я: ${name}
📧 Email/Телефон: ${email}
📝 Деталі: ${details}
⏰ Час замовлення: ${time}
      `;

      const file = files.file as FormidableFile;

      if (file && file.filepath) {
        const fileBuffer = await fs.readFile(file.filepath); // читаємо файл як Buffer

        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID!);
        formData.append('caption', caption);
        formData.append('document', fileBuffer, {
          filename: file.originalFilename || 'file',
        });

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, formData, {
          headers: formData.getHeaders(),
        });

        return res.status(200).json({ message: 'Файл і текст відправлено' });
      } else {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: TELEGRAM_CHAT_ID,
          text: caption,
        });

        return res.status(200).json({ message: 'Тільки текст відправлено' });
      }
    } catch (error) {
      console.error('Telegram error:', error);
      return res.status(500).json({ message: 'Telegram send error' });
    }
  });
}