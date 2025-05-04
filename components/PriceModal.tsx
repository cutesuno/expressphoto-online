export default function PriceModal({
    language,
    onClose,
  }: {
    language: 'uk' | 'pl';
    onClose: () => void;
  }) {
    const t = (uk: string, pl: string) => (language === 'uk' ? uk : pl);
  
    const prices = {
      photos: [
        ['(3,5 x 4,5) – 4', '40zł'],
        ['(3,5 x 4,5) – 6', '45zł'],
        ['(3,5 x 4,5) – 12', '55zł'],
        ['(4,5 x 6,5) – 4', '45zł'],
        ['(4,5 x 6,5) – 8', '55zł'],
        [t('Електронна версія', 'Wersja elektroniczna'), '5zł'],
      ],
      printing: [
        ['9x13', '1,70zł'],
        ['10x15', '2,30zł'],
        ['13x18', '3zł'],
        ['15x21', '6zł'],
        ['21x30', '17zł'],
        ['30x40', '40zł'],
        ['30x45', '40zł'],
        ['33x48', '55zł'],
      ],
      bnw: [
        [t('1–10 стор.', '1–10 str.'), '1zł'],
        ['11–50', '0,90zł'],
        ['51–100', '0,80zł'],
        ['A3', '1,50zł'],
      ],
      color: [
        ['A4', '2,50zł'],
        ['A3', '5,00zł'],
      ],
      laminate: [
        ['A3', '14zł'],
        ['A4', '7zł'],
        ['A5', '4zł'],
        ['A6', '3zł'],
        ['6,5x9,5', '2zł'],
        ['5,4x8,6', '2zł'],
      ],
      scan: [
        ['A3', '6zł'],
        ['A4', '3zł'],
      ],
    };
  
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
        <div className="bg-white text-black p-6 rounded-xl max-w-3xl w-full overflow-y-auto max-h-full relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-4 text-xl"
          >
            ✖️
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">
            {t('Прайс / Ціни за послуги', 'Cennik usług')}
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold">{t('Фото на документи', 'Zdjęcia do dokumentów')}</h3>
              <ul>
                {prices.photos.map(([label, price], i) => (
                  <li key={i}>{label} – {price}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">{t('Друк фото', 'Drukowanie zdjęć')}</h3>
              <ul>
                {prices.printing.map(([label, price], i) => (
                  <li key={i}>{label} – {price}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">{t('Ксеро/друк (ч/б)', 'Ksero/druk czarno-białe')}</h3>
              <ul>
                {prices.bnw.map(([label, price], i) => (
                  <li key={i}>{label} – {price}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">{t('Кольоровий друк', 'Druk kolorowy')}</h3>
              <ul>
                {prices.color.map(([label, price], i) => (
                  <li key={i}>{label} – {price}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">{t('Ламінування', 'Laminowanie')}</h3>
              <ul>
                {prices.laminate.map(([label, price], i) => (
                  <li key={i}>{label} – {price}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">{t('Сканування', 'Skanowanie')}</h3>
              <ul>
                {prices.scan.map(([label, price], i) => (
                  <li key={i}>{label} – {price}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }