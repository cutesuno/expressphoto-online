import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OrderForm({ language }: { language: 'uk' | 'pl' }) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const saveOrderToLocalStorage = () => {
    const order = {
      name: form.name,
      email: form.email,
      details: form.details,
      time: form.time,
      service: selectedService?.label,
      price: selectedService?.price,
      quantity,
      total: totalPrice,
    };
    localStorage.setItem('express_order', JSON.stringify(order));
  };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      if (!selectedService) {
        alert(language === 'uk' ? 'Оберіть послугу' : 'Wybierz usługę');
        return;
      }
    
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          service: selectedService.label,
          unitPrice: selectedService.price,
          quantity,
          total: totalPrice,
        }),
      });
    
      const data = await response.json();
    
      if (data && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert(
          language === 'uk'
            ? 'Не вдалося створити оплату. Спробуйте пізніше.'
            : 'Nie udało się utworzyć płatności. Spróbuj ponownie.'
        );
      }
      
    }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md space-y-4">
      <input
        name="name"
        placeholder={language === 'uk' ? "Ваше ім'я" : 'Imię'}
        onChange={handleChange}
        className="bg-gray-800 p-3 rounded"
        required
      />
      <input
        name="email"
        type="text"
        placeholder={language === 'uk' ? 'Емейл або телефон' : 'Email lub telefon'}
        onChange={handleChange}
        className="bg-gray-800 p-3 rounded"
        required
      />
      <textarea
        name="details"
        placeholder={language === 'uk' ? 'Деталі замовлення' : 'Szczegóły zamówienia'}
        onChange={handleChange}
        className="bg-gray-800 p-3 rounded"
        required
      />
      <label className="text-sm text-gray-400">
        {language === 'uk' ? 'Оберіть час отримання' : 'Wybierz godzinę odbioru'}
      </label>
      <input
        name="time"
        type="time"
        onChange={handleChange}
        className="bg-gray-800 p-3 rounded"
        required
      />

      <label className="text-sm text-gray-400 mt-2">
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
        className="bg-gray-800 p-3 rounded"
        required
      />

      {selectedService && (
        <p className="text-sm text-gray-300">
          {language === 'uk' ? 'Сума до оплати' : 'Kwota do zapłaty'}: <strong>{totalPrice.toFixed(2)} zł</strong>
        </p>
      )}

      <input
        type="file"
        name="file"
        onChange={handleFileChange}
        className="bg-gray-800 p-3 rounded"
      />
      <button
        type="submit"
        className="bg-white text-black font-bold py-2 rounded hover:bg-gray-200"
      >
        {language === 'uk' ? 'Оформити замовлення' : 'Złóż zamówienie'}
      </button>
    </form>
  );
}
