import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    details: '',
    time: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [sending, setSending] = useState(false);
  const [language, setLanguage] = useState<'uk' | 'pl'>('uk');
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const message = `
📸 НОВЕ ЗАМОВЛЕННЯ
👤 Ім'я: ${form.name}
📧 Email або Телефон: ${form.email}
📝 Деталі: ${form.details}
⏰ Час замовлення: ${form.time}
    `;

    try {
      const formData = new FormData();
      formData.append('chat_id', process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID!);

      if (file) {
        formData.append('document', file);
        formData.append('caption', message);
        await fetch(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/sendDocument`, {
          method: 'POST',
          body: formData,
        });
      } else {
        await fetch(`https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID,
            text: message,
          }),
        });
      }

      setConfirmed(true);
      setForm({ name: '', email: '', details: '', time: '' });
      setFile(null);
    } catch (error) {
      console.error('Помилка надсилання:', error);
    } finally {
      setSending(false);
    }
  };

  const toggleLang = () => setLanguage(language === 'uk' ? 'pl' : 'uk');

  const t = (key: string) => {
    const dict: any = {
      intro: {
        uk: 'Онлайн-друк, фото на документи, ксерокопії та більше',
        pl: 'Druk online, zdjęcia do dokumentów, kserokopie i więcej',
      },
      name: { uk: "Ваше ім'я", pl: 'Imię' },
      email: { uk: 'Емейл або телефон', pl: 'Email lub telefon' },
      details: { uk: 'Деталі замовлення', pl: 'Szczegóły zamówienia' },
      time: { uk: 'Час замовлення', pl: 'Godzina odbioru' },
      submit: { uk: 'Оформити замовлення', pl: 'Złóż zamówienie' },
      sending: { uk: 'Надсилаємо...', pl: 'Wysyłanie...' },
      thanks: { uk: 'Дякуємо за замовлення!', pl: 'Dziękujemy za zamówienie!' },
      back: { uk: 'Оформити нове замовлення', pl: 'Złóż nowe zamówienie' },
      company: { uk: 'Інформація про компанію', pl: 'Informacje o firmie' },
      address: { uk: 'Poland, Łódź, Łagiewnicka 118B', pl: 'Polska, Łódź, Łagiewnicka 118B' },
      phone: { uk: 'Телефон: +48 609 860 816', pl: 'Telefon: +48 609 860 816' },
      emailCompany: { uk: 'Пошта: dariiaexpressphoto@gmail.com', pl: 'Email: dariiaexpressphoto@gmail.com' },
    };
    return dict[key]?.[language] || key;
  };

  if (isLoading) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl font-bold" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1 }}>
        Welcome to EXPRESS PHOTO ONLINE
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative">
      <button onClick={toggleLang} className="absolute top-4 right-4 text-2xl">
        {language === 'uk' ? '🇵🇱' : '🇺🇦'}
      </button>

      <motion.h1 className="text-4xl font-bold mb-2" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        ExpressPhoto <span className="text-gray-400">Online</span>
      </motion.h1>

      <motion.p className="text-gray-300 mb-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {t('intro')}
      </motion.p>

      {!confirmed ? (
        <motion.form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <input name="name" placeholder={t('name')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <input name="email" type="text" placeholder={t('email')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <textarea name="details" placeholder={t('details')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <input name="time" type="time" onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <input type="file" name="file" onChange={handleFileChange} className="bg-gray-800 p-3 rounded" />

          <button type="submit" className="bg-white text-black font-bold py-2 rounded hover:bg-gray-200">
            {sending ? t('sending') : t('submit')}
          </button>
        </motion.form>
      ) : (
        <motion.div className="text-green-400 text-xl font-semibold mt-4 flex flex-col items-center space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p>{t('thanks')}</p>
          <button onClick={() => setConfirmed(false)} className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200">
            {t('back')}
          </button>
        </motion.div>
      )}

      <p className="text-sm text-gray-500 mt-10 text-center">
        {t('address')}<br />
        {t('phone')}<br />
        {t('emailCompany')}
      </p>
    </div>
  );
}
