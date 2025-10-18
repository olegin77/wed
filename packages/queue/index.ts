export type QueueJob<TPayload = unknown> = {
  name: string;
  payload: TPayload;
};

export const enqueue = <TPayload = unknown>(name: string, payload: TPayload): QueueJob<TPayload> => ({
  name,
  payload,
});
