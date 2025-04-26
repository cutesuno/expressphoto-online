import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import TelegramBot from 'node-telegram-bot-api';

export const config = {
  api: {
    bodyParser: false,
  },
};

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false });
const chatId = process.env.TELEGRAM_CHAT_ID!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не дозволений' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Помилка обробки форми' });
    }

    const name = fields.name as string || 'Не вказано';
    const email = fields.email as string || 'Не вказано';
    const details = fields.details as string || 'Не вказано';
    const time = fields.time as string || 'Не вказано';

    const caption = `✨ НОВЕ ЗАМОВЛЕННЯ
👤 Iм'я: ${name}
📧 Email/Телефон: ${email}
📄 Деталі: ${details}
⏰ Час: ${time}`;

    try {
      const file = files.file as formidable.File;

      if (file && file.filepath) {
        const fileStream = fs.createReadStream(file.filepath);

        await bot.sendDocument(chatId, fileStream, {}, { filename: file.originalFilename || 'file', contentType: file.mimetype || undefined });
        await bot.sendMessage(chatId, caption);
      } else {
        await bot.sendMessage(chatId, caption);
      }

      res.status(200).json({ message: 'Замовлення надіслано успішно' });
    } catch (error) {
      console.error('Помилка надсилання в Telegram:', error);
      res.status(500).json({ message: 'Помилка надсилання в Telegram' });
    }
  });
}
