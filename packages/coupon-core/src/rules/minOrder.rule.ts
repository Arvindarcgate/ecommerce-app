type RuleResult = { valid: true } | { valid: false; reason: string };

export function checkMinOrder(
  cartAmount: number,
  minOrderAmount?: number
): RuleResult {
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
