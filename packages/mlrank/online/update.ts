// ML Ranking online update functions
export interface RankInput {
  vendorId: string;
  score: number;
  features: Record<string, number>;
}

export interface RankEvent {
  type: 'click' | 'view' | 'conversion';
  vendorId: string;
  delta?: number;
  timestamp: Date;
}

export interface RankState {
  weights: Record<string, number>;
  lastUpdated: Date;
}

let state: RankState = {
  weights: {},
  lastUpdated: new Date(),
};

export function updateRanking(event: RankEvent): void {
  if (!event.delta) return;
  
  // Simple ranking update logic
  const learningRate = 0.01;
  const weight = state.weights[event.vendorId] || 0;
  state.weights[event.vendorId] = weight + learningRate * event.delta;
  state.lastUpdated = new Date();
}

export function getRanking(vendorId: string): number {
  return state.weights[vendorId] || 0;
}

export function resetWeights(): void {
  state.weights = {};
  state.lastUpdated = new Date();
}

export function getState(): RankState {
  return { ...state };
}

export function setState(newState: RankState): void {
  state = { ...newState };
}