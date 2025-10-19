# Catalog category reference

`packages/catalog/categories.ts` exposes a hierarchical list of wedding vendor categories grouped by the type of service they
provide. Each category includes Russian, Uzbek, and English titles, optional descriptions, synonyms, and tags to drive search,
filtering, and analytics features across the platform.

## Data structure

- **Root nodes**: venues, media, decor, entertainment, beauty, and services.
- **Nested slugs**: children inherit the parent slug (`venue:banquet-hall`) so URLs and analytics can stitch the hierarchy.
- **Locale-aware titles**: every entry has `title.ru`, `title.uz`, and `title.en` strings ready for UI components.
- **Synonyms/tags**: support fuzzy matching and facets for the search helper.

## Helper functions

- `listRootCategories()` – returns the six high-level groups without children for navigation menus.
- `listChildren(slug)` – fetches immediate children for a given category.
- `getCategory(slug)` – resolves a single category entry, including its locale labels.
- `getCategoryPath(slug)` – returns the breadcrumb chain from the root to the requested category.
- `searchCategories(query)` – lightweight substring search over titles, synonyms, and tags.

These utilities power both the public catalogue and the admin CMS, enabling consistent classification across ingestion, SEO,
search, and reporting pipelines.
