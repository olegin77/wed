export interface PaymeConfig {
  merchantId: string;
  key: string;
  endpoint?: string;
}

type PaymentRequest = Record<string, unknown> & { amount: number; orderId: string };

export function initPayme(config: PaymeConfig) {
  return {
    pay(order: PaymentRequest) {
      return {
        ok: true,
        provider: "payme" as const,
        endpoint: config.endpoint ?? "https://checkout.payme.uz/api/payments",
        payload: {
          id: config.merchantId,
          key: config.key,
          amount: order.amount,
          orderId: order.orderId,
        },
      };
    },
  };
}
