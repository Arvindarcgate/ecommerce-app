import { checkExpiry } from '../rules/expiry.rule';

describe('checkExpiry', () => {
  const startDate = '2025-01-01';
  const endDate = '2025-12-31';

  it('should return valid=true when current date is within the start and end date', () => {
    const result = checkExpiry(startDate, endDate, new Date('2025-06-15'));
    expect(result).toEqual({ valid: true });
  });

  it('should return valid=false with reason "Coupon is not active yet" if current date is before start date', () => {
    const result = checkExpiry(startDate, endDate, new Date('2024-12-31'));
    expect(result).toEqual({
      valid: false,
      reason: 'Coupon is not active yet',
    });
  });

  it('should return valid=false with reason "Coupon has expired" if current date is after end date', () => {
    const result = checkExpiry(startDate, endDate, new Date('2026-01-01'));
    expect(result).toEqual({
      valid: false,
      reason: 'Coupon has expired',
    });
  });

  it('should treat startDate and endDate inclusively', () => {
    const startResult = checkExpiry(startDate, endDate, new Date('2025-01-01'));
    const endResult = checkExpiry(startDate, endDate, new Date('2025-12-31'));

    expect(startResult).toEqual({ valid: true });
    expect(endResult).toEqual({ valid: true });
  });

  it('should default currentDate to today if not provided', () => {
    const today = new Date();
    const result = checkExpiry('2000-01-01', '2100-01-01');
    expect(result.valid).toBe(true);
  });
});
