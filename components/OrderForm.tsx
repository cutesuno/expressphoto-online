import { useState } from 'react';

export default function OrderForm({ language }: { language: 'uk' | 'pl' }) {
  const t = (uk: string, pl: string) => (language === 'uk' ? uk : pl);

  const [selectedService, setSelectedService] = useState('');
  const [price, setPrice] = useState('');

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

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [group, index] = e.target.value.split(':');
    const selected = prices[group][parseInt(index)];
    setSelectedService(selected.label);
    setPrice(selected.price.toFixed(2));
  };

  return (
    <div className="text-black bg-white rounded-xl p-6 max-w-md w-full text-sm space-y-4">
      <h2 className="text-lg font-bold text-center">
        {t('Замовлення за прайсом', 'Zamówienie według cennika')}
      </h2>
      <select onChange={handleSelect} className="w-full p-2 border border-gray-300 rounded">
        <option value="">{t('Оберіть послугу', 'Wybierz usługę')}</option>
        {Object.entries(prices).map(([group, items]) => (
          <optgroup key={group} label={group}>
            {items.map((item, idx) => (
              <option key={idx} value={`${group}:${idx}`}>
                {item.label} – {item.price.toFixed(2)}zł
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {selectedService && (
        <div className="text-center">
          <p>
            {t('Обрано', 'Wybrano')}: <strong>{selectedService}</strong>
          </p>
          <p>
            {t('Сума до оплати', 'Kwota do zapłaty')}: <strong>{price}zł</strong>
          </p>
        </div>
      )}
      <button
        disabled={!selectedService}
        className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
      >
        {t('Перейти до оплати', 'Przejdź do płatności')}
      </button>
    </div>
  );
}