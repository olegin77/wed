const DEFAULT_CLICK_ENDPOINT = "https://api.click.uz/v2/pay";

/**
 * Credentials required for the Click Uzbekistan payment gateway.
 */
export interface ClickConfig {
  /** Identifier of the Click service (a numeric code). */
  serviceId: string;
  /** Merchant identifier assigned by Click. */
  merchantId: string;
  /** Secret key used for HMAC-style signatures. */
  secretKey: string;
  /** Optional endpoint override for sandbox environments. */
  endpoint?: string;
}

/**
 * Minimal order payload Click expects for invoice creation.
 */
export interface ClickOrder {
  amount: number;
  orderId: string;
  description?: string;
  returnUrl?: string;
  phone?: string;
}

/**
 * Normalised payment response for the Click stub.
 */
export interface ClickPayment {
  ok: true;
  provider: "click";
  endpoint: string;
  payload: {
    serviceId: string;
    merchantId: string;
    amount: number;
    orderId: string;
    description?: string;
    returnUrl?: string;
    phone?: string;
    signature: string;
  };
}

/**
 * Public client contract returned by the factory.
 */
export interface ClickClient {
  pay(order: ClickOrder): ClickPayment;
}

/**
 * Click requires a SHA-1 signature in production; for the stub we build a
 * deterministic base64 string to keep integration tests cheap while still
 * validating that the secret key participates in the payload.
 */
function buildSignature(config: ClickConfig, order: ClickOrder): string {
  const raw = `${config.serviceId}:${config.merchantId}:${order.orderId}:${order.amount}:${config.secretKey}`;
  return Buffer.from(raw).toString("base64url");
}

/**
 * Initialises the Click client with a single documented payment helper.
 */
export function initClick(config: ClickConfig): ClickClient {
  const endpoint = config.endpoint ?? DEFAULT_CLICK_ENDPOINT;

  return {
    pay(order) {
      return {
        ok: true as const,
        provider: "click" as const,
        endpoint,
        payload: {
          serviceId: config.serviceId,
          merchantId: config.merchantId,
          amount: order.amount,
          orderId: order.orderId,
          description: order.description,
          returnUrl: order.returnUrl,
          phone: order.phone,
          signature: buildSignature(config, order),
        },
      };
    },
  };
}
