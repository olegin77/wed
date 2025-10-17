export interface WebPushSubscription {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export interface WebPushPayload {
  title: string;
  body: string;
  url?: string;
}

export async function sendWebPush(
  subscription: WebPushSubscription,
  payload: WebPushPayload,
): Promise<void> {
  // In production we'd call web-push library; here we simply log.
  console.info("webpush", subscription.endpoint, payload.title);
}
