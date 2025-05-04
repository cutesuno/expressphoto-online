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
      time: { uk: 'Оберіть час отримання', pl: 'Wybierz godzinę odbioru' },
      submit: { uk: 'Оформити замовлення', pl: 'Złóż zamówienie' },
      sending: { uk: 'Надсилаємо...', pl: 'Wysyłanie...' },
      thanks: { uk: 'Дякуємо за замовлення!', pl: 'Dziękujemy za zamówienie!' },
      back: { uk: 'Оформити нове замовлення', pl: 'Złóż nowe zamówienie' },
      contactUs: { uk: 'Звʼяжіться з нами', pl: 'Skontaktuj się z nami' },
      company: { uk: 'Інформація про компанію', pl: 'Informacje o firmie' },
      prices: { uk: 'Прайс', pl: 'Cennik' },
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
      <button onClick={toggleLang} className="absolute top-4 right-4 text-2xl">
        {language === 'uk' ? '🇵🇱' : '🇺🇦'}
      </button>

      <button onClick={() => setShowInfo(true)} className="absolute top-4 left-4 text-sm underline">
        {t('company')}
      </button>

      <button onClick={() => setShowPrices(true)} className="absolute top-4 left-32 text-sm underline">
  🧾 {t('prices')}
</button>

      {showPrices && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white text-black p-6 rounded-xl max-w-xl w-full h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowPrices(false)}
              className="absolute top-2 right-3 text-xl"
            >✖️</button>
            <h2 className="text-xl font-bold mb-4 text-center">{t('prices')}</h2>
            <ul className="text-left space-y-1 text-sm">
              <li>Фото на документи — 20 zł</li>
              <li>Копії А4 ч/б — 0,5 zł</li>
              <li>Копії А4 кольорові — 1 zł</li>
              <li>Копії А3 ч/б — 1 zł</li>
              <li>Копії А3 кольорові — 2 zł</li>
              <li>Сканування — 1 zł</li>
              <li>Ламінування — 2–4 zł</li>
              <li>Друк фото 10x15 — 2 zł</li>
              <li>Друк фото A4 — 4 zł</li>
            </ul>
          </div>
        </motion.div>
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