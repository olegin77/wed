/**
 * Lightweight and well-documented helpers for importing iCalendar (ICS) feeds.
 * Vendors frequently expose availability calendars that we need to translate
 * into busy slots for booking workflows. The parser below aims to stay within
 * the subset of RFC 5545 that popular providers (Google/Apple/Outlook) use in
 * export feeds. It focuses on deterministic conversions instead of supporting
 * the full recurrence grammar.
 */

/** Canonicalised event statuses that downstream services consume. */
export const CALENDAR_STATUS = Object.freeze({
  CONFIRMED: "confirmed",
  TENTATIVE: "tentative",
  CANCELLED: "cancelled",
});

/** Transparency hints whether the event blocks availability or not. */
export const CALENDAR_TRANSPARENCY = Object.freeze({
  OPAQUE: "opaque",
  TRANSPARENT: "transparent",
});

const STATUS_MAP = Object.freeze({
  CONFIRMED: CALENDAR_STATUS.CONFIRMED,
  TENTATIVE: CALENDAR_STATUS.TENTATIVE,
  CANCELLED: CALENDAR_STATUS.CANCELLED,
});

const TRANSPARENCY_MAP = Object.freeze({
  OPAQUE: CALENDAR_TRANSPARENCY.OPAQUE,
  TRANSPARENT: CALENDAR_TRANSPARENCY.TRANSPARENT,
});

const DEFAULT_OPTIONS = Object.freeze({
  includeCancelled: false,
  window: undefined,
  defaultTimezone: undefined,
});

const tzFormatterCache = new Map();

/**
 * Parses an iCalendar feed and returns structured events ready for downstream
 * availability reconciliation. The helper performs the following operations:
 *
 * - Normalises folded lines and unescapes text values.
 * - Converts DTSTART/DTEND pairs (and optional DURATION) into `Date` objects.
 * - Filters cancelled events unless `includeCancelled` is set.
 * - Applies an optional time window filter to minimise downstream processing.
 *
 * The parser intentionally ignores recurrence rules. Consumers can inspect the
 * `recurrenceRule` field to decide whether to schedule explicit overrides.
 *
 * @param {string | Buffer} source - Raw ICS payload obtained from a vendor.
 * @param {{
 *   includeCancelled?: boolean,
 *   window?: { start?: Date, end?: Date },
 *   defaultTimezone?: string
 * }} [options]
 * @returns {ReadonlyArray<CalendarEvent>} Array of parsed events ordered by start date.
 */
export function parseICalendar(source, options = {}) {
  const resolvedOptions = { ...DEFAULT_OPTIONS, ...options };
  const calendarText = normaliseSource(source);
  const lines = unfoldLines(calendarText.split(/\r?\n/));

  /** @type {CalendarEvent[]} */
  const events = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line === "BEGIN:VEVENT") {
      current = { props: new Map() };
      continue;
    }
    if (line === "END:VEVENT") {
      if (current) {
        const event = finaliseEvent(current, resolvedOptions);
        if (event) {
          events.push(event);
        }
      }
      current = null;
      continue;
    }
    if (!current || line.length === 0) {
      continue;
    }

    const parsed = parsePropertyLine(line);
    if (!parsed) {
      continue;
    }

    const { name, params, value } = parsed;
    if (!current.props.has(name)) {
      current.props.set(name, []);
    }
    current.props.get(name).push({ value, params });
  }

  events.sort((a, b) => a.start.getTime() - b.start.getTime());
  return Object.freeze(events.map(Object.freeze));
}

/**
 * Finalises an accumulated VEVENT entry into a plain event object.
 *
 * @param {{ props: Map<string, Array<{ value: string, params: Record<string, string[]> }>> }}
 *   vevent - Parsed VEVENT properties.
 * @param {{ includeCancelled: boolean, window?: { start?: Date, end?: Date }, defaultTimezone?: string }} options
 * @returns {CalendarEvent | undefined}
 */
function finaliseEvent(vevent, options) {
  const startEntry = vevent.props.get("DTSTART")?.[0];
  if (!startEntry) {
    return undefined;
  }

  const startParse = parseTemporalEntry(startEntry, options.defaultTimezone);
  if (!startParse) {
    return undefined;
  }

  const endEntry = vevent.props.get("DTEND")?.[0];
  let endParse = endEntry
    ? parseTemporalEntry(endEntry, options.defaultTimezone)
    : undefined;

  if (!endParse) {
    const durationEntry = vevent.props.get("DURATION")?.[0];
    if (durationEntry) {
      const durationMs = parseDuration(durationEntry.value);
      if (Number.isFinite(durationMs)) {
        endParse = {
          date: new Date(startParse.date.getTime() + durationMs),
          isAllDay: startParse.isAllDay && durationMs % DAY_MS === 0,
        };
      }
    }
  }

  if (!endParse) {
    endParse = startParse.isAllDay
      ? { date: new Date(startParse.date.getTime() + DAY_MS), isAllDay: true }
      : { date: new Date(startParse.date.getTime()), isAllDay: false };
  }

  const statusRaw = vevent.props.get("STATUS")?.[0]?.value ?? "CONFIRMED";
  const status = STATUS_MAP[statusRaw.toUpperCase()] ?? CALENDAR_STATUS.CONFIRMED;
  if (!options.includeCancelled && status === CALENDAR_STATUS.CANCELLED) {
    return undefined;
  }

  const transparencyRaw = vevent.props.get("TRANSP")?.[0]?.value ?? "OPAQUE";
  const transparency =
    TRANSPARENCY_MAP[transparencyRaw.toUpperCase()] ?? CALENDAR_TRANSPARENCY.OPAQUE;

  const uid = vevent.props.get("UID")?.[0]?.value ?? generateDeterministicUid(startParse, endParse);
  const summary = vevent.props.get("SUMMARY")?.[0]?.value ?? null;
  const description = vevent.props.get("DESCRIPTION")?.[0]?.value ?? null;
  const location = vevent.props.get("LOCATION")?.[0]?.value ?? null;
  const sequenceRaw = vevent.props.get("SEQUENCE")?.[0]?.value;
  const sequence = sequenceRaw ? Number.parseInt(sequenceRaw, 10) : 0;
  const recurrenceRule = vevent.props.get("RRULE")?.[0]?.value ?? null;

  const event = {
    uid,
    start: startParse.date,
    end: endParse.date,
    isAllDay: Boolean(startParse.isAllDay || endParse.isAllDay),
    status,
    transparency,
    summary,
    description,
    location,
    sequence: Number.isFinite(sequence) ? sequence : 0,
    recurrenceRule,
  };

  if (!passesWindow(event, options.window)) {
    return undefined;
  }

  return event;
}

/** @param {CalendarEvent} event */
function passesWindow(event, window) {
  if (!window) {
    return true;
  }
  if (window.start && event.end <= window.start) {
    return false;
  }
  if (window.end && event.start >= window.end) {
    return false;
  }
  return true;
}

/**
 * Parses a DTSTART/DTEND entry into a JavaScript date while respecting TZID and
 * all-day hints.
 *
 * @param {{ value: string, params: Record<string, string[]> }} entry
 * @param {string | undefined} defaultTimezone
 * @returns {{ date: Date, isAllDay: boolean } | undefined}
 */
function parseTemporalEntry(entry, defaultTimezone) {
  const params = entry.params ?? {};
  const isDateOnly = params.VALUE?.some((value) => value.toUpperCase() === "DATE") ?? false;

  if (isDateOnly) {
    const components = parseDateComponents(entry.value);
    if (!components) {
      return undefined;
    }
    const timezone = params.TZID?.[0] ?? defaultTimezone;
    const date = resolveDateTime({ ...components, hour: 0, minute: 0, second: 0 }, timezone, true);
    return date ? { date, isAllDay: true } : undefined;
  }

  const dateTime = parseDateTimeComponents(entry.value);
  if (!dateTime) {
    return undefined;
  }

  if (dateTime.isUTC) {
    return {
      date: new Date(Date.UTC(dateTime.year, dateTime.month - 1, dateTime.day, dateTime.hour, dateTime.minute, dateTime.second)),
      isAllDay: false,
    };
  }

  const timezone = params.TZID?.[0] ?? defaultTimezone;
  const date = resolveDateTime(dateTime, timezone, false);
  if (date) {
    return { date, isAllDay: false };
  }

  // Fallback: interpret the timestamp as floating local time.
  return {
    date: new Date(
      dateTime.year,
      dateTime.month - 1,
      dateTime.day,
      dateTime.hour,
      dateTime.minute,
      dateTime.second
    ),
    isAllDay: false,
  };
}

/**
 * Parses `YYYYMMDD` strings used for all-day events.
 * @param {string} value
 * @returns {{ year: number, month: number, day: number } | undefined}
 */
function parseDateComponents(value) {
  const match = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
  if (!match) {
    return undefined;
  }
  return {
    year: Number.parseInt(match[1], 10),
    month: Number.parseInt(match[2], 10),
    day: Number.parseInt(match[3], 10),
  };
}

/**
 * Parses a `YYYYMMDDTHHMMSS` (optionally without seconds) timestamp.
 * @param {string} value
 * @returns {{ year: number, month: number, day: number, hour: number, minute: number, second: number, isUTC: boolean } | undefined}
 */
function parseDateTimeComponents(value) {
  const isUTC = value.endsWith("Z");
  const normalized = isUTC ? value.slice(0, -1) : value;
  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?$/.exec(normalized);
  if (!match) {
    return undefined;
  }
  const secondPart = match[6];
  return {
    year: Number.parseInt(match[1], 10),
    month: Number.parseInt(match[2], 10),
    day: Number.parseInt(match[3], 10),
    hour: Number.parseInt(match[4], 10),
    minute: Number.parseInt(match[5], 10),
    second: secondPart ? Number.parseInt(secondPart, 10) : 0,
    isUTC,
  };
}

/**
 * Resolves a timestamp in a named timezone into a JavaScript `Date`.
 *
 * @param {{ year: number, month: number, day: number, hour: number, minute: number, second: number }} components
 * @param {string | undefined} timezone
 * @param {boolean} allowStartOfDay - Treats missing timezone as UTC for all-day events.
 * @returns {Date | undefined}
 */
function resolveDateTime(components, timezone, allowStartOfDay) {
  if (!timezone) {
    if (allowStartOfDay) {
      return new Date(Date.UTC(components.year, components.month - 1, components.day, components.hour, components.minute, components.second));
    }
    return undefined;
  }

  const formatter = getTimezoneFormatter(timezone);
  const naiveUtc = Date.UTC(
    components.year,
    components.month - 1,
    components.day,
    components.hour,
    components.minute,
    components.second
  );
  const parts = formatter.formatToParts(new Date(naiveUtc));
  const zoned = extractDateParts(parts);
  if (!zoned) {
    return undefined;
  }
  const actualUtc = Date.UTC(
    zoned.year,
    zoned.month - 1,
    zoned.day,
    zoned.hour,
    zoned.minute,
    zoned.second
  );
  const offset = actualUtc - naiveUtc;
  return new Date(naiveUtc - offset);
}

/**
 * Re-uses `Intl.DateTimeFormat` instances for timezone conversions.
 * @param {string} timezone
 */
function getTimezoneFormatter(timezone) {
  if (!tzFormatterCache.has(timezone)) {
    tzFormatterCache.set(
      timezone,
      new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  }
  return tzFormatterCache.get(timezone);
}

/**
 * @param {Intl.DateTimeFormatPart[]} parts
 * @returns {{ year: number, month: number, day: number, hour: number, minute: number, second: number } | undefined}
 */
function extractDateParts(parts) {
  const bucket = {};
  for (const part of parts) {
    if (part.type === "literal") {
      continue;
    }
    bucket[part.type] = Number.parseInt(part.value, 10);
  }
  if (
    bucket.year === undefined ||
    bucket.month === undefined ||
    bucket.day === undefined ||
    bucket.hour === undefined ||
    bucket.minute === undefined ||
    bucket.second === undefined
  ) {
    return undefined;
  }
  return bucket;
}

/**
 * Parses RFC 5545 duration strings (e.g. `PT1H30M`).
 * @param {string} value
 * @returns {number}
 */
function parseDuration(value) {
  const match = /^P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/.exec(value);
  if (!match) {
    return Number.NaN;
  }
  const weeks = Number.parseInt(match[1] ?? "0", 10);
  const days = Number.parseInt(match[2] ?? "0", 10);
  const hours = Number.parseInt(match[3] ?? "0", 10);
  const minutes = Number.parseInt(match[4] ?? "0", 10);
  const seconds = Number.parseInt(match[5] ?? "0", 10);
  return (
    weeks * 7 * DAY_MS +
    days * DAY_MS +
    hours * HOUR_MS +
    minutes * MINUTE_MS +
    seconds * SECOND_MS
  );
}

/**
 * Generates a deterministic UID fallback when a feed omits the field. The
 * combination of timestamps keeps the identifier stable across imports.
 *
 * @param {{ date: Date }} start
 * @param {{ date: Date }} end
 * @returns {string}
 */
function generateDeterministicUid(start, end) {
  return ["wt", start.date.toISOString(), end.date.toISOString()].join(":");
}

/** Normalises input strings and buffers into UTF-8 text. */
function normaliseSource(source) {
  if (typeof source === "string") {
    return source;
  }
  if (Buffer.isBuffer(source)) {
    return source.toString("utf8");
  }
  throw new TypeError("ical.invalid_source");
}

/**
 * Unfolds lines according to RFC 5545 section 3.1. Lines beginning with a
 * space or horizontal tab continue the previous line.
 *
 * @param {string[]} lines
 * @returns {string[]}
 */
function unfoldLines(lines) {
  const unfolded = [];
  for (const line of lines) {
    if (/^[ \t]/.test(line) && unfolded.length > 0) {
      unfolded[unfolded.length - 1] += line.slice(1);
    } else {
      unfolded.push(line);
    }
  }
  return unfolded;
}

/**
 * Parses a property line into name, parameters, and value.
 * @param {string} line
 * @returns {{ name: string, params: Record<string, string[]>, value: string } | undefined}
 */
function parsePropertyLine(line) {
  const colonIndex = line.indexOf(":");
  if (colonIndex === -1) {
    return undefined;
  }
  const nameAndParams = line.slice(0, colonIndex);
  const value = unescapeValue(line.slice(colonIndex + 1));
  const segments = nameAndParams.split(";");
  const name = segments[0].toUpperCase();
  const params = {};
  for (let i = 1; i < segments.length; i += 1) {
    const segment = segments[i];
    const [rawKey, rawValue] = segment.split("=");
    if (!rawKey) {
      continue;
    }
    const key = rawKey.toUpperCase();
    if (!rawValue) {
      params[key] = ["TRUE"];
      continue;
    }
    params[key] = rawValue.split(",").map((entry) => entry.trim());
  }
  return { name, params, value };
}

/**
 * Unescapes characters according to RFC 5545 section 3.3.11.
 * @param {string} value
 */
function unescapeValue(value) {
  return value
    .replace(/\\\\/g, "\\")
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";");
}

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/**
 * @typedef {Object} CalendarEvent
 * @property {string} uid - Stable identifier supplied by the feed (or generated fallback).
 * @property {Date} start - Inclusive start timestamp of the event.
 * @property {Date} end - Exclusive end timestamp of the event.
 * @property {boolean} isAllDay - Whether the event covers full days.
 * @property {"confirmed" | "tentative" | "cancelled"} status - Canonical status derived from `STATUS`.
 * @property {"opaque" | "transparent"} transparency - `TRANSP` hint describing busy/available state.
 * @property {string | null} summary - Optional short title.
 * @property {string | null} description - Optional detailed description.
 * @property {string | null} location - Optional location field.
 * @property {number} sequence - Incrementing revision counter used by some providers.
 * @property {string | null} recurrenceRule - Raw RRULE value for recurring events.
 */
