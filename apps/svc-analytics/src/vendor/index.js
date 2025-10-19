import { strict as assert } from "node:assert";

/**
 * Frozen list of seasons the analytics helpers recognise.
 */
export const SEASONS = Object.freeze(["winter", "spring", "summer", "autumn"]);

const SEASON_BY_MONTH = Object.freeze({
  "01": "winter",
  "02": "winter",
  "03": "spring",
  "04": "spring",
  "05": "spring",
  "06": "summer",
  "07": "summer",
  "08": "summer",
  "09": "autumn",
  "10": "autumn",
  "11": "autumn",
  "12": "winter",
});

const PEAK_RATIO = 1.25;
const OFF_RATIO = 0.75;

/**
 * Recognised season buckets.
 * @typedef {"winter"|"spring"|"summer"|"autumn"} Season
 */

/**
 * Represents a single vendor/month metric row.
 * @typedef {Object} VendorEventStat
 * @property {string} vendorId - Stable vendor identifier.
 * @property {number} enquiries - Qualified enquiries received within the month.
 * @property {number} bookings - Confirmed bookings attributed to the month.
 * @property {string} month - ISO-like month key in `YYYY-MM` format.
 */

/**
 * Summarised demand rollup per vendor.
 * @typedef {Object} VendorDemandSummary
 * @property {string} vendorId
 * @property {number} conversionRate - Overall enquiry to booking ratio rounded to two decimals.
 * @property {string|null} hottestMonth - Month with the highest enquiry volume if available.
 */

/**
 * @typedef {Object} VendorDemandSlice
 * @property {string} month - Month identifier in `YYYY-MM` format.
 * @property {number} enquiries - Monthly enquiries count.
 * @property {number} bookings - Monthly bookings count.
 * @property {number} conversionRate - Monthly enquiry→booking ratio rounded to two decimals.
 * @property {number} demandShare - Share of enquiries relative to the vendor total rounded to four decimals.
 * @property {Season} season - Season bucket the month belongs to.
 * @property {"peak"|"steady"|"off"} intensity - Demand classification compared to the vendor average.
 */

/**
 * @typedef {Object} VendorSeasonalityOverview
 * @property {string} vendorId
 * @property {VendorDemandSlice[]} slices
 * @property {string[]} peakMonths - Months considered peak (enquiries ≥ 125% of the average).
 * @property {string[]} offSeasonMonths - Months considered off-season (enquiries ≤ 75% of the average).
 * @property {Season|null} busiestSeason - Season with the highest enquiry volume.
 * @property {Season|null} offSeason - Season with the lowest enquiry volume.
 * @property {number} averageConversionRate - Weighted enquiry→booking ratio rounded to two decimals.
 */

function assertValidMonth(month) {
  assert.equal(typeof month, "string", "Month identifier must be a string");
  assert.equal(month.length, 7, "Month identifier must follow YYYY-MM format");
  assert.equal(month.charAt(4), "-", "Month identifier must include a dash separator");
  const monthPart = month.slice(5, 7);
  const monthNumber = Number.parseInt(monthPart, 10);
  assert(!Number.isNaN(monthNumber), "Month identifier must include a numeric month");
  assert(monthNumber >= 1 && monthNumber <= 12, "Month must be between 1 and 12");
  const season = SEASON_BY_MONTH[monthPart];
  assert(season, "Unsupported month provided");
  return /** @type {Season} */ (season);
}

function round(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function groupByVendor(stats) {
  const grouped = new Map();
  for (const stat of stats) {
    const list = grouped.get(stat.vendorId);
    if (list) {
      list.push(stat);
    } else {
      grouped.set(stat.vendorId, [stat]);
    }
  }
  return grouped;
}

function computeVendorSummary(stats) {
  let enquiries = 0;
  let bookings = 0;
  let hottestMonth = null;
  let hottestEnquiries = -1;

  for (const stat of stats) {
    enquiries += stat.enquiries;
    bookings += stat.bookings;
    if (stat.enquiries > hottestEnquiries) {
      hottestEnquiries = stat.enquiries;
      hottestMonth = stat.month;
    }
  }

  const conversionRate = enquiries === 0 ? 0 : round(bookings / enquiries, 2);
  return { vendorId: stats[0]?.vendorId ?? "", conversionRate, hottestMonth };
}

function buildSeasonality(stats) {
  const slices = [];
  let totalEnquiries = 0;
  let totalBookings = 0;

  for (const stat of stats) {
    totalEnquiries += stat.enquiries;
    totalBookings += stat.bookings;
  }

  const averageEnquiries = stats.length === 0 ? 0 : totalEnquiries / stats.length;

  for (const stat of [...stats].sort((a, b) => a.month.localeCompare(b.month))) {
    const season = assertValidMonth(stat.month);
    const conversionRate = stat.enquiries === 0 ? 0 : round(stat.bookings / stat.enquiries, 2);
    const demandShare = totalEnquiries === 0 ? 0 : round(stat.enquiries / totalEnquiries, 4);
    const ratio = averageEnquiries === 0 ? 0 : stat.enquiries / averageEnquiries;
    let intensity = "steady";
    if (ratio >= PEAK_RATIO) {
      intensity = "peak";
    } else if (ratio <= OFF_RATIO) {
      intensity = "off";
    }

    slices.push({
      month: stat.month,
      enquiries: stat.enquiries,
      bookings: stat.bookings,
      conversionRate,
      demandShare,
      season,
      intensity,
    });
  }

  const peakMonths = slices.filter((slice) => slice.intensity === "peak").map((slice) => slice.month);
  const offSeasonMonths = slices.filter((slice) => slice.intensity === "off").map((slice) => slice.month);

  const seasonTotals = new Map();
  for (const season of SEASONS) {
    seasonTotals.set(season, 0);
  }
  for (const slice of slices) {
    seasonTotals.set(slice.season, (seasonTotals.get(slice.season) ?? 0) + slice.enquiries);
  }

  let busiestSeason = null;
  let busiestValue = -1;
  let offSeason = null;
  let offSeasonValue = Infinity;
  for (const [season, value] of seasonTotals.entries()) {
    if (value > busiestValue) {
      busiestSeason = season;
      busiestValue = value;
    }
    if (value < offSeasonValue) {
      offSeason = season;
      offSeasonValue = value;
    }
  }

  const averageConversionRate = totalEnquiries === 0 ? 0 : round(totalBookings / totalEnquiries, 2);

  return {
    vendorId: stats[0]?.vendorId ?? "",
    slices,
    peakMonths,
    offSeasonMonths,
    busiestSeason,
    offSeason,
    averageConversionRate,
  };
}

/**
 * Collapses monthly enquiry + booking stats into a summary per vendor.
 *
 * @param {VendorEventStat[]} stats
 * @returns {VendorDemandSummary[]}
 */
export function summarizeVendorDemand(stats) {
  const grouped = groupByVendor(stats);
  const summaries = [];
  for (const vendorStats of grouped.values()) {
    summaries.push(computeVendorSummary(vendorStats));
  }
  return summaries;
}

/**
 * Produces detailed demand slices per vendor to highlight seasonality trends.
 *
 * @param {VendorEventStat[]} stats
 * @returns {VendorSeasonalityOverview[]}
 */
export function analyzeVendorSeasonality(stats) {
  const grouped = groupByVendor(stats);
  const overviews = [];
  for (const vendorStats of grouped.values()) {
    overviews.push(buildSeasonality(vendorStats));
  }
  return overviews;
}
