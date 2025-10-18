import type { Buffer } from "node:buffer";
import {
  CALENDAR_STATUS as calendarStatusImpl,
  CALENDAR_TRANSPARENCY as calendarTransparencyImpl,
  parseICalendar as parseICalendarImpl,
} from "./index.js";

/**
 * Canonical event statuses recognised by the parser. The structure mirrors the
 * runtime export so consumers can rely on string literal types.
 */
export const CALENDAR_STATUS = calendarStatusImpl as {
  readonly CONFIRMED: "confirmed";
  readonly TENTATIVE: "tentative";
  readonly CANCELLED: "cancelled";
};

/** Transparency hints whether an event blocks availability. */
export const CALENDAR_TRANSPARENCY = calendarTransparencyImpl as {
  readonly OPAQUE: "opaque";
  readonly TRANSPARENT: "transparent";
};

/** Status string derived from an iCalendar `STATUS` field. */
export type CalendarStatus = (typeof CALENDAR_STATUS)[keyof typeof CALENDAR_STATUS];

/** Transparency hint derived from the `TRANSP` property. */
export type CalendarTransparency =
  (typeof CALENDAR_TRANSPARENCY)[keyof typeof CALENDAR_TRANSPARENCY];

/**
 * Parsed calendar event. These objects are immutable snapshots of VEVENT entries
 * and intentionally omit recurrence expansion.
 */
export interface CalendarEvent {
  /** Stable identifier supplied by the feed (or generated fallback). */
  uid: string;
  /** Inclusive start timestamp. */
  start: Date;
  /** Exclusive end timestamp. */
  end: Date;
  /** Whether the event spans entire days. */
  isAllDay: boolean;
  /** Canonicalised status, e.g. `confirmed` or `tentative`. */
  status: CalendarStatus;
  /** Whether the event blocks availability (`opaque`) or not. */
  transparency: CalendarTransparency;
  /** Optional short summary of the event. */
  summary: string | null;
  /** Optional long-form description. */
  description: string | null;
  /** Optional location string (venue, address, etc.). */
  location: string | null;
  /** Incrementing revision counter used by some providers. */
  sequence: number;
  /** Raw RRULE string when the event represents a recurrence template. */
  recurrenceRule: string | null;
}

/** Time window filter applied during parsing. */
export interface CalendarWindow {
  /** Inclusive lower bound; events ending before this instant are omitted. */
  start?: Date;
  /** Exclusive upper bound; events starting at or after this instant are omitted. */
  end?: Date;
}

/** Optional knobs that influence how iCalendar feeds are parsed. */
export interface ParseICalendarOptions {
  /** Include cancelled events instead of skipping them. */
  includeCancelled?: boolean;
  /** Restrict parsing to a specific time window. */
  window?: CalendarWindow;
  /**
   * Default timezone used for floating timestamps lacking `TZID`. Helpful for
   * providers that emit local times without explicit identifiers.
   */
  defaultTimezone?: string;
}

/**
 * Parses an iCalendar feed into immutable {@link CalendarEvent} objects.
 */
export const parseICalendar = parseICalendarImpl as (
  source: string | Buffer,
  options?: ParseICalendarOptions
) => ReadonlyArray<CalendarEvent>;
