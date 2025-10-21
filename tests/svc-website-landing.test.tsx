import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import HomeLanding, {
  FEATURE_SECTIONS,
  HERO_METRICS,
  PARTNER_STEPS,
} from "../apps/svc-website/src/pages/index";
import BlogIndexPage, { BLOG_POSTS } from "../apps/svc-website/src/pages/blog/index";
import FirstBlogPost, { loadFirstArticle } from "../apps/svc-website/src/pages/blog/first";
import FaqPage, { FAQ_ITEMS } from "../apps/svc-website/src/pages/faq";
import ComingSoonLanding from "../apps/svc-website/src/pages/landing/coming-soon";
import { buildFaqJsonLd, buildOrganizationJsonLd } from "../apps/svc-website/src/seo/org-jsonld";
import CommunityFeedPage, { FEED_ITEMS } from "../apps/svc-website/src/pages/feed";

describe("svc-website marketing surface", () => {
  it("renders hero metrics and call-to-actions", () => {
    const markup = renderToStaticMarkup(React.createElement(HomeLanding));
    assert.ok(markup.includes("WeddingTech UZ"));
    assert.ok(markup.includes("Открыть каталог"));
    assert.ok(markup.includes("data-testid=\"skip-link\""));
    assert.ok(markup.includes("data-testid=\"language-switcher\""));
    for (const metric of HERO_METRICS) {
      assert.ok(markup.includes(metric.value));
    }
    assert.equal(FEATURE_SECTIONS.length, 3);
    assert.equal(PARTNER_STEPS.length, 3);
  });

  it("lists marketing blog posts", () => {
    const markup = renderToStaticMarkup(React.createElement(BlogIndexPage));
    assert.ok(markup.includes("Блог WeddingTech"));
    assert.ok(BLOG_POSTS.length > 0);
    for (const post of BLOG_POSTS) {
      assert.ok(markup.includes(`/blog/${post.slug}`));
    }
  });

  it("parses markdown article content", () => {
    const article = loadFirstArticle();
    assert.equal(article.title.length > 0, true);
    assert.ok(article.body.length >= 3);
    const markup = renderToStaticMarkup(React.createElement(FirstBlogPost));
    assert.ok(markup.includes(article.title));
  });

  it("exposes FAQ entries and JSON-LD structures", () => {
    const faqLd = buildFaqJsonLd(FAQ_ITEMS);
    assert.equal(faqLd.mainEntity.length, FAQ_ITEMS.length);
    const organizationLd = buildOrganizationJsonLd();
    assert.equal(organizationLd.name, "WeddingTech UZ");
    const markup = renderToStaticMarkup(React.createElement(FaqPage));
    assert.ok(markup.includes("Частые вопросы"));
  });

  it("renders the coming soon landing form", () => {
    const markup = renderToStaticMarkup(React.createElement(ComingSoonLanding));
    assert.ok(markup.includes("Станьте первыми пользователями"));
    assert.ok(markup.includes("coming-soon-email"));
  });

  it("lists curated community feed items", () => {
    const markup = renderToStaticMarkup(React.createElement(CommunityFeedPage));
    assert.ok(markup.includes("data-testid=\"community-feed-list\""));
    assert.ok(FEED_ITEMS.length >= 3);
    for (const item of FEED_ITEMS) {
      assert.ok(markup.includes(item.title));
      assert.ok(markup.includes(item.href));
    }
  });
});
