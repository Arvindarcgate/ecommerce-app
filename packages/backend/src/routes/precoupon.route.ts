import { Router } from 'express';
import { applyCouponHandler } from '../controllers/precoupon.controller';

const router = Router();

router.post('/apply', applyCouponHandler);

export default router;
