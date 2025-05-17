import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: { bodyParser: false },
};

const TEMP_DIR = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const form = formidable({ uploadDir: TEMP_DIR, keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err || !files.file) return res.status(400).json({ error: 'Upload failed' });

    const file = files.file[0];
    const id = path.basename(file.filepath);

    res.status(200).json({ fileId: id });
  });
}