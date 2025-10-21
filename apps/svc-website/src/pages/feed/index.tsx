import React from "react";

import Container from "../../ui/Container";
import Section from "../../ui/Section";
import Card from "../../ui/Card";
import SkipLink from "../../ui/a11y/SkipLink";

export type FeedItemType = "blog" | "wedding" | "qa";

export interface FeedItem {
  readonly id: string;
  readonly type: FeedItemType;
  readonly title: string;
  readonly excerpt: string;
  readonly href: string;
  readonly publishedAt: string;
  readonly meta?: string;
}

export const FEED_ITEMS: readonly FeedItem[] = [
  {
    id: "blog-destination-trends",
    type: "blog",
    title: "5 трендов свадеб 2025 года",
    excerpt:
      "Собрали главные инсайты от ведущих организаторов: цветовые палитры, идеи welcome-зон и советы по таймлайну.",
    href: "/blog/first",
    publishedAt: "2024-05-12",
    meta: "Блог",
  },
  {
    id: "real-wedding-nodir-madina",
    type: "wedding",
    title: "Реальная свадьба: Нодир и Мадина",
    excerpt:
      "Пара поделилась опытом поиска площадки и внедрения интерактивного реестра подарков на WeddingTech.",
    href: "/real-weddings/nodir-madina",
    publishedAt: "2024-05-05",
    meta: "Реальные свадьбы",
  },
  {
    id: "qa-budget-planning",
    type: "qa",
    title: "Как оптимизировать бюджет без потери качества?",
    excerpt:
      "Отвечаем на популярный вопрос из комьюнити: что вынести в must-have и как договариваться с вендорами о пакетах.",
    href: "/community/questions/budget-planning",
    publishedAt: "2024-04-28",
    meta: "Q&A",
  },
  {
    id: "blog-vendor-spotlight",
    type: "blog",
    title: "Интервью с флористом Aisha Flowers",
    excerpt:
      "Как автоматизация заявок и аналитика в кабинете помогают команде доставлять композиции вовремя и без пересортов.",
    href: "/blog/aisha-flowers",
    publishedAt: "2024-04-20",
    meta: "Блог",
  },
  {
    id: "qa-guest-management",
    type: "qa",
    title: "Что делать с гостями без смартфона?",
    excerpt:
      "Разбираем сценарии офлайн-приглашений и подтверждений, чтобы никто не остался без внимания.",
    href: "/community/questions/guest-management",
    publishedAt: "2024-04-14",
    meta: "Q&A",
  },
];

const FILTERS: readonly { value: FeedItemType | "all"; label: string }[] = [
  { value: "all", label: "Все материалы" },
  { value: "blog", label: "Блог" },
  { value: "wedding", label: "Реальные свадьбы" },
  { value: "qa", label: "Вопросы и ответы" },
];

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
              {FILTERS.map((entry) => {
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
