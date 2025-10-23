const http = require("http");
const { applySecurityHeaders } = require("../../../packages/security/headers.js");

const port = process.env.PORT || 3000;

http
  .createServer((req, res) => {
    applySecurityHeaders(res);
    
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
      return;
    }

    res.writeHead(404);
    res.end();
  })
  .listen(port, "0.0.0.0", () => {
    console.log("svc ok", port);
  });

// health

