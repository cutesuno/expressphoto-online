// pages/privacy.tsx
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Polityka prywatności</h1>

        <section>
          <h2 className="text-xl font-semibold">1. Administrator danych</h2>
          <p>Administratorem danych jest EXPRESS PHOTO DARIIA KRAVETS, Łódź, Łagiewnicka 118B, Polska.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Zakres danych</h2>
          <p>Przetwarzamy dane osobowe niezbędne do realizacji zamówień: imię, adres e-mail, numer telefonu, pliki przesłane do druku.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Cel przetwarzania</h2>
          <p>Dane przetwarzamy wyłącznie w celu realizacji usług oraz obsługi klienta.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Udostępnianie danych</h2>
          <p>Dane nie są udostępniane innym podmiotom poza podmiotami realizującymi płatności i obsługę zamówień.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Prawa użytkownika</h2>
          <p>Użytkownik ma prawo do wglądu, poprawiania oraz żądania usunięcia swoich danych.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Kontakt</h2>
          <p>W przypadku pytań dotyczących danych osobowych prosimy o kontakt: dariiaexpressphoto@gmail.com</p>
        </section>

        <div className="text-center mt-10">
          <Link href="/" className="underline text-blue-400">← Powrót do strony głównej</Link>
        </div>
      </div>
    </div>
  );
}
