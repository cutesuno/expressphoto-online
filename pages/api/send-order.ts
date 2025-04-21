import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs';
import FormData from 'form-data';

const upload = multer({ dest: '/tmp' });

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Метод ${req.method} не дозволено` });
  }

  await runMiddleware(req, res, upload.single('file'));

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

  const name = req.body?.name || 'undefined';
  const email = req.body?.email || 'undefined';
  const details = req.body?.details || 'undefined';

  const text = `📸 НОВЕ ЗАМОВЛЕННЯ\n\n👤 ${name}\n📧 ${email}\n📝 ${details}`;

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
    }),
  });

  if (file) {
    formData.append('file', file);
  }
    const fileStream = fs.createReadStream(req.file.path);
    const form = new FormData();
    form.append('chat_id', TELEGRAM_CHAT_ID);
    form.append('document', fileStream, req.file.originalname);

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: form as any,
    });
  }

  res.status(200).json({ success: true });
}
