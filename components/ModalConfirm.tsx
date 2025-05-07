// components/ModalConfirm.tsx
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function ModalConfirm({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-xl text-center max-w-sm w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex justify-center mb-4 text-green-500"
        >
          <CheckCircle size={64} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-zinc-800 dark:text-zinc-100"
        >
          Замовлення прийнято!
        </motion.h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Ми надішлемо підтвердження вам у месенджер або на пошту.
        </p>
        <button
          onClick={onClose}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition"
        >
          Повернутися на головну
        </button>
      </motion.div>
    </div>
  );
}