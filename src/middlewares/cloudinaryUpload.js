import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import HttpError from '../utils/HttpError.js';
import { Readable } from 'stream';

export const cloudinaryUpload = async (req, res, next) => {
  try {

    if (!req.file) return next(); // якщо немає фото — йдемо далі

    const bufferToStream = (buffer) => {
      const readable = new Readable();
      readable.push(buffer);
      readable.push(null);
      return readable;
    };

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'contacts',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
  
          return next(HttpError(500, 'Cloudinary upload failed'));
        }

      req.body.photo = {
  url: result.secure_url,
  public_id: result.public_id,
};

        next();
      }
    );

    bufferToStream(req.file.buffer).pipe(stream);
  } catch (error) {
console.error('Upload error:', error); // ⬅️ лог для діагностики
    next(HttpError(500, 'Unexpected upload error'));
  }
};
