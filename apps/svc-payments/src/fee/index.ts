export const PLATFORM_FEE_RATE = 0.1;

export const calculateFee = (amount: number): number =>
  Math.round(amount * PLATFORM_FEE_RATE);

export const feeReport = (amounts: number[]): { total: number; fee: number } => {
  const total = amounts.reduce((sum, value) => sum + value, 0);
  return { total, fee: calculateFee(total) };
};
