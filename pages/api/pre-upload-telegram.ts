import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: { bodyParser: false },
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_IDS = process.env.TELEGRAM_CHAT_IDS!.split(',');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const form = formidable({ keepExtensions: true });

  const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const { name, email, service, quantity, details } = fields;
  const file = files.file as formidable.File;

  const caption = `
📝 *Нове замовлення до оплати*  
👤 Ім’я: ${name}  
📧 Email: ${email}  
📦 Послуга: ${service} – ${quantity}x  
🗒 Деталі: ${details || '—'}  
⚠️ Статус: *ще не оплачено*
`.trim();

  for (const chatId of TELEGRAM_CHAT_IDS) {
    const tgForm = new FormData();
    tgForm.append('chat_id', chatId);
    tgForm.append('caption', caption);
    tgForm.append('parse_mode', 'Markdown');
    tgForm.append('document', fs.createReadStream(file.filepath), file.originalFilename);

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: tgForm as any,
    });
  }

  return res.status(200).json({ ok: true });
}