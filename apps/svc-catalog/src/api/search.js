import { URL } from "node:url";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const SORT_PRESETS = {
  rating: [{ rating: "desc" }, { createdAt: "desc" }],
  reviews: [{ reviews: { _count: "desc" } }, { rating: "desc" }],
};

export async function handleCatalogSearch(req, res, prisma) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const query = url.searchParams.get("q") || "";
    const category = url.searchParams.get("category") || "";
    const city = url.searchParams.get("city") || "";
    const sort = url.searchParams.get("sort") || "rating";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || DEFAULT_LIMIT), MAX_LIMIT);
    const offset = (page - 1) * limit;

    const where = {
      verified: true,
      ...(query && {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
        ],
      }),
      ...(category && { type: category }),
      ...(city && { city: { contains: city, mode: "insensitive" } }),
    };

    const orderBy = SORT_PRESETS[sort] || SORT_PRESETS.rating;

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          venues: true,
          offers: true,
        },
      }),
      prisma.vendor.count({ where }),
    ]);

    const result = {
      data: vendors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  } catch (error) {
    console.error("Search error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
}