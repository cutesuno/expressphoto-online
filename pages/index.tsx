// pages/index.tsx

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
      details: { uk: 'Деталі замовлення', pl: 'Szczegóły zamówienia' },
      email: { uk: 'Емейл або телефон', pl: 'Email lub telefon' },
      time: { uk: '⏰ Час замовлення', pl: '⏰ Czas odbioru' },
      submit: { uk: 'Оформити замовлення', pl: 'Złóż zamówienie' },
      thanks: { uk: 'Дякуємо за замовлення!', pl: 'Dziękujemy za zamówienie!' },
      again: { uk: 'Оформити нове замовлення', pl: 'Złóż nowe zamówienie' },
      info: { uk: 'Інформація про компанію', pl: 'Informacje o firmie' },
    };
    return dict[key]?.[language] || key;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <button onClick={toggleLang} className="text-2xl">
          {language === 'uk' ? '🇵🇱' : '🇺🇦'}
        </button>
        <button onClick={() => setShowModal(true)} className="text-sm underline">
          {t('info')}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-2">ExpressPhoto <span className="text-gray-400">Online</span></h1>
      <p className="text-gray-300 mb-6 text-center">{t('intro')}</p>

      {!confirmed ? (
        <motion.form 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit} 
          method="POST" 
          encType="multipart/form-data" 
          className="flex flex-col w-full max-w-md space-y-4"
        >
          <input name="name" placeholder={t('name')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <input name="email" type="text" placeholder={t('email')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <textarea name="details" placeholder={t('details')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <input name="time" type="time" placeholder={t('time')} onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
          <input type="file" name="file" onChange={handleFileChange} className="bg-gray-800 p-3 rounded" />
          <button type="submit" className="bg-white text-black font-bold py-2 rounded hover:bg-gray-200">
            {t('submit')}
          </button>
        </motion.form>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-center">
          <p className="text-green-400 text-xl font-semibold mt-4">{t('thanks')}</p>
          <button onClick={() => location.reload()} className="mt-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
            {t('again')}
          </button>
        </motion.div>
      )}

      <div className="text-gray-500 text-sm mt-10 text-center">
        Poland, Łódź, Łagiewnicka 118B<br />
        Телефон: +48 609 860 816<br />
        Пошта: dariiaexpressphoto@gmail.com
      </div>

      {showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4">
          <div className="bg-white text-black p-6 rounded-xl max-w-md w-full relative">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-3 text-xl">✖️</button>
            <h2 className="text-xl font-bold mb-4">ExpressPhoto Online</h2>
            <p>Poland, Łódź, Łagiewnicka 118B</p>
            <p>Телефон: +48 609 860 816</p>
            <p>Пошта: dariiaexpressphoto@gmail.com</p>
            <h3 className="mt-4 font-semibold">Послуги:</h3>
            <ul className="list-disc pl-5">
              <li>Фотосесії (портрети, вагітність, весілля)</li>
              <li>Відновлення фотографій</li>
              <li>Копіювання документів (A3/A4)</li>
              <li>Ламінування</li>
              <li>Друк та сканування фото і документів</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
