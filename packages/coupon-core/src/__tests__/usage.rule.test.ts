import { checkUsage } from '../rules/usage.rule';

describe('checkUsage', () => {
  it('should return valid=true if usageLimitPerUser is not provided', () => {
    const result = checkUsage(undefined, 0);
    expect(result).toEqual({ valid: true });
  });

  it('should return valid=true if usageLimitPerUser is 0 or less', () => {
    expect(checkUsage(0, 5)).toEqual({ valid: true });
    expect(checkUsage(-1, 5)).toEqual({ valid: true });
  });

  it('should return valid=false if userUsageCount >= usageLimitPerUser', () => {
    const result = checkUsage(3, 3);
    expect(result).toEqual({
      valid: false,
      reason: 'Coupon usage limit reached for this user',
    });

    const result2 = checkUsage(3, 4);
    expect(result2).toEqual({
      valid: false,
      reason: 'Coupon usage limit reached for this user',
    });
  });

  it('should return valid=true if userUsageCount < usageLimitPerUser', () => {
    expect(checkUsage(5, 3)).toEqual({ valid: true });
    expect(checkUsage(1, 0)).toEqual({ valid: true });
  });
});
