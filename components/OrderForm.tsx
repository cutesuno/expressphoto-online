import { useState } from 'react';

export default function OrderForm({ language }: { language: 'uk' | 'pl' }) {
  const [selected, setSelected] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    details: '',
    time: '',
  });

  const prices: { [key: string]: { label: string; price: number }[] } = {
    photos: [
      { label: '(3,5 x 4,5) – 4', price: 40 },
      { label: '(3,5 x 4,5) – 6', price: 45 },
      { label: '(3,5 x 4,5) – 12', price: 55 },
      { label: '(4,5 x 6,5) – 4', price: 45 },
      { label: '(4,5 x 6,5) – 8', price: 55 },
      { label: t('Електронна версія', 'Wersja elektroniczna'), price: 5 },
    ],
    printing: [
      { label: '9x13', price: 1.7 },
      { label: '10x15', price: 2.3 },
      { label: '13x18', price: 3 },
      { label: '15x21', price: 6 },
      { label: '21x30', price: 17 },
      { label: '30x40', price: 40 },
      { label: '30x45', price: 40 },
      { label: '33x48', price: 55 },
    ],
    laminate: [
      { label: 'A3', price: 14 },
      { label: 'A4', price: 7 },
      { label: 'A5', price: 4 },
      { label: 'A6', price: 3 },
      { label: '6,5x9,5', price: 2 },
      { label: '5,4x8,6', price: 2 },
    ],
    copy: [
      { label: t('1–10 стор.', '1–10 str.'), price: 1 },
      { label: '11–50', price: 0.9 },
      { label: '51–100', price: 0.8 },
      { label: 'A3', price: 1.5 },
    ],
    color: [
      { label: 'A4', price: 2.5 },
      { label: 'A3', price: 5 },
    ],
    scan: [
      { label: 'A3', price: 6 },
      { label: 'A4', price: 3 },
    ],
  };

  const t = (uk: string, pl: string) => (language === 'uk' ? uk : pl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const service = services.find((s) => s.label === selected);
    if (!service) return alert('Оберіть послугу');
    alert(`Ви обрали: ${service.label}, вартість: ${service.price} PLN`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-black p-6 rounded-xl w-full max-w-md flex flex-col gap-4"
    >
      <h2 className="text-xl font-semibold text-center">
        {t('Замовлення за прайсом', 'Zamówienie według cennika')}
      </h2>

      <select
        className="p-2 border rounded"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        required
      >
        <option value="">
          {t('Оберіть послугу', 'Wybierz usługę')}
        </option>
        {services.map((s, i) => (
          <option key={i} value={s.label}>
            {s.label} — {s.price} PLN
          </option>
        ))}
      </select>

      <input
        name="name"
        placeholder={t("Ваше ім'я", 'Imię')}
        className="p-2 border rounded"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        name="email"
        placeholder={t('Емейл або телефон', 'Email lub telefon')}
        className="p-2 border rounded"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <textarea
        name="details"
        placeholder={t('Деталі замовлення', 'Szczegóły zamówienia')}
        className="p-2 border rounded"
        onChange={(e) => setForm({ ...form, details: e.target.value })}
        required
      />
      <label className="text-sm text-gray-500">{t('Оберіть час отримання', 'Wybierz godzinę odbioru')}</label>
      <input
        name="time"
        type="time"
        className="p-2 border rounded"
        onChange={(e) => setForm({ ...form, time: e.target.value })}
        required
      />

      <button
        type="submit"
        className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
      >
        {t('Перейти до оплати', 'Przejdź do płatności')}
      </button>
    </form>
  );
}
