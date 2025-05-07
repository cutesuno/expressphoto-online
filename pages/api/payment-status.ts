// ✅ /pages/api/payment-status.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';

const TEMP_DIR = path.join(process.cwd(), 'tmp');
const ORDERS_PATH = path.join(TEMP_DIR, 'orders.json');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    merchantId,
    posId,
    sessionId,
    amount,
    currency,
    orderId,
    sign,
  } = req.body;

  const crc = process.env.P24_CRC || '';
  const dataToSign = `${sessionId}|${orderId}|${amount}|${currency}|${crc}`;
  const expectedSign = crypto.createHash('sha384').update(dataToSign).digest('hex');

  if (expectedSign !== sign) {
    console.error('❌ Invalid signature');
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (!fs.existsSync(ORDERS_PATH)) return res.status(404).json({ error: 'Orders file not found' });
  const orders = JSON.parse(fs.readFileSync(ORDERS_PATH, 'utf-8'));
  const order = orders[sessionId];

  if (!order) return res.status(404).json({ error: 'Order not found' });

  const {
    name,
    email,
    details,
    time,
    service,
    quantity,
    total,
    filePath,
    originalFilename,
  } = order;

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  const caption = `✅ ОПЛАЧЕНЕ ЗАМОВЛЕННЯ\n👤 Імʼя: ${name}\n📧 Email: ${email}\n📝 Деталі: ${details}\n⏰ Час: ${time}\n📦 Послуга: ${service}\n📄 Кількість: ${quantity}\n💰 Сума: ${total} zł`;

  const formData = new FormData();
  formData.append('chat_id', TELEGRAM_CHAT_ID);
  formData.append('caption', caption);
  formData.append('document', fs.createReadStream(filePath), {
    filename: originalFilename || 'file',
  });

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, formData, {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity, // на всякий випадок для великих файлів
    });
  } catch (error: any) {
    console.error('Telegram error:', error?.response?.data || error);
    return res.status(500).json({ error: 'Telegram failed' });
  }

  fs.unlinkSync(filePath);
  delete orders[sessionId];
  fs.writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2));

  return res.status(200).json({ status: 'OK' });
}