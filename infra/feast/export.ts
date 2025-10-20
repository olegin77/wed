import { mkdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";

export interface SnapshotOptions {
  metadata?: Record<string, unknown>;
  pretty?: boolean;
}

/**
 * Сериализует набор признаков в JSON и сохраняет в каталоге `infra/feast/snapshots`.
 * Возвращает абсолютный путь к файлу, что удобно для логирования в пайплайнах.
 */
export function dumpSnapshot(
  name: string,
  rows: Record<string, unknown>[],
  options: SnapshotOptions = {},
): string {
  const targetPath = resolve("infra", "feast", "snapshots", `${name}.json`);
  mkdirSync(dirname(targetPath), { recursive: true });

  const payload = options.metadata
    ? { metadata: { generatedAt: new Date().toISOString(), ...options.metadata }, rows }
    : rows;

  const indent = options.pretty === false ? undefined : 2;
  writeFileSync(targetPath, `${JSON.stringify(payload, null, indent)}\n`, { encoding: "utf-8" });
  return targetPath;
}
