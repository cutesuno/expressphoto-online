import { useState } from 'react';

const PRICE_LIST = {
  'Фото на документи': [
    { name: '(3,5 x 4,5) – 4 шт', price: 40 },
    { name: '(3,5 x 4,5) – 6 шт', price: 45 },
    { name: '(3,5 x 4,5) – 12 шт', price: 55 },
    { name: '(4,5 x 6,5) – 4 шт', price: 45 },
    { name: '(4,5 x 6,5) – 8 шт', price: 55 },
    { name: 'Електронна версія', price: 5 },
  ],
  'Друк фото': [
    { name: '9x13', price: 1.7 },
    { name: '10x15', price: 2.3 },
    { name: '13x18', price: 3 },
    { name: '15x21', price: 6 },
    { name: '21x30', price: 17 },
    { name: '30x40', price: 40 },
    { name: '30x45', price: 40 },
    { name: '33x48', price: 55 },
  ],
  'Ксеро/друк (ч/б)': [
    { name: '1–10 стор.', price: 1 },
    { name: '11–50 стор.', price: 0.9 },
    { name: '51–100 стор.', price: 0.8 },
    { name: 'A3', price: 1.5 },
  ],
  'Кольоровий друк': [
    { name: 'A4', price: 2.5 },
    { name: 'A3', price: 5 },
  ],
  'Ламінування': [
    { name: 'A3', price: 14 },
    { name: 'A4', price: 7 },
    { name: 'A5', price: 4 },
    { name: 'A6', price: 3 },
    { name: '6,5x9,5', price: 2 },
    { name: '5,4x8,6', price: 2 },
  ],
  'Сканування': [
    { name: 'A3', price: 6 },
    { name: 'A4', price: 3 },
  ],
};

export default function OrderForm() {
  const [selected, setSelected] = useState<{ name: string; price: number }[]>([]);

  const toggleItem = (item: { name: string; price: number }) => {
    setSelected((prev) =>
      prev.find((i) => i.name === item.name)
        ? prev.filter((i) => i.name !== item.name)
        : [...prev, item]
    );
  };

  const total = selected.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="text-white p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Оберіть послуги</h2>
      {Object.entries(PRICE_LIST).map(([category, items]) => (
        <div key={category} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {items.map((item) => (
              <label
                key={item.name}
                className={`flex justify-between items-center border p-2 rounded cursor-pointer transition ${
                  selected.find((i) => i.name === item.name)
                    ? 'bg-green-700 border-green-400'
                    : 'hover:bg-gray-800'
                }`}
              >
                <span>{item.name}</span>
                <span>{item.price.toFixed(2)} zł</span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selected.some((i) => i.name === item.name)}
                  onChange={() => toggleItem(item)}
                />
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-6 text-xl font-semibold">Загальна сума: {total.toFixed(2)} zł</div>
      <button
        className="mt-4 bg-white text-black px-4 py-2 rounded hover:bg-gray-200 font-semibold"
        onClick={() => alert(`Переходимо до оплати ${total.toFixed(2)} zł через Przelewy24...`)}
      >
        Перейти до оплати
      </button>
    </div>
  );
}
