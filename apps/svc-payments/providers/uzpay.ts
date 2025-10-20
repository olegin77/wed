const DEFAULT_UZPAY_ENDPOINT = "https://api.uzpay.uz/pay";

/**
 * Configuration fields required to talk to the UzPay API.
 * Each field maps to the merchant dashboard credentials so we can
 * issue correctly signed payment requests in staging environments.
 */
export interface UzPayConfig {
  /** Public merchant identifier issued by UzPay. */
  merchantId: string;
  /** Shared secret used to build request signatures. */
  secretKey: string;
  /** Optional override for the UzPay API base URL. */
  endpoint?: string;
}

/**
 * Shape of a payment request the provider accepts. The amount is denoted in
 * tiyin (the smallest sum unit) to avoid rounding errors.
 */
export interface UzPayOrder {
  amount: number;
  orderId: string;
  description?: string;
  returnUrl?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Normalised payment response we return back to the payment service.
 */
export interface UzPayPayment {
  ok: true;
  provider: "uzpay";
  endpoint: string;
  payload: {
    merchantId: string;
    amount: number;
    orderId: string;
    description?: string;
    returnUrl?: string;
    metadata?: Record<string, unknown>;
    signature: string;
  };
}

/**
 * Public client contract that exposes the single payment operation.
 */
export interface UzPayClient {
  pay(order: UzPayOrder): UzPayPayment;
}

/**
 * Builds a deterministic signature for the mock implementation so we can
 * trace outgoing payloads and validate basic auth flow during integration
 * testing. The algorithm mirrors the typical concatenation pattern used by
 * UzPay without pulling in crypto dependencies for the stub.
 */
function buildSignature(config: UzPayConfig, order: UzPayOrder): string {
  const raw = `${config.merchantId}:${order.orderId}:${order.amount}:${config.secretKey}`;
  return Buffer.from(raw).toString("base64url");
}

/**
 * Factory that initialises a thin UzPay client. The returned helper builds a
 * signed payload suitable for forwarding to the external checkout endpoint.
 */
export function initUzPay(config: UzPayConfig): UzPayClient {
  const endpoint = config.endpoint ?? DEFAULT_UZPAY_ENDPOINT;

  return {
    pay(order) {
      return {
        ok: true as const,
        provider: "uzpay" as const,
        endpoint,
        payload: {
          merchantId: config.merchantId,
          amount: order.amount,
          orderId: order.orderId,
          description: order.description,
          returnUrl: order.returnUrl,
          metadata: order.metadata,
          signature: buildSignature(config, order),
        },
      };
    },
  };
}
