import { motion } from 'framer-motion';

export default function CompanyInfoModal({
  language,
  onClose,
}: {
  language: 'uk' | 'pl';
  onClose: () => void;
}) {
  const t = (uk: string, pl: string) => (language === 'uk' ? uk : pl);

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center text-center p-6 z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white text-black p-6 rounded-xl max-w-md w-full relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl"
        >
          ✖️
        </button>

        <h2 className="text-xl font-bold mb-4">ExpressPhoto Online</h2>
        <h3 className="font-semibold">{t('Опис послуг', 'Opis usług')}:</h3>
        <ul className="list-disc pl-5 text-left space-y-1">
          <li>{t('Фотосесії (портретні, вагітність, народження, групові фото)', 'Sesje zdjęciowe (portretowe, ciążowe, narodzinowe, grupowe)')}</li>
          <li>{t('Весільні та заручальні фотосесії', 'Sesje ślubne i zaręczynowe')}</li>
          <li>{t('Відновлення та ретуш фотографій', 'Renowacja i retusz fotografii')}</li>
          <li>{t('Фото на документи', 'Zdjęcia do dokumentów')}</li>
          <li>{t('Друк фотографій у форматах: 9x13, 10x15, 13x18, 15x21, 21x30, 30x40, 30x45, 33x48', 'Drukowanie zdjęć w formatach: 9x13, 10x15, 13x18, 15x21, 21x30, 30x40, 30x45, 33x48')}</li>
          <li>{t('Ксерокопії ч/б та кольорові (A3, A4)', 'Kserokopie czarno-białe i kolorowe (A3, A4)')}</li>
          <li>{t('Кольоровий друк', 'Druk kolorowy')}</li>
          <li>{t('Ламінування документів (A3, A4, A5, A6, 6,5x9,5, 5,4x8,6)', 'Laminowanie dokumentów (A3, A4, A5, A6, 6,5x9,5, 5,4x8,6)')}</li>
          <li>{t('Сканування документів', 'Skanowanie dokumentów')}</li>
        </ul>

        <h3 className="font-semibold mt-4">{t('Контакти', 'Kontakt')}:</h3>
        <p>{t('Телефон: +48 609 860 816', 'Telefon: +48 609 860 816')}</p>
        <p>{t('Пошта: dariiaexpressphoto@gmail.com', 'Email: dariiaexpressphoto@gmail.com')}</p>
        <p>{t('Адреса: Poland, Łódź, Łagiewnicka 118B', 'Adres: Polska, Łódź, Łagiewnicka 118B')}</p>
        <p>{t('Графік роботи: Пн–Пт 9:00–17:00, Сб 10:00–13:00, Нд – вихідний', 'Godziny pracy: Pon–Pt 9:00–17:00, Sob 10:00–13:00, Niedz – nieczynne')}</p>
        <p className="text-sm mt-4">
  <a
    href="/privacy-policy"
    className="underline text-blue-600 hover:text-blue-400"
    target="_blank"
    rel="noopener noreferrer"
  >
    {language === 'uk' ? 'Політика конфіденційності' : 'Polityka prywatności'}
  </a>

  <h3 className="font-semibold mt-4">
  {language === 'uk' ? 'Юридична інформація' : 'Informacje prawne'}
</h3>
<p>
  {language === 'uk'
    ? 'Повна назва: EXPRESS PHOTO DARIIA KTAVETS'
    : 'Pełna nazwa: EXPRESS PHOTO DARIIA KRAVETS'}
</p>
<p>NIP: 7262708270</p>
<p>REGON: 529959121</p>

</p>
      </div>
    </motion.div>
  );
}