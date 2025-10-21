import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import PrivacyPolicyPage, { PRIVACY_SECTIONS } from "../apps/svc-website/src/pages/legal/privacy";
import TermsPage, { TERMS_SECTIONS } from "../apps/svc-website/src/pages/legal/terms";

describe("svc-website legal surfaces", () => {
  it("renders privacy policy sections", () => {
    const markup = renderToStaticMarkup(React.createElement(PrivacyPolicyPage));
    assert.ok(markup.includes("Политика конфиденциальности"));
    assert.equal(PRIVACY_SECTIONS.length >= 4, true);
    for (const section of PRIVACY_SECTIONS) {
      assert.ok(markup.includes(section.heading));
    }
  });

  it("renders terms of service content", () => {
    const markup = renderToStaticMarkup(React.createElement(TermsPage));
    assert.ok(markup.includes("Пользовательское соглашение"));
    assert.equal(TERMS_SECTIONS.length >= 4, true);
    for (const section of TERMS_SECTIONS) {
      assert.ok(markup.includes(section.heading));
    }
  });
});
