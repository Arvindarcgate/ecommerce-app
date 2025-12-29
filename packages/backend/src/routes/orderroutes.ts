import express from 'express';
import { createOrder, getAllOrders } from '../controllers/ordercontroller';
import { getApplicableCoupons } from '../controllers/getapplicable.controller';

const router = express.Router();

router.post('/create', createOrder);
router.get('/all', getAllOrders);
router.get('/applicable', getApplicableCoupons);

export default router;
