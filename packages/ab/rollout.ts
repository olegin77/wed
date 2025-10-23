// A/B testing rollout package
export interface RolloutConfig {
  feature: string;
  percentage: number;
  userId?: string;
  sessionId?: string;
  customAttributes?: Record<string, any>;
}

export interface RolloutResult {
  enabled: boolean;
  variant?: string;
  reason?: string;
}

export class RolloutManager {
  private configs: Map<string, RolloutConfig> = new Map();

  addConfig(config: RolloutConfig): void {
    this.configs.set(config.feature, config);
  }

  removeConfig(feature: string): void {
    this.configs.delete(feature);
  }

  isEnabled(feature: string, userId?: string, sessionId?: string): RolloutResult {
    const config = this.configs.get(feature);
    
    if (!config) {
      return {
        enabled: false,
        reason: 'Feature not configured',
      };
    }

    // Check if user is specifically included
    if (config.userId && config.userId === userId) {
      return {
        enabled: true,
        variant: 'user-specific',
        reason: 'User-specific configuration',
      };
    }

    // Check if session is specifically included
    if (config.sessionId && config.sessionId === sessionId) {
      return {
        enabled: true,
        variant: 'session-specific',
        reason: 'Session-specific configuration',
      };
    }

    // Check percentage rollout
    const hash = this.hashString(`${feature}-${userId || sessionId || 'anonymous'}`);
    const bucket = hash % 100;
    
    if (bucket < config.percentage) {
      return {
        enabled: true,
        variant: 'percentage',
        reason: `User in ${config.percentage}% rollout`,
      };
    }

    return {
      enabled: false,
      reason: `User not in ${config.percentage}% rollout`,
    };
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  getAllConfigs(): RolloutConfig[] {
    return Array.from(this.configs.values());
  }

  clearConfigs(): void {
    this.configs.clear();
  }
}

// Global rollout manager
export const rolloutManager = new RolloutManager();

// Utility functions
export function isFeatureEnabled(
  feature: string,
  userId?: string,
  sessionId?: string
): boolean {
  return rolloutManager.isEnabled(feature, userId, sessionId).enabled;
}

export function getFeatureVariant(
  feature: string,
  userId?: string,
  sessionId?: string
): string | undefined {
  return rolloutManager.isEnabled(feature, userId, sessionId).variant;
}