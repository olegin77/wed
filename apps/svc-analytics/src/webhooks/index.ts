type EventName = "invoice.created" | "payment.completed" | "enquiry.status";

type Subscriber = {
  url: string;
  secret: string;
  events: EventName[];
};

const registry = new Map<string, Subscriber>();

export function subscribe(id?: string, payload?: Subscriber): boolean | void {
  if (id && payload) {
    registry.set(id, payload);
  } else {
    return true;
  }
}

export function unsubscribe(id: string): void {
  registry.delete(id);
}

export function getSubscribers(event: EventName): Subscriber[] {
  return Array.from(registry.values()).filter((subscriber) => subscriber.events.includes(event));
}
