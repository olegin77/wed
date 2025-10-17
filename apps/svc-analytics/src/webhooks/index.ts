type EventName = "invoice.created" | "payment.completed" | "enquiry.status";

type Subscriber = {
  url: string;
  secret: string;
  events: EventName[];
};

const registry = new Map<string, Subscriber>();

export function subscribe(id: string, payload: Subscriber): void {
  registry.set(id, payload);
}

export function unsubscribe(id: string): void {
  registry.delete(id);
}

export function getSubscribers(event: EventName): Subscriber[] {
  return Array.from(registry.values()).filter((subscriber) => subscriber.events.includes(event));
}
