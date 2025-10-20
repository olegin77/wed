export function ics({ title, events }) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WeddingTech//Calendar//EN",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${title}`,
  ];

  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      `SUMMARY:${event.summary}`,
      `DTSTART:${event.start}`,
      `DTEND:${event.end}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR", "");
  return lines.join("\n");
}
