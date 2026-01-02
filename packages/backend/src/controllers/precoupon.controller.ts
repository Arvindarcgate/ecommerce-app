import { Request, Response } from 'express';
import { applyCoupon } from '../service/coupon.service';

export const applyCouponHandler = async (req: Request, res: Response) => {
  try {
    const { code, cartAmount } = req.body;

    if (!code || !cartAmount || cartAmount <= 0) {
      return res.status(400).json({
        valid: false,
        reason: 'Invalid request data',
      });
    }

    const result = await applyCoupon(code, cartAmount);

    if (!result.valid) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Apply coupon error:', error);
    return res.status(500).json({
      valid: false,
      reason: 'Internal server error',
    });
  }
};
