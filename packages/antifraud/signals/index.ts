export type FraudContext = Record<string, unknown> & {
  eqLastHour?: number;
  regIpCountry?: string;
  txIpCountry?: string;
};

export type FraudSignal = (context: FraudContext) => boolean;

/**
 * Collection of synchronous fraud heuristics we can evaluate inline before
 * hitting the heavy scoring services. Each signal returns `true` when the
 * associated condition is considered risky.
 */
export const signals: Record<string, FraudSignal> = {
  /** Flags users who created too many enquiries within the last hour. */
  manyEnquiriesShortTime: (context) => (context.eqLastHour ?? 0) > 5,
  /** Detects mismatched registration and transaction IP countries. */
  ipMismatch: (context) => {
    const { regIpCountry, txIpCountry } = context;
    return Boolean(regIpCountry && txIpCountry && regIpCountry !== txIpCountry);
  },
};
