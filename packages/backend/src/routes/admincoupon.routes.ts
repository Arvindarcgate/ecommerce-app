import { Router } from 'express';
import {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
} from '../controllers/coupon.controller';

const router = Router();

router.post('/admin/coupons', createCoupon);
router.get('/coupons', getAllCoupons);
router.delete('/coupons/:id', deleteCoupon);

export default router;
