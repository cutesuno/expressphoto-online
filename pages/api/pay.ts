import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { amount, email } = req.query;

  if (!amount || !email) {
    return res.status(400).json({ error: 'Missing amount or email' });
  }

  try {
    const body = {
      merchantId: process.env.PRZELEWY_MERCHANT_ID,
      posId: process.env.PRZELEWY_POS_ID,
      sessionId: Date.now().toString(),
      amount: Math.round(parseFloat(amount as string) * 100),
      currency: 'PLN',
      description: 'Оплата за послугу ExpressPhoto',
      email: email as string,
      country: 'PL',
      urlReturn: `${process.env.BASE_URL}/success`,
      urlStatus: `${process.env.BASE_URL}/api/payment-status`,
      encoding: 'UTF-8',
      language: 'pl',
    };

    return res.status(200).json({
      message: 'Симуляція: редірект на оплату',
      paymentData: body,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Payment creation failed' });
  }
}