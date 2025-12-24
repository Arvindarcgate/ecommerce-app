import { calculateDiscount } from '../calculateDiscount/calculatediscount';
import { applyDiscount } from '../calculateDiscount/discount';

describe('calculateDiscount', () => {
  it('should calculate percentage discount correctly', () => {
    const result = calculateDiscount({
      orderAmount: 1000,
      discountType: 'PERCENTAGE',
      discountValue: 10, 
    });

    expect(result.discountAmount).toBe(100);
    expect(result.finalAmount).toBe(900);
  });

  it('should calculate flat discount correctly', () => {
    const result = calculateDiscount({
      orderAmount: 500,
      discountType: 'FLAT',
      discountValue: 50,
    });

    expect(result.discountAmount).toBe(50);
    expect(result.finalAmount).toBe(450);
  });

  it('should not exceed maxDiscount if specified', () => {
    const result = calculateDiscount({
      orderAmount: 1000,
      discountType: 'PERCENTAGE',
      discountValue: 50, 
      maxDiscount: 300,
    });

    expect(result.discountAmount).toBe(300); 
    expect(result.finalAmount).toBe(700);
  });

  it('should not allow discount greater than orderAmount', () => {
    const result = calculateDiscount({
      orderAmount: 200,
      discountType: 'FLAT',
      discountValue: 300,
    });

    expect(result.discountAmount).toBe(200);
    expect(result.finalAmount).toBe(0);
  });
});

describe('applyDiscount', () => {
  it('should apply percentage discount from coupon correctly', () => {
    const result = applyDiscount({
      orderAmount: 1000,
      coupon: {
        code: 'SAVE10',
        discountType: 'PERCENTAGE',
        discountValue: 10,
      },
    });

    expect(result.couponCode).toBe('SAVE10');
    expect(result.discountAmount).toBe(100);
    expect(result.finalAmount).toBe(900);
  });

  it('should apply flat discount from coupon correctly', () => {
    const result = applyDiscount({
      orderAmount: 500,
      coupon: {
        code: 'FLAT50',
        discountType: 'FLAT',
        discountValue: 50,
      },
    });

    expect(result.couponCode).toBe('FLAT50');
    expect(result.discountAmount).toBe(50);
    expect(result.finalAmount).toBe(450);
  });

  it('should respect maxDiscount from coupon', () => {
    const result = applyDiscount({
      orderAmount: 1000,
      coupon: {
        code: 'BIGSAVE',
        discountType: 'PERCENTAGE',
        discountValue: 50, 
        maxDiscount: 300,
      },
    });

    expect(result.couponCode).toBe('BIGSAVE');
    expect(result.discountAmount).toBe(300);
    expect(result.finalAmount).toBe(700);
  });
});
