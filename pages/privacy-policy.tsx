// pages/privacy-policy.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const [language, setLanguage] = useState<'uk' | 'pl'>('uk'); // Стан для мови
  
  // Функція для перемикання мови
  const toggleLanguage = () => {
    setLanguage(language === 'uk' ? 'pl' : 'uk');
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Кнопка перемикання мови */}
        <button 
          onClick={toggleLanguage}
          className="absolute top-6 right-6 text-xl text-blue-400"
        >
          {language === 'uk' ? 'PL' : 'UA'}
        </button>

        <h1 className="text-3xl font-bold text-center">
          {language === 'uk' ? 'Політика конфіденційності' : 'Polityka prywatności'}
        </h1>

        <p>
          {language === 'uk' 
            ? 'Ваша конфіденційність важлива для нас. Ця політика пояснює, яку інформацію ми збираємо, як ми її використовуємо та як ми її захищаємо.'
            : 'Twoja prywatność jest dla nas ważna. Niniejsza polityka wyjaśnia, jakie informacje zbieramy, jak je wykorzystujemy i jak je chronimy.'
          }
        </p>

        <h2 className="text-xl font-semibold">
          {language === 'uk' ? '1. Збір інформації' : '1. Zbieranie informacji'}
        </h2>
        <p>
          {language === 'uk'
            ? 'Ми збираємо особисту інформацію, таку як імʼя, контактні дані та деталі замовлення, виключно з метою обробки замовлень.'
            : 'Zbieramy informacje osobiste, takie jak imię, dane kontaktowe i szczegóły zamówienia, w tym metodę przetwarzania zamówienia.'
          }
        </p>

        <h2 className="text-xl font-semibold">
          {language === 'uk' ? '2. Використання інформації' : '2. Wykorzystanie informacji'}
        </h2>
        <p>
          {language === 'uk'
            ? 'Ваші дані використовуються лише для надання послуг та звʼязку з вами. Ми не передаємо ваші дані третім особам без вашої згоди.'
            : 'Twoje dane są wykorzystywane tylko do świadczenia usług i kontaktu z tobą. Nie przekazujemy twoich danych osobom trzecim bez twojej zgody.'
          }
        </p>

        <h2 className="text-xl font-semibold">
          {language === 'uk' ? '3. Безпека' : '3. Bezpieczeństwo'}
        </h2>
        <p>
          {language === 'uk'
            ? 'Ми вживаємо належні заходи для захисту вашої інформації від несанкціонованого доступу або розголошення.'
            : 'Podejmujemy odpowiednie kroki, aby chronić Twoje dane przed nieautoryzowanym dostępem lub ujawnieniem.'
          }
        </p>

        <h2 className="text-xl font-semibold">
          {language === 'uk' ? '4. Файли cookie' : '4. Pliki cookie'}
        </h2>
        <p>
          {language === 'uk'
            ? 'Наш сайт може використовувати файли cookie для покращення зручності користування.'
            : 'Nasza strona może używać plików cookie w celu ulepszenia wygody użytkowania.'
          }
        </p>

        <h2 className="text-xl font-semibold">
          {language === 'uk' ? '5. Зміни до політики' : '5. Zmiany w polityce'}
        </h2>
        <p>
          {language === 'uk'
            ? 'Ми можемо оновлювати цю політику час від часу. Усі зміни будуть публікуватися на цій сторінці.'
            : 'Możemy aktualizować tę politykę od czasu do czasu. Wszystkie zmiany będą publikowane na tej stronie.'
          }
        </p>

        <p className="text-sm text-gray-400">
          Останнє оновлення: 4 травня 2025 р.
        </p>

        <Link href="/" className="text-blue-400 underline">
          {language === 'uk' ? 'Назад на головну' : 'Powróć do strony głównej'}
        </Link>
      </div>
    </motion.div>
  );
}