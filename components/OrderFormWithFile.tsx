// components/OrderFormWithFile.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';

export default function OrderFormWithFile({ language, onSuccess }: { language: 'uk' | 'pl'; onSuccess?: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    details: '',
    time: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [selectedService, setSelectedService] = useState<{ label: string; price: number } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const priceList = [
    {
      category: language === 'uk' ? 'Фото на документи' : 'Zdjęcia do dokumentów',
      items: [
        ['(3,5 x 4,5) – 4x', 40],
        ['(3,5 x 4,5) – 6x', 45],
        ['(3,5 x 4,5) – 12x', 55],
        ['(4,5 x 6,5) – 4x', 45],
        ['(4,5 x 6,5) – 8x', 55],
        [language === 'uk' ? 'Електронна версія' : 'Wersja elektroniczna', 5],
      ],
    },
    {
      category: language === 'uk' ? 'Друк фото' : 'Drukowanie zdjęć',
      items: [
        ['9x13', 1.7], ['10x15', 2.3], ['13x18', 3], ['15x21', 6],
        ['21x30', 17], ['30x40', 40], ['30x45', 40], ['33x48', 55],
      ],
    },
    {
      category: language === 'uk' ? 'Ксеро/друк (ч/б)' : 'Ksero/druk czarno-białe',
      items: [
        [language === 'uk' ? '1–10 стор.' : '1–10 str.', 1],
        ['11–50', 0.9], ['51–100', 0.8], ['A3', 1.5],
      ],
    },
    {
      category: language === 'uk' ? 'Кольоровий друк' : 'Druk kolorowy',
      items: [['A4', 2.5], ['A3', 5]],
    },
    {
      category: language === 'uk' ? 'Ламінування' : 'Laminowanie',
      items: [
        ['A3', 14], ['A4', 7], ['A5', 4], ['A6', 3],
        ['6,5x9,5', 2], ['5,4x8,6', 2],
      ],
    },
    {
      category: language === 'uk' ? 'Сканування' : 'Skanowanie',
      items: [['A3', 6], ['A4', 3]],
    },
  ];

  useEffect(() => {
    if (selectedService) {
      setTotalPrice(selectedService.price * quantity);
    }
  }, [selectedService, quantity]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!file || !selectedService || !form.name || !form.email) {
      alert(language === 'uk' ? 'Заповніть усі поля' : 'Wypełnij wszystkie pola');
      return;
    }

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

    const res = await fetch('/api/create-payment', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.redirectUrl) {
      if (onSuccess) onSuccess();
      setTimeout(() => {
        window.location.href = data.redirectUrl;
      }, 1500);
    } else {
      alert(language === 'uk' ? 'Помилка створення замовлення' : 'Błąd składania zamówienia');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        name="name"
        placeholder={language === 'uk' ? "Ваше ім'я" : 'Imię'}
        value={form.name}
        onChange={handleChange}
        required
        className="w-full p-2 rounded bg-gray-800 text-white"
      />
      <input
        name="email"
        placeholder={language === 'uk' ? 'Емейл або телефон' : 'Email lub telefon'}
        value={form.email}
        onChange={handleChange}
        required
        className="w-full p-2 rounded bg-gray-800 text-white"
      />
      <textarea
        name="details"
        placeholder={language === 'uk' ? 'Деталі замовлення' : 'Szczegóły zamówienia'}
        value={form.details}
        onChange={handleChange}
        className="w-full p-2 rounded bg-gray-800 text-white"
      />
      <label className="text-sm text-gray-400">
        {language === 'uk' ? 'Оберіть час отримання' : 'Wybierz godzinę odbioru'}
      </label>
      <input
        name="time"
        type="time"
        value={form.time}
        onChange={handleChange}
        className="w-full p-2 rounded bg-gray-800 text-white"
      />
      <label className="text-sm text-gray-400">
        {language === 'uk' ? 'Оберіть послугу' : 'Wybierz usługę'}
      </label>
      <select
        onChange={(e) => {
          const [label, price] = e.target.value.split('|');
          setSelectedService({ label, price: Number(price) });
        }}
        className="bg-gray-800 p-3 rounded text-white"
        defaultValue=""
        required
      >
        <option value="" disabled>
          {language === 'uk' ? 'Виберіть послугу з прайсу' : 'Wybierz usługę z cennika'}
        </option>
        {priceList.map((category) => (
          <optgroup label={category.category} key={category.category}>
            {category.items.map(([label, price]) => (
              <option key={label} value={`${label}|${price}`}>
                {label} – {price} zł
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <label className="text-sm text-gray-400">
        {language === 'uk' ? 'Кількість' : 'Ilość'}
      </label>
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
        className="w-full p-2 rounded bg-gray-800 text-white"
        required
      />
      {selectedService && (
        <p className="text-sm text-gray-300">
          {language === 'uk' ? 'Сума до оплати' : 'Kwota do zapłaty'}: <strong>{totalPrice.toFixed(2)} zł</strong>
        </p>
      )}
      <input type="file" onChange={handleFileChange} className="text-white" required />
      <button
        type="submit"
        className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
      >
        {language === 'uk' ? 'Оформити замовлення' : 'Złóż zamówienie'}
      </button>
    </form>
  );
}
