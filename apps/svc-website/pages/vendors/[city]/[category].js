import { buildVendorPageProps } from "../../../lib/vendors-page.js";

/**
 * Server-side loader for the vendor directory narrowed down by city and
 * category. The handler mirrors the city-only variant but ensures the category
 * slug is normalised and exposed to the template for breadcrumb rendering.
 *
 * @param {{ params?: { city?: string, category?: string }, query?: Record<string, string | string[]> }} context -
 *   Dynamic route parameters and query string for the incoming request.
 * @returns {Promise<{ props: { city: string, category: string | null, filters: string[], metadata: { title: string, description: string, canonicalPath: string } } }>} Props consumed by the page component.
 */
export async function getServerSideProps(context) {
  return {
    props: buildVendorPageProps({
      city: context.params?.city,
      category: context.params?.category,
      query: context.query,
    }),
  };
}

/**
 * Renders a minimal HTML stub for the city/category vendor listing. The markup
 * keeps breadcrumb information available to crawlers and future UI layers while
 * remaining compact for the SSR-only placeholder stage.
 *
 * @param {{ city: string, category: string | null, filters: string[], metadata: { title: string, description: string, canonicalPath: string } }} props -
 *   Prepared props returned from {@link getServerSideProps}.
 * @returns {string} HTML snippet rendered by Next.js.
 */
export default function CityCategoryVendorsPage({ city, category, filters, metadata }) {
  const categoryLabel = category ? ` категории ${category}` : "";
  const filterSummary = filters.length > 0 ? ` с фильтрами ${filters.join(", ")}` : "";
  return `<!DOCTYPE html><html lang="ru"><head><title>${metadata.title}</title><meta name="description" content="${metadata.description}" /><link rel="canonical" href="${metadata.canonicalPath}" /></head><body><main><h1>Поставщики ${city}${categoryLabel}</h1><p>Страница каталога${filterSummary}.</p></main></body></html>`;
}
