# Payment Providers

## UzPay stub integration

- **Module:** `apps/svc-payments/providers/uzpay.ts`
- **Factory:** `initUzPay(config)` returns a client with a single `pay(order)` method.
- **Signature:** `merchantId:orderId:amount:secret` string encoded as `base64url` for predictable integration testing.
- **Endpoints:** Defaults to `https://api.uzpay.uz/pay`; override via `config.endpoint` for sandbox mirrors.
- **Order fields:** Accepts `amount` (tiyin), `orderId`, optional `description`, `returnUrl`, and `metadata` for custom context.

> The helper is intentionally light-weight: the payments service is responsible for HTTP transport and error handling.

## Payme stub integration

- **Module:** `apps/svc-payments/providers/payme.ts`
- **Factory:** `initPayme(config)` issues a client that attaches an HTTP Basic auth header.
- **Auth header:** `Authorization: Basic base64(merchantId:key)`.
- **Endpoints:** Defaults to `https://checkout.payme.uz/api/payments` with optional override for sandboxes.
- **Order fields:** `amount`, `orderId`, optional `description` and `returnUrl` are forwarded as-is to the REST payload.

## Click stub integration

- **Module:** `apps/svc-payments/providers/click.ts`
- **Factory:** `initClick(config)` returns a client that includes service/merchant identifiers and a deterministic signature.
- **Signature:** `serviceId:merchantId:orderId:amount:secret` encoded as `base64url` for predictable fixture generation.
- **Endpoints:** Defaults to `https://api.click.uz/v2/pay`; override with `config.endpoint` for partner sandboxes.
- **Order fields:** `amount`, `orderId`, optional `description`, `returnUrl`, and `phone` are forwarded.
