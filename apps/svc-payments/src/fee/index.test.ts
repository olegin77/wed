import assert from "node:assert/strict";
import test from "node:test";

import { buildFeeLine, calculateFee, feeReport, PLATFORM_FEE_RATE } from "./index";

test("calculateFee applies default rate", () => {
  const fee = calculateFee(1000);
  assert.equal(fee, Math.round(1000 * PLATFORM_FEE_RATE));
});

test("calculateFee validates input", () => {
  assert.throws(() => calculateFee(-10), /non-negative/);
  assert.throws(() => calculateFee(10, -0.1), /non-negative/);
});

test("buildFeeLine respects custom rate", () => {
  const line = buildFeeLine({ orderId: "o1", amount: 1000, rate: 0.05 });
  assert.equal(line.fee, 50);
  assert.equal(line.net, 950);
});

test("feeReport aggregates totals", () => {
  const report = feeReport([
    { orderId: "a", amount: 1000 },
    { orderId: "b", amount: 500, rate: 0.05 },
  ]);

  assert.equal(report.lines.length, 2);
  assert.equal(report.grossTotal, 1500);
  assert.equal(report.feeTotal, report.lines[0]!.fee + report.lines[1]!.fee);
  assert.equal(report.netTotal, report.lines[0]!.net + report.lines[1]!.net);
});
