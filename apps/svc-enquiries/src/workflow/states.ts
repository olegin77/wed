export const flow = ["NEW", "QUOTE_SENT", "CONTRACT_SIGNED", "WON", "LOST"] as const;

export function canTransit(from: string, to: string) {
  const i = flow.indexOf(from as any);
  const j = flow.indexOf(to as any);
  if (i < 0 || j < 0) return false;
  if (to === "WON" || to === "LOST") return i >= flow.indexOf("CONTRACT_SIGNED");
  return j === i + 1;
}
