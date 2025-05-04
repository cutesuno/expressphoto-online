import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Cancel() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-4 text-red-400">❌ Оплату скасовано</h1>
      <p className="mb-6 text-lg">Ви можете повернутися та спробувати знову.</p>
      <Link href="/" className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
        Назад до форми замовлення
      </Link>
    </motion.div>
  );
}