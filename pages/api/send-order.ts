import nextConnect from 'next-connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import fs from 'fs';
import FormData from 'form-data';

const upload = multer({ dest: '/tmp' });

const apiRoute = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error(error);
    res.status(501).json({ error: `Щось пішло не так` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Метод ${req.method} не дозволено` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post(async (req: any, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;
  
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: `🐞 DEBUG:\n\nBODY: ${JSON.stringify(req.body)}\n\nFILE: ${req.file ? req.file.originalname : '❌ no file'}`
    }),
  });

  const name = req.body.name || '—';
  const email = req.body.email || '—';
  const details = req.body.details || '—';

  const text = `📸 НОВЕ ЗАМОВЛЕННЯ\n\n👤 ${name}\n📧 ${email}\n📝 ${details}`;

  // Надсилаємо текст
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text }),
  });

  // Надсилаємо файл (якщо є)
  if (req.file) {
    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('document', fs.createReadStream(req.file.path), req.file.originalname);

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: formData as any,
    });
  }

  res.status(200).json({ success: true });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};