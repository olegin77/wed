export type LogLevel = "info" | "warn" | "error";

/**
 * Logs a structured JSON entry to stdout and forwards errors to the remote collector.
 *
 * @param level - Severity level of the log entry.
 * @param msg - Human readable message to include.
 * @param extra - Optional structured payload merged into the log entry.
 */
export function logj(level: LogLevel, msg: string, extra: Record<string, unknown> = {}): void {
  const entry = {
    ts: new Date().toISOString(),
    level,
    msg,
    ...extra,
  };

  const serialized = JSON.stringify(entry);
  console.log(serialized);

  if (level === "error") {
    void import("../remote/ship.js")
      .then((module) => module.ship(serialized))
      .catch(() => undefined);
  }
}
