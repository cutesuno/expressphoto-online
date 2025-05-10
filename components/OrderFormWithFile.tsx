import { useState } from 'react';

export default function OrderFormWithFile() {
  const [name, setName] = useState('');
  const [service, setService] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!name || !service || !file) {
      alert('Заповніть усі поля і виберіть файл');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('service', service);
    formData.append('file', file);

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Помилка при створенні сесії');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Ваше ім’я"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-2 p-2 border"
      />
      <input
        type="text"
        placeholder="Послуга"
        value={service}
        onChange={(e) => setService(e.target.value)}
        className="w-full mb-2 p-2 border"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
        Перейти до оплати
      </button>
    </div>
  );
}