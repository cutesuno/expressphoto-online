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
      res.status(500).json({ message: 'Помилка парсингу форми' });
      return;
    }

    try {
      const name = fields.name?.toString() || 'Не вказано';
      const email = fields.email?.toString() || 'Не вказано';
      const details = fields.details?.toString() || 'Не вказано';
      const time = fields.time?.toString() || 'Не вказано';

      const messageText = `
📸 НОВЕ ЗАМОВЛЕННЯ
👤 Ім'я: ${name}
📧 Емейл або телефон: ${email}
📝 Деталі замовлення: ${details}
⏰ Час замовлення: ${time}
      `.trim();

      const file = files.file as FormidableFile;

      if (file && file.filepath) {
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID!);
        formData.append('caption', messageText);
        formData.append('document', fs.createReadStream(file.filepath), {
          filename: file.originalFilename || 'file',
        });

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, formData, {
          headers: formData.getHeaders(),
        });

      } else {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
        });
      }

      res.status(200).json({ message: 'OK' });

    } catch (error) {
      console.error('Telegram send error:', error);
      res.status(500).json({ message: 'Помилка відправки до Telegram' });
    }
  });
}