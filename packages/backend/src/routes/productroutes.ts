import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { addProduct, getProducts } from '../controllers/adminProductpage';

const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/add', upload.single('image'), addProduct);
router.get('/all', getProducts);

export default router;
