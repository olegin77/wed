export interface ClickConfig {
  serviceId: string;
  secretKey: string;
  merchantId: string;
  endpoint?: string;
}

type PaymentRequest = Record<string, unknown> & { amount: number; orderId: string };

export function initClick(config: ClickConfig) {
  return {
    pay(order: PaymentRequest) {
      return {
        ok: true,
        provider: "click" as const,
        endpoint: config.endpoint ?? "https://api.click.uz/v2/pay",
        payload: {
          serviceId: config.serviceId,
          merchantId: config.merchantId,
          signature: config.secretKey ? "mock-signature" : "",
          amount: order.amount,
          orderId: order.orderId,
        },
      };
    },
  };
}
