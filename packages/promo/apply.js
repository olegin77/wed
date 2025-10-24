/**
 * Applies a promotional discount to an amount
 * @param {number} amount - Original amount
 * @param {"PERCENT"|"FIXED"} type - Type of discount
 * @param {number} value - Discount value (percentage or fixed amount)
 * @returns {number} - Amount after discount applied
 */
export function applyPromo(amount, type, value) {
  if (type === "PERCENT") {
    return Math.max(0, amount - Math.floor(amount * value / 100));
  }
  return Math.max(0, amount - value);
}
