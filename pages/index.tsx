import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', details: '' });
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });
  const toggleLang = () => i18n.changeLanguage(i18n.language === 'uk' ? 'pl' : 'uk');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/send-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setConfirmed(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="absolute top-4 right-4">
        <button onClick={toggleLang} className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition">{i18n.language === 'uk' ? 'PL' : 'UA'}</button>
      </div>

      <h1 className="text-4xl font-bold mb-2">ExpressPhoto <span className="text-gray-400">Online</span></h1>
      <p className="text-gray-300 mb-6 text-center">{t('intro')}</p>

      {!confirmed ? (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-3">
          <input name="name" placeholder={t('name')} onChange={handleChange} className="w-full p-3 rounded bg-zinc-800 border border-zinc-600" required />
          <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 rounded bg-zinc-800 border border-zinc-600" required />
          <textarea name="details" placeholder={t('details')} onChange={handleChange} className="w-full p-3 rounded bg-zinc-800 border border-zinc-600" required />
          <button type="submit" className="w-full bg-white text-black py-2 rounded hover:bg-gray-200 transition">
            {loading ? t('loading') : t('makeOrder')}
          </button>
        </form>
      ) : (
        <div className="text-green-400 text-lg animate-pulse mt-4">{t('confirmed')}</div>
      )}

      <footer className="absolute bottom-4 text-sm text-gray-500">Poland, Łódź, Łagiewnicka 118B</footer>
    </div>
  );
}
