import multer from 'multer';
import path from 'path';
import fs from 'fs';

// dir storage {fieldname: 'path'}
const uploadMap = {
   coverImage: 'uploads/cover',
   images: 'uploads/blog',
   avatar: 'uploads/profile',
};

// storage config (local disk)
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      const dirPath = uploadMap[file.fieldname] || 'uploads/more';
      const uploadDir = path.join(process.cwd(), dirPath);

      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
   },
   filename: (req, file, cb) => {
      // sanitize + unique
      const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-]/g, '');
      const ext = path.extname(safeName);
      const base = path.basename(safeName, ext);
      const unique = `${base}-${Date.now()}${ext}`;
      cb(null, unique);
   },
});

// file filter: only images
const fileFilter = (req, file, cb) => {
   const allowed = /jpeg|jpg|png|webp|/;
   const ext = path.extname(file.originalname).toLowerCase();
   allowed.test(ext) ? cb(null, true) : cb(new Error('Only file images are allowed to upload like (jpeg, jpg, png & webp)'));
};

const limits = {
   fileSize: 5 * 1024 * 1024, // 5 mb limit
};

// upload single
export const uploadSingle = (fieldName) => {
   const uploader = multer({ storage, fileFilter, limits }).single(fieldName);
   return (req, res, next) => {
      uploader(req, res, (err) => {
         if (err) return res.status(400).json({ message: err.message });
         // if file uploaded, req.file is available
         next();
      });
   };
};

// optionally export .array or .fields variants if needed
export const uploadMultiple = (fieldName = 'images', maxCount = 5) => {
   const uploader = multer({ storage, fileFilter, limits }).array(fieldName, maxCount);
   return (req, res, next) => {
      uploader(req, res, (err) => {
         if (err) return res.status(400).json({ message: err.message });
         next();
      });
   };
};
