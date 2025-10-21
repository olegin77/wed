import React from "react";

import Container from "../../ui/Container";
import Section from "../../ui/Section";
import Card from "../../ui/Card";
import SkipLink from "../../ui/a11y/SkipLink";
import {
  FEED_ITEMS,
  FEED_FILTERS,
  type FeedItem,
  type FeedItemType,
} from "../../../app/community-feed-data";

export { FEED_ITEMS, FEED_FILTERS };
export type { FeedItem, FeedItemType };

function formatDate(date: string) {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return formatter.format(new Date(date));
}

function FeedCard({ item }: { item: FeedItem }) {
  const badgeLabel =
    item.meta ??
    (item.type === "blog" ? "Блог" : item.type === "wedding" ? "Реальные свадьбы" : "Q&A");
  return (
    <Card className="h-full space-y-4" title={item.title}>
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--brand)]" aria-label={badgeLabel}>
        {badgeLabel}
      </p>
      <p className="text-sm leading-6 text-[var(--fg)]/80">{item.excerpt}</p>
      <div className="flex items-center justify-between pt-2 text-sm text-[var(--muted)]">
        <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
        <a className="font-semibold text-[var(--brand)]" href={item.href}>
          Читать далее
        </a>
      </div>
    </Card>
  );
}

export default function CommunityFeedPage() {
  const [filter, setFilter] = React.useState<FeedItemType | "all">("all");

  const visibleItems = React.useMemo(() => {
    if (filter === "all") {
      return FEED_ITEMS;
    }
    return FEED_ITEMS.filter((item) => item.type === filter);
  }, [filter]);

  return (
    <>
      <SkipLink targetId="community-feed" />
      <main id="community-feed" className="bg-[var(--bg)] text-[var(--fg)]">
        <Container className="py-16">
          <Section
            title="Лента WeddingTech"
            description="Следите за последними обновлениями платформы, историями реальных пар и ответами экспертов комьюнити."
          >
            <div className="flex flex-wrap items-center gap-3 pb-6" role="toolbar" aria-label="Фильтр материалов">
              {FEED_FILTERS.map((entry) => {
                const isActive = filter === entry.value;
                return (
                  <button
                    key={entry.value}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                        : "border-black/10 bg-white/70 text-[var(--fg)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
                    }`}
                    aria-pressed={isActive}
                    onClick={() => setFilter(entry.value)}
                  >
                    {entry.label}
                  </button>
                );
              })}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="community-feed-list">
              {visibleItems.map((item) => (
                <FeedCard key={item.id} item={item} />
              ))}
            </div>
            {visibleItems.length === 0 ? (
              <p className="mt-6 text-sm text-[var(--muted)]">Материалы выбранного типа появятся в ближайшее время.</p>
            ) : null}
          </Section>
        </Container>
      </main>
    </>
  );
}
