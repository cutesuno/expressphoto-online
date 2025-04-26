import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile } from 'formidable';
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
    return res.status(405).json({ message: 'Метод не дозволено' });
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ message: 'Помилка парсингу форми' });
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

      const fileArray = files.file as FormidableFile[] | FormidableFile;

      const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

      if (file && file.filepath) {
        const fileStream = fs.createReadStream(file.filepath);

        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID!);
        formData.append('caption', messageText);
        formData.append('document', fileStream, file.originalFilename || 'document.jpg');

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, formData, {
          headers: formData.getHeaders(),
        });

      } else {
        // Якщо файл відсутній — просто надсилаємо текст
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
        });
      }

      return res.status(200).json({ message: 'OK' });

    } catch (error) {
      console.error('Telegram send error:', error);
      return res.status(500).json({ message: 'Помилка відправки в Telegram' });
    }
  });
}