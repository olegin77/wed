export interface LoyaltyTransaction {
  id: string;
  userId: string;
  points: number;
  type: "earn" | "redeem";
  createdAt: Date;
}

export function calculateBalance(history: LoyaltyTransaction[]): number {
  return history.reduce((balance, tx) => balance + tx.points * (tx.type === "earn" ? 1 : -1), 0);
}

export function awardPoints(amountUzS: number): number {
  return Math.floor(amountUzS / 100_000);
}
