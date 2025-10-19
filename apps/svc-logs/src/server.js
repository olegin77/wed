import { createServer } from "node:http";
import { appendFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/**
 * TCP port on which the ingestion service listens.
 */
const port = process.env.PORT || 3200;
const LOG_DIRECTORY_URL = new URL("../logs/", import.meta.url);
const LOG_DIRECTORY = fileURLToPath(LOG_DIRECTORY_URL);
const DAY_FILENAME_PATTERN = /^[0-9-]+$/;

/**
 * Resolves the absolute path to the log file for the current UTC day.
 * @returns {string}
 */
function resolveLogFile() {
  const day = new Date().toISOString().slice(0, 10);
  if (!DAY_FILENAME_PATTERN.test(day)) {
    throw new Error("invalid_log_day_format");
  }
  const target = new URL(`./${day}.log`, LOG_DIRECTORY_URL);
  return fileURLToPath(target);
}

/**
 * HTTP server that accepts log lines and appends them to the daily file.
 */
createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/logs/ingest") {
    try {
      // eslint-disable-next-line security/detect-non-literal-fs-filename -- path derived from static module URL
      await mkdir(LOG_DIRECTORY, { recursive: true });

      /** @type {Buffer[]} */
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      const logFilePath = resolveLogFile();
      // eslint-disable-next-line security/detect-non-literal-fs-filename -- filename validated against DAY_FILENAME_PATTERN
      await appendFile(logFilePath, Buffer.concat(chunks).toString() + "\n");
      res.writeHead(204);
      res.end();
      return;
    } catch (error) {
      console.error("log_ingest_failure", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "failed_to_persist_log" }));
      return;
    }
  }

  res.writeHead(404);
  res.end();
}).listen(port, "0.0.0.0");
