import fs from "node:fs";
import path from "node:path";

const cities = ["tashkent", "samarkand", "bukhara", "namangan", "andijan"] as const;
const categories = ["venues", "catering", "photo", "video", "music", "decor"] as const;

export function buildSitemap(baseUrl = "https://weddingtech.uz") {
  const urls = [
    "/",
    "/catalog",
    ...cities.flatMap((city) => categories.map((category) => `/catalog/${city}/${category}`)),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map((slug) => `<url><loc>${baseUrl}${slug}</loc></url>`)
    .join("")}</urlset>`;

  const outputDir = path.join(process.cwd(), "apps", "svc-website", "public");
  fs.mkdirSync(outputDir, { recursive: true });
  const filepath = path.join(outputDir, "sitemap.xml");
  fs.writeFileSync(filepath, xml);
  return { ok: true, path: filepath };
}
