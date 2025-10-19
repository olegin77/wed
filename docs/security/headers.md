# HTTP security headers

## Defaults

The `@wt/security` helper ships with the following defaults:

- `X-Frame-Options: DENY` – blocks clickjacking via iframes.
- `X-Content-Type-Options: nosniff` – prevents MIME type sniffing.
- `Referrer-Policy: strict-origin-when-cross-origin` – limits referrer leakage.
- `Cross-Origin-Resource-Policy: same-origin` – isolates resources from other origins.
- `Cross-Origin-Opener-Policy: same-origin` – prevents cross-window interference.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` – disables sensitive device APIs by default.
- `X-DNS-Prefetch-Control: off` – stops DNS prefetching for privacy.

## Usage

```js
import http from "http";
import { applySecurityHeaders } from "../../../packages/security/headers.js";

http.createServer((req, res) => {
  applySecurityHeaders(res);
  // continue with handler logic
});
```

Use the optional second argument to add or override headers for specific routes:

```js
applySecurityHeaders(res, [["Content-Security-Policy", "default-src 'self'"]]);
```
