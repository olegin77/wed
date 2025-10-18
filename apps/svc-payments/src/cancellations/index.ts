export interface CancellationPolicy {
  refundableUntilHours: number;
  feePercent: number;
  message?: string;
}

export interface CancellationResult {
  refundableAmount: number;
  feeAmount: number;
  isRefundable: boolean;
}

export function calculateRefund(
  totalAmount: number,
  hoursBeforeEvent: number,
  policy: CancellationPolicy,
): CancellationResult {
  if (hoursBeforeEvent >= policy.refundableUntilHours) {
    return {
      refundableAmount: round(totalAmount * (1 - policy.feePercent / 100)),
      feeAmount: round(totalAmount * (policy.feePercent / 100)),
      isRefundable: true,
    };
  }
  return {
    refundableAmount: 0,
    feeAmount: totalAmount,
    isRefundable: false,
  };
}

function round(amount: number): number {
  return Math.round(amount * 100) / 100;
}
