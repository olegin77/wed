import assert from "node:assert/strict";
import test from "node:test";

import { computeFunnel, FUNNEL_STAGES } from "./index.js";

test("computes conversion metrics across the default funnel", () => {
  const base = Date.UTC(2024, 0, 1, 12, 0, 0);
  const when = (minutes) => new Date(base + minutes * 60_000);

  const events = [
    { leadId: "lead-a", stage: "view", occurredAt: when(0) },
    { leadId: "lead-a", stage: "enquiry", occurredAt: when(10) },
    { leadId: "lead-a", stage: "contract", occurredAt: when(20) },
    { leadId: "lead-a", stage: "payment", occurredAt: when(30) },

    { leadId: "lead-b", stage: "view", occurredAt: when(1) },
    { leadId: "lead-b", stage: "enquiry", occurredAt: when(12) },
    { leadId: "lead-b", stage: "contract", occurredAt: when(24) },

    { leadId: "lead-c", stage: "view", occurredAt: when(2) },
    { leadId: "lead-c", stage: "enquiry", occurredAt: when(15) },

    { leadId: "lead-d", stage: "view", occurredAt: when(3) },

    { leadId: "lead-e", stage: "view", occurredAt: when(4) },
    { leadId: "lead-e", stage: "enquiry", occurredAt: when(14) },
    { leadId: "lead-e", stage: "payment", occurredAt: when(35) },
  ];

  const summary = computeFunnel(events);
  assert.deepEqual(summary.totals, {
    leads: 5,
    completed: 1,
    completionRate: 0.2,
    dropOff: 0.8,
  });

  const [view, enquiry, contract, payment] = summary.stages;
  assert.equal(view.stage, "view");
  assert.equal(view.reached, 5);
  assert.equal(view.qualified, 5);
  assert.equal(view.conversionFromPrevious, 1);
  assert.equal(view.conversionFromStart, 1);
  assert.equal(view.dropOffFromPrevious, 0);
  assert.equal(view.firstReachedAt?.toISOString(), when(0).toISOString());
  assert.equal(view.lastReachedAt?.toISOString(), when(4).toISOString());

  assert.equal(enquiry.stage, "enquiry");
  assert.equal(enquiry.reached, 4);
  assert.equal(enquiry.qualified, 4);
  assert.equal(enquiry.conversionFromPrevious, 0.8);
  assert.equal(enquiry.conversionFromStart, 0.8);
  assert.equal(enquiry.dropOffFromPrevious, 0.2);

  assert.equal(contract.stage, "contract");
  assert.equal(contract.reached, 2);
  assert.equal(contract.qualified, 2);
  assert.equal(contract.conversionFromPrevious, 0.5);
  assert.equal(contract.conversionFromStart, 0.4);
  assert.equal(contract.dropOffFromPrevious, 0.5);

  assert.equal(payment.stage, "payment");
  assert.equal(payment.reached, 2);
  assert.equal(payment.qualified, 1);
  assert.equal(payment.conversionFromPrevious, 0.5);
  assert.equal(payment.conversionFromStart, 0.2);
  assert.equal(payment.dropOffFromPrevious, 0.5);
  assert.equal(payment.firstReachedAt?.toISOString(), when(30).toISOString());
  assert.equal(payment.lastReachedAt?.toISOString(), when(30).toISOString());
});

test("filters events outside the provided window", () => {
  const events = [
    { leadId: "historic", stage: "view", occurredAt: "2023-12-01T00:00:00Z" },
    { leadId: "lead-1", stage: "view", occurredAt: "2024-01-01T10:00:00Z" },
    { leadId: "lead-1", stage: "enquiry", occurredAt: "2024-01-01T10:05:00Z" },
    { leadId: "lead-1", stage: "payment", occurredAt: "2024-01-02T09:00:00Z" },
    { leadId: "lead-2", stage: "view", occurredAt: "2024-01-01T09:55:00Z" },
  ];

  const summary = computeFunnel(events, {
    startAt: "2024-01-01T10:00:00Z",
    endAt: "2024-01-02T00:00:00Z",
  });

  assert.equal(summary.totals.leads, 1);
  assert.equal(summary.stages.at(-1)?.qualified, 0);
});

test("validates incoming stages and surfaces a helpful error", () => {
  const events = [
    { leadId: "lead-1", stage: "view", occurredAt: Date.now() },
    // @ts-expect-error - we intentionally send an unsupported stage
    { leadId: "lead-1", stage: "unknown", occurredAt: Date.now() },
  ];

  assert.throws(
    () => computeFunnel(events),
    /Unknown funnel stage received: unknown/,
  );
});

// Sanity check that TypeScript consumers receive the literal tuple.
test("exports funnel stages as a frozen tuple", () => {
  assert.deepEqual(FUNNEL_STAGES, ["view", "enquiry", "contract", "payment"]);
  assert.throws(() => {
    // @ts-expect-error - we deliberately violate readonly constraints
    FUNNEL_STAGES.push("refund");
  }, TypeError);
});
