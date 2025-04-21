import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', details: '' });
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggleLang = () => i18n.changeLanguage(i18n.language === 'uk' ? 'pl' : 'uk');

  const handleSubmit = async (e: any) => {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="absolute top-4 right-4">
        <button onClick={toggleLang} className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition">
          {i18n.language === 'uk' ? 'PL' : 'UA'}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-2">ExpressPhoto <span className="text-gray-400">Online</span></h1>
      <p className="text-gray-300 mb-6 text-center">{t('intro')}</p>

      {!confirmed ? (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-3" encType="multipart/form-data">
          <input name="name" placeholder={t('name')} onChange={handleChange} className="w-full p-3 rounded bg-zinc-800 border border-zinc-600" required />
          <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 rounded bg-zinc-800 border border-zinc-600" required />
          <textarea name="details" placeholder={t('details')} onChange={handleChange} className="w-full p-3 rounded bg-zinc-800 border border-zinc-600" required />

          <input
            type="file"
            name="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 bg-zinc-800 text-white border border-zinc-600 rounded"
          />

          <button type="submit" className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition">
            {loading ? t('loading') : t('makeOrder')}
          </button>
        </form>
      ) : (
        <div className="text-green-400 text-lg animate-pulse mt-4">{t('confirmed')}</div>
      )}

      <footer className="absolute bottom-4 text-sm text-gray-500 flex gap-4 items-center">
        <span>Poland, Łódź, Łagiewnicka 118B</span>
        <button
          onClick={() => setShowInfo(true)}
          className="underline text-blue-400 hover:text-blue-300"
        >
          Інформація про компанію
        </button>
      </footer>

      {showInfo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-xl text-left text-sm relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-white"
              onClick={() => setShowInfo(false)}
            >✕</button>
            <h2 className="text-xl font-bold mb-3">EXPRESS PHOTO</h2>
            <p><strong>Послуги:</strong></p>
            <ul className="list-disc list-inside mb-2">
              <li>Портретна зйомка / Sesja portretowa</li>
              <li>Відновлення фото / Odnawianie zdjęć</li>
              <li>Фотосесія: портретна, материнство, групова / Portretowa, macierzyńska, grupowa</li>
              <li>Фотографії на документи / Zdjęcia do dokumentów</li>
              <li>Ксерокопія ч/б і кольорова / Kserokopia czarno-biała, kolorowa</li>
              <li>Формати A3, A4. Ламінування, сканування</li>
              <li>Друк фото, друк документів / Druk zdjęć, dokumentów</li>
            </ul>
            <p><strong>Контакти:</strong></p>
            <p>Телефон: +48 609 860 816</p>
            <p>Email: dariiakravetsexpressphoto@gmail.com</p>
            <p>Адреса: Poland, Łódź, Łagiewnicka 118B</p>
          </div>
        </div>
      )}
    </div>
  );
}