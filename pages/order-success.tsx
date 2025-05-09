// pages/order-success.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Stripe from 'stripe';

export default function OrderSuccess() {
  const router = useRouter();
  const { sessionId, lang = 'uk' } = router.query as {
    sessionId?: string;
    lang?: 'uk' | 'pl';
  };

  const [session, setSession] = useState<Stripe.Checkout.Session | null>(null);

  const t = (key: string) => {
    const dict: Record<string, Record<'uk' | 'pl', string>> = {
      success: {
        uk: 'Дякуємо за замовлення! Оплата пройшла успішно 💚',
        pl: 'Dziękujemy za zamówienie! Płatność powiodła się 💚',
      },
      back: {
        uk: 'Повернутися на головну',
        pl: 'Powrót na stronę główną',
      },
    };
    return dict[key]?.[lang || 'uk'] || key;
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
      <h1 className="text-2xl font-bold mb-4">{t('success')}</h1>
      {session ? (
        <p className="text-sm text-gray-400 mb-6">
          🧾 ID: {session.id}<br />
          💳 {session.payment_method_types?.[0]}<br />
          📧 {session.customer_email}
        </p>
      ) : (
        <p className="text-sm text-gray-400 mb-6">Loading session details...</p>
      )}
      <button
        onClick={() => router.push('/')}
        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
      >
        {t('back')}
      </button>
    </div>
  );
}