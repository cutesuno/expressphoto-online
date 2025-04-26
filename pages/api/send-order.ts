// /pages/api/send-order.ts

import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile } from 'formidable';
import fs from 'fs';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ message: 'Form parsing error' });
    }

    const name = fields.name || '';
    const email = fields.email || '';
    const details = fields.details || '';
    const time = fields.time || '';

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({ message: 'Bot token or chat ID missing' });
    }

    const textMessage = `📸 *НОВЕ ЗАМОВЛЕННЯ*

👤 *Ім'я:* ${name}
📧 *Email/Телефон:* ${email}
🖋️ *Деталі:* ${details}
⏰ *Час:* ${time}`;

    try {
      const file = files.file && Array.isArray(files.file) ? files.file[0] : files.file as FormidableFile;

      if (file && file.filepath && fs.existsSync(file.filepath)) {
        const stream = fs.createReadStream(file.filepath);
        const formData = new FormData();

        formData.append('chat_id', chatId);
        formData.append('caption', textMessage);
        formData.append('parse_mode', 'Markdown');
        formData.append('document', stream, {
          filename: file.originalFilename || 'file',
          contentType: file.mimetype || 'application/octet-stream',
        });

        await axios.post(`https://api.telegram.org/bot${botToken}/sendDocument`, formData, {
          headers: formData.getHeaders(),
        });
      } else {
        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          chat_id: chatId,
          text: textMessage,
          parse_mode: 'Markdown',
        });
      }

      res.status(200).json({ message: 'Order sent successfully' });
    } catch (error) {
      console.error('Sending error:', error);
      res.status(500).json({ message: 'Failed to send order' });
    }
  });
}