import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

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

  // Load order by sessionId
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

  const fileStream = fs.createReadStream(filePath);

  const formData = new FormData();
  formData.append('chat_id', TELEGRAM_CHAT_ID);
  formData.append('caption', caption);
  formData.append('document', fileStream, originalFilename);

  const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
    method: 'POST',
    body: formData as any,
  });

  if (!tgRes.ok) {
    console.error('Telegram error:', await tgRes.text());
    return res.status(500).json({ error: 'Telegram failed' });
  }

  // Clean up
  fs.unlinkSync(filePath);
  delete orders[sessionId];
  fs.writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2));

  return res.status(200).json({ status: 'OK' });
}