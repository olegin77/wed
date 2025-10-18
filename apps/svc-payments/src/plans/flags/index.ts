const PRO_FEATURES = new Set([
  'advanced-analytics',
  'priority-support',
  'multi-user',
]);

const BUSINESS_FEATURES = new Set([...PRO_FEATURES, 'white-label']);

export const hasFeature = (plan: string, feature: string): boolean => {
  if (plan === 'business') return true;
  if (plan === 'pro') return PRO_FEATURES.has(feature) || feature === 'basic';
  if (plan === 'basic') return feature === 'basic';
  return false;
};

export const availableFeatures = (plan: string): string[] => {
  switch (plan) {
    case 'business':
      return Array.from(BUSINESS_FEATURES).concat('basic');
    case 'pro':
      return Array.from(PRO_FEATURES).concat('basic');
    case 'basic':
      return ['basic'];
    default:
      return [];
  }
};
