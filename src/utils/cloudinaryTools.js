import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';


export const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

export const cloudinaryDestroy = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};
