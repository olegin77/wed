export type FeatureValue = number | string | boolean | null;

export type VendorFeatures = {
  conversionRate: number;
  ratingAverage: number;
  profileCompleteness: number;
  calendarAvailability: number;
};

export type FeatureKey<T> = keyof T & string;

export interface FeatureDefinition<T> {
  key: FeatureKey<T>;
  description: string;
  defaultValue: FeatureValue;
}

export interface FeatureSchema<T> {
  name: string;
  features: FeatureDefinition<T>[];
}

const registry = new Map<string, FeatureSchema<any>>();

export function registerFeatures<T>(schema: FeatureSchema<T>): void {
  registry.set(schema.name, schema);
}

export function getSchema<T = Record<string, FeatureValue>>(name: string): FeatureSchema<T> | undefined {
  return registry.get(name);
}

export function serializeRow<T extends Record<string, FeatureValue>>(name: string, values: T): Record<string, FeatureValue> {
  const schema = getSchema<T>(name);
  if (!schema) {
    throw new Error(`Unknown feature set: ${name}`);
  }

  const result: Record<string, FeatureValue> = { __entity__: name };
  for (const feature of schema.features) {
    const value = values[feature.key];
    result[feature.key] = value ?? feature.defaultValue;
  }

  return result;
}

registerFeatures<VendorFeatures>({
  name: "vendor",
  features: [
    {
      key: "conversionRate",
      description: "Доля заявок, конвертирующихся в бронирования",
      defaultValue: 0,
    },
    {
      key: "ratingAverage",
      description: "Средняя оценка отзывов",
      defaultValue: 0,
    },
    {
      key: "profileCompleteness",
      description: "Заполненность профиля поставщика",
      defaultValue: 0,
    },
    {
      key: "calendarAvailability",
      description: "Доступность дат в календаре",
      defaultValue: 0,
    },
  ],
});
