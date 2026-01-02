import Coupon from '../models/coupon';
import { validateCoupon } from '@ecommerce/coupon-core';

export const applyCoupon = async (code: string, cartAmount: number) => {
  const coupon = await Coupon.query()
    .where('code', code)
    .where('status', 'ACTIVE')
    .first();

  if (!coupon) {
    return {
      valid: false,
      reason: 'Invalid coupon code',
    };
  }

  return validateCoupon({
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount,
      max_discount: coupon.max_discount,
      usage_limit: coupon.usage_limit_per_user,
      usage_used: 0,
      start_date: coupon.start_date,
      end_date: coupon.end_date,
      status: coupon.status,
    },
    cartAmount,
  });
};
