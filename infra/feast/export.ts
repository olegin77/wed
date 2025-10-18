import { mkdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

export function dumpSnapshot(name: string, rows: Record<string, unknown>[]): string {
  const targetPath = resolve("infra", "feast", "snapshots", `${name}.json`);
  mkdirSync(dirname(targetPath), { recursive: true });
  const payload = JSON.stringify(rows, null, 2);
  writeFileSync(targetPath, `${payload}\n`, { encoding: "utf-8" });
  return targetPath;
}
