import assert from "node:assert/strict";
import test from "node:test";

import {
  analyzeVendorSeasonality,
  summarizeVendorDemand,
} from "./index.js";

test("summarizes vendor demand across months", () => {
  const stats = [
    { vendorId: "vendor-1", enquiries: 10, bookings: 3, month: "2024-01" },
    { vendorId: "vendor-1", enquiries: 20, bookings: 6, month: "2024-02" },
    { vendorId: "vendor-2", enquiries: 5, bookings: 1, month: "2024-03" },
  ];

  const summaries = summarizeVendorDemand(stats);
  const vendorOne = summaries.find((item) => item.vendorId === "vendor-1");
  assert.ok(vendorOne);
  assert.equal(vendorOne.conversionRate, 0.3);
  assert.equal(vendorOne.hottestMonth, "2024-02");

  const vendorTwo = summaries.find((item) => item.vendorId === "vendor-2");
  assert.ok(vendorTwo);
  assert.equal(vendorTwo.conversionRate, 0.2);
  assert.equal(vendorTwo.hottestMonth, "2024-03");
});

test("produces seasonality overviews with peak/off-season slices", () => {
  const stats = [
    { vendorId: "vendor-1", enquiries: 10, bookings: 2, month: "2024-01" },
    { vendorId: "vendor-1", enquiries: 15, bookings: 3, month: "2024-02" },
    { vendorId: "vendor-1", enquiries: 30, bookings: 6, month: "2024-07" },
    { vendorId: "vendor-1", enquiries: 5, bookings: 1, month: "2024-08" },
  ];

  const [overview] = analyzeVendorSeasonality(stats);
  assert.ok(overview);
  assert.equal(overview.vendorId, "vendor-1");
  assert.equal(overview.averageConversionRate, 0.2);
  assert.deepEqual(overview.peakMonths, ["2024-07"]);
  assert.deepEqual(overview.offSeasonMonths.sort(), ["2024-01", "2024-08"].sort());
  assert.equal(overview.busiestSeason, "summer");
  assert.equal(overview.offSeason, "spring");

  const julySlice = overview.slices.find((slice) => slice.month === "2024-07");
  assert.ok(julySlice);
  assert.equal(julySlice.intensity, "peak");
  assert.equal(julySlice.season, "summer");
  assert.equal(julySlice.conversionRate, 0.2);
  assert.equal(julySlice.demandShare, 0.5);
});

test("fails fast when an invalid month identifier is provided", () => {
  assert.throws(
    () =>
      analyzeVendorSeasonality([
        { vendorId: "vendor-1", enquiries: 5, bookings: 1, month: "2024-13" },
      ]),
    /Month must be between 1 and 12/,
  );
});
