import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const bb = require('busboy')({ headers: req.headers });

  let formData: { [key: string]: any } = {};
  let fileBuffer: Buffer | null = null;
  let fileName: string = '';
  let mimeType: string = '';

  bb.on('file', (name: string, file: Readable, info: { filename: string, mimeType: string }) => {
    fileName = info.filename;
    mimeType = info.mimeType;

    fileBuffer = Buffer.alloc(0);
    file.on('data', (data: Buffer) => {
      fileBuffer = Buffer.concat([fileBuffer as Buffer, data]);
    });
  });

  bb.on('field', (name: string, value: string) => {
    formData[name] = value;
  });

  bb.on('close', async () => {
    try {
      const textMessage = `✨ <b>НОВЕ ЗАМОВЛЕННЯ</b>\n\n` +
        `👤 <b>Ім'я:</b> ${formData.name}\n` +
        `📧 <b>Email/Телефон:</b> ${formData.email}\n` +
        `📄 <b>Деталі:</b> ${formData.details}\n` +
        `🕒 <b>Час:</b> ${formData.time}`;

      if (fileBuffer) {
        const fileData = {
          chat_id: TELEGRAM_CHAT_ID,
          caption: textMessage,
          parse_mode: 'HTML',
        };

        const formToSend = new FormData();
        formToSend.append(
          mimeType.startsWith('image/') ? 'photo' : 'document',
          new Blob([fileBuffer], { type: mimeType }),
          fileName
        );

        for (const [key, value] of Object.entries(fileData)) {
          formToSend.append(key, value);
        }

        const method = mimeType.startsWith('image/') ? 'sendPhoto' : 'sendDocument';

        await axios.post(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`,
          formToSend,
          {
            headers: formToSend.getHeaders ? formToSend.getHeaders() : { 'Content-Type': 'multipart/form-data' },
          }
        );
      } else {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: TELEGRAM_CHAT_ID,
          text: textMessage,
          parse_mode: 'HTML',
        });
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Telegram API error:', error);
      res.status(500).json({ success: false });
    }
  });

  req.pipe(bb);
}
