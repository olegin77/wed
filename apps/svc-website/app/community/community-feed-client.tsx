"use client";

import React from "react";

import Container from "../../src/ui/Container";
import Section from "../../src/ui/Section";
import Card from "../../src/ui/Card";
import { Breadcrumbs, type BreadcrumbItem } from "../../src/ui/nav/Breadcrumbs";
import { LanguageSwitcher } from "../../src/ui/i18n/LanguageSwitcher";
import {
  FEED_ITEMS,
  FEED_FILTERS,
  type FeedItem,
  type FeedItemType,
} from "../community-feed-data";

const COMMUNITY_CRUMBS: BreadcrumbItem[] = [
  { href: "/", label: "Главная" },
  { label: "Комьюнити" },
];

function formatDate(date: string) {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formatter.format(new Date(date));
}

function FeedCard({ item }: { readonly item: FeedItem }) {
  const badgeLabel =
    item.meta ??
    (item.type === "blog" ? "Блог" : item.type === "wedding" ? "Реальные свадьбы" : "Q&A");

  return (
    <Card className="wt-community-feed__card" title={item.title}>
      <p className="wt-community-feed__badge" aria-label={badgeLabel}>
        {badgeLabel}
      </p>
      <p className="wt-community-feed__excerpt">{item.excerpt}</p>
      <div className="wt-community-feed__meta">
        <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
        <a className="wt-community-feed__link" href={item.href}>
          Читать далее
        </a>
      </div>
    </Card>
  );
}

export default function CommunityFeedClient() {
  const [filter, setFilter] = React.useState<FeedItemType | "all">("all");

  const visibleItems = React.useMemo(() => {
    if (filter === "all") {
      return FEED_ITEMS;
    }
    return FEED_ITEMS.filter((item) => item.type === filter);
  }, [filter]);

  return (
    <main className="wt-community-feed" id="community-feed">
      <Container className="wt-community-feed__container">
        <header className="wt-community-feed__header">
          <Breadcrumbs items={COMMUNITY_CRUMBS} />
          <LanguageSwitcher />
        </header>
        <Section
          title="Лента WeddingTech"
          description="Следите за обновлениями платформы, историями реальных пар и ответами экспертов комьюнити."
        >
          <div className="wt-community-feed__filters" role="toolbar" aria-label="Фильтр материалов">
            {FEED_FILTERS.map((entry) => {
              const isActive = filter === entry.value;
              return (
                <button
                  key={entry.value}
                  type="button"
                  className={`wt-community-feed__filter${isActive ? " is-active" : ""}`}
                  aria-pressed={isActive}
                  onClick={() => setFilter(entry.value)}
                >
                  {entry.label}
                </button>
              );
            })}
          </div>
          <div className="wt-community-feed__grid" data-testid="community-feed-list">
            {visibleItems.map((item) => (
              <FeedCard key={item.id} item={item} />
            ))}
          </div>
          {visibleItems.length === 0 ? (
            <p className="wt-community-feed__empty">
              Материалы выбранного типа появятся в ближайшее время.
            </p>
          ) : null}
        </Section>
      </Container>
    </main>
  );
}
