export interface EscrowSplit {
  holdPercent: number;
  releaseOn: "event_date" | "manual" | "milestone";
}

export interface EscrowState {
  total: number;
  heldAmount: number;
  releasedAmount: number;
  status: "pending" | "partially_released" | "released";
}

export function createEscrow(total: number, split: EscrowSplit): EscrowState {
  const heldAmount = round((total * split.holdPercent) / 100);
  return {
    total,
    heldAmount,
    releasedAmount: round(total - heldAmount),
    status: split.holdPercent === 0 ? "released" : "pending",
  };
}

export function releaseEscrow(state: EscrowState, amount: number): EscrowState {
  if (amount <= 0) {
    throw new Error("Escrow release amount must be positive");
  }
  const newReleased = Math.min(state.total, round(state.releasedAmount + amount));
  const heldAmount = round(state.total - newReleased);
  return {
    total: state.total,
    releasedAmount: newReleased,
    heldAmount,
    status: heldAmount === 0 ? "released" : "partially_released",
  };
}

function round(amount: number): number {
  return Math.round(amount * 100) / 100;
}
