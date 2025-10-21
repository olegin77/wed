import { URL } from "node:url";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const SORT_PRESETS = {
  rating: [{ rating: "desc" }, { createdAt: "desc" }],
  reviews: [{ reviews: { _count: "desc" } }, { rating: "desc" }],
};

function clampToRange(value, fallback, min, max) {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

/**
 * Parses the incoming request URL and normalises catalog search parameters.
 *
 * @param {string | undefined} rawUrl - Raw request URL.
 * @returns {{ city?: string; category?: string; capacity?: number; minRating?: number; limit: number; page: number; sort: "rating" | "reviews" }}
 *   Structured filter descriptor consumed by Prisma.
 */
export function parseSearchParams(rawUrl) {
  const url = new URL(rawUrl ?? "/catalog/search", "http://localhost");
  const city = url.searchParams.get("city")?.trim() || undefined;
  const category = url.searchParams.get("category")?.trim() || undefined;

  const capacityParam = url.searchParams.get("capacity");
  const capacity = capacityParam ? Number.parseInt(capacityParam, 10) : undefined;
  const normalisedCapacity = Number.isFinite(capacity) && capacity > 0 ? capacity : undefined;

  const ratingParam = url.searchParams.get("rating");
  const minRating = ratingParam ? Number.parseFloat(ratingParam) : undefined;
  const normalisedRating =
    typeof minRating === "number" && Number.isFinite(minRating) && minRating >= 0
      ? Math.min(minRating, 5)
      : undefined;

  const requestedLimit = Number.parseInt(url.searchParams.get("limit") ?? "", 10);
  const limit = clampToRange(requestedLimit, DEFAULT_LIMIT, 1, MAX_LIMIT);

  const requestedPage = Number.parseInt(url.searchParams.get("page") ?? "", 10);
  const page = clampToRange(requestedPage, 1, 1, Number.MAX_SAFE_INTEGER);

  const sortParam = url.searchParams.get("sort")?.toLowerCase();
  const sort = sortParam && sortParam in SORT_PRESETS ? sortParam : "rating";

  return {
    city,
    category,
    capacity: normalisedCapacity,
    minRating: normalisedRating,
    limit,
    page,
    sort,
  };
}

/**
 * Translates normalised filters into a Prisma `where` clause.
 *
 * @param {{ city?: string; category?: string; capacity?: number; minRating?: number }} filters -
 *   Parsed search filters.
 * @returns {import("@prisma/client").Prisma.VendorWhereInput} Prisma-compatible filter expression.
 */
export function buildSearchWhere(filters) {
  const where = {};

  if (filters.city) {
    where.city = filters.city;
  }

  if (filters.category) {
    where.type = filters.category;
  }

  if (typeof filters.minRating === "number") {
    where.rating = { gte: filters.minRating };
  }

  if (typeof filters.capacity === "number") {
    const guests = filters.capacity;
    where.venues = {
      some: {
        AND: [
          {
            OR: [
              { capacityMin: null },
              { capacityMin: { lte: guests } },
            ],
          },
          {
            OR: [
              { capacityMax: null },
              { capacityMax: { gte: guests } },
            ],
          },
        ],
      },
    };
  }

  return where;
}

/**
 * Handles `GET /catalog/search` requests by executing a filtered vendor lookup
 * and responding with the matching profiles alongside the applied filters.
 *
 * @param {import("http").IncomingMessage} req - Node.js request object.
 * @param {import("http").ServerResponse} res - Node.js response.
 * @param {{ prisma: import("@prisma/client").PrismaClient; json: (res: any, status: number, payload: any) => void }} context -
 *   Infrastructure dependencies shared with the service entry point.
 */
export async function handleCatalogSearch(req, res, context) {
  const params = parseSearchParams(req.url);
  const where = buildSearchWhere(params);
  const orderBy = SORT_PRESETS[params.sort] ?? SORT_PRESETS.rating;
  const skip = (params.page - 1) * params.limit;

  const [vendors, total] = await Promise.all([
    context.prisma.vendor.findMany({
      where,
      include: {
        venues: {
          select: {
            id: true,
            title: true,
            capacityMin: true,
            capacityMax: true,
          },
        },
        _count: { select: { reviews: true } },
      },
      orderBy,
      skip,
      take: params.limit,
    }),
    context.prisma.vendor.count({ where }),
  ]);

  context.json(res, 200, {
    ok: true,
    filters: {
      city: params.city,
      category: params.category,
      capacity: params.capacity,
      minRating: params.minRating,
    },
    items: vendors,
    pagination: {
      limit: params.limit,
      page: params.page,
      sort: params.sort,
      total,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    },
  });
}

export const __internal = { DEFAULT_LIMIT, MAX_LIMIT, SORT_PRESETS, clampToRange };
