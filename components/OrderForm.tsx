import { useState } from 'react';

export default function OrderForm({ language }: { language: 'uk' | 'pl' }) {
  const [form, setForm] = useState({
    service: '',
    quantity: 1,
    name: '',
    email: '',
  });
  const [price, setPrice] = useState(0);
  const [sending, setSending] = useState(false);

  const services = [
    { label: { uk: 'Фото на документи', pl: 'Zdjęcia do dokumentów' }, price: 20 },
    { label: { uk: 'Копія A4 ч/б', pl: 'Kopia A4 cz-b' }, price: 0.5 },
    { label: { uk: 'Копія A4 кольорова', pl: 'Kopia A4 kolorowa' }, price: 1 },
    { label: { uk: 'Сканування', pl: 'Skanowanie' }, price: 1 },
    { label: { uk: 'Ламінування', pl: 'Laminowanie' }, price: 2 },
  ];

  const t = (key: string, pl: string) => (language === 'uk' ? key : pl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));

    if (name === 'service') {
      const selected = services.find((s) => s.label.uk === value || s.label.pl === value);
      if (selected) setPrice(selected.price * form.quantity);
    }
    if (name === 'quantity') {
      const selected = services.find((s) => s.label.uk === form.service || s.label.pl === form.service);
      if (selected) setPrice(selected.price * Number(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Далі можна реалізувати підключення до Przelewy24 через бекенд
    alert(`Оплата ${price} PLN`);

    setSending(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-black rounded-xl shadow-lg p-6 w-full max-w-md space-y-4"
    >
      <h2 className="text-xl font-bold text-center">
        {t('Оформити замовлення', 'Złóż zamówienie')}
      </h2>

      <select
        name="service"
        className="w-full border border-gray-300 p-2 rounded"
        onChange={handleChange}
        required
      >
        <option value="">{t('Оберіть послугу', 'Wybierz usługę')}</option>
        {services.map((s, i) => (
          <option key={i} value={s.label[language]}>
            {s.label[language]}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="quantity"
        min={1}
        value={form.quantity}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded"
      />

      <input
        name="name"
        placeholder={t('Ваше імʼя', 'Imię')}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded"
        required
      />

      <input
        name="email"
        placeholder={t('Емейл або телефон', 'Email lub telefon')}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded"
        required
      />

      <p className="text-center">
        {t('До сплати', 'Do zapłaty')}: <strong>{price.toFixed(2)} PLN</strong>
      </p>

      <button
        type="submit"
        disabled={sending}
        className="bg-black text-white font-bold py-2 px-4 rounded w-full hover:bg-gray-900"
      >
        {sending ? t('Надсилаємо...', 'Wysyłanie...') : t('Перейти до оплати', 'Przejdź do płatności')}
      </button>
    </form>
  );
}
