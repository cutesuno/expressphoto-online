import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';

// Зберігаємо тимчасово файл у /tmp
const upload = multer({ dest: '/tmp' });

export const config = {
  api: {
    bodyParser: false,
  },
};

function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, upload.single('file'));

  const { name, email, details } = (req as any).body;
  const file = (req as any).file;

  console.log('🧾 BODY:', name, email, details);
  console.log('📎 FILE:', file);

  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const chatId = process.env.TELEGRAM_CHAT_ID!;

  try {
    // Надсилаємо текст
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: `📸 НОВЕ ЗАМОВЛЕННЯ\n👤 ${name}\n📧 ${email}\n📝 ${details}`,
    });

    // Якщо є файл — шлемо файл
    if (file) {
      const form = new FormData();
      form.append('chat_id', chatId);
      form.append('document', fs.createReadStream(file.path), {
        filename: file.originalname,
      });

      await axios.post(`https://api.telegram.org/bot${token}/sendDocument`, form, {
        headers: form.getHeaders(),
      });

      // Видаляємо файл
      fs.unlinkSync(file.path);
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('💥 Telegram error:', error);
    res.status(500).json({ error: 'Щось пішло не так' });
  }
}