/**
 * Shared community feed data used across both the legacy pages router and
 * the new Next.js app router marketing surfaces.
 */
export type FeedItemType = "blog" | "wedding" | "qa";

export interface FeedItem {
  /** Unique identifier for stable rendering keys. */
  readonly id: string;
  /** Category of the entry so filters can group similar material. */
  readonly type: FeedItemType;
  /** Primary title surfaced in cards and metadata. */
  readonly title: string;
  /** Supporting description rendered inside the card body. */
  readonly excerpt: string;
  /** Destination URL when visitors follow the card call-to-action. */
  readonly href: string;
  /** ISO date string used to display the publication date. */
  readonly publishedAt: string;
  /** Optional badge text overriding the default category label. */
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

export const FEED_FILTERS: readonly { value: FeedItemType | "all"; label: string }[] = [
  { value: "all", label: "Все материалы" },
  { value: "blog", label: "Блог" },
  { value: "wedding", label: "Реальные свадьбы" },
  { value: "qa", label: "Вопросы и ответы" },
];
