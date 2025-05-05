// pages/privacy-policy.tsx
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <motion.div
      className="min-h-screen bg-black text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Політика конфіденційності</h1>

        <p>
          Ваша конфіденційність важлива для нас. Ця політика пояснює, яку інформацію ми збираємо, як ми її використовуємо та як ми її захищаємо.
        </p>

        <h2 className="text-xl font-semibold">1. Збір інформації</h2>
        <p>
          Ми збираємо особисту інформацію, таку як імʼя, контактні дані та деталі замовлення, виключно з метою обробки замовлень.
        </p>

        <h2 className="text-xl font-semibold">2. Використання інформації</h2>
        <p>
          Ваші дані використовуються лише для надання послуг та звʼязку з вами. Ми не передаємо ваші дані третім особам без вашої згоди.
        </p>

        <h2 className="text-xl font-semibold">3. Безпека</h2>
        <p>
          Ми вживаємо належні заходи для захисту вашої інформації від несанкціонованого доступу або розголошення.
        </p>

        <h2 className="text-xl font-semibold">4. Файли cookie</h2>
        <p>
          Наш сайт може використовувати файли cookie для покращення зручності користування.
        </p>

        <h2 className="text-xl font-semibold">5. Зміни до політики</h2>
        <p>
          Ми можемо оновлювати цю політику час від часу. Усі зміни будуть публікуватися на цій сторінці.
        </p>

        <p className="text-sm text-gray-400">
          Останнє оновлення: 4 травня 2025 р.
        </p>

        <Link href="/" className="text-blue-400 underline">
          Назад на головну
        </Link>
      </div>
    </motion.div>
  );
}