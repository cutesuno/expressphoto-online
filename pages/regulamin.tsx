// pages/regulamin.tsx
import Link from 'next/link';

export default function Regulamin() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Regulamin sklepu</h1>

        <section>
          <h2 className="text-xl font-semibold">1. Informacje o firmie</h2>
          <p>Nazwa firmy: EXPRESS PHOTO DARIIA KRAVETS</p>
          <p>Adres: Łódź, Łagiewnicka 118B, Polska</p>
          <p>NIP: [7262708270]</p>
          <p>REGON: [529959121]</p>
          <p>Email: dariiaexpressphoto@gmail.com</p>
          <p>Telefon: +48 609 860 816</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Zasady składania zamówień</h2>
          <p>Klient może złożyć zamówienie za pomocą formularza dostępnego na stronie.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Reklamacje</h2>
          <p>Reklamacje należy zgłaszać mailowo w ciągu 14 dni od zrealizowania zamówienia.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Odstąpienie od umowy</h2>
          <p>Klient ma prawo odstąpić od umowy w ciągu 14 dni bez podania przyczyny.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Polityka prywatności</h2>
          <p>Dane klientów są przetwarzane wyłącznie w celu realizacji zamówień i nie są udostępniane osobom trzecim.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Postanowienia końcowe</h2>
          <p>Regulamin obowiązuje od 2025-05-04. Możemy go aktualizować, a zmiany publikujemy na tej stronie.</p>
        </section>

        <div className="text-center mt-10">
          <Link href="/" className="underline text-blue-400">← Powrót do strony głównej</Link>
        </div>
      </div>
    </div>
  );
}