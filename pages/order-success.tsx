import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ModalConfirm from '../components/ModalConfirm';

export default function OrderSuccess() {
  const [show, setShow] = useState(true);
  const router = useRouter();

  const language = (router.query.lang as 'uk' | 'pl') || 'uk';
  const sessionId = router.query.sessionId as string;

  const t = (key: string) => {
    const dict: any = {
      thankYou: {
        uk: 'Дякуємо за замовлення!',
        pl: 'Dziękujemy za zamówienie!',
      },
      backHome: {
        uk: 'Повернутися на головну',
        pl: 'Powrót na stronę główną',
      },
      orderNumber: {
        uk: 'Номер замовлення:',
        pl: 'Numer zamówienia:',
      },
    };
    return dict[key]?.[language] || key;
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      {show ? (
        <ModalConfirm onClose={() => setShow(false)} />
      ) : (
        <div className="text-center space-y-4">
          <p className="text-xl">{t('thankYou')}</p>
          {sessionId && (
            <p className="text-sm text-gray-400">
              {t('orderNumber')} <span className="font-mono">{sessionId}</span>
            </p>
          )}
          <button
            onClick={() => router.push(`/?lang=${language}`)}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            {t('backHome')}
          </button>
        </div>
      )}
    </div>
  );
}