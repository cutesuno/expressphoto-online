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
      const name = fields.name?.toString() || 'Не вказано';
      const email = fields.email?.toString() || 'Не вказано';
      const details = fields.details?.toString() || 'Не вказано';

      const caption = `\ud83d\udedf\ufe0f НОВЕ ЗАМОВЛЕННЯ\n────────────\n\n\ud83d\udc64 Ім'я: ${name}\n\ud83d\udce7 Емейл або телефон: ${email}\n\ud83d\udcc5 Деталі: ${details}`;

      const file = files.file as FormidableFile;
      if (file && file.filepath) {
        const stream = fs.createReadStream(file.filepath);
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID!);
        formData.append('caption', caption);
        formData.append('document', stream, file.originalFilename || 'file');

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, formData, {
          headers: formData.getHeaders(),
        });
      } else {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: TELEGRAM_CHAT_ID,
          text: caption,
        });
      }

      res.status(200).json({ message: 'OK' });
    } catch (error) {
      console.error('Telegram error:', error);
      res.status(500).json({ message: 'Failed to send to Telegram' });
    }
  });
}
