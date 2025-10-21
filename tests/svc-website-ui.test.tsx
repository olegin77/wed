import assert from "node:assert/strict";
import { describe, it } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import HomePage from "../apps/svc-website/app/page";
import { Breadcrumbs } from "../apps/svc-website/src/ui/nav/Breadcrumbs";
import SearchEmpty from "../apps/svc-website/src/ui/empty/SearchEmpty";
import { FeatureHighlights } from "../apps/svc-website/src/ui/marketing/FeatureHighlights";
import { LoadingButton } from "../apps/svc-website/src/ui/LoadingButton";
import { MARKETING_FEATURES } from "../apps/svc-website/app/marketing-features";

void describe("svc-website shared UI", () => {
  void it("renders breadcrumb links and marks the current page", () => {
    const markup = renderToStaticMarkup(
      React.createElement(Breadcrumbs, {
        items: [
          { href: "/", label: "Главная" },
          { href: "/vendors", label: "Каталог" },
          { label: "Поиск" },
        ],
      }),
    );

    assert.match(markup, /aria-label="Хлебные крошки"/);
    assert.ok(markup.includes("/vendors"));
    assert.ok(markup.includes("aria-current=\"page\""));
  });

  void it("shows contextual query information in the search empty state", () => {
    const markup = renderToStaticMarkup(
      React.createElement(SearchEmpty, {
        query: "фотограф",
        suggestion: "Свяжитесь с нами — мы подберём подходящих специалистов.",
      }),
    );

    assert.ok(markup.includes("Ничего не найдено"));
    assert.ok(markup.includes("фотограф"));
    assert.ok(markup.includes("Свяжитесь с нами"));
  });

  void it("disables the loading button and renders a spinner when busy", () => {
    const markup = renderToStaticMarkup(
      React.createElement(LoadingButton, {
        loading: true,
        spinnerLabel: "Отправляем запрос",
        children: "Отправить",
      }),
    );

    assert.ok(markup.includes("aria-busy=\"true\""));
    assert.ok(markup.includes("Отправляем запрос"));
    assert.ok(markup.includes("wt-loading-button__spinner"));
  });

  void it("renders a feature grid with optional stats and CTA links", () => {
    const markup = renderToStaticMarkup(
      React.createElement(FeatureHighlights, {
        title: "Почему команды выбирают нас",
        intro: "Несколько примеров фокуса на автоматизации.",
        features: [
          {
            stat: "10k",
            title: "Импорт карточек",
            description: "Автоматическое обновление каталога каждые 15 минут.",
            ctaLabel: "Подробнее",
            ctaHref: "/docs/import",
          },
          {
            title: "Поддержка",
            description: "Кураторы подключаются в сложных сценариях и помогают вендору.",
          },
        ],
      }),
    );

    assert.ok(markup.includes("Почему команды выбирают нас"));
    assert.ok(markup.includes("10k"));
    assert.ok(markup.includes("/docs/import"));
  });

  void it("includes predefined marketing features on the Next.js homepage", () => {
    const markup = renderToStaticMarkup(React.createElement(HomePage));

    for (const feature of MARKETING_FEATURES) {
      assert.ok(markup.includes(feature.title));
      if (feature.ctaHref) {
        assert.ok(markup.includes(`href=\"${feature.ctaHref}\"`));
      }
    }
  });
});
