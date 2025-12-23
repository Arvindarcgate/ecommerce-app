import { applyCoupon } from './applycoupon.service';
import Coupon from '../models/coupon';
import { validateCoupon } from '@ecommerce/coupon-core';

// Mock external dependencies
jest.mock('../models/coupon');
jest.mock('@ecommerce/coupon-core');

describe('applyCoupon service', () => {
  const mockCoupon = {
    id: 1,
    code: 'SAVE10',
    discount_type: 'PERCENT',
    discount_value: 10,
    min_order_amount: 100,
    max_discount: 50,
    usage_limit_per_user: 1,
    start_date: new Date('2025-01-01'),
    end_date: new Date('2025-12-31'),
    status: 'ACTIVE',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return invalid when coupon is not found', async () => {
    // Mock DB query chain
    (Coupon.query as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(null),
    });

    const result = await applyCoupon('INVALID', 200);

    expect(result).toEqual({
      valid: false,
      reason: 'Invalid coupon code',
    });
  });

  it('should call validateCoupon when coupon is found', async () => {
    (Coupon.query as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(mockCoupon),
    });

    (validateCoupon as jest.Mock).mockReturnValue({
      valid: true,
      discountAmount: 20,
      finalAmount: 180,
    });

    const result = await applyCoupon('SAVE10', 200);

    expect(validateCoupon).toHaveBeenCalledTimes(1);
    expect(result.valid).toBe(true);
  });

  it('should pass correct data to validateCoupon', async () => {
    (Coupon.query as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(mockCoupon),
    });

    (validateCoupon as jest.Mock).mockReturnValue({
      valid: true,
      discountAmount: 20,
      finalAmount: 180,
    });

    await applyCoupon('SAVE10', 200);

    expect(validateCoupon).toHaveBeenCalledWith({
      coupon: {
        id: mockCoupon.id,
        code: mockCoupon.code,
        discount_type: mockCoupon.discount_type,
        discount_value: mockCoupon.discount_value,
        min_order_amount: mockCoupon.min_order_amount,
        max_discount: mockCoupon.max_discount,
        usage_limit: mockCoupon.usage_limit_per_user,
        usage_used: 0,
        start_date: mockCoupon.start_date,
        end_date: mockCoupon.end_date,
        status: mockCoupon.status,
      },
      cartAmount: 200,
    });
  });

  it('should return response from validateCoupon', async () => {
    const mockValidateResponse = {
      valid: true,
      discountAmount: 30,
      finalAmount: 170,
    };

    (Coupon.query as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(mockCoupon),
    });

    (validateCoupon as jest.Mock).mockReturnValue(mockValidateResponse);

    const result = await applyCoupon('SAVE10', 200);

    expect(result).toEqual(mockValidateResponse);
  });
});
