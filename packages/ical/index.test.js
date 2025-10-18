import assert from "node:assert/strict";
import test from "node:test";
import { parseICalendar, CALENDAR_STATUS, CALENDAR_TRANSPARENCY } from "./index.js";

test("parses iCalendar feeds into structured events", () => {
  const feed = Buffer.from(
    [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//WeddingTech//Calendar Import//EN",
      "BEGIN:VEVENT",
      "UID:event-1@example.com",
      "DTSTART;TZID=Asia/Tashkent:20240115T100000",
      "DTEND;TZID=Asia/Tashkent:20240115T110000",
      "SUMMARY:Initial consultation",
      "LOCATION:Tashkent HQ",
      "DESCRIPTION:Discuss requirements\\nCapture expectations",
      "SEQUENCE:2",
      "RRULE:FREQ=MONTHLY;COUNT=3",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "UID:event-2@example.com",
      "DTSTART;VALUE=DATE:20240120",
      "SUMMARY:Full-day site visit",
      "DESCRIPTION:All-day block for venue walkthrough",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "DTSTART;TZID=Asia/Almaty:20240122T090000",
      "DURATION:PT3H",
      "STATUS:TENTATIVE",
      "TRANSP:TRANSPARENT",
      "DESCRIPTION:Prep call with vendor, confirm agenda",
      "SUMMARY:Prep call (folded title that spans",
      "  lines for readability)",
      "RRULE:FREQ=WEEKLY;COUNT=4",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "UID:event-3@example.com",
      "DTSTART:20240125T090000Z",
      "DURATION:PT2H",
      "STATUS:CANCELLED",
      "SUMMARY:Deprecated meeting",
      "END:VEVENT",
      "END:VCALENDAR",
      "",
    ].join("\r\n"),
    "utf8"
  );

  const events = parseICalendar(feed);
  assert.equal(events.length, 3, "cancelled events are excluded by default");

  const [first, second, third] = events;

  assert.equal(first.uid, "event-1@example.com");
  assert.equal(first.summary, "Initial consultation");
  assert.equal(first.description, "Discuss requirements\nCapture expectations");
  assert.equal(first.location, "Tashkent HQ");
  assert.equal(first.sequence, 2);
  assert.equal(first.recurrenceRule, "FREQ=MONTHLY;COUNT=3");
  assert.equal(first.status, CALENDAR_STATUS.CONFIRMED);
  assert.equal(first.transparency, CALENDAR_TRANSPARENCY.OPAQUE);
  assert.equal(first.start.toISOString(), "2024-01-15T05:00:00.000Z");
  assert.equal(first.end.toISOString(), "2024-01-15T06:00:00.000Z");
  assert.equal(first.isAllDay, false);

  assert.equal(second.uid, "event-2@example.com");
  assert.equal(second.isAllDay, true);
  assert.equal(second.start.toISOString(), "2024-01-20T00:00:00.000Z");
  assert.equal(second.end.toISOString(), "2024-01-21T00:00:00.000Z");

  assert.equal(third.status, CALENDAR_STATUS.TENTATIVE);
  assert.equal(third.transparency, CALENDAR_TRANSPARENCY.TRANSPARENT);
  assert.ok(third.uid.startsWith("wt:"), "missing UID falls back to deterministic hash");
  assert.equal(
    third.summary,
    "Prep call (folded title that spans lines for readability)"
  );
  assert.equal(third.description, "Prep call with vendor, confirm agenda");
  assert.equal(third.recurrenceRule, "FREQ=WEEKLY;COUNT=4");
  assert.equal(third.start.toISOString(), "2024-01-22T03:00:00.000Z");
  assert.equal(third.end.toISOString(), "2024-01-22T06:00:00.000Z");
});

test("supports cancelled events, floating timestamps, and window filtering", () => {
  const feed = `BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:window-case\nDTSTART:20240201T090000\nDTEND:20240201T110000\nSUMMARY:Floating time\nEND:VEVENT\nBEGIN:VEVENT\nUID:cancelled\nDTSTART:20240202T120000Z\nDURATION:PT1H\nSTATUS:CANCELLED\nSUMMARY:Cancelled slot\nEND:VEVENT\nEND:VCALENDAR`;

  const baseOptions = {
    includeCancelled: true,
    defaultTimezone: "Europe/Moscow",
    window: {
      start: new Date("2024-02-01T05:00:00.000Z"),
      end: new Date("2024-02-02T00:00:00.000Z"),
    },
  };

  const events = parseICalendar(feed, baseOptions);
  assert.equal(events.length, 1, "window filter excludes cancelled event outside window");
  const [single] = events;
  assert.equal(single.uid, "window-case");
  assert.equal(single.start.toISOString(), "2024-02-01T06:00:00.000Z");
  assert.equal(single.end.toISOString(), "2024-02-01T08:00:00.000Z");
  assert.equal(single.status, CALENDAR_STATUS.CONFIRMED);
});
