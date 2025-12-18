type RuleResult =
  | { valid: true }
  | { valid: false; reason: string };

export function checkMinOrder(
  cartAmount: number,
  minOrderAmount?: number
): RuleResult {
  // If no minimum order is defined, rule passes
  if (!minOrderAmount || minOrderAmount <= 0) {
    return { valid: true };
  }

  if (cartAmount < minOrderAmount) {
    return {
      valid: false,
      reason: `Minimum order amount should be ₹${minOrderAmount}`,
    };
  }

  return { valid: true };
}
