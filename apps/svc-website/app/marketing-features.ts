import type { FeatureItem } from "../src/ui/marketing/FeatureHighlights";

/**
 * Structured marketing features rendered on the homepage.
 * Extracted into a separate module so the Next.js page can keep
 * its exports limited to framework-recognised fields.
 */
export const MARKETING_FEATURES: ReadonlyArray<FeatureItem> = [
  {
    stat: "72 часа",
    title: "Полный запуск каталога",
    description:
      "Подключаем импорты через API и Excel, синхронизируем остатки и цены без бесконечных таблиц и ручного ввода.",
    ctaLabel: "Посмотреть интеграции",
    ctaHref: "/vendors",
  },
  {
    stat: "+35%",
    title: "Конверсия онбординга",
    description:
      "Сценарии для вендоров подстраиваются под тип бизнеса: банкетные залы, фотографы, флористы — каждому своя воронка.",
    ctaLabel: "Как мы адаптируемся",
    ctaHref: "/w/partners",
  },
  {
    stat: "24/7",
    title: "Контроль качества",
    description:
      "Автоматические проверки по SLA, уведомления в Telegram и доске задач — команда видит, где застрял контент.",
    ctaLabel: "Посмотреть регламенты",
    ctaHref: "/w/quality",
  },
];

export default MARKETING_FEATURES;
