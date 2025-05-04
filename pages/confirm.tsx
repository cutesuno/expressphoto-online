// pages/confirm.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ConfirmPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const router = useRouter();

  useEffect(() => {
    const checkPayment = async () => {
      const order = sessionStorage.getItem('order');
      if (!order) return setStatus('failed');

      try {
        const res = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: order,
        });
        const result = await res.json();

        if (result?.success) {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (err) {
        setStatus('failed');
      } finally {
        setLoading(false);
        sessionStorage.removeItem('order');
      }
    };

    checkPayment();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      {loading && <p>⏳ Перевіряємо оплату...</p>}
      {status === 'success' && <p className="text-green-400 text-xl">✅ Оплата пройшла! Замовлення підтверджено.</p>}
      {status === 'failed' && <p className="text-red-400 text-xl">❌ Не вдалося підтвердити оплату.</p>}
    </div>
  );
}
