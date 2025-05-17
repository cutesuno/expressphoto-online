import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import os from 'os';
import path from 'path';

export const config = {
  api: { bodyParser: false },
};

const TEMP_DIR = os.tmpdir(); // ✅ використовує дозволену директорію

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const form = formidable({
    uploadDir: TEMP_DIR,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err || !files.file) return res.status(400).json({ error: 'Upload failed' });

    const file = files.file[0];
    const id = path.basename(file.filepath); // без перенесення — просто повертаємо ім’я

    res.status(200).json({ fileId: id });
  });
}