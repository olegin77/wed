export type Check = (db: Record<string, unknown>) => boolean;

export const checks: Check[] = [
  (db) => Boolean(db.User),
  (db) => Boolean(db.Vendor),
];

export function runChecks(db: Record<string, unknown>) {
  return checks.map((check, index) => ({
    name: `check_${index + 1}`,
    passed: check(db),
  }));
}
