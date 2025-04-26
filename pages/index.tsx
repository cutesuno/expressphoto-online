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
  const [showModal, setShowModal] = useState(false);

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
    formData.append('details', `${form.details}\nЧас замовлення: ${form.time}`);
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
      time: { uk: 'Бажаний час отримання', pl: 'Preferowany czas odbioru' },
      submit: { uk: 'Оформити замовлення', pl: 'Złóż zamówienie' },
      thanks: { uk: 'Дякуємо за замовлення!', pl: 'Dziękujemy za zamówienie!' },
      neworder: { uk: 'Оформити нове замовлення', pl: 'Złóż nowe zamówienie' },
    };
    return dict[key]?.[language] || key;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <div className="absolute top-4 right-4 flex space-x-2">
        <button onClick={toggleLang} className="rounded-full overflow-hidden w-10 h-6 flex items-center border border-gray-600">
          {language === 'uk' ? (
            <img src="/ua-flag.png" alt="UA" className="w-full h-full object-cover" />
          ) : (
            <img src="/pl-flag.png" alt="PL" className="w-full h-full object-cover" />
          )}
        </button>
        <button onClick={() => setShowModal(true)} className="text-sm underline">
          Інформація про компанію
        </button>
      </div>

      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold mb-2">
        ExpressPhoto <span className="text-gray-400">Online</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-300 mb-6 text-center">
        {t('intro')}
      </motion.p>

      {!confirmed ? (
        <motion.form onSubmit={handleSubmit} method="POST" encType="multipart/form-data" className="flex flex-col w-full max-w-md space-y-4" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <input name="name" placeholder={t('name')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <input name="email" type="text" placeholder={t('email')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <textarea name="details" placeholder={t('details')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <input name="time" type="time" onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <input type="file" name="file" onChange={handleFileChange} className="bg-gray-800 p-3 rounded" />
          <button type="submit" className="bg-white text-black font-bold py-2 rounded hover:bg-gray-200">
            {t('submit')}
          </button>
        </motion.form>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center space-y-4">
          <p className="text-green-400 text-xl font-semibold mt-4">{t('thanks')}</p>
          <button onClick={() => { setConfirmed(false); setForm({ name: '', email: '', details: '', time: '' }); setFile(null); }} className="bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-200">
            {t('neworder')}
          </button>
        </motion.div>
      )}

      <p className="text-sm text-gray-500 mt-10">Poland, Łódź, Łagiewnicka 118B</p>

      {showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-lg w-full relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-white">×</button>
            <h2 className="text-2xl mb-4 font-bold">ExpressPhoto Online</h2>
            <p className="mb-2">📞 Телефон: +48 609 860 816</p>
            <p className="mb-2">📧 Пошта: <a href="mailto:dariiaexpressphoto@gmail.com" className="underline">dariiaexpressphoto@gmail.com</a></p>
            <p className="mb-2">🌐 Адреса: Poland, Łódź, Łagiewnicka 118B</p>
            <p className="text-sm text-gray-400 mt-4">Послуги: онлайн-друк, фото на документи, ксерокопії, фотодрук, ламінування, сканування.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
