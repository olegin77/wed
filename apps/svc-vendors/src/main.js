import http from "http";
import { applySecurityHeaders } from "../../../packages/security/headers.js";
import { handleAvailabilityIcs } from "./api/availability-ics.js";

const port = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    applySecurityHeaders(res);

    if (handleAvailabilityIcs(req, res)) {
      return;
    }

    if (req.url === "/health") {
      const db = true; // TODO: заменить stub на реальный ping БД
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ status: "ok", db: typeof db !== "undefined" ? !!db : false })
      );
    }

    res.writeHead(404);
    res.end();
  })
  .listen(port, "0.0.0.0", () => console.log("svc ok", port));

// health

