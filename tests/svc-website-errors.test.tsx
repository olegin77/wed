import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import NotFoundPage, { NOT_FOUND_LINKS } from "../apps/svc-website/src/pages/404";
import Error500Page, { ERROR_TIPS } from "../apps/svc-website/src/pages/500";

describe("svc-website error pages", () => {
  it("exposes helpful navigation on 404", () => {
    const markup = renderToStaticMarkup(React.createElement(NotFoundPage));
    assert.ok(markup.includes("Страница не найдена"));
    assert.equal(NOT_FOUND_LINKS.length >= 3, true);
    for (const link of NOT_FOUND_LINKS) {
      assert.ok(markup.includes(link.href));
    }
  });

  it("lists troubleshooting tips on 500", () => {
    const markup = renderToStaticMarkup(React.createElement(Error500Page));
    assert.ok(markup.includes("Что-то пошло не так"));
    assert.equal(ERROR_TIPS.length >= 3, true);
    for (const tip of ERROR_TIPS) {
      assert.ok(markup.includes(tip.split(" — ")[0]));
    }
  });
});
