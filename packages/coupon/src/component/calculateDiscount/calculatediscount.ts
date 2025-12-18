type DiscountType = 'PERCENTAGE' | 'FLAT';

type CalculateDiscountInput = {
  orderAmount: number;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
};

type CalculateDiscountResult = {
  discountAmount: number;
  finalAmount: number;
};

export function calculateDiscount({
  orderAmount,
  discountType,
  discountValue,
  maxDiscount,
}: CalculateDiscountInput): CalculateDiscountResult {
  let discountAmount = 0;

  if (discountType === 'PERCENTAGE') {
    discountAmount = (orderAmount * discountValue) / 100;
  }

  if (discountType === 'FLAT') {
    discountAmount = discountValue;
  }

  // Apply max discount cap
  if (maxDiscount && discountAmount > maxDiscount) {
    discountAmount = maxDiscount;
  }

  // Prevent negative final amount
  if (discountAmount > orderAmount) {
    discountAmount = orderAmount;
  }

  const finalAmount = orderAmount - discountAmount;

  return {
    discountAmount,
    finalAmount,
  };
}
