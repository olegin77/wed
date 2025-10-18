export type LogLevel = "info" | "warn" | "error";

type ShipModule = typeof import("../remote/ship.js");

let shipModulePromise: Promise<ShipModule> | null = null;

/**
 * Lazily loads the remote shipping helper and forwards the serialized log entry.
 *
 * @param serialized - Already serialized JSON log entry.
 */
async function forwardToRemote(serialized: string): Promise<void> {
  try {
    shipModulePromise ??= import("../remote/ship.js");
    const module = await shipModulePromise;
    await module.ship(serialized);
  } catch (_) {
    // Errors are intentionally ignored to keep logging non-blocking.
  }
}

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
    void forwardToRemote(serialized);
  }
}
