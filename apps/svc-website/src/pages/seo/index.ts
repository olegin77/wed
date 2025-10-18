export const SEO_CITIES = [
  "Tashkent",
  "Samarkand",
  "Bukhara",
  "Namangan",
  "Andijan",
];

export const SEO_CATEGORIES = [
  "venues",
  "catering",
  "photography",
  "videography",
  "music",
  "decor",
];

export function buildSeoLandingPath(city: string, category: string): string {
  const citySlug = city.toLowerCase().replace(/\s+/g, "-");
  const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
  return `/vendors/${citySlug}/${categorySlug}`;
}
