import { ics } from "../../../packages/calendar/ics.js";

const ROUTE_PATH = "/vendors/availability.ics";

function pad(value) {
  return String(value).padStart(2, "0");
}

function toUtcStamp(date) {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

function buildSampleEvents() {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const schedule = [
    { offset: 3 * day, summary: "FREE" },
    { offset: 10 * day, summary: "BUSY" },
  ];

  return schedule.map(({ offset, summary }) => {
    const slotStart = new Date(now + offset);
    const slotEnd = new Date(now + offset + day);
    return {
      summary,
      start: toUtcStamp(slotStart),
      end: toUtcStamp(slotEnd),
    };
  });
}

export function handleAvailabilityIcs(req, res) {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname !== ROUTE_PATH) {
    return false;
  }

  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "method_not_allowed" }));
    return true;
  }

  const calendarBody = ics({
    title: "Vendor Availability",
    events: buildSampleEvents(),
  });

  const headers = {
    "Content-Type": "text/calendar; charset=utf-8",
    "Content-Disposition": 'attachment; filename="availability.ics"',
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(calendarBody, "utf8"),
  };

  res.writeHead(200, headers);
  if (req.method === "GET") {
    res.end(calendarBody);
  } else {
    res.end();
  }
  return true;
}

export const availabilityIcsRoute = ROUTE_PATH;

// health

