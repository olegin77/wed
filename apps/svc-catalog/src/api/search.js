import { URL } from "node:url";
import { URL } from "node:url";
import { URL } from "node:url";
import { URL } from "node:url";




const DEFAULT_LIMIT = 20;
const DEFAULT_LIMIT = 20;
const DEFAULT_LIMIT = 20;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const MAX_LIMIT = 50;
const MAX_LIMIT = 50;
const MAX_LIMIT = 50;
const SORT_PRESETS = {
const SORT_PRESETS = {
const SORT_PRESETS = {
const SORT_PRESETS = {
  rating: [{ rating: "desc" }, { createdAt: "desc" }],
  rating: [{ rating: "desc" }, { createdAt: "desc" }],
  rating: [{ rating: "desc" }, { createdAt: "desc" }],
  rating: [{ rating: "desc" }, { createdAt: "desc" }],
  reviews: [{ reviews: { _count: "desc" } }, { rating: "desc" }],
  reviews: [{ reviews: { _count: "desc" } }, { rating: "desc" }],
  reviews: [{ reviews: { _count: "desc" } }, { rating: "desc" }],
  reviews: [{ reviews: { _count: "desc" } }, { rating: "desc" }],
};
};
};
};




function clampToRange(value, fallback, min, max) {
function clampToRange(value, fallback, min, max) {
function clampToRange(value, fallback, min, max) {
function clampToRange(value, fallback, min, max) {
  if (!Number.isFinite(value)) {
  if (!Number.isFinite(value)) {
  if (!Number.isFinite(value)) {
  if (!Number.isFinite(value)) {
    return fallback;
    return fallback;
    return fallback;
    return fallback;
  }
  }
  }
  }
  if (value < min) {
  if (value < min) {
  if (value < min) {
  if (value < min) {
    return min;
    return min;
    return min;
    return min;
  }
  }
  }
  }
  if (value > max) {
  if (value > max) {
  if (value > max) {
  if (value > max) {
    return max;
    return max;
    return max;
    return max;
  }
  }
  }
  }
  return value;
  return value;
  return value;
  return value;
}
}
}
}




/**
/**
/**
/**
 * Parses the incoming request URL and normalises catalog search parameters.
 * Parses the incoming request URL and normalises catalog search parameters.
 * Parses the incoming request URL and normalises catalog search parameters.
 * Parses the incoming request URL and normalises catalog search parameters.
 *
 *
 *
 *
 * @param {string | undefined} rawUrl - Raw request URL.
 * @param {string | undefined} rawUrl - Raw request URL.
 * @param {string | undefined} rawUrl - Raw request URL.
 * @param {string | undefined} rawUrl - Raw request URL.
 * @returns {{ city?: string; category?: string; capacity?: number; minRating?: number; limit: number; page: number; sort: "rating" | "reviews" }}
 * @returns {{ city?: string; category?: string; capacity?: number; minRating?: number; limit: number; page: number; sort: "rating" | "reviews" }}
 * @returns {{ city?: string; category?: string; capacity?: number; minRating?: number; limit: number; page: number; sort: "rating" | "reviews" }}
 * @returns {{ city?: string; category?: string; capacity?: number; minRating?: number; limit: number; page: number; sort: "rating" | "reviews" }}
 *   Structured filter descriptor consumed by Prisma.
 *   Structured filter descriptor consumed by Prisma.
 *   Structured filter descriptor consumed by Prisma.
 *   Structured filter descriptor consumed by Prisma.
 */
 */
 */
 */
export function parseSearchParams(rawUrl) {
export function parseSearchParams(rawUrl) {
export function parseSearchParams(rawUrl) {
export function parseSearchParams(rawUrl) {
  const url = new URL(rawUrl ?? "/catalog/search", "http://localhost");
  const url = new URL(rawUrl ?? "/catalog/search", "http://localhost");
  const url = new URL(rawUrl ?? "/catalog/search", "http://localhost");
  const url = new URL(rawUrl ?? "/catalog/search", "http://localhost");
  const city = url.searchParams.get("city")?.trim() || undefined;
  const city = url.searchParams.get("city")?.trim() || undefined;
  const city = url.searchParams.get("city")?.trim() || undefined;
  const city = url.searchParams.get("city")?.trim() || undefined;
  const category = url.searchParams.get("category")?.trim() || undefined;
  const category = url.searchParams.get("category")?.trim() || undefined;
  const category = url.searchParams.get("category")?.trim() || undefined;
  const category = url.searchParams.get("category")?.trim() || undefined;




  const capacityParam = url.searchParams.get("capacity");
  const capacityParam = url.searchParams.get("capacity");
  const capacityParam = url.searchParams.get("capacity");
  const capacityParam = url.searchParams.get("capacity");
  const capacity = capacityParam ? Number.parseInt(capacityParam, 10) : undefined;
  const capacity = capacityParam ? Number.parseInt(capacityParam, 10) : undefined;
  const capacity = capacityParam ? Number.parseInt(capacityParam, 10) : undefined;
  const capacity = capacityParam ? Number.parseInt(capacityParam, 10) : undefined;
  const normalisedCapacity = Number.isFinite(capacity) && capacity > 0 ? capacity : undefined;
  const normalisedCapacity = Number.isFinite(capacity) && capacity > 0 ? capacity : undefined;
  const normalisedCapacity = Number.isFinite(capacity) && capacity > 0 ? capacity : undefined;
  const normalisedCapacity = Number.isFinite(capacity) && capacity > 0 ? capacity : undefined;




  const ratingParam = url.searchParams.get("rating");
  const ratingParam = url.searchParams.get("rating");
  const ratingParam = url.searchParams.get("rating");
  const ratingParam = url.searchParams.get("rating");
  const minRating = ratingParam ? Number.parseFloat(ratingParam) : undefined;
  const minRating = ratingParam ? Number.parseFloat(ratingParam) : undefined;
  const minRating = ratingParam ? Number.parseFloat(ratingParam) : undefined;
  const minRating = ratingParam ? Number.parseFloat(ratingParam) : undefined;
  const normalisedRating =
  const normalisedRating =
  const normalisedRating =
  const normalisedRating =
    typeof minRating === "number" && Number.isFinite(minRating) && minRating >= 0
    typeof minRating === "number" && Number.isFinite(minRating) && minRating >= 0
    typeof minRating === "number" && Number.isFinite(minRating) && minRating >= 0
    typeof minRating === "number" && Number.isFinite(minRating) && minRating >= 0
      ? Math.min(minRating, 5)
      ? Math.min(minRating, 5)
      ? Math.min(minRating, 5)
      ? Math.min(minRating, 5)
      : undefined;
      : undefined;
      : undefined;
      : undefined;




  const requestedLimit = Number.parseInt(url.searchParams.get("limit") ?? "", 10);
  const requestedLimit = Number.parseInt(url.searchParams.get("limit") ?? "", 10);
  const requestedLimit = Number.parseInt(url.searchParams.get("limit") ?? "", 10);
  const requestedLimit = Number.parseInt(url.searchParams.get("limit") ?? "", 10);
  const limit = clampToRange(requestedLimit, DEFAULT_LIMIT, 1, MAX_LIMIT);
  const limit = clampToRange(requestedLimit, DEFAULT_LIMIT, 1, MAX_LIMIT);
  const limit = clampToRange(requestedLimit, DEFAULT_LIMIT, 1, MAX_LIMIT);
  const limit = clampToRange(requestedLimit, DEFAULT_LIMIT, 1, MAX_LIMIT);




  const requestedPage = Number.parseInt(url.searchParams.get("page") ?? "", 10);
  const requestedPage = Number.parseInt(url.searchParams.get("page") ?? "", 10);
  const requestedPage = Number.parseInt(url.searchParams.get("page") ?? "", 10);
  const requestedPage = Number.parseInt(url.searchParams.get("page") ?? "", 10);
  const page = clampToRange(requestedPage, 1, 1, Number.MAX_SAFE_INTEGER);
  const page = clampToRange(requestedPage, 1, 1, Number.MAX_SAFE_INTEGER);
  const page = clampToRange(requestedPage, 1, 1, Number.MAX_SAFE_INTEGER);
  const page = clampToRange(requestedPage, 1, 1, Number.MAX_SAFE_INTEGER);




  const sortParam = url.searchParams.get("sort")?.toLowerCase();
  const sortParam = url.searchParams.get("sort")?.toLowerCase();
  const sortParam = url.searchParams.get("sort")?.toLowerCase();
  const sortParam = url.searchParams.get("sort")?.toLowerCase();
  const sort = sortParam && sortParam in SORT_PRESETS ? sortParam : "rating";
  const sort = sortParam && sortParam in SORT_PRESETS ? sortParam : "rating";
  const sort = sortParam && sortParam in SORT_PRESETS ? sortParam : "rating";
  const sort = sortParam && sortParam in SORT_PRESETS ? sortParam : "rating";




  return {
  return {
  return {
  return {
    city,
    city,
    city,
    city,
    category,
    category,
    category,
    category,
    capacity: normalisedCapacity,
    capacity: normalisedCapacity,
    capacity: normalisedCapacity,
    capacity: normalisedCapacity,
    minRating: normalisedRating,
    minRating: normalisedRating,
    minRating: normalisedRating,
    minRating: normalisedRating,
    limit,
    limit,
    limit,
    limit,
    page,
    page,
    page,
    page,
    sort,
    sort,
    sort,
    sort,
  };
  };
  };
  };
}
}
}
}




/**
/**
/**
/**
 * Translates normalised filters into a Prisma `where` clause.
 * Translates normalised filters into a Prisma `where` clause.
 * Translates normalised filters into a Prisma `where` clause.
 * Translates normalised filters into a Prisma `where` clause.
 *
 *
 *
 *
 * @param {{ city?: string; category?: string; capacity?: number; minRating?: number }} filters -
 * @param {{ city?: string; category?: string; capacity?: number; minRating?: number }} filters -
 * @param {{ city?: string; category?: string; capacity?: number; minRating?: number }} filters -
 * @param {{ city?: string; category?: string; capacity?: number; minRating?: number }} filters -
 *   Parsed search filters.
 *   Parsed search filters.
 *   Parsed search filters.
 *   Parsed search filters.
 * @returns {import("@prisma/client").Prisma.VendorWhereInput} Prisma-compatible filter expression.
 * @returns {import("@prisma/client").Prisma.VendorWhereInput} Prisma-compatible filter expression.
 * @returns {import("@prisma/client").Prisma.VendorWhereInput} Prisma-compatible filter expression.
 * @returns {import("@prisma/client").Prisma.VendorWhereInput} Prisma-compatible filter expression.
 */
 */
 */
 */
export function buildSearchWhere(filters) {
export function buildSearchWhere(filters) {
export function buildSearchWhere(filters) {
export function buildSearchWhere(filters) {
  const where = {};
  const where = {};
  const where = {};
  const where = {};




  if (filters.city) {
  if (filters.city) {
  if (filters.city) {
  if (filters.city) {
    where.city = filters.city;
    where.city = filters.city;
    where.city = filters.city;
    where.city = filters.city;
  }
  }
  }
  }




  if (filters.category) {
  if (filters.category) {
  if (filters.category) {
  if (filters.category) {
    where.type = filters.category;
    where.type = filters.category;
    where.type = filters.category;
    where.type = filters.category;
  }
  }
  }
  }




  if (typeof filters.minRating === "number") {
  if (typeof filters.minRating === "number") {
  if (typeof filters.minRating === "number") {
  if (typeof filters.minRating === "number") {
    where.rating = { gte: filters.minRating };
    where.rating = { gte: filters.minRating };
    where.rating = { gte: filters.minRating };
    where.rating = { gte: filters.minRating };
  }
  }
  }
  }




  if (typeof filters.capacity === "number") {
  if (typeof filters.capacity === "number") {
  if (typeof filters.capacity === "number") {
  if (typeof filters.capacity === "number") {
    const guests = filters.capacity;
    const guests = filters.capacity;
    const guests = filters.capacity;
    const guests = filters.capacity;
    where.venues = {
    where.venues = {
    where.venues = {
    where.venues = {
      some: {
      some: {
      some: {
      some: {
        AND: [
        AND: [
        AND: [
        AND: [
          {
          {
          {
          {
            OR: [
            OR: [
            OR: [
            OR: [
              { capacityMin: null },
              { capacityMin: null },
              { capacityMin: null },
              { capacityMin: null },
              { capacityMin: { lte: guests } },
              { capacityMin: { lte: guests } },
              { capacityMin: { lte: guests } },
              { capacityMin: { lte: guests } },
            ],
            ],
            ],
            ],
          },
          },
          },
          },
          {
          {
          {
          {
            OR: [
            OR: [
            OR: [
            OR: [
              { capacityMax: null },
              { capacityMax: null },
              { capacityMax: null },
              { capacityMax: null },
              { capacityMax: { gte: guests } },
              { capacityMax: { gte: guests } },
              { capacityMax: { gte: guests } },
              { capacityMax: { gte: guests } },
            ],
            ],
            ],
            ],
          },
          },
          },
          },
        ],
        ],
        ],
        ],
      },
      },
      },
      },
    };
    };
    };
    };
  }
  }
  }
  }




  return where;
  return where;
  return where;
  return where;
}
}
}
}




/**
/**
/**
/**
 * Handles `GET /catalog/search` requests by executing a filtered vendor lookup
 * Handles `GET /catalog/search` requests by executing a filtered vendor lookup
 * Handles `GET /catalog/search` requests by executing a filtered vendor lookup
 * Handles `GET /catalog/search` requests by executing a filtered vendor lookup
 * and responding with the matching profiles alongside the applied filters.
 * and responding with the matching profiles alongside the applied filters.
 * and responding with the matching profiles alongside the applied filters.
 * and responding with the matching profiles alongside the applied filters.
 *
 *
 *
 *
 * @param {import("http").IncomingMessage} req - Node.js request object.
 * @param {import("http").IncomingMessage} req - Node.js request object.
 * @param {import("http").IncomingMessage} req - Node.js request object.
 * @param {import("http").IncomingMessage} req - Node.js request object.
 * @param {import("http").ServerResponse} res - Node.js response.
 * @param {import("http").ServerResponse} res - Node.js response.
 * @param {import("http").ServerResponse} res - Node.js response.
 * @param {import("http").ServerResponse} res - Node.js response.
 * @param {{ prisma: import("@prisma/client").PrismaClient; json: (res: any, status: number, payload: any) => void }} context -
 * @param {{ prisma: import("@prisma/client").PrismaClient; json: (res: any, status: number, payload: any) => void }} context -
 * @param {{ prisma: import("@prisma/client").PrismaClient; json: (res: any, status: number, payload: any) => void }} context -
 * @param {{ prisma: import("@prisma/client").PrismaClient; json: (res: any, status: number, payload: any) => void }} context -
 *   Infrastructure dependencies shared with the service entry point.
 *   Infrastructure dependencies shared with the service entry point.
 *   Infrastructure dependencies shared with the service entry point.
 *   Infrastructure dependencies shared with the service entry point.
 */
 */
 */
 */
export async function handleCatalogSearch(req, res, context) {
export async function handleCatalogSearch(req, res, context) {
export async function handleCatalogSearch(req, res, context) {
export async function handleCatalogSearch(req, res, context) {
  const params = parseSearchParams(req.url);
  const params = parseSearchParams(req.url);
  const params = parseSearchParams(req.url);
  const params = parseSearchParams(req.url);
  const where = buildSearchWhere(params);
  const where = buildSearchWhere(params);
  const where = buildSearchWhere(params);
  const where = buildSearchWhere(params);
  const orderBy = SORT_PRESETS[params.sort] ?? SORT_PRESETS.rating;
  const orderBy = SORT_PRESETS[params.sort] ?? SORT_PRESETS.rating;
  const orderBy = SORT_PRESETS[params.sort] ?? SORT_PRESETS.rating;
  const orderBy = SORT_PRESETS[params.sort] ?? SORT_PRESETS.rating;
  const skip = (params.page - 1) * params.limit;
  const skip = (params.page - 1) * params.limit;
  const skip = (params.page - 1) * params.limit;
  const skip = (params.page - 1) * params.limit;




  const [vendors, total] = await Promise.all([
  const [vendors, total] = await Promise.all([
  const [vendors, total] = await Promise.all([
  const [vendors, total] = await Promise.all([
    context.prisma.vendor.findMany({
    context.prisma.vendor.findMany({
    context.prisma.vendor.findMany({
    context.prisma.vendor.findMany({
      where,
      where,
      where,
      where,
      include: {
      include: {
      include: {
      include: {
        venues: {
        venues: {
        venues: {
        venues: {
          select: {
          select: {
          select: {
          select: {
            id: true,
            id: true,
            id: true,
            id: true,
            title: true,
            title: true,
            title: true,
            title: true,
            capacityMin: true,
            capacityMin: true,
            capacityMin: true,
            capacityMin: true,
            capacityMax: true,
            capacityMax: true,
            capacityMax: true,
            capacityMax: true,
          },
          },
          },
          },
        },
        },
        },
        },
        _count: { select: { reviews: true } },
        _count: { select: { reviews: true } },
        _count: { select: { reviews: true } },
        _count: { select: { reviews: true } },
      },
      },
      },
      },
      orderBy,
      orderBy,
      orderBy,
      orderBy,
      skip,
      skip,
      skip,
      skip,
      take: params.limit,
      take: params.limit,
      take: params.limit,
      take: params.limit,
    }),
    }),
    }),
    }),
    context.prisma.vendor.count({ where }),
    context.prisma.vendor.count({ where }),
    context.prisma.vendor.count({ where }),
    context.prisma.vendor.count({ where }),
  ]);
  ]);
  ]);
  ]);




  context.json(res, 200, {
  context.json(res, 200, {
  context.json(res, 200, {
  context.json(res, 200, {
    ok: true,
    ok: true,
    ok: true,
    ok: true,
    filters: {
    filters: {
    filters: {
    filters: {
      city: params.city,
      city: params.city,
      city: params.city,
      city: params.city,
      category: params.category,
      category: params.category,
      category: params.category,
      category: params.category,
      capacity: params.capacity,
      capacity: params.capacity,
      capacity: params.capacity,
      capacity: params.capacity,
      minRating: params.minRating,
      minRating: params.minRating,
      minRating: params.minRating,
      minRating: params.minRating,
    },
    },
    },
    },
    items: vendors,
    items: vendors,
    items: vendors,
    items: vendors,
    pagination: {
    pagination: {
    pagination: {
    pagination: {
      limit: params.limit,
      limit: params.limit,
      limit: params.limit,
      limit: params.limit,
      page: params.page,
      page: params.page,
      page: params.page,
      page: params.page,
      sort: params.sort,
      sort: params.sort,
      sort: params.sort,
      sort: params.sort,
      total,
      total,
      total,
      total,
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
      totalPages: Math.max(1, Math.ceil(total / params.limit)),
    },
    },
    },
    },
  });
  });
  });
  });
}
}
}
}




export const __internal = { DEFAULT_LIMIT, MAX_LIMIT, SORT_PRESETS, clampToRange };
export const __internal = { DEFAULT_LIMIT, MAX_LIMIT, SORT_PRESETS, clampToRange };
export const __internal = { DEFAULT_LIMIT, MAX_LIMIT, SORT_PRESETS, clampToRange };
export const __internal = { DEFAULT_LIMIT, MAX_LIMIT, SORT_PRESETS, clampToRange };

// health

