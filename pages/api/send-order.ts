import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ message: 'Form Parse Error' });
    }

    const textMessage = `
📸 НОВЕ ЗАМОВЛЕННЯ
👤 Ім'я: ${fields.name}
📧 Email/Телефон: ${fields.email}
📝 Деталі: ${fields.details}
🕘 Час: ${fields.time}
    `;

    try {
      if (files.file) {
        const fileData = fs.readFileSync((files.file as formidable.File).filepath);

        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        formData.append('caption', textMessage);
        formData.append('document', new Blob([fileData]), (files.file as formidable.File).originalFilename);

        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, formData, {
          headers: formData.getHeaders(),
        });
      } else {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: TELEGRAM_CHAT_ID,
          text: textMessage,
        });
      }

      return res.status(200).json({ message: 'Order sent successfully' });
    } catch (error) {
      console.error('Telegram send error:', error);
      return res.status(500).json({ message: 'Failed to send order' });
    }
  });
}