import {
  FLAG_SEVERITY as flagSeverityImpl,
  FRAUD_FLAGS as fraudFlagsImpl,
  evaluateFraudFlags as evaluateFraudFlagsImpl,
  getFlagDefinition as getFlagDefinitionImpl,
} from "./index.js";

/** Supported severity levels assigned to fraud flags. */
export type FlagSeverity = "low" | "medium" | "high";

/** Definition describing a fraud flag and suggested remediation. */
export interface FraudFlagDefinition {
  /** Stable identifier used to store matches in persistence layers. */
  id:
    | "duplicate_contact"
    | "disposable_email"
    | "velocity_spike"
    | "failed_payment_spike"
    | "geo_mismatch"
    | "stolen_card_report";
  /** Human-friendly title rendered in dashboards. */
  title: string;
  /** Detailed explanation used for tooltips and incident reviews. */
  description: string;
  /** Severity hint that downstream systems can map to UI priorities. */
  severity: FlagSeverity;
  /** Recommended next step for operators handling the match. */
  remediation: string;
}

/** Raw signals that can be evaluated by the heuristics. */
export interface FraudSignals {
  /** Email address provided by the actor (e.g. enquiry submitter). */
  email?: string;
  /** Phone number supplied during the request lifecycle. */
  phone?: string;
  /** Number of records that reuse the same email/phone within the window. */
  duplicateContactCount?: number;
  /** Amount of enquiries created by the actor within the window. */
  recentEnquiryCount?: number;
  /** Amount of failed payment attempts captured by the processor. */
  failedPaymentAttempts?: number;
  /** Country declared by the actor (profile or enquiry metadata). */
  declaredCountry?: string;
  /** Country resolved from the IP address. */
  ipCountry?: string;
  /** Processor feedback that the card or account was reported stolen. */
  hasStolenCardReport?: boolean;
  /** External IP reputation verdict. */
  suspiciousIpReputation?: boolean;
}

/** Threshold configuration recognised by {@link evaluateFraudFlags}. */
export interface FraudThresholds {
  /** Minimum duplicate contacts required to trigger the flag (defaults to 1). */
  duplicateContact?: number;
  /** Maximum enquiries allowed in the evaluation window (defaults to 5). */
  enquiryVelocity?: number;
  /** Maximum failed payment attempts before escalation (defaults to 3). */
  failedPaymentAttempts?: number;
}

/** Optional evaluator overrides. */
export interface FraudEvaluationOptions {
  /** Custom thresholds per heuristic. */
  thresholds?: FraudThresholds;
  /** Additional disposable email domains to be considered risky. */
  disposableEmailDomains?: Iterable<string>;
  /** High-risk country codes for the geo-mismatch heuristic. */
  highRiskCountries?: Iterable<string>;
}

/** Match produced by the evaluator for a single heuristic. */
export interface FraudFlagMatch {
  /** Referenced flag definition. */
  flag: FraudFlagDefinition;
  /** Evidence collected while evaluating the heuristic. */
  evidence: Readonly<Record<string, unknown>>;
}

/** Structured summary returned by {@link evaluateFraudFlags}. */
export interface FraudEvaluationResult {
  /** List of triggered matches (empty when no heuristics fired). */
  matches: readonly FraudFlagMatch[];
  /** Weighted score derived from the individual severities. */
  riskScore: number;
  /** Highest severity encountered amongst all matches. */
  highestSeverity: FlagSeverity | "none";
}

export const FLAG_SEVERITY = flagSeverityImpl as Readonly<{
  LOW: FlagSeverity;
  MEDIUM: FlagSeverity;
  HIGH: FlagSeverity;
}>;

export const FRAUD_FLAGS = fraudFlagsImpl as readonly FraudFlagDefinition[];

export const evaluateFraudFlags = evaluateFraudFlagsImpl as (
  signals: FraudSignals,
  options?: FraudEvaluationOptions
) => FraudEvaluationResult;

export const getFlagDefinition = getFlagDefinitionImpl as (
  flagId: FraudFlagDefinition["id"]
) => FraudFlagDefinition | undefined;
