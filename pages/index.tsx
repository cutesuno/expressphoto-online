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
  const [showInfo, setShowInfo] = useState(false);

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
      email: { uk: 'Емейл або телефон', pl: 'E-mail lub telefon' },
      details: { uk: 'Деталі замовлення', pl: 'Szczegóły zamówienia' },
      time: { uk: 'Час замовлення', pl: 'Godzina odbioru' },
      submit: { uk: 'Оформити замовлення', pl: 'Złóż zamówienie' },
      thanks: { uk: 'Дякуємо за замовлення!', pl: 'Dziękujemy za zamówienie!' },
      back: { uk: 'На головну', pl: 'Wróć do strony głównej' },
      info: {
        uk: 'Poland, Łódź, Łagiewnicka 118B\nТелефон: +48 609 860 816\nПошта: dariiaexpressphoto@gmail.com',
        pl: 'Polska, Łódź, Łagiewnicka 118B\nTelefon: +48 609 860 816\nE-mail: dariiaexpressphoto@gmail.com',
      },
    };
    return dict[key]?.[language] || key;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button onClick={toggleLang} className="w-8 h-5 rounded overflow-hidden border border-gray-300">
          <img
            src={language === 'uk' ? '/uk-flag.png' : '/pl-flag.png'}
            alt="lang"
            className="w-full h-full object-cover"
          />
        </button>
        <button onClick={() => setShowInfo(true)} className="text-xs underline">
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
        <motion.form
          onSubmit={handleSubmit}
          method="POST"
          encType="multipart/form-data"
          className="flex flex-col w-full max-w-md space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
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
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mt-10"
        >
          <p className="text-green-400 text-xl font-semibold mb-4">{t('thanks')}</p>
          <button
            onClick={() => {
              setForm({ name: '', email: '', details: '', time: '' });
              setFile(null);
              setConfirmed(false);
            }}
            className="mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            {t('back')}
          </button>
        </motion.div>
      )}

      <div className="text-sm text-gray-500 mt-10 text-center whitespace-pre-line">
        {t('info')}
      </div>

      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-6">
          <div className="bg-white text-black rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-2 right-2 text-black text-2xl"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4">Інформація про компанію</h2>
            <p className="whitespace-pre-line">{t('info')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
