export interface PrepayRequest {
  enquiryId: string;
  totalAmount: number;
  percent: number;
}

export interface PrepaySchedule {
  enquiryId: string;
  depositAmount: number;
  remainingAmount: number;
}

export function createPrepaySchedule(request: PrepayRequest): PrepaySchedule {
  const depositAmount = round((request.totalAmount * request.percent) / 100);
  return {
    enquiryId: request.enquiryId,
    depositAmount,
    remainingAmount: round(request.totalAmount - depositAmount),
  };
}

function round(amount: number): number {
  return Math.round(amount * 100) / 100;
}
