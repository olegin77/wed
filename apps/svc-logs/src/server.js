import { createServer } from "node:http";
import { appendFile, mkdir } from "node:fs/promises";

/**
 * TCP port on which the ingestion service listens.
 */
const port = process.env.PORT || 3200;

/**
 * Resolves the absolute path to the log file for the current UTC day.
 * @returns {string}
 */
function resolveLogFile() {
  const day = new Date().toISOString().slice(0, 10);
  return `logs/${day}.log`;
}

/**
 * HTTP server that accepts log lines and appends them to the daily file.
 */
createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/logs/ingest") {
    try {
      await mkdir("logs", { recursive: true });

      /** @type {Buffer[]} */
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      await appendFile(resolveLogFile(), Buffer.concat(chunks).toString() + "\n");
      res.writeHead(204);
      res.end();
      return;
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "failed_to_persist_log" }));
      return;
    }
  }

  res.writeHead(404);
  res.end();
}).listen(port, "0.0.0.0");
