import assert from "node:assert/strict";
import { test } from "node:test";

import { buildVendorPageProps, normalizeSlug } from "../../../lib/vendors-page.js";

test("normalizes incoming slugs and strips unsafe characters", () => {
  assert.equal(normalizeSlug("  TaShKeNt  "), "tashkent");
  assert.equal(normalizeSlug("Наманган"), "namangan");
  assert.equal(normalizeSlug("  !!!"), "all");
});

test("buildVendorPageProps collects filters into a deterministic payload", () => {
  const props = buildVendorPageProps({
    city: "Ташкент",
    category: "Фото",
    query: { filter: ["Budget", " Top "] },
  });

  assert.deepEqual(props.city, "tashkent");
  assert.deepEqual(props.category, "foto");
  assert.deepEqual(props.filters, ["budget", "top"]);
  assert.equal(props.metadata.canonicalPath, "/vendors/tashkent/foto");
});

test("city page loader delegates to the shared helper", async () => {
  const { getServerSideProps } = await import("../[city].js");
  const result = await getServerSideProps({
    params: { city: "Samarkand" },
    query: { filter: "decor" },
  });

  assert.deepEqual(result.props, {
    city: "samarkand",
    category: null,
    filters: ["decor"],
    metadata: {
      title: "Поставщики в Samarkand — WeddingTech",
      description: "Каталог проверенных поставщиков для города Samarkand.",
      canonicalPath: "/vendors/samarkand",
    },
  });
});

test("city/category page exposes both slugs and metadata", async () => {
  const { getServerSideProps } = await import("../[city]/[category].js");
  const result = await getServerSideProps({
    params: { city: "Bukhara", category: "photography" },
    query: {},
  });

  assert.equal(result.props.city, "bukhara");
  assert.equal(result.props.category, "photography");
  assert.deepEqual(result.props.metadata, {
    title: "Photography в Bukhara — WeddingTech",
    description: "Подборка категории «Photography» в городе Bukhara.",
    canonicalPath: "/vendors/bukhara/photography",
  });
});
