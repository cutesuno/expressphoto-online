import { useState } from 'react';
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
  const [language, setLanguage] = useState<'uk' | 'pl'>('uk');

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
      email: { uk: 'Емейл або телефон', pl: 'Email lub telefon' },
      details: { uk: 'Деталі замовлення', pl: 'Szczegóły zamówienia' },
      time: { uk: '⏰ Час замовлення', pl: '⏰ Czas odbioru' },
      submit: { uk: 'Оформити замовлення', pl: 'Złóż zamówienie' },
      thanks: { uk: 'Дякуємо за замовлення!', pl: 'Dziękujemy za zamówienie!' },
      newOrder: { uk: 'Оформити нове замовлення', pl: 'Złóż nowe zamówienie' },
    };
    return dict[key]?.[language] || key;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative">
      <div className="absolute top-4 right-4">
        <button onClick={toggleLang} className="text-2xl">
          {language === 'uk' ? '🇵🇱' : '🇺🇦'}
        </button>
      </div>

      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-4xl font-bold mb-2">
        ExpressPhoto <span className="text-gray-400">Online</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-gray-300 mb-6 text-center">
        {t('intro')}
      </motion.p>

      {!confirmed ? (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} onSubmit={handleSubmit} method="POST" encType="multipart/form-data" className="flex flex-col w-full max-w-md space-y-4">
          <input name="name" placeholder={t('name')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <input name="email" placeholder={t('email')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <textarea name="details" placeholder={t('details')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <input type="time" name="time" onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <input type="file" name="file" onChange={handleFileChange} className="bg-gray-800 p-3 rounded" />
          <button type="submit" className="bg-white text-black font-bold py-2 rounded hover:bg-gray-200">
            {t('submit')}
          </button>
        </motion.form>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex flex-col items-center space-y-4 mt-6">
          <p className="text-green-400 text-xl font-semibold">{t('thanks')}</p>
          <button onClick={() => { setConfirmed(false); setForm({ name: '', email: '', details: '', time: '' }); setFile(null); }} className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200">
            {t('newOrder')}
          </button>
        </motion.div>
      )}

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-sm text-gray-500 mt-10 text-center">
        Poland, Łódź, Łagiewnicka 118B<br />
        Телефон: +48 609 860 816<br />
        Пошта: dariiaexpressphoto@gmail.com
      </motion.p>
    </div>
  );
}
