import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PriceModal from '../components/PriceModal';
import OrderForm from '../components/OrderForm';
import CompanyInfoModal from '../components/CompanyInfoModal';
import Link from 'next/link';
import OrderConfirmation from '../components/OrderConfirmation';
import ConfirmModal from '../components/ConfirmModal';

export default function Home() {
  const [language, setLanguage] = useState<'uk' | 'pl'>('uk');
  const [showInfo, setShowInfo] = useState(false);
  const [showPrices, setShowPrices] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggleLang = () => setLanguage(language === 'uk' ? 'pl' : 'uk');

  const handleFakeSubmit = () => {
    setShowConfirm(true);
  };

  const t = (key: string) => {
    const dict: any = {
      intro: {
        uk: 'Онлайн-друк, фото на документи, ксерокопії та більше',
        pl: 'Druk online, zdjęcia do dokumentów, kserokopie i więcej',
      },
      contactUs: {
        uk: 'Звʼяжіться з нами',
        pl: 'Skontaktuj się z nami',
      },
      company: { uk: 'Інформація про компанію', pl: 'Informacje o firmie' },
      prices: { uk: 'Прайс', pl: 'Cennik' },
      address: { uk: 'Poland, Łódź, Łagiewnicka 118B', pl: 'Polska, Łódź, Łagiewnicka 118B' },
      phone: { uk: 'Телефон: +48 609 860 816', pl: 'Telefon: +48 609 860 816' },
      emailCompany: { uk: 'Пошта: dariiaexpressphoto@gmail.com', pl: 'Email: dariiaexpressphoto@gmail.com' },
    };
    return dict[key]?.[language] || key;
  };

  return isLoading ? (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-black text-white text-3xl font-bold"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      Welcome to EXPRESS PHOTO ONLINE
    </motion.div>
  ) : (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative">
      <button onClick={toggleLang} className="absolute top-4 right-4 text-2xl">
        {language === 'uk' ? '🇵🇱' : '🇺🇦'}
      </button>

      <div className="absolute top-4 left-4 flex gap-4">
        <button onClick={() => setShowInfo(true)} className="text-sm underline">
          {t('company')}
        </button>
        <button onClick={() => setShowPrices(true)} className="text-sm underline">
          {t('prices')}
        </button>
      </div>

      {showInfo && <CompanyInfoModal language={language} onClose={() => setShowInfo(false)} />}
      {showPrices && <PriceModal language={language} onClose={() => setShowPrices(false)} />}

      <motion.h1
        className="text-4xl font-bold mb-2 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ExpressPhoto <span className="text-gray-400">Online</span>
      </motion.h1>

      <motion.p
        className="text-gray-300 mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {t('intro')}
      </motion.p>

      <OrderForm language={language} />

      <button
        onClick={handleFakeSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition mt-6"
      >
        Відправити замовлення
      </button>
      
      {showConfirm && <ConfirmModal onClose={() => setShowConfirm(false)} />}

      {showConfirm && <OrderConfirmation onClose={() => setShowConfirm(false)} />}

      <p className="text-sm text-gray-500 mt-10 text-center">
        {t('address')}<br />
        {t('phone')}<br />
        {t('emailCompany')}<br />
        {language === 'uk'
          ? 'Графік роботи: Пн–Пт 9:00–17:00, Сб 10:00–13:00, Нд – вихідний'
          : 'Godziny pracy: Pon–Pt 9:00–17:00, Sob 10:00–13:00, Niedz – nieczynne'}
      </p>

      <Link href="/privacy-policy" className="text-sm underline block text-blue-400 hover:text-blue-300 text-center mt-4">
        {language === 'uk' ? 'Політика конфіденційності' : 'Polityka prywatności'}
      </Link>

      <Link href="/rules" className="text-sm underline block text-blue-400 hover:text-blue-300 text-center mt-2">
        {language === 'uk' ? 'Правила магазину' : 'Regulamin sklepu'}
      </Link>

      <a
        href="mailto:dariiaexpressphoto@gmail.com"
        className="fixed bottom-6 right-6 bg-white text-black font-semibold px-4 py-2 rounded-full shadow-lg border border-gray-300 hover:bg-gray-100 transition-all z-50 flex items-center gap-2 text-sm sm:text-base"
      >
        ✉️ {t('contactUs')}
      </a>
    </div>
  );
}