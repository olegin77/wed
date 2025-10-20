export type IcsEvent = {
  start: string;
  end: string;
  summary: string;
};

export declare function ics(args: { title: string; events: IcsEvent[] }): string;
