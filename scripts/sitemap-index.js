const { writeFileSync, mkdirSync } = require("fs");
const { dirname, resolve } = require("path");

const baseUrl = process.env.WEBSITE_BASE_URL || "https://example.com";
const sitemapList = (process.env.SITEMAP_FILES || "sitemap.xml")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const entries = sitemapList
  .map((file) => {
    const url = new URL(file, `${baseUrl}/`).toString();
    return `  <sitemap>\n    <loc>${url}</loc>\n  </sitemap>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;

const outputPath = resolve(__dirname, "../public/sitemap-index.xml");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, xml);

console.log(`sitemap-index.xml generated (${sitemapList.length} files)`);
