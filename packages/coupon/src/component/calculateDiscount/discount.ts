import { calculateDiscount } from './calculatediscount';

type DiscountType = 'PERCENTAGE' | 'FLAT';

type ApplyDiscountInput = {
  orderAmount: number;
  coupon: {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    maxDiscount?: number;
  };
};

type ApplyDiscountResult = {
  couponCode: string;
  discountAmount: number;
  finalAmount: number;
};

export function applyDiscount({
  orderAmount,
  coupon,
}: ApplyDiscountInput): ApplyDiscountResult {
  const { discountAmount, finalAmount } = calculateDiscount({
    orderAmount,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    maxDiscount: coupon.maxDiscount,
  });

  return {
    couponCode: coupon.code,
    discountAmount,
    finalAmount,
  };
}
