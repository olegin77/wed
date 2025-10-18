import {
  FUNNEL_STAGES as FUNNEL_STAGES_IMPL,
  computeFunnel as computeFunnelImpl,
} from "./index.js";

/**
 * Ordered list of sales funnel stages. Consumers are encouraged to reuse the
 * constant when aggregating metrics so the TypeScript literal types remain in
 * sync with the runtime implementation.
 */
export const FUNNEL_STAGES = FUNNEL_STAGES_IMPL as Readonly<[
  "view",
  "enquiry",
  "contract",
  "payment",
]>;

/**
 * Union type that represents all known funnel milestones.
 */
export type FunnelStage = (typeof FUNNEL_STAGES)[number];

/**
 * Discrete event describing that a lead reached a specific funnel stage.
 */
export interface FunnelEvent {
  /** Stable identifier that lets us connect subsequent events to the same lead. */
  leadId: string;
  /** Stage reached by the lead. The literal union mirrors {@link FUNNEL_STAGES}. */
  stage: FunnelStage;
  /** Timestamp when the milestone was observed. */
  occurredAt: Date | string | number;
  /** Optional metadata captured alongside the milestone. */
  metadata?: Record<string, unknown>;
}

/**
 * Optional filters that can be applied when computing funnel summaries.
 */
export interface ComputeFunnelOptions {
  /** Custom funnel definition. Defaults to {@link FUNNEL_STAGES}. */
  stages?: Readonly<FunnelStage[]>;
  /** Inclusive lower bound for the reporting window. */
  startAt?: Date | string | number;
  /** Inclusive upper bound for the reporting window. */
  endAt?: Date | string | number;
}

/**
 * Aggregated numbers for each stage within the funnel.
 */
export interface FunnelStageMetrics {
  /** Stage name. */
  stage: FunnelStage;
  /** Unique leads that recorded the stage regardless of previous milestones. */
  reached: number;
  /** Leads that progressed through every stage up to and including this one. */
  qualified: number;
  /** Fraction of qualified leads compared to the previous stage. */
  conversionFromPrevious: number;
  /** Fraction of qualified leads relative to the first stage. */
  conversionFromStart: number;
  /** Drop-off ratio relative to the previous stage. */
  dropOffFromPrevious: number;
  /** Earliest moment the stage was reached by a qualified lead. */
  firstReachedAt?: Date;
  /** Latest moment the stage was reached by a qualified lead. */
  lastReachedAt?: Date;
}

/**
 * Summary response returned by {@link computeFunnel}.
 */
export interface FunnelSummary {
  /** Per-stage breakdown of conversion metrics. */
  stages: FunnelStageMetrics[];
  /** Totals calculated across the entire funnel. */
  totals: {
    /** Leads that entered the funnel by hitting the first stage. */
    leads: number;
    /** Leads that successfully reached the final stage. */
    completed: number;
    /** Completion ratio relative to the first stage. */
    completionRate: number;
    /** Share of leads that dropped out before finishing the funnel. */
    dropOff: number;
  };
}

/**
 * Calculates conversion metrics for a set of funnel events.
 */
export const computeFunnel = computeFunnelImpl as (
  events: FunnelEvent[],
  options?: ComputeFunnelOptions,
) => FunnelSummary;
