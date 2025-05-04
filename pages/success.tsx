import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Success() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const confirmPayment = async () => {
      const sessionId = localStorage.getItem('sessionId');
      const amount = localStorage.getItem('amount');

      if (!sessionId || !amount) {
        setStatus('error');
        return;
      }

      try {
        const res = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, amount }),
        });

        const result = await res.json();

        if (result.success) {
          // Після підтвердження оплати — відправляємо замовлення в Telegram
          const formData = JSON.parse(localStorage.getItem('order') || '{}');

          const tgForm = new FormData();
          for (const [key, value] of Object.entries(formData)) {
            tgForm.append(key, value as string);
          }

          await fetch('/api/send-order', {
            method: 'POST',
            body: tgForm,
          });

          setStatus('success');
          localStorage.removeItem('sessionId');
          localStorage.removeItem('amount');
          localStorage.removeItem('order');
        } else {
          setStatus('error');
        }
      } catch (e) {
        console.error('verify error', e);
        setStatus('error');
      }
    };

    confirmPayment();
  }, []);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {status === 'loading' && <p className="text-lg">⏳ Перевіряємо оплату...</p>}
      {status === 'success' && (
        <>
          <h1 className="text-3xl font-bold mb-4 text-green-400">✅ Оплата пройшла успішно!</h1>
          <p className="mb-6 text-lg">Ваше замовлення отримано. Дякуємо за довіру ❤️</p>
          <Link href="/" className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
            Повернутися на головну
          </Link>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 className="text-3xl font-bold mb-4 text-red-400">❌ Помилка перевірки оплати</h1>
          <p className="mb-6 text-lg">Ми не змогли підтвердити оплату. Будь ласка, зверніться в підтримку.</p>
          <Link href="/" className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
            Спробувати ще раз
          </Link>
        </>
      )}
    </motion.div>
  );
}