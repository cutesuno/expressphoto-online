// pages/privacy-policy.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const [language, setLanguage] = useState<'uk' | 'pl'>('uk');

  const t = (uk: string, pl: string) => (language === 'uk' ? uk : pl);

  return (
    <motion.div
      className="min-h-screen bg-black text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {t('Політика конфіденційності', 'Polityka prywatności')}
        </h1>
        <button
          onClick={() => setLanguage(language === 'uk' ? 'pl' : 'uk')}
          className="text-2xl"
        >
          {language === 'uk' ? '🇵🇱' : '🇺🇦'}
        </button>
      </div>

      <div className="space-y-4 text-gray-300 text-sm max-w-3xl">
        <p>
          {t(
            'Ми зобовʼязуємось захищати вашу особисту інформацію. Дані, які ви надаєте через цю платформу, використовуються виключно для обробки замовлень і не передаються третім особам.',
            'Zobowiązujemy się chronić Twoje dane osobowe. Informacje przekazane za pośrednictwem tej platformy są wykorzystywane wyłącznie do realizacji zamówień i nie są udostępniane osobom trzecim.'
          )}
        </p>
        <p>
          {t(
            'Ви маєте право звернутися до нас, щоб переглянути, змінити або видалити ваші дані.',
            'Masz prawo skontaktować się z nami w celu przeglądu, zmiany lub usunięcia swoich danych.'
          )}
        </p>
        <p>
          {t(
            'Для будь-яких питань звертайтесь за адресою: dariiaexpressphoto@gmail.com.',
            'W razie pytań prosimy o kontakt: dariiaexpressphoto@gmail.com.'
          )}
        </p>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="bg-white text-black font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition"
        >
          {t('Повернутись на головну', 'Powrót na stronę główną')}
        </Link>
      </div>
    </motion.div>
  );
}
