export type PaymentPart = { kind: 'deposit' | 'final'; amount: number; due: string };

export const split = (total: number): PaymentPart[] => {
  const deposit = Math.round(total * 0.3);
  return [
    { kind: 'deposit', amount: deposit, due: 'book' },
    { kind: 'final', amount: total - deposit, due: 'event' },
  ];
};
