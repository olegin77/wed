import { buildVendorPageProps } from "../../lib/vendors-page.js";

/**
 * Server-side loader for the city-specific vendor directory. The handler keeps
 * the SSR stub deterministic by normalising the city slug and extracting any
 * `filter` query parameters into an array.
 *
 * @param {{ params?: { city?: string }, query?: Record<string, string | string[]> }} context -
 *   Dynamic route parameters and the query string provided by Next.js.
 * @returns {Promise<{ props: { city: string, category: string | null, filters: string[], metadata: { title: string, description: string, canonicalPath: string } } }>} Props consumed by the page component.
 */
export async function getServerSideProps(context) {
  return {
    props: buildVendorPageProps({
      city: context.params?.city,
      query: context.query,
    }),
  };
}

/**
 * Minimal server-rendered component that communicates which vendor city page a
 * visitor has reached. The markup is intentionally tiny yet descriptive so the
 * page can be indexed and extended later without breaking SSR behaviour.
 *
 * @param {{ city: string, filters: string[], metadata: { title: string, description: string, canonicalPath: string } }} props -
 *   Prepared props returned from {@link getServerSideProps}.
 * @returns {string} HTML snippet rendered by Next.js.
 */
export default function CityVendorsPage({ city, filters, metadata }) {
  const filterSummary = filters.length > 0 ? ` с фильтрами ${filters.join(", ")}` : "";
  return `<!DOCTYPE html><html lang="ru"><head><title>${metadata.title}</title><meta name="description" content="${metadata.description}" /><link rel="canonical" href="${metadata.canonicalPath}" /></head><body><main><h1>Поставщики ${city}</h1><p>Страница каталога${filterSummary}.</p></main></body></html>`;
}
