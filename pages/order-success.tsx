// pages/order-success.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Stripe from 'stripe';
import { motion } from 'framer-motion';

export default function OrderSuccess() {
  const router = useRouter();
  const { sessionId, lang = 'uk' } = router.query;
  const [session, setSession] = useState<Stripe.Checkout.Session | null>(null);

  const t = (key: string) => {
    const dict: any = {
      success: {
        uk: 'Дякуємо за замовлення! Оплата пройшла успішно 💚',
        pl: 'Dziękujemy za zamówienie! Płatność powiodła się 💚',
      },
      back: {
        uk: 'Повернутися на головну',
        pl: 'Powrót na stronę główną',
      },
      method: {
        uk: 'Спосіб оплати:',
        pl: 'Metoda płatności:',
      },
      email: {
        uk: 'Електронна пошта:',
        pl: 'Adres e-mail:',
      },
      service: {
        uk: 'Послуга:',
        pl: 'Usługa:',
      },
    };
    return dict[key]?.[lang as string] || key;
  };

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/get-session?sessionId=${sessionId}`)
      .then((res) => res.json())
      .then((data) => setSession(data.session))
      .catch(console.error);
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-4"
      >
        {t('success')}
        <motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  className="mb-6 text-green-500"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-20 h-20 mx-auto"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
</motion.div>
      </motion.h1>

      {session && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-400 mb-6"
        >
          💳 {t('method')} {session.payment_method_types?.[0]}<br />
          📧 {t('email')} {session.customer_email}<br />
          🧾 {t('service')} {session.metadata?.service || '—'}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push(`/`)}
        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
      >
        {t('back')}
      </motion.button>
    </div>
  );
}
