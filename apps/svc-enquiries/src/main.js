import http from "http";

import "./api/slots.js";
import "./api/booking.js";

const port = process.env.PORT || 3000;

http
  .createServer((req, res) => {
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
