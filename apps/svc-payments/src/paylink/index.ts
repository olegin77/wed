export function payLink(invoiceId: string): string {
  return `/pay/${invoiceId}`;
}

const DEFAULT_BASE = process.env.PAYMENT_PORTAL_URL ?? "https://pay.weddingtech.uz";

type PayLinkOptions = {
  amount?: number;
  currency?: string;
  locale?: string;
  token?: string;
};

function buildQuery(options: PayLinkOptions): string {
  const params = new URLSearchParams();
  if (options.amount) params.set("amount", options.amount.toFixed(2));
  if (options.currency) params.set("currency", options.currency);
  if (options.locale) params.set("locale", options.locale);
  if (options.token) params.set("token", options.token);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function createPayLink(invoiceId: string, options: PayLinkOptions = {}): string {
  if (!invoiceId) {
    throw new Error("invoiceId is required to build a pay link");
  }
  const base = DEFAULT_BASE.replace(/\/$/, "");
  return `${base}/pay/${invoiceId}${buildQuery(options)}`;
}
