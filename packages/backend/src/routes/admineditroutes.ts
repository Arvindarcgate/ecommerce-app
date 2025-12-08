import express from 'express';
import multer from 'multer';
import path from 'path';
import { updateProduct, deleteProduct } from '../controllers/adminedit';

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.put('/update/:id', upload.single('image'), updateProduct);

router.delete('/delete/:id', deleteProduct);

export default router;
