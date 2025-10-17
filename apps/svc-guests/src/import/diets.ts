export const diets = ["vegan", "vegetarian", "halal", "gluten-free"] as const;
export type DietOption = (typeof diets)[number];

export function normalizeDiet(value: string): DietOption | null {
  const normalized = value.trim().toLowerCase().replace(/[^a-z-]/g, "");
  return diets.find((diet) => diet === normalized) ?? null;
}
