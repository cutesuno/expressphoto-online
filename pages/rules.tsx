import { useState } from 'react';

export default function RulesPage() {
  const [lang, setLang] = useState<'uk' | 'pl'>('uk');

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {lang === 'uk' ? 'Правила магазину' : 'Regulamin sklepu'}
        </h1>
        <button
          onClick={() => setLang(lang === 'uk' ? 'pl' : 'uk')}
          className="bg-white text-black px-4 py-1 rounded"
        >
          {lang === 'uk' ? 'PL' : 'UA'}
        </button>
      </div>

      {lang === 'uk' ? (
        <div className="space-y-4 text-gray-200 text-sm">
          <p><strong>1. Загальні положення:</strong> Компанія  EXPRESS PHOTO DARIIA KRAVETS надає послуги друку, фотографування, сканування, ламінування та копіювання документів.</p>
          <p><strong>2. Замовлення:</strong> Замовлення оформлюються онлайн через наш веб-сайт, із зазначенням деталей, часу отримання та додаванням файлів, якщо необхідно.</p>
          <p><strong>3. Оплата:</strong> Оплата здійснюється через безпечну платіжну систему Przelewy24. Замовлення вважається підтвердженим тільки після успішної оплати.</p>
          <p><strong>4. Час виконання:</strong> Замовлення виконуються протягом годин роботи копі-центру. Графік: Пн–Пт 9:00–17:00, Сб 10:00–13:00, Нд – вихідний.</p>
          <p><strong>5. Повернення коштів:</strong> У разі помилки з нашого боку або ненадання послуги можливе повернення коштів протягом 7 днів.</p>
          <p><strong>6. Контакти:</strong> Email: dariiaexpressphoto@gmail.com | Телефон: +48 609 860 816 | Адреса: Польща, Łódź, Łagiewnicka 118B</p>
        </div>
      ) : (
        <div className="space-y-4 text-gray-200 text-sm">
          <p><strong>1. Postanowienia ogólne:</strong> Firma ExpressPhoto Online świadczy usługi drukowania, fotografowania, skanowania, laminowania i kopiowania dokumentów.</p>
          <p><strong>2. Zamówienia:</strong> Zamówienia składane są online przez naszą stronę internetową z podaniem szczegółów, godziny odbioru i dołączeniem plików (jeśli dotyczy).</p>
          <p><strong>3. Płatność:</strong> Płatności realizowane są za pośrednictwem bezpiecznego systemu Przelewy24. Zamówienie jest potwierdzone tylko po udanej płatności.</p>
          <p><strong>4. Czas realizacji:</strong> Zamówienia realizujemy w godzinach pracy punktu. Godziny otwarcia: Pon–Pt 9:00–17:00, Sob 10:00–13:00, Niedz – nieczynne.</p>
          <p><strong>5. Zwroty:</strong> W przypadku błędu z naszej strony lub niewykonania usługi możliwy jest zwrot środków w ciągu 7 dni.</p>
          <p><strong>6. Kontakt:</strong> Email: dariiaexpressphoto@gmail.com | Telefon: +48 609 860 816 | Adres: Polska, Łódź, Łagiewnicka 118B</p>
        </div>
      )}
    </div>
  );
}