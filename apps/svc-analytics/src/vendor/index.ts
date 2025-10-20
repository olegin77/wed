import {
  SEASONS as SEASONS_IMPL,
  analyzeVendorSeasonality as analyzeVendorSeasonalityImpl,
  summarizeVendorDemand as summarizeVendorDemandImpl,
} from "./index.js";

/**
 * Seasons recognised by the vendor analytics helpers. The tuple is frozen so
 * TypeScript consumers can rely on literal union types for exhaustiveness
 * checks.
 */
export const SEASONS = SEASONS_IMPL as Readonly<[
  "winter",
  "spring",
  "summer",
  "autumn",
]>;

/**
 * Literal union that represents every supported season bucket.
 */
export type Season = (typeof SEASONS)[number];

/**
 * Represents aggregated enquiry and booking numbers for a vendor in a specific
 * calendar month.
 */
export interface VendorEventStat {
  /** Stable vendor identifier. */
  vendorId: string;
  /** Qualified enquiries received within the reporting month. */
  enquiries: number;
  /** Confirmed bookings attributed to the same period. */
  bookings: number;
  /** Month label formatted as `YYYY-MM`. */
  month: string;
}

/**
 * Overall demand snapshot per vendor returned by
 * {@link summarizeVendorDemand}.
 */
export interface VendorDemandSummary {
  /** Vendor identifier the summary belongs to. */
  vendorId: string;
  /** Enquiry→booking conversion rate rounded to two decimals. */
  conversionRate: number;
  /** Month with the highest enquiry volume or `null` if no data. */
  hottestMonth: string | null;
}

/**
 * Detailed demand slice for a single month produced by
 * {@link analyzeVendorSeasonality}.
 */
export interface VendorDemandSlice {
  /** Month identifier in `YYYY-MM` format. */
  month: string;
  /** Monthly enquiry count. */
  enquiries: number;
  /** Monthly booking count. */
  bookings: number;
  /** Monthly enquiry→booking conversion rate rounded to two decimals. */
  conversionRate: number;
  /** Share of enquiries relative to the vendor total rounded to four decimals. */
  demandShare: number;
  /** Season bucket inferred from the month. */
  season: Season;
  /** Demand classification compared to the vendor average. */
  intensity: "peak" | "steady" | "off";
}

/**
 * Rich seasonality report summarising peaks, off-season windows, and weighted
 * conversion ratios for each vendor.
 */
export interface VendorSeasonalityOverview {
  /** Vendor identifier. */
  vendorId: string;
  /** Chronologically sorted demand slices for every reported month. */
  slices: VendorDemandSlice[];
  /** Months where enquiries reached at least 125% of the vendor average. */
  peakMonths: string[];
  /** Months where enquiries dipped below or equal to 75% of the average. */
  offSeasonMonths: string[];
  /** Season with the highest enquiry volume or `null` if no data exists. */
  busiestSeason: Season | null;
  /** Season with the lowest enquiry volume or `null` if no data exists. */
  offSeason: Season | null;
  /** Weighted enquiry→booking conversion ratio rounded to two decimals. */
  averageConversionRate: number;
}

/**
 * Collapses monthly enquiry and booking stats into a summary per vendor.
 */
export const summarizeVendorDemand = summarizeVendorDemandImpl as (
  stats: VendorEventStat[],
) => VendorDemandSummary[];

/**
 * Produces detailed demand slices per vendor highlighting seasonality trends.
 */
export const analyzeVendorSeasonality = analyzeVendorSeasonalityImpl as (
  stats: VendorEventStat[],
) => VendorSeasonalityOverview[];
