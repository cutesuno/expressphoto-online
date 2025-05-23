import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { pl as plLocale } from 'date-fns/locale';
import { uk as ukLocale } from 'date-fns/locale';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Props = {
  language: 'uk' | 'pl';
  onSuccess?: () => void;
};

const OrderFormWithFile: React.FC<Props> = ({ language, onSuccess }) => {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', details: '', date: new Date(), time: '' });
  const [file, setFile] = useState<File | null>(null);
  const [selectedService, setSelectedService] = useState<{ label: string; price: number } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 2);

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const getAvailableTimes = () => {
    const selectedDay = form.date.getDay();
    if (selectedDay === 0) return [];
    const times: string[] = [];
    const start = selectedDay === 6 ? 10 : 9;
    const end = selectedDay === 6 ? 13 : 17;
    for (let h = start; h < end; h++) {
      times.push(`${h.toString().padStart(2, '0')}:00`);
      times.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  const availableTimes = getAvailableTimes();

  const handleStripeCheckout = async () => {
    if (!selectedService || !form.name || !form.email || !file || !form.date || !form.time) {
      alert(language === 'uk' ? 'Заповніть усі поля та прикріпіть файл' : 'Wypełnij wszystkie pola i załącz plik');
      return;
    }

    try {
      setIsLoading(true);
      const preUploadForm = new FormData();
      preUploadForm.append('file', file);

      const preUploadRes = await fetch('/api/pre-upload', {
        method: 'POST',
        body: preUploadForm,
      });

      if (!preUploadRes.ok) throw new Error('Помилка завантаження файлу');
      const { fileUrl } = await preUploadRes.json();
      console.log('✅ FILE URL TO STRIPE:', fileUrl);

      const formattedDate = form.date.toLocaleDateString('uk-UA');
      const timeLabel = `${formattedDate} ${form.time}`;

      const payload = {
        name: form.name,
        email: form.email,
        details: form.details,
        time: timeLabel,
        service: selectedService.label,
        quantity,
        total: totalPrice.toFixed(2),
        language,
        fileUrl,
      };

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      alert('❌ Помилка при переході до Stripe.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="w-full max-w-md mx-auto space-y-4">
      <input name="name" placeholder={language === 'uk' ? "Ваше ім'я" : 'Imię'} value={form.name} onChange={handleChange} className="w-full p-3 rounded bg-zinc-900 text-white" required />
      <input name="email" placeholder={language === 'uk' ? 'Емейл або телефон' : 'Email lub telefon'} value={form.email} onChange={handleChange} className="w-full p-3 rounded bg-zinc-900 text-white" required />
      <textarea name="details" placeholder={language === 'uk' ? 'Деталі замовлення' : 'Szczegóły zamówienia'} value={form.details} onChange={handleChange} rows={3} className="w-full p-3 rounded bg-zinc-900 text-white" />

      <label className="text-sm text-gray-400 block">{language === 'uk' ? 'Оберіть дату' : 'Wybierz datę'}</label>
      <DatePicker
        selected={form.date}
        onChange={(date: Date | null) => date && setForm({ ...form, date })}
        minDate={new Date()}
        maxDate={maxDate}
        filterDate={(date) => date.getDay() !== 0}
        locale={language === 'uk' ? ukLocale : plLocale}
        className="w-full p-3 rounded bg-zinc-900 text-white"
        dateFormat="dd.MM.yyyy"
      />

      <label className="text-sm text-gray-400 block">{language === 'uk' ? 'Оберіть час' : 'Wybierz godzinę'}</label>
      <select name="time" value={form.time} onChange={handleChange} className="w-full p-3 rounded bg-zinc-900 text-white" required>
        <option value="" disabled>{language === 'uk' ? 'Час' : 'Godzina'}</option>
        {availableTimes.map((time) => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>

      <label className="text-sm text-gray-400 block">{language === 'uk' ? 'Оберіть послугу' : 'Wybierz usługę'}</label>
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
          <input
            type="number"
            name="quantity"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-full p-3 rounded bg-zinc-900 text-white"
            required
          />
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
        disabled={isLoading}
        className={`w-full text-white py-3 rounded-xl transition ${
          isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {language === 'uk' ? 'Завантаження…' : 'Ładowanie...'}
          </span>
        ) : (
          language === 'uk' ? 'Перейти до оплати' : 'Przejdź do płatności'
        )}
      </button>
    </form>
  );
};

export default OrderFormWithFile;