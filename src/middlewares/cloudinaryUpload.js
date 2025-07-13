import cloudinary from '../config/cloudinary.js';
import HttpError from '../utils/HttpError.js';
import { Readable } from 'stream';

export const cloudinaryUpload = async (req, res, next) => {
  try {
    // Якщо немає файлу — йдемо далі
    if (!req.file) return next();

    // Перевірка буфера
    if (!req.file.buffer) {
      throw new Error('File buffer is missing');
    }

    // Буфер у потік
    const bufferToStream = (buffer) => {
      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      return readable;
    };

    // Завантаження у Cloudinary через проміс
    const result = await new Promise((resolve, reject) => {
      console.log('Cloudinary env config:', {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'OK' : 'MISSING',
});
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'contacts',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );

      bufferToStream(req.file.buffer).pipe(stream);
    });

    // Зберігаємо результат у req.body
    req.body.photo = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    next();
  } catch (error) {
    console.error('Upload error:', error);
    next(HttpError(500, 'Unexpected upload error'));
  }
};
