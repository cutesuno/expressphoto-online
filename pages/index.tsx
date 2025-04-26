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
      email: { uk: "Емейл або телефон", pl: 'Email lub telefon' },
      details: { uk: 'Деталі замовлення', pl: 'Szczegóły zamówienia' },
      time: { uk: 'Час замовлення', pl: 'Godzina odbioru' },
      submit: { uk: 'Оформити замовлення', pl: 'Złóż zamówienie' },
      thanks: { uk: 'Дякуємо за замовлення!', pl: 'Dziękujemy za zamówienie!' },
      back: { uk: 'Оформити нове замовлення', pl: 'Złóż nowe zamówienie' },
      company: { uk: 'Інформація про компанію', pl: 'Informacje o firmie' },
      address: { uk: 'Poland, Łódź, Łagiewnicka 118B', pl: 'Polska, Łódź, Łagiewnicka 118B' },
      phone: { uk: 'Телефон: +48 609 860 816', pl: 'Telefon: +48 609 860 816' },
      emailCompany: { uk: 'Пошта: dariiaexpressphoto@gmail.com', pl: 'Email: dariiaexpressphoto@gmail.com' },
    };
    return dict[key]?.[language] || key;
  };

  return (
    <>
      <Preloader />

      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 relative">
        {/* Кнопка перемикання мови */}
        <button
          onClick={toggleLang}
          className="absolute top-4 right-4 text-2xl"
        >
          {language === 'uk' ? '🇵🇱' : '🇺🇦'}
        </button>

        {/* Модалка інформації про компанію */}
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
                  <p>Телефон: +48 609 860 816</p>
                  <p>Пошта: dariiaexpressphoto@gmail.com</p>
                  <p>Адреса: Польща, Лодзь, вул. Łagiewnicka 118B</p>
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
                  <p>Telefon: +48 609 860 816</p>
                  <p>E-mail: dariiaexpressphoto@gmail.com</p>
                  <p>Adres: Polska, Łódź, ul. Łagiewnicka 118B</p>
                </>
              )}
            </div>
          </motion.div>
        )}

        <motion.h1
          className="text-4xl font-bold mb-2"
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
            <input name="time" type="time" onChange={handleChange} className="bg-gray-800 p-3 rounded" required />
            <input type="file" name="file" onChange={handleFileChange} className="bg-gray-800 p-3 rounded" />
            <button type="submit" className="bg-white text-black font-bold py-2 rounded hover:bg-gray-200">
              {t('submit')}
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

        {/* Низ сайту */}
        <p className="text-sm text-gray-500 mt-10 text-center">
          {t('address')}<br />
          {t('phone')}<br />
          {t('emailCompany')}
        </p>
      </div>
    </>
  );
}