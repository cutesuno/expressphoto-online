import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Props = {
  language: 'uk' | 'pl';
  onSuccess?: () => void;
};

const OrderFormWithFile: React.FC<Props> = ({ language, onSuccess }) => {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', details: '', time: '' });
  const [file, setFile] = useState<File | null>(null);
  const [selectedService, setSelectedService] = useState<{ label: string; price: number } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const priceList = [
    { category: language === 'uk' ? 'Фото на документи' : 'Zdjęcia do dokumentów', items: [['(3,5 x 4,5) – 4x', 40], ['(3,5 x 4,5) – 6x', 45], ['(3,5 x 4,5) – 12x', 55], ['(4,5 x 6,5) – 4x', 45], ['(4,5 x 6,5) – 8x', 55], [language === 'uk' ? 'Електронна версія' : 'Wersja elektroniczna', 5]] },
    { category: language === 'uk' ? 'Друк фото' : 'Drukowanie zdjęć', items: [['9x13', 1.7], ['10x15', 2.3], ['13x18', 3], ['15x21', 6], ['21x30', 17], ['30x40', 40], ['30x45', 40], ['33x48', 55]] },
    { category: language === 'uk' ? 'Ксеро/друк (ч/б)' : 'Ksero/druk czarno-białe', items: [[language === 'uk' ? '1–10 стор.' : '1–10 str.', 1], ['11–50', 0.9], ['51–100', 0.8], ['A3', 1.5]] },
    { category: language === 'uk' ? 'Кольоровий друк' : 'Druk kolorowy', items: [['A4', 2.5], ['A3', 5]] },
    { category: language === 'uk' ? 'Ламінування' : 'Laminowanie', items: [['A3', 14], ['A4', 7], ['A5', 4], ['A6', 3], ['6,5x9,5', 2], ['5,4x8,6', 2]] },
    { category: language === 'uk' ? 'Сканування' : 'Skanowanie', items: [['A3', 6], ['A4', 3]] }
  ];

  useEffect(() => {
    if (selectedService) setTotalPrice(selectedService.price * quantity);
  }, [selectedService, quantity]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleStripeCheckout = async () => {
    if (!selectedService || !form.name || !form.email || !file) {
      alert(language === 'uk' ? 'Заповніть усі поля та прикріпіть файл' : 'Wypełnij wszystkie pola i załącz plik');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('details', form.details);
      formData.append('time', form.time);
      formData.append('service', selectedService.label);
      formData.append('quantity', quantity.toString());
      formData.append('total', totalPrice.toFixed(2));
      formData.append('language', language);
      formData.append('file', file);

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        body: formData,
      });

      // Надіслати файл у Telegram одразу
const preSubmit = new FormData();
preSubmit.append('name', form.name);
preSubmit.append('email', form.email);
preSubmit.append('details', form.details);
preSubmit.append('service', selectedService.label);
preSubmit.append('quantity', quantity.toString());
preSubmit.append('file', file!);

await fetch('/api/pre-upload-telegram', {
  method: 'POST',
  body: preSubmit,
});

      if (!res.ok) {
        const text = await res.text();
        console.error('❌ Server response:', text);
        throw new Error('Stripe session creation failed');
      }

      const data = await res.json();
      if (!data.url) throw new Error('Missing session URL');

      if (onSuccess) onSuccess();
      window.location.href = data.url;
    } catch (error) {
      console.error('❌ Checkout error:', error);
      alert(language === 'uk'
        ? 'Помилка під час переходу до Stripe. Спробуйте ще раз.'
        : 'Błąd przy przekierowaniu do Stripe. Spróbuj ponownie.');
    }
  };

  return (
    <form className="w-full max-w-md mx-auto space-y-4">
      <input name="name" placeholder={language === 'uk' ? "Ваше ім'я" : 'Imię'} value={form.name} onChange={handleChange} required className="w-full p-3 rounded bg-zinc-900 text-white" />
      <input name="email" placeholder={language === 'uk' ? 'Емейл або телефон' : 'Email lub telefon'} value={form.email} onChange={handleChange} required className="w-full p-3 rounded bg-zinc-900 text-white" />
      <textarea name="details" placeholder={language === 'uk' ? 'Деталі замовлення' : 'Szczegóły zamówienia'} value={form.details} onChange={handleChange} rows={3} className="w-full p-3 rounded bg-zinc-900 text-white" />

      <label className="text-sm text-gray-400 block">
        {language === 'uk' ? 'Оберіть час отримання' : 'Wybierz godzinę odbioru'}
      </label>
      <input name="time" type="time" value={form.time} onChange={handleChange} required className="w-full p-3 rounded bg-zinc-900 text-white" />

      <label className="text-sm text-gray-400 block">
        {language === 'uk' ? 'Оберіть послугу' : 'Wybierz usługę'}
      </label>
      <select onChange={(e) => {
        const [label, price] = e.target.value.split('|');
        setSelectedService({ label, price: Number(price) });
      }} className="w-full p-3 rounded bg-zinc-900 text-white" defaultValue="" required>
        <option value="" disabled>{language === 'uk' ? 'Виберіть послугу з прайсу' : 'Wybierz usługę z cennika'}</option>
        {priceList.map((cat) => (
          <optgroup key={cat.category} label={cat.category}>
            {cat.items.map(([label, price]) => (
              <option key={label} value={`${label}|${price}`}>{label} – {price} zł</option>
            ))}
          </optgroup>
        ))}
      </select>

      <div className="flex items-end gap-4">
        <div className="flex-1">
          <label className="text-sm text-gray-400 block">{language === 'uk' ? 'Кількість' : 'Ilość'}</label>
          <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} className="w-full p-3 rounded bg-zinc-900 text-white" required />
        </div>
        {selectedService && (
          <p className="text-sm text-gray-300 whitespace-nowrap">
            {language === 'uk' ? 'Сума:' : 'Kwota:'} <strong>{totalPrice.toFixed(2)} zł</strong>
          </p>
        )}
      </div>

      <input type="file" onChange={handleFileChange} required className="block text-sm text-white" />

      <button
        type="button"
        onClick={handleStripeCheckout}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition"
      >
        {language === 'uk' ? 'Перейти до оплати' : 'Przejdź do płatności'}
      </button>
    </form>
  );
};

export default OrderFormWithFile;