import { createServer } from "http";
import { render } from "../../../packages/metrics/index.js";
import { applySecurityHeaders } from "../../../packages/security/headers.js";

const port = process.env.PORT || 3070;

createServer((req, res) => {
  applySecurityHeaders(res);
  
  if (req.url === "/metrics") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end(render());
  }
  
  res.writeHead(404);
  res.end();
}).listen(port, "0.0.0.0");

// health

