export type RuleResult = { valid: true } | { valid: false; reason: string };
export function checkUsage(
  usageLimitPerUser: number | undefined,
  userUsageCount: number
): RuleResult {
  if (!usageLimitPerUser || usageLimitPerUser <= 0) {
    return { valid: true };
  }

  if (userUsageCount >= usageLimitPerUser) {
    return {
      valid: false,
      reason: 'Coupon usage limit reached for this user',
    };
  }

  return { valid: true };
}
