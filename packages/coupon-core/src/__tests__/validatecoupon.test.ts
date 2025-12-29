import { validateCoupon, Coupon } from '../validators/validateCoupon';

const baseCoupon: Coupon = {
  id: 1,
  code: 'SAVE10',
  discount_type: 'PERCENTAGE',
  discount_value: 10,
  min_order_amount: 100,
  max_discount: 50,
  usage_limit: 5,
  usage_used: 1,
  start_date: '2024-01-01',
  end_date: '2026-01-01',
  status: 'ACTIVE',
};

describe('validateCoupon', () => {
  it('should apply coupon successfully when all conditions pass', () => {
    const result = validateCoupon({
      coupon: baseCoupon,
      cartAmount: 500,
      currentDate: new Date('2025-01-01'),
    });

    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.discountAmount).toBe(50);
      expect(result.finalAmount).toBe(450);
    }
  });

  it('should fail when coupon is inactive', () => {
    const result = validateCoupon({
      coupon: { ...baseCoupon, status: 'INACTIVE' },
      cartAmount: 500,
    });

    expect(result).toEqual({
      valid: false,
      reason: 'Coupon is inactive',
    });
  });

  it('should fail when cart amount is below minimum order', () => {
    const result = validateCoupon({
      coupon: baseCoupon,
      cartAmount: 50,
    });

    expect(result.valid).toBe(false);
  });

  it('should fail when usage limit is exceeded', () => {
    const result = validateCoupon({
      coupon: {
        ...baseCoupon,
        usage_limit: 1,
        usage_used: 1,
      },
      cartAmount: 500,
    });

    expect(result.valid).toBe(false);
  });

  it('should fail when coupon is expired', () => {
    const result = validateCoupon({
      coupon: baseCoupon,
      cartAmount: 500,
      currentDate: new Date('2030-01-01'),
    });

    expect(result.valid).toBe(false);
  });
});
