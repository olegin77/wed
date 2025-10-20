/**
 * Default commission rate applied to vendor payouts (10%).
 */
export const PLATFORM_FEE_RATE = 0.1;

/** Commission rounding helper. */
const roundCurrency = (value: number) => Math.round(value);

export interface FeeLineInput {
  orderId: string;
  amount: number;
  rate?: number;
}

export interface FeeLine {
  orderId: string;
  rate: number;
  gross: number;
  fee: number;
  net: number;
}

export interface FeeReport {
  grossTotal: number;
  feeTotal: number;
  netTotal: number;
  lines: FeeLine[];
}

/**
 * Calculates the platform fee for a single amount. A custom rate can be
 * provided for premium plans; otherwise the default rate is used.
 */
export const calculateFee = (amount: number, rate: number = PLATFORM_FEE_RATE): number => {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("Amount must be a non-negative finite number");
  }
  if (!Number.isFinite(rate) || rate < 0) {
    throw new Error("Rate must be a non-negative finite number");
  }
  return roundCurrency(amount * rate);
};

/** Builds a per-order fee line with gross/fee/net amounts. */
export const buildFeeLine = ({ orderId, amount, rate = PLATFORM_FEE_RATE }: FeeLineInput): FeeLine => {
  const fee = calculateFee(amount, rate);
  return {
    orderId,
    rate,
    gross: roundCurrency(amount),
    fee,
    net: roundCurrency(amount - fee),
  };
};

/** Aggregates multiple fee lines into a report for finance export. */
export const feeReport = (orders: FeeLineInput[]): FeeReport => {
  const lines = orders.map((order) => buildFeeLine(order));
  const grossTotal = lines.reduce((sum, line) => sum + line.gross, 0);
  const feeTotal = lines.reduce((sum, line) => sum + line.fee, 0);
  const netTotal = lines.reduce((sum, line) => sum + line.net, 0);
  return { grossTotal, feeTotal, netTotal, lines };
};
