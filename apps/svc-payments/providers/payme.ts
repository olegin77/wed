const DEFAULT_PAYME_ENDPOINT = "https://checkout.payme.uz/api/payments";

/**
 * Merchant credentials required to sign Payme checkout requests.
 */
export interface PaymeConfig {
  /** Identifier of the Payme merchant profile. */
  merchantId: string;
  /** Secret key used for basic-auth header generation. */
  key: string;
  /** Optional Payme endpoint override (useful for staging). */
  endpoint?: string;
}

/**
 * Minimal order data Payme requires for initiating a payment link.
 */
export interface PaymeOrder {
  amount: number;
  orderId: string;
  description?: string;
  returnUrl?: string;
}

/**
 * Response structure produced by the Payme stub.
 */
export interface PaymePayment {
  ok: true;
  provider: "payme";
  endpoint: string;
  payload: {
    merchantId: string;
    amount: number;
    orderId: string;
    description?: string;
    returnUrl?: string;
  };
  headers: {
    Authorization: string;
  };
}

/**
 * Public client returned by the factory.
 */
export interface PaymeClient {
  pay(order: PaymeOrder): PaymePayment;
}

/**
 * Builds the HTTP basic auth header expected by Payme's REST API.
 */
function buildAuthHeader(config: PaymeConfig): string {
  const raw = `${config.merchantId}:${config.key}`;
  return `Basic ${Buffer.from(raw).toString("base64")}`;
}

/**
 * Initialises a documented Payme client with a single `pay` operation.
 */
export function initPayme(config: PaymeConfig): PaymeClient {
  const endpoint = config.endpoint ?? DEFAULT_PAYME_ENDPOINT;
  const Authorization = buildAuthHeader(config);

  return {
    pay(order) {
      return {
        ok: true as const,
        provider: "payme" as const,
        endpoint,
        payload: {
          merchantId: config.merchantId,
          amount: order.amount,
          orderId: order.orderId,
          description: order.description,
          returnUrl: order.returnUrl,
        },
        headers: { Authorization },
      };
    },
  };
}
