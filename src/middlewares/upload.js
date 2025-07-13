import multer from 'multer';

// 2MB у байтах
const MAX_SIZE = 2 * 1024 * 1024;

// Фільтр типів файлів
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png files are allowed!'), false);
  }
};

// Зберігання в памʼяті
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});

export default upload;

