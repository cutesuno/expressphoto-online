import PriceModal from '../components/PriceModal';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    details: '',
    time: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [language, setLanguage] = useState<'uk' | 'pl'>('uk');
  const [showInfo, setShowInfo] = useState(false);
  const [showPrices, setShowPrices] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('details', form.details);
    formData.append('time', form.time);
    if (file) formData.append('file', file);

    await fetch('/api/send-order', {
      method: 'POST',
      body: formData,
    });

    setIsSending(false);
    setConfirmed(true);
  };

  const toggleLang = () => setLanguage(language === 'uk' ? 'pl' : 'uk');

  const t = (key: string) => {
    const dict: any = {
      intro: {
        uk: 'Онлайн-друк, фото на документи, ксерокопії та більше',
        pl: 'Druk online, zdjęcia do dokumentów, kserokopie i więcej',
      },
      name: { uk: "Ваше ім'я", pl: 'Imię' },
      email: { uk: "Емейл або телефон", pl: 'Email lub telefon' },
      details: { uk: 'Деталі замовлення', pl: 'Szczegóły zamówienia' },
      time: { 
        uk: 'Оберіть час отримання', 
        pl: 'Wybierz godzinę odbioru' 
      },
      submit: { uk: 'Оформити замовлення', pl: 'Złóż zamówienie' },
      sending: { uk: 'Надсилаємо...', pl: 'Wysyłanie...' },
      thanks: { uk: 'Дякуємо за замовлення!', pl: 'Dziękujemy za zamówienie!' },
      back: { uk: 'Оформити нове замовлення', pl: 'Złóż nowe zamówienie' },
      contactUs: {
        uk: 'Звʼяжіться з нами',
        pl: 'Skontaktuj się z nami',
      },
      company: { uk: 'Інформація про компанію', pl: 'Informacje o firmie' },
      address: { uk: 'Poland, Łódź, Łagiewnicka 118B', pl: 'Polska, Łódź, Łagiewnicka 118B' },
      phone: { uk: 'Телефон: +48 609 860 816', pl: 'Telefon: +48 609 860 816' },
      emailCompany: { uk: 'Пошта: dariiaexpressphoto@gmail.com', pl: 'Email: dariiaexpressphoto@gmail.com' },
    };
    return dict[key]?.[language] || key;
  };

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-black text-white text-3xl font-bold"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to EXPRESS PHOTO ONLINE
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative">
      <button
        onClick={toggleLang}
        className="absolute top-4 right-4 text-2xl"
      >
        {language === 'uk' ? '🇵🇱' : '🇺🇦'}
      </button>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
  <button
    onClick={() => setShowPrices(true)}
    className="bg-white text-black font-semibold px-4 py-2 rounded-full shadow-md border border-gray-300 hover:bg-gray-100 transition-all flex items-center gap-2 text-sm sm:text-base"
  >
    📋 {t('prices')}
  </button>
</div>

      <button
        onClick={() => setShowInfo(true)}
        className="absolute top-4 left-4 text-sm underline"
      >
        {t('company')}
      </button>

      {showInfo && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-center p-6 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white text-black p-6 rounded-xl max-w-md w-full relative space-y-4">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-2 right-3 text-xl"
            >
              ✖️
            </button>

            {language === 'uk' ? (
              <>
                <h2 className="text-xl font-bold mb-4">ExpressPhoto Online</h2>
                <h3 className="font-semibold">Опис послуг:</h3>
                <ul className="list-disc pl-5 text-left space-y-1">
                  <li>Фотосесії (портретні, вагітність, народження, групові фото)</li>
                  <li>Весільні та заручальні фотосесії</li>
                  <li>Відновлення та ретуш фотографій</li>
                  <li>Ксерокопії ч/б та кольорові (A3, A4)</li>
                  <li>Ламінування документів</li>
                  <li>Сканування документів</li>
                  <li>Друк фотографій та документів</li>
                </ul>
                <h3 className="font-semibold mt-4">Контакти:</h3>
                <p>{t('phone')}</p>
                <p>{t('emailCompany')}</p>
                <p>{t('address')}</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">ExpressPhoto Online</h2>
                <h3 className="font-semibold">Opis usług:</h3>
                <ul className="list-disc pl-5 text-left space-y-1">
                  <li>Sesje zdjęciowe (portretowe, ciążowe, narodzinowe, grupowe)</li>
                  <li>Sesje ślubne i zaręczynowe</li>
                  <li>Renowacja i retusz fotografii</li>
                  <li>Kserokopie czarno-białe i kolorowe (A3, A4)</li>
                  <li>Laminowanie dokumentów</li>
                  <li>Skanowanie dokumentów</li>
                  <li>Drukowanie zdjęć i dokumentów</li>
                </ul>
                <h3 className="font-semibold mt-4">Kontakt:</h3>
                <p>{t('phone')}</p>
                <p>{t('emailCompany')}</p>
                <p>{t('address')}</p>
              </>
            )}
          </div>
        </motion.div>
      )}

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

      {!confirmed ? (
        <motion.form
          onSubmit={handleSubmit}
          method="POST"
          encType="multipart/form-data"
          className="flex flex-col w-full max-w-md space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <input name="name" placeholder={t('name')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <input name="email" type="text" placeholder={t('email')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <textarea name="details" placeholder={t('details')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <label className="text-sm text-gray-400">{t('time')}</label>
<input
  name="time"
  type="time"
  onChange={handleChange}
  className="bg-gray-800 p-3 rounded"
  required
/>
          <input type="file" name="file" onChange={handleFileChange} className="bg-gray-800 p-3 rounded" />
          <button type="submit" disabled={isSending} className="bg-white text-black font-bold py-2 rounded hover:bg-gray-200">
            {isSending ? t('sending') : t('submit')}
          </button>
        </motion.form>
      ) : (
        <motion.div
          className="text-green-400 text-xl font-semibold mt-4 flex flex-col items-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>{t('thanks')}</p>
          <button
            onClick={() => {
              setConfirmed(false);
              setForm({ name: '', email: '', details: '', time: '' });
              setFile(null);
            }}
            className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200"
          >
            {t('back')}
          </button>
        </motion.div>
      )}

{showPrices && (
  <PriceModal language={language} onClose={() => setShowPrices(false)} />
)}
<p className="text-sm text-gray-500 mt-10 text-center">
  {t('address')}<br />
  {t('phone')}<br />
  {t('emailCompany')}<br />
  {
    language === 'uk'
      ? 'Графік роботи: Пн–Пт 9:00–17:00, Сб 10:00–13:00, Нд – вихідний'
      : 'Godziny pracy: Pon–Pt 9:00–17:00, Sob 10:00–13:00, Niedz – nieczynne'
  }
</p>
<a
  href="mailto:dariiaexpressphoto@gmail.com"
  className="fixed bottom-6 right-6 bg-white text-black font-semibold px-4 py-2 rounded-full shadow-lg border border-gray-300 hover:bg-gray-100 transition-all z-50 flex items-center gap-2 text-sm sm:text-base"
>
  <span role="img" aria-label="mail">✉️</span> {t('contactUs')}
</a>
    </div>
  );
}