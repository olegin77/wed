export function recommend(city: string, guests: number): number {
  return Math.round(guests * 30 * (city === "Tashkent" ? 1.3 : 1.0));
}
