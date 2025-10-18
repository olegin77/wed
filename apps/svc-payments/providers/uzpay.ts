export interface UzPayConfig {
  merchantId: string;
  secretKey: string;
  endpoint?: string;
}

type PaymentRequest = Record<string, unknown> & { amount: number; orderId: string };

export function initUzPay(config: UzPayConfig) {
  return {
    pay(order: PaymentRequest) {
      return {
        ok: true,
        provider: "uzpay" as const,
        endpoint: config.endpoint ?? "https://api.uzpay.uz/pay",
        payload: {
          merchantId: config.merchantId,
          signature: config.secretKey ? "mock-signature" : "",
          amount: order.amount,
          orderId: order.orderId,
        },
      };
    },
  };
}
