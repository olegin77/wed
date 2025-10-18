import type { ClientRequest } from "node:http";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";

const DEFAULT_ENDPOINT = "http://localhost:3200/logs/ingest";
const DEFAULT_URL = new URL(DEFAULT_ENDPOINT);

/**
 * Resolves the collector endpoint URL from the environment.
 *
 * @returns {URL} Parsed endpoint URL that always includes a path.
 */
function resolveEndpoint(): URL {
  const candidate = process.env.LOG_SHIP_ENDPOINT;

  if (typeof candidate === "string" && candidate.trim().length > 0) {
    try {
      const parsed = new URL(candidate);
      if (!parsed.pathname || parsed.pathname === "/") {
        parsed.pathname = DEFAULT_URL.pathname;
      }
      return parsed;
    } catch (_) {
      // Fall back to the default endpoint when parsing fails.
    }
  }

  return new URL(DEFAULT_URL.toString());
}

/**
 * Ships a single log line to the remote ingestion endpoint.
 *
 * The collector URL can be configured via the `LOG_SHIP_ENDPOINT` environment
 * variable and supports both HTTP and HTTPS targets. The function suppresses
 * all network errors because logging should never interfere with the main
 * application flow.
 */
export async function ship(line: string): Promise<void> {
  if (!line) {
    return;
  }

  const payload = Buffer.from(line);
  const endpoint = resolveEndpoint();
  const requestImpl = endpoint.protocol === "https:" ? httpsRequest : httpRequest;
  const port = endpoint.port
    ? Number.parseInt(endpoint.port, 10)
    : endpoint.protocol === "https:"
    ? 443
    : 80;

  await new Promise<void>((resolve) => {
    let requestRef: ClientRequest | null = null;
    let settled = false;
    const finalize = () => {
      if (settled) {
        return;
      }
      settled = true;
      requestRef?.destroy();
      resolve();
    };

    try {
      requestRef = requestImpl(
        {
          hostname: endpoint.hostname,
          port,
          path: endpoint.pathname + endpoint.search,
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
            "Content-Length": payload.byteLength,
          },
        },
        (res) => {
          res.on("end", finalize);
          res.on("error", finalize);
          res.resume();
        }
      );

      requestRef.setTimeout(3000, finalize);
      requestRef.on("error", finalize);
      requestRef.write(payload);
      requestRef.end();
    } catch (_) {
      finalize();
    }
  });
}
