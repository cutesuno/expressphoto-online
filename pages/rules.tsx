import { useState } from 'react';

export default function RulesPage() {
  const [lang, setLang] = useState<'uk' | 'pl'>('uk');

  const toggleLang = () => setLang(lang === 'uk' ? 'pl' : 'uk');

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-4xl mx-auto">
      <button
        onClick={toggleLang}
        className="mb-6 px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
      >
        {lang === 'uk' ? 'Polski🇵🇱' : 'Українська🇺🇦'}
      </button>

      {lang === 'uk' ? (
        <>
          <h1 className="text-3xl font-bold mb-4">Правила магазину та політика</h1>
          <p><strong>Назва компанії:</strong> EXPRESS PHOTO DARIIA KRAVETS</p>
          <p><strong>Адреса:</strong> Łódź, Łagiewnicka 118B, Польща</p>
          <p><strong>NIP:</strong> [7262708270]</p>
          <p><strong>REGON:</strong> [529959121]</p>

          <h2 className="text-xl font-bold mt-6 mb-2">Політика повернення</h2>
          <p>Ви маєте право відмовитись від замовлення без пояснення причин протягом 14 днів з моменту отримання.</p>

          <h2 className="text-xl font-bold mt-6 mb-2">Процедура скарг</h2>
          <p>Скарги надсилаються на емейл dariiaexpressphoto@gmail.com. Ми відповідаємо протягом 7 робочих днів.</p>

          <h2 className="text-xl font-bold mt-6 mb-2">Умови доставки</h2>
          <p>Замовлення виконуються протягом 1–3 робочих днів. Самовивіз за адресою: Łódź, Łagiewnicka 118B.</p>

          <h2 className="text-xl font-bold mt-6 mb-2">Політика конфіденційності</h2>
          <p>Ваші персональні дані використовуються виключно для обробки замовлення і не передаються третім сторонам.</p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">Regulamin sklepu i polityki</h1>
          <p><strong>Nazwa firmy:</strong> EXPRESS PHOTO DARIIA KRAVETS</p>
          <p><strong>Adres:</strong> Łódź, Łagiewnicka 118B, Polska</p>
          <p><strong>NIP:</strong> [7262708270]</p>
          <p><strong>REGON:</strong> [529959121]</p>

          <h2 className="text-xl font-bold mt-6 mb-2">Polityka zwrotów</h2>
          <p>Masz prawo odstąpić od zamówienia bez podania przyczyny w ciągu 14 dni od jego otrzymania.</p>

          <h2 className="text-xl font-bold mt-6 mb-2">Procedura reklamacji</h2>
          <p>Reklamacje prosimy przesyłać na adres e-mail: dariiaexpressphoto@gmail.com. Odpowiadamy w ciągu 7 dni roboczych.</p>

          <h2 className="text-xl font-bold mt-6 mb-2">Warunki dostawy</h2>
          <p>Zamówienia realizowane są w ciągu 1–3 dni roboczych. Odbiór osobisty: Łódź, Łagiewnicka 118B.</p>

          <h2 className="text-xl font-bold mt-6 mb-2">Polityka prywatności</h2>
          <p>Twoje dane osobowe są wykorzystywane wyłącznie do realizacji zamówienia i nie są udostępniane osobom trzecim.</p>
        </>
      )}
    </div>
  );
}
