// components/Preloader.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // прелоадер 2 секунди
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="text-white text-4xl font-bold"
      >
        ExpressPhoto <span className="text-gray-400">Online</span>
      </motion.h1>
    </div>
  );
}