// @ts-check

/**
 * Canonical order of the product funnel that tracks how couples progress from
 * browsing vendors to completing a booking payment. The list is exported as a
 * frozen array so consumers can reuse it as the default when calling
 * {@link computeFunnel}.
 * @type {readonly ["view", "enquiry", "contract", "payment"]}
 */
export const FUNNEL_STAGES = Object.freeze(["view", "enquiry", "contract", "payment"]);

/**
 * @typedef {import("./index.ts").FunnelStage} FunnelStage
 * @typedef {import("./index.ts").FunnelEvent} FunnelEvent
 * @typedef {import("./index.ts").ComputeFunnelOptions} ComputeFunnelOptions
 * @typedef {import("./index.ts").FunnelStageMetrics} FunnelStageMetrics
 * @typedef {import("./index.ts").FunnelSummary} FunnelSummary
 */

/**
 * Normalises arbitrary time-like inputs into native {@link Date} instances and
 * validates that the resulting timestamp is finite.
 *
 * @param {Date | string | number} value
 * @returns {Date}
 */
function toDate(value) {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError(`Invalid timestamp provided: ${value}`);
  }
  return date;
}

/**
 * Validates that the provided funnel stages are unique and non-empty, returning
 * them as a tuple that mirrors the input order.
 *
 * @param {readonly FunnelStage[]} stages
 * @returns {readonly FunnelStage[]}
 */
function validateStages(stages) {
  if (!Array.isArray(stages) || stages.length === 0) {
    throw new TypeError("At least one funnel stage must be provided");
  }

  const seen = new Set();
  for (const stage of stages) {
    if (typeof stage !== "string" || stage.length === 0) {
      throw new TypeError("Funnel stage names must be non-empty strings");
    }
    if (seen.has(stage)) {
      throw new TypeError(`Funnel stages must be unique, duplicated: ${stage}`);
    }
    seen.add(stage);
  }

  return stages;
}

/**
 * Builds a lookup map between funnel stages and their order so we can quickly
 * determine whether a given event stage is recognised.
 *
 * @param {readonly FunnelStage[]} stages
 * @returns {Map<FunnelStage, number>}
 */
function buildStageIndex(stages) {
  const index = new Map();
  stages.forEach((stage, position) => {
    index.set(stage, position);
  });
  return index;
}

/**
 * Groups events by lead identifier and records the earliest timestamp for each
 * stage they reached. Events outside the optional reporting window are skipped.
 *
 * @param {FunnelEvent[]} events
 * @param {Map<FunnelStage, number>} stageIndex
 * @param {Date | undefined} startAt
 * @param {Date | undefined} endAt
 * @returns {Map<string, Map<FunnelStage, Date>>}
 */
function collectLeadStages(events, stageIndex, startAt, endAt) {
  const leads = new Map();
  for (const event of events) {
    if (!event || typeof event !== "object") {
      throw new TypeError("Funnel events must be plain objects");
    }
    const { leadId, stage, occurredAt } = event;
    if (typeof leadId !== "string" || leadId.length === 0) {
      throw new TypeError("Each funnel event must include a non-empty leadId");
    }
    if (!stageIndex.has(stage)) {
      throw new TypeError(`Unknown funnel stage received: ${stage}`);
    }

    const timestamp = toDate(occurredAt);
    if (startAt && timestamp < startAt) continue;
    if (endAt && timestamp > endAt) continue;

    let leadStages = leads.get(leadId);
    if (!leadStages) {
      leadStages = new Map();
      leads.set(leadId, leadStages);
    }

    const current = leadStages.get(stage);
    if (!current || timestamp < current) {
      leadStages.set(stage, timestamp);
    }
  }

  return leads;
}

/**
 * Produces conversion metrics for every funnel stage by analysing how many
 * leads reach each milestone and how many progress sequentially through the
 * pipeline. Duplicate stage events are deduplicated by keeping the earliest
 * timestamp per lead.
 *
 * @param {FunnelEvent[]} events - Raw chronological or unordered events that
 *   describe how leads progress through the funnel.
 * @param {ComputeFunnelOptions} [options] - Optional reporting options such as
 *   time windows or custom funnel definitions.
 * @returns {FunnelSummary}
 */
export function computeFunnel(events, options = {}) {
  if (!Array.isArray(events)) {
    throw new TypeError("Funnel events must be provided as an array");
  }

  const stages = validateStages(options.stages ?? FUNNEL_STAGES);
  const stageIndex = buildStageIndex(stages);

  const startAt = options.startAt ? toDate(options.startAt) : undefined;
  const endAt = options.endAt ? toDate(options.endAt) : undefined;
  if (startAt && endAt && endAt < startAt) {
    throw new TypeError("The reporting window end date must be after the start date");
  }

  const leadStages = collectLeadStages(events, stageIndex, startAt, endAt);
  const orderedStages = Array.from(stages);

  const firstStage = orderedStages[0];
  const totalLeads = [...leadStages.values()].filter((stagesMap) => stagesMap.has(firstStage)).length;

  /** @type {FunnelStageMetrics[]} */
  const summaries = [];
  let previousQualified = 0;
  let completed = 0;

  orderedStages.forEach((stage, index) => {
    let reached = 0;
    let qualified = 0;
    /** @type {Date | undefined} */
    let firstReachedAt;
    /** @type {Date | undefined} */
    let lastReachedAt;

    for (const stagesMap of leadStages.values()) {
      const timestamp = stagesMap.get(stage);
      if (!timestamp) {
        continue;
      }
      reached += 1;

      let hasAllPrevious = true;
      for (let i = 0; i <= index; i += 1) {
        const requiredStage = orderedStages[i];
        if (!stagesMap.has(requiredStage)) {
          hasAllPrevious = false;
          break;
        }
      }

      if (!hasAllPrevious) {
        continue;
      }

      qualified += 1;
      if (!firstReachedAt || timestamp < firstReachedAt) {
        firstReachedAt = new Date(timestamp.getTime());
      }
      if (!lastReachedAt || timestamp > lastReachedAt) {
        lastReachedAt = new Date(timestamp.getTime());
      }
    }

    const conversionFromPrevious = index === 0
      ? 1
      : previousQualified === 0
        ? 0
        : qualified / previousQualified;

    const conversionFromStart = totalLeads === 0 ? 0 : qualified / totalLeads;
    const dropOffFromPrevious = index === 0
      ? 0
      : previousQualified === 0
        ? 0
        : (previousQualified - qualified) / previousQualified;

    summaries.push({
      stage,
      reached,
      qualified,
      conversionFromPrevious,
      conversionFromStart,
      dropOffFromPrevious,
      firstReachedAt,
      lastReachedAt,
    });

    previousQualified = qualified;
    if (index === orderedStages.length - 1) {
      completed = qualified;
    }
  });

  const completionRate = totalLeads === 0 ? 0 : completed / totalLeads;
  const dropOff = totalLeads === 0 ? 0 : (totalLeads - completed) / totalLeads;

  return {
    stages: summaries,
    totals: {
      leads: totalLeads,
      completed,
      completionRate,
      dropOff,
    },
  };
}
