import { request } from "node:http";

/**
 * Ships a single log line to the remote ingestion endpoint.
 *
 * The function intentionally suppresses all network errors because logging
 * should never interfere with the main application flow.
 */
export async function ship(line: string): Promise<void> {
  if (!line) {
    return;
  }

  const payload = Buffer.from(line);

  await new Promise<void>((resolve) => {
    const finalize = () => resolve();

    try {
      const req = request(
        {
          hostname: "localhost",
          port: 3200,
          path: "/logs/ingest",
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
            "Content-Length": payload.byteLength,
          },
        },
        (res) => {
          res.on("end", finalize);
          res.resume();
        }
      );

      req.on("error", finalize);
      req.write(payload);
      req.end();
    } catch (_) {
      finalize();
    }
  });
}
