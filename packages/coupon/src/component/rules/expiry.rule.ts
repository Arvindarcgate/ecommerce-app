type RuleResult =
  | { valid: true }
  | { valid: false; reason: string };

export function checkExpiry(
  startDate: string,
  endDate: string,
  currentDate: Date = new Date()
): RuleResult {
  const start = new Date(startDate);
  const end = new Date(endDate);


  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  if (currentDate < start) {
    return {
      valid: false,
      reason: 'Coupon is not active yet',
    };
  }

  if (currentDate > end) {
    return {
      valid: false,
      reason: 'Coupon has expired',
    };
  }

  return { valid: true };
}
