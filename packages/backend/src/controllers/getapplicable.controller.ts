import { Request, Response } from 'express';
import Coupon from '../models/coupon';

export const getApplicableCoupons = async (req: Request, res: Response) => {
  try {
    const cartAmount = Number(req.query.cartAmount);

    if (!cartAmount) {
      return res.status(400).json({ message: 'Cart amount required' });
    }

    const coupons = await Coupon.query()
      .where('status', 'ACTIVE')
      .where('min_order_amount', '<=', cartAmount)
      .where('start_date', '<=', new Date())
      .where('end_date', '>=', new Date())
      .select(
        'code',
        'discount_type',
        'discount_value',
        'max_discount',
        'min_order_amount'
      );

    res.json({ coupons });
  } catch (error) {
    console.error('Get Coupons Error:', error);
    res.status(500).json({ message: 'Failed to fetch coupons' });
  }
};
