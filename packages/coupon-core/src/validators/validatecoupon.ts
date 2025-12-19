import { checkExpiry } from '../rules/expiry.rule';
import { checkMinOrder } from '../rules/minOrder.rule';
import { checkUsage } from '../rules/usage.rule';
import { calculateDiscount } from '../calculateDiscount/calculatediscount';

export type Coupon = {
  id: number;
  code: string;
  discount_type: 'PERCENTAGE' | 'FLAT';
  discount_value: number;
  min_order_amount: number;
  max_discount: number;
  usage_limit: number;
  usage_used: number;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'INACTIVE';
};

export type ValidateCouponInput = {
  coupon: Coupon;
  cartAmount: number;
  currentDate?: Date;
};

export type ValidateCouponResult =
  | {
      valid: true;
      discountAmount: number;
      finalAmount: number;
    }
  | {
      valid: false;
      reason: string;
    };

export function validateCoupon({
  coupon,
  cartAmount,
  currentDate = new Date(),
}: ValidateCouponInput): ValidateCouponResult {
  if (coupon.status !== 'ACTIVE') {
    return { valid: false, reason: 'Coupon is inactive' };
  }

  const expiryCheck = checkExpiry(
    coupon.start_date,
    coupon.end_date,
    currentDate
  );
  if (!expiryCheck.valid) {
    return { valid: false, reason: expiryCheck.reason };
  }

  const minOrderCheck = checkMinOrder(cartAmount, coupon.min_order_amount);
  if (!minOrderCheck.valid) {
    return { valid: false, reason: minOrderCheck.reason };
  }

  const usageCheck = checkUsage(coupon.usage_limit, coupon.usage_used);
  if (!usageCheck.valid) {
    return { valid: false, reason: usageCheck.reason };
  }

  const { discountAmount, finalAmount } = calculateDiscount({
    orderAmount: cartAmount,
    discountType: coupon.discount_type,
    discountValue: coupon.discount_value,
    maxDiscount: coupon.max_discount,
  });

  return {
    valid: true,
    discountAmount,
    finalAmount,
  };
}
