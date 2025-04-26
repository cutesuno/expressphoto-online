import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [form, setForm] = useState({ name: '', email: '', details: '' });
  const [file, setFile] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'uk' | 'pl'>('uk');
  const [showModal, setShowModal] = useState(false);

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
    setLoading(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('details', form.details);
    if (file) formData.append('file', file);

    await fetch('/api/send-order', {
      method: 'POST',
      body: formData,
    });

    setLoading(false);
    setConfirmed(true);
  };

  const handleNewOrder = () => {
    setConfirmed(false);
    setForm({ name: '', email: '', details: '' });
    setFile(null);
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
      submit: { uk: 'Оформити замовлення', pl: 'Złóż zamówienie' },
      thanks: { uk: 'Дякуємо за замовлення!', pl: 'Dziękujemy za zamówienie!' },
      newOrder: { uk: 'Оформити нове замовлення', pl: 'Złóż nowe zamówienie' },
      companyInfo: { uk: 'Інформація про компанію', pl: 'Informacje o firmie' },
    };
    return dict[key]?.[language] || key;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      {/* Кнопки мов */}
      <div className="absolute top-4 right-4 flex gap-2">
        <motion.button
          onClick={() => setLanguage('uk')}
          whileHover={{ scale: 1.1 }}
          className={`p-2 rounded-full ${language === 'uk' ? 'bg-white text-black' : 'bg-gray-700'} hover:bg-gray-600`}
        >
          🇺🇦
        </motion.button>
        <motion.button
          onClick={() => setLanguage('pl')}
          whileHover={{ scale: 1.1 }}
          className={`p-2 rounded-full ${language === 'pl' ? 'bg-white text-black' : 'bg-gray-700'} hover:bg-gray-600`}
        >
          🇵🇱
        </motion.button>
      </div>

      <h1 className="text-4xl font-bold mb-2">ExpressPhoto <span className="text-gray-400">Online</span></h1>
      <p className="text-gray-300 mb-6 text-center">{t('intro')}</p>

      <AnimatePresence>
        {loading && (
          <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xl font-semibold text-white">
            Завантаження...
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!loading && !confirmed && (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            method="POST"
            encType="multipart/form-data"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col w-full max-w-md space-y-4"
          >
            <input name="name" placeholder={t('name')} onChange={handleChange} value={form.name} className="bg-gray-800 p-3 rounded" required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} value={form.email} className="bg-gray-800 p-3 rounded" required />
            <textarea name="details" placeholder={t('details')} onChange={handleChange} value={form.details} className="bg-gray-800 p-3 rounded" required />
            <input type="file" name="file" onChange={handleFileChange} className="bg-gray-800 p-3 rounded" />
            <button type="submit" className="bg-white text-black font-bold py-2 rounded hover:bg-gray-200">
              {t('submit')}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmed && (
          <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center space-y-6 mt-6">
            <p className="text-green-400 text-2xl font-semibold">{t('thanks')}</p>
            <button onClick={handleNewOrder} className="mt-4 bg-white text-black font-bold py-2 px-6 rounded hover:bg-gray-200">
              {t('newOrder')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setShowModal(true)} className="mt-8 text-sm text-blue-400 underline">
        {t('companyInfo')}
      </button>

      <p className="text-sm text-gray-500 mt-6">Poland, Łódź, Łagiewnicka 118B</p>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="bg-gray-900 p-6 rounded-lg max-w-md text-white relative">
              <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-white">
                ✖
              </button>
              <h2 className="text-xl font-bold mb-4">Express Photo</h2>
              <ul className="list-disc list-inside text-sm space-y-1 mb-4">
                <li>Портретна зйомка / Portretowa sesja zdjęciowa</li>
                <li>Відновлення фото / Odnawianie zdjęć</li>
                <li>Материнство і народження / Sesja macierzyńska i narodziny</li>
                <li>Групова зйомка / Sesja grupowa</li>
                <li>Весілля і заручини / Śluby i zaręczyny</li>
                <li>Фотографія на паспорт / Zdjęcia do dokumentów</li>
                <li>Ксерокопії ч/б і кольорові / Kserokopie czarno-białe i kolorowe</li>
                <li>Формати A3, A4</li>
                <li>Ламінування / Laminowanie</li>
                <li>Сканування / Skanowanie</li>
                <li>Друк фотографій / Druk zdjęć</li>
                <li>Друк документів / Druk dokumentów</li>
              </ul>
              <p className="text-sm mb-1"><strong>Телефон:</strong> +48 609 860 816</p>
              <p className="text-sm mb-1"><strong>Email:</strong> dariiakravetsexpressphoto@gmail.com</p>
              <p className="text-sm"><strong>Адреса:</strong> Poland, Łódź, Łagiewnicka 118B</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
