import assert from "node:assert/strict";
import { test } from "node:test";

import { createAbRuntime } from "./index.js";

const BASE_EXPERIMENT = Object.freeze({
  key: "header_cta",
  variants: Object.freeze([
    Object.freeze({ name: "control" }),
    Object.freeze({ name: "treatment", weight: 2, payload: { color: "peach" } }),
  ]),
  coverage: 1,
  controlVariant: "control",
  seed: "wed",
});

test("assignments are deterministic across calls", () => {
  const runtime = createAbRuntime();
  const uid = "user-42";

  const first = runtime.assign(BASE_EXPERIMENT, uid);
  const second = runtime.assign(BASE_EXPERIMENT, uid);

  assert.deepEqual(second, first);
  assert.equal(first.reason, "bucket");
  assert.equal(first.variant.name, second.variant.name);
});

test("coverage toggles holdouts but keeps control payload", () => {
  const runtime = createAbRuntime();
  const holdoutExperiment = { ...BASE_EXPERIMENT, coverage: 0.2 };
  let included = 0;
  let holdout = 0;

  for (let index = 0; index < 5000; index += 1) {
    const assignment = runtime.assign(holdoutExperiment, `holdout-${index}`);
    if (assignment.included) {
      included += 1;
    } else {
      holdout += 1;
      assert.equal(assignment.variant.name, "control");
      assert.equal(assignment.reason, "holdout");
    }
  }

  const coverage = included / (included + holdout);
  assert.ok(coverage > 0.15 && coverage < 0.25, coverage.toString());
});

test("respects weighted distributions across a stable cohort", () => {
  const runtime = createAbRuntime();
  const sample = 10_000;
  let controlCount = 0;
  let treatmentCount = 0;

  for (let index = 0; index < sample; index += 1) {
    const assignment = runtime.assign(BASE_EXPERIMENT, `weighted-${index}`);
    if (assignment.variant.name === "control") {
      controlCount += 1;
    } else {
      treatmentCount += 1;
    }
  }

  const controlShare = controlCount / sample;
  const treatmentShare = treatmentCount / sample;
  assert.ok(Math.abs(controlShare - 1 / 3) < 0.03, controlShare.toString());
  assert.ok(Math.abs(treatmentShare - 2 / 3) < 0.03, treatmentShare.toString());
});

test("supports overrides for QA cohorts", () => {
  const runtime = createAbRuntime();
  runtime.setOverride(BASE_EXPERIMENT.key, "treatment", "qa-user");

  const qaAssignment = runtime.assign(BASE_EXPERIMENT, "qa-user");
  assert.equal(qaAssignment.reason, "override");
  assert.equal(qaAssignment.variant.name, "treatment");

  runtime.clearOverride(BASE_EXPERIMENT.key, "qa-user");
  const afterClear = runtime.assign(BASE_EXPERIMENT, "qa-user");
  assert.notEqual(afterClear.reason, "override");
});

test("preloads overrides from configuration objects", () => {
  const runtime = createAbRuntime({
    overrides: {
      [BASE_EXPERIMENT.key]: {
        "vip-user": "treatment",
      },
    },
  });

  const assignment = runtime.assign(BASE_EXPERIMENT, "vip-user");
  assert.equal(assignment.reason, "override");
  assert.equal(assignment.variant.name, "treatment");
});

test("records exposures only for included traffic", () => {
  const exposures = [];
  const runtime = createAbRuntime({
    onExposure: (event) => exposures.push(event),
  });

  const trackedDefinition = { ...BASE_EXPERIMENT, coverage: 0.4 };

  for (let index = 0; index < 500; index += 1) {
    runtime.expose(trackedDefinition, `exposure-${index}`, {
      placement: "hero",
    });
  }

  assert.ok(exposures.length > 0);
  for (const event of exposures) {
    assert.equal(event.key, BASE_EXPERIMENT.key);
    assert.equal(event.context.placement, "hero");
    const verification = runtime.assign(trackedDefinition, event.uid);
    assert.equal(verification.variant.name, event.variant.name);
    assert.equal(verification.included, true);
  }
});

test("validates experiment definitions", () => {
  const runtime = createAbRuntime();
  assert.throws(
    () =>
      runtime.assign(
        {
          key: "broken",
          variants: [
            { name: "dup" },
            { name: "dup" },
          ],
        },
        "user"
      ),
    /ab\.duplicate_variant/
  );
  assert.throws(
    () => runtime.assign({ key: "broken", variants: [] }, "user"),
    /ab\.missing_variants/
  );
  assert.throws(
    () => runtime.assign({ key: "broken", variants: [{ name: "ok" }], coverage: 2 }, "user"),
    /ab\.invalid_coverage/
  );
});
