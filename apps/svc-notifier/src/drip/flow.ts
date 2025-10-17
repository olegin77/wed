export interface DripStep {
  day: number;
  action: string;
}

const flow: DripStep[] = [
  { day: 0, action: "email:welcome" },
  { day: 3, action: "email:checklist" },
  { day: 7, action: "email:vendors-reco" },
];

export default flow;
