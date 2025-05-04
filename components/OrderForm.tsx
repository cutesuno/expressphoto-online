import { useState } from 'react';

export default function OrderForm({ language }: { language: 'uk' | 'pl' }) {
  const [selected, setSelected] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    details: '',
    time: '',
  });

  const services = [
    { label: '(3,5 x 4,5) – 4 шт', price: 40 },
    { label: '(3,5 x 4,5) – 6 шт', price: 45 },
    { label: '(3,5 x 4,5) – 12 шт', price: 55 },
    { label: '(4,5 x 6,5) – 4 шт', price: 45 },
    { label: '(4,5 x 6,5) – 8 шт', price: 55 },
    { label: 'Електронна версія', price: 5 },
    { label: 'Друк фото 10x15', price: 2.3 },
    { label: 'Копії А4 ч/б', price: 1 },
    { label: 'Копії А4 кольорові', price: 2.5 },
    { label: 'Ламінування A4', price: 7 },
    { label: 'Сканування A4', price: 3 },
  ];

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
