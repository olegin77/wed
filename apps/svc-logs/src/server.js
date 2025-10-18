import { createServer } from "node:http";
import fs from "node:fs";

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
    fs.mkdirSync("logs", { recursive: true });

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    fs.appendFileSync(resolveLogFile(), Buffer.concat(chunks).toString() + "\n");
    res.writeHead(204);
    res.end();
    return;
  }

  res.writeHead(404);
  res.end();
}).listen(port, "0.0.0.0");
