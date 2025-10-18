/**
 * Mapping between Cyrillic characters and their Latin approximations. The
 * transliteration does not aim to be perfect but keeps URLs readable for the
 * primary locales (ru/uz/kk) that the marketplace targets.
 * @type {Record<string, string>}
 */
const CYRILLIC_TO_LATIN = {
  а: "a", б: "b", в: "v", г: "g", ғ: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", қ: "q", л: "l", м: "m", н: "n", ң: "ng", о: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ў: "u", ү: "u", ұ: "u", ф: "f", х: "h", ҳ: "h",
  ц: "ts", ч: "ch", ш: "sh", щ: "shch", ы: "y", э: "e", ю: "yu", я: "ya", ъ: "", ь: "",
  ә: "a", ө: "o", і: "i", ї: "i", ґ: "g", қ: "q", ү: "u", ұ: "u", һ: "h",
};

/**
 * Converts Cyrillic strings to their Latin counterparts so the slug normaliser
 * can operate on ASCII characters and produce friendly URLs.
 *
 * @param {string} value - String to transliterate.
 * @returns {string} Transliteration result.
 */
function transliterate(value) {
  let result = "";
  for (const char of value) {
    const lower = char.toLowerCase();
    if (CYRILLIC_TO_LATIN[lower] !== undefined) {
      const transliterated = CYRILLIC_TO_LATIN[lower];
      result += char === lower ? transliterated : transliterated.charAt(0).toUpperCase() + transliterated.slice(1);
    } else {
      result += char;
    }
  }
  return result.toLowerCase();
}

/**
 * Normalizes a dynamic route slug that may come from query parameters. The helper
 * only allows latin letters, numbers, and dashes so that the resulting value can
 * safely participate in URLs, test fixtures, and server-rendered markup without
 * introducing XSS vectors.
 *
 * @param {unknown} rawValue - Slug extracted from the Next.js `params` bag.
 * @param {object} [options]
 * @param {string} [options.fallback="all"] - Fallback value returned when the
 *   provided slug is empty or contains no safe characters.
 * @returns {string} Sanitised slug that is safe to use in URLs and templates.
 */
export function normalizeSlug(rawValue, options = {}) {
  const fallback = typeof options.fallback === "string" && options.fallback.trim().length > 0
    ? options.fallback.trim().toLowerCase()
    : "all";

  if (typeof rawValue !== "string") {
    return fallback;
  }

  const trimmed = rawValue.trim();
  if (trimmed.length === 0) {
    return fallback;
  }

  const transliterated = transliterate(trimmed);
  const normalized = transliterated
    .normalize("NFKD")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");

  return normalized.length > 0 ? normalized : fallback;
}

/**
 * Builds basic SEO metadata for vendor listing pages. Even though this is a
 * server-side rendered stub, the metadata keeps the surface ready for future
 * enhancement when actual catalog data becomes available.
 *
 * @param {string} city - Normalized city slug.
 * @param {string | null} [category] - Optional normalized vendor category slug.
 * @returns {{ title: string, description: string, canonicalPath: string }} SEO metadata.
 */
export function buildSeoMetadata(city, category = null) {
  const readableCity = city.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  const readableCategory = category
    ? category.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : null;

  const baseTitle = readableCategory ? `${readableCategory} в ${readableCity}` : `Поставщики в ${readableCity}`;
  const canonicalPath = readableCategory
    ? `/vendors/${city}/${category}`
    : `/vendors/${city}`;

  return {
    title: `${baseTitle} — WeddingTech`,
    description: readableCategory
      ? `Подборка категории «${readableCategory}» в городе ${readableCity}.`
      : `Каталог проверенных поставщиков для города ${readableCity}.`,
    canonicalPath,
  };
}

/**
 * Produces a predictable payload that our server-side rendered vendor pages can
 * consume. The helper keeps the props structure consistent between the city and
 * category variants and encapsulates how we normalise filters supplied via the
 * query string.
 *
 * @param {object} context - Next.js server-side context.
 * @param {Record<string, string | string[] | undefined>} [context.query] - Query string map.
 * @param {string | undefined} [context.category] - Optional category slug supplied by the caller.
 * @param {string} context.city - City slug from the dynamic route params.
 * @returns {{ city: string, category: string | null, filters: string[], metadata: ReturnType<typeof buildSeoMetadata> }}
 *   Prepared props for the vendor listing page.
 */
export function buildVendorPageProps({ city, category, query = {} }) {
  const citySlug = normalizeSlug(city);
  const categorySlug = typeof category === "string" ? normalizeSlug(category) : null;

  const filters = [];
  const rawFilters = query.filter;
  if (Array.isArray(rawFilters)) {
    for (const value of rawFilters) {
      filters.push(normalizeSlug(value));
    }
  } else if (typeof rawFilters === "string") {
    filters.push(normalizeSlug(rawFilters));
  }

  return {
    city: citySlug,
    category: categorySlug,
    filters,
    metadata: buildSeoMetadata(citySlug, categorySlug),
  };
}

/**
 * @typedef {ReturnType<typeof buildVendorPageProps>} VendorPageProps
 */
export const __vendorPagePropsDoc = undefined;
