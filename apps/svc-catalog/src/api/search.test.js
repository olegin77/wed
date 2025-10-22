import assert from "node:assert/strict";
import { test } from "node:test";

import { buildSearchWhere, handleCatalogSearch, parseSearchParams } from "./search.js";

test("parseSearchParams normalises numeric filters and pagination", () => {
  const filters = parseSearchParams(
    "/catalog/search?city=%D0%A2%D0%B0%D1%88%D0%BA%D0%B5%D0%BD%D1%82&category=venues&capacity=150&rating=4.7&limit=100&page=3&sort=reviews",
  );
  assert.deepEqual(filters, {
    city: "Ташкент",
    category: "venues",
    capacity: 150,
    minRating: 4.7,
    limit: 50,
    page: 3,
    sort: "reviews",
  });
});

test("buildSearchWhere composes relational capacity filter", () => {
  const where = buildSearchWhere({ capacity: 120 });
  assert.deepEqual(where, {
    venues: {
      some: {
        AND: [
          {
            OR: [
              { capacityMin: null },
              { capacityMin: { lte: 120 } },
            ],
          },
          {
            OR: [
              { capacityMax: null },
              { capacityMax: { gte: 120 } },
            ],
          },
        ],
      },
    },
  });
});

test("handleCatalogSearch proxies filters, pagination and sorting", async () => {
  let receivedArgs;
  let receivedCountWhere;
  const prisma = {
    vendor: {
      async findMany(args) {
        receivedArgs = args;
        return [{ id: "vendor-1" }];
      },
      async count(args) {
        receivedCountWhere = args.where;
        return 37;
      },
    },
  };
  const payload = {};
  const res = {};
  const json = (_res, status, body) => {
    payload.status = status;
    payload.body = body;
  };

  await handleCatalogSearch({ url: "/catalog/search?city=Самарканд&page=2&limit=10&sort=reviews" }, res, { prisma, json });

  assert.equal(payload.status, 200);
  assert.equal(payload.body.ok, true);
  assert.deepEqual(payload.body.filters, {
    city: "Самарканд",
    category: undefined,
    capacity: undefined,
    minRating: undefined,
  });
  assert.deepEqual(payload.body.items, [{ id: "vendor-1" }]);
  assert.equal(receivedArgs.where.city, "Самарканд");
  assert.deepEqual(receivedArgs.orderBy, [{ reviews: { _count: "desc" } }, { rating: "desc" }]);
  assert.equal(receivedArgs.take, 10);
  assert.equal(receivedArgs.skip, 10);
  assert.deepEqual(receivedCountWhere, receivedArgs.where);
  assert.deepEqual(payload.body.pagination, {
    limit: 10,
    page: 2,
    sort: "reviews",
    total: 37,
    totalPages: 4,
  });
});

// health

