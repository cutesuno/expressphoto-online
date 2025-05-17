import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import cloudinary from 'cloudinary';

export const config = {
  api: { bodyParser: false },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-rar-compressed'
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) return res.status(400).json({ error: 'Upload failed' });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!allowedTypes.includes(file.mimetype || '')) {
      return res.status(400).json({ error: 'Недозволений формат файлу' });
    }

    try {
      const uploadRes = await cloudinary.v2.uploader.upload(file.filepath, {
        folder: 'orders',
        resource_type: 'auto',
      });

      return res.status(200).json({ fileUrl: uploadRes.secure_url });
    } catch (e: any) {
      console.error('Cloudinary upload error:', e.message);
      return res.status(500).json({ error: 'Upload error', message: e.message });
    }
  });
}
