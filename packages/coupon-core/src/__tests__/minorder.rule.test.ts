import { checkMinOrder } from '../rules/minOrder.rule';

describe('checkMinOrder', () => {
  it('should return valid=true if minOrderAmount is not provided', () => {
    const result = checkMinOrder(500);
    expect(result).toEqual({ valid: true });
  });

  it('should return valid=true if minOrderAmount is 0 or less', () => {
    expect(checkMinOrder(500, 0)).toEqual({ valid: true });
    expect(checkMinOrder(500, -100)).toEqual({ valid: true });
  });

  it('should return valid=false if cartAmount is less than minOrderAmount', () => {
    const result = checkMinOrder(400, 500);
    expect(result).toEqual({
      valid: false,
      reason: 'Minimum order amount should be ₹500',
    });
  });

  it('should return valid=true if cartAmount is equal to or greater than minOrderAmount', () => {
    expect(checkMinOrder(500, 500)).toEqual({ valid: true });
    expect(checkMinOrder(600, 500)).toEqual({ valid: true });
  });
});
