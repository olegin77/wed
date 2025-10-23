// ML Ranking offline training functions
export interface TrainingData {
  vendorId: string;
  features: Record<string, number>;
  score: number;
  label: number;
}

export interface ModelConfig {
  learningRate: number;
  epochs: number;
  regularization: number;
}

export function trainModel(
  data: TrainingData[],
  config: ModelConfig = {
    learningRate: 0.01,
    epochs: 100,
    regularization: 0.001,
  }
): Record<string, number> {
  // Simple linear regression training
  const weights: Record<string, number> = {};
  const features = new Set<string>();
  
  // Collect all features
  data.forEach(item => {
    Object.keys(item.features).forEach(feature => features.add(feature));
  });
  
  // Initialize weights
  features.forEach(feature => {
    weights[feature] = Math.random() * 0.1;
  });
  
  // Training loop
  for (let epoch = 0; epoch < config.epochs; epoch++) {
    data.forEach(item => {
      const prediction = Object.keys(item.features).reduce((sum, feature) => {
        return sum + (weights[feature] || 0) * item.features[feature];
      }, 0);
      
      const error = item.label - prediction;
      
      // Update weights
      Object.keys(item.features).forEach(feature => {
        weights[feature] = (weights[feature] || 0) + 
          config.learningRate * error * item.features[feature] -
          config.regularization * (weights[feature] || 0);
      });
    });
  }
  
  return weights;
}

export function predictScore(
  features: Record<string, number>,
  weights: Record<string, number>
): number {
  return Object.keys(features).reduce((sum, feature) => {
    return sum + (weights[feature] || 0) * features[feature];
  }, 0);
}