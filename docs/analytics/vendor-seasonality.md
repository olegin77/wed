# Vendor demand and seasonality slices

This note explains how to use the vendor analytics helpers introduced in `apps/svc-analytics/src/vendor/index.{js,ts}` to surface demand patterns for account managers and vendor success teams.

## Overview

The helper exports two documented entry points:

- `summarizeVendorDemand(stats)` collapses monthly enquiry and booking counts into a concise conversion summary per vendor.
- `analyzeVendorSeasonality(stats)` derives demand slices per month, flags peak/off-season periods, and aggregates totals by season.

Both functions accept arrays of `VendorEventStat` objects with the following fields:

- `vendorId` – stable vendor identifier;
- `enquiries` – qualified enquiries captured in the referenced month;
- `bookings` – confirmed bookings for the same month;
- `month` – ISO-like label in `YYYY-MM` format.

## Peak and off-season thresholds

Seasonality classification relies on demand ratios against the vendor's average monthly enquiries:

- Months where enquiries reach at least **125%** of the average are tagged as `peak`.
- Months at or below **75%** of the average are labelled `off`.
- Remaining months are treated as `steady` demand.

These thresholds are defined via `PEAK_RATIO` and `OFF_RATIO` constants in `index.js` and can be safely tweaked if new guidance emerges.

## Example usage

```js
import { analyzeVendorSeasonality } from "apps/svc-analytics/src/vendor/index.js";

const rows = [
  { vendorId: "venue-1", enquiries: 18, bookings: 4, month: "2024-03" },
  { vendorId: "venue-1", enquiries: 42, bookings: 9, month: "2024-06" },
  { vendorId: "venue-1", enquiries: 12, bookings: 3, month: "2024-09" },
];

const [overview] = analyzeVendorSeasonality(rows);
console.log(overview.peakMonths); //=> ["2024-06"]
console.log(overview.offSeason);  //=> "autumn"
```

The generated overview already contains a `slices` array that can be visualised in admin dashboards to highlight months with significant demand swings.
