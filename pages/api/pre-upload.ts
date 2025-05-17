import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('❌ Formidable parse error:', err);
      return res.status(400).json({ error: 'File upload error' });
    }

    const file = files.file?.[0] || files.file;
    if (!file || !file.filepath) {
      return res.status(400).json({ error: 'No file found' });
    }

    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        resource_type: 'auto', // ⬅️ обов’язково для PDF, DOCX, ZIP тощо
        folder: 'uploads',
      });

      return res.status(200).json({ fileUrl: result.secure_url });
    } catch (uploadError: any) {
      console.error('❌ Cloudinary upload error:', uploadError);
      return res.status(500).json({ error: 'Upload failed', details: uploadError.message });
    }
  });
}