type RuleResult =
  | { valid: true }
  | { valid: false; reason: string };

type UsageRuleInput = {
  usageLimitPerUser?: number;
  userUsageCount: number;
};

export function checkUsageLimit({
  usageLimitPerUser,
  userUsageCount,
}: UsageRuleInput): RuleResult {

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
