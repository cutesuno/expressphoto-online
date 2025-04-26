import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      email: { uk: 'Емейл або телефон', pl: 'Email lub telefon' },
      details: { uk: 'Деталі замовлення', pl: 'Szczegóły zamówienia' },
      time: { uk: 'Виберіть час замовлення', pl: 'Wybierz godzinę zamówienia' },
      submit: { uk: 'Оформити замовлення', pl: 'Złóż zamówienie' },
      thanks: { uk: 'Дякуємо за замовлення!', pl: 'Dziękujemy za zamówienie!' },
      new: { uk: 'Оформити нове замовлення', pl: 'Złóż nowe zamówienie' },
      back: { uk: 'Повернутись на головну', pl: 'Wróć na stronę główną' },
      company: { uk: 'Інформація про компанію', pl: 'Informacje o firmie' }
    };
    return dict[key]?.[language] || key;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button onClick={toggleLang} className="w-8 h-6">
          {language === 'uk' ? 
            <img src="https://flagcdn.com/w40/ua.png" alt="UA" /> : 
            <img src="https://flagcdn.com/w40/pl.png" alt="PL" />}
        </button>
        <button onClick={() => setShowModal(true)} className="text-xs underline">
          {t('company')}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-2">ExpressPhoto <span className="text-gray-400">Online</span></h1>
      <p className="text-gray-300 mb-6 text-center">{t('intro')}</p>

      {!confirmed ? (
        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          method="POST"
          encType="multipart/form-data"
          className="flex flex-col w-full max-w-md space-y-4">

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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className="text-green-400 text-xl font-semibold mb-4">{t('thanks')}</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => setConfirmed(false)} className="bg-white text-black font-bold py-2 rounded hover:bg-gray-200">
              {t('new')}
            </button>
          </div>
        </motion.div>
      )}

      <p className="text-sm text-gray-500 mt-10">Poland, Łódź, Łagiewnicka 118B<br/>Телефон: +48 609 860 816<br/>Пошта: dariiaexpressphoto@gmail.com</p>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white text-black p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">ExpressPhoto</h2>
              <p>Poland, Łódź, Łagiewnicka 118B</p>
              <p>Телефон: +48 609 860 816</p>
              <p>Пошта: dariiaexpressphoto@gmail.com</p>
              <button onClick={() => setShowModal(false)} className="mt-4 bg-black text-white py-2 px-4 rounded hover:bg-gray-800">
                OK
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}