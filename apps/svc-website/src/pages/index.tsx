import React from "react";

import Button from "../ui/Button";
import Card from "../ui/Card";
import Container from "../ui/Container";
import Section from "../ui/Section";
import Banner from "../ui/banner/Banner";

/**
 * Key metrics surfaced on the landing hero. Values are stored as strings to
 * keep locale-aware formatting (non‑breaking spaces, suffixes) intact.
 */
export const HERO_METRICS: ReadonlyArray<{ label: string; value: string }> = [
  { label: "Пары на платформе", value: "4 800+" },
  { label: "Активных вендоров", value: "560" },
  { label: "Средняя оценка", value: "4.8/5" },
];

/**
 * Highlights used below the hero to quickly communicate the product value.
 */
export const FEATURE_SECTIONS: ReadonlyArray<{
  title: string;
  description: string;
  points: ReadonlyArray<string>;
}> = [
  {
    title: "Каталог площадок и сервисов",
    description:
      "Подробные карточки с ценами, фото и доступностью на ближайшие даты.",
    points: [
      "Интеллектуальный поиск по городу, бюджету и стилю свадьбы",
      "Верифицированные отзывы и бейджи качества",
      "Сохранение избранного и сравнение предложений"
    ],
  },
  {
    title: "Планирование в одном месте",
    description:
      "Онлайн-чек-лист, управление гостями и автоматический контроль бюджета.",
    points: [
      "Синхронизация с мобильным приложением пары",
      "Отслеживание RSVP и персональные ссылки на приглашения",
      "Экспорт задач и календарных напоминаний"
    ],
  },
  {
    title: "Прозрачные бронирования",
    description:
      "Заявки, счета и платежи проходят через защищённый кабинет вендора.",
    points: [
      "Уведомления о статусах в реальном времени",
      "Гибкая система скидок и промокодов",
      "Отчёты для вендоров и пары в один клик"
    ],
  },
];

/**
 * Partner roadmap steps displayed near the bottom of the page.
 */
export const PARTNER_STEPS: ReadonlyArray<{ title: string; detail: string }> = [
  {
    title: "Создайте профиль",
    detail: "Загрузите фотографии и опишите услуги — это займёт не больше 10 минут.",
  },
  {
    title: "Получайте лиды",
    detail: "Мы покажем вас парам, подходящим по бюджету и стилю, и уведомим о заявках.",
  },
  {
    title: "Растите вместе с нами",
    detail: "Аналитика, рекомендации и маркетинговые инструменты помогают увеличить выручку.",
  },
];

function MetricList() {
  return (
    <dl className="grid grid-cols-1 gap-6 pt-10 sm:grid-cols-3" aria-label="Ключевые показатели сервиса">
      {HERO_METRICS.map((metric) => (
        <div key={metric.label} className="rounded-3xl bg-white/60 p-6 text-left shadow-sm ring-1 ring-black/5 backdrop-blur">
          <dt className="text-sm font-medium uppercase tracking-wide text-[var(--muted)]">{metric.label}</dt>
          <dd className="mt-3 text-3xl font-semibold text-[var(--fg)]">{metric.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function FeatureGrid() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {FEATURE_SECTIONS.map((feature) => (
        <Card key={feature.title} title={feature.title} className="h-full">
          <p className="small text-[var(--fg)]/80">{feature.description}</p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--fg)]">
            {feature.points.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span aria-hidden className="mt-1 inline-block h-2 w-2 rounded-full bg-[var(--brand)]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

function PartnerSteps() {
  return (
    <ol className="grid gap-6 md:grid-cols-3" aria-label="Как начать работать с WeddingTech UZ">
      {PARTNER_STEPS.map((step, index) => (
        <li key={step.title} className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <span className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">
            Шаг {index + 1}
          </span>
          <h3 className="mt-3 text-xl font-semibold text-[var(--fg)]">{step.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--fg)]/85">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}

function navigateTo(href: string) {
  return () => {
    if (typeof window !== "undefined") {
      window.location.href = href;
    }
  };
}

/**
 * Главная страница публичного сайта WeddingTech. Страница подчёркивает ценность
 * сервиса и ведёт посетителя к каталогу площадок или регистрации пары.
 */
export default function HomeLanding() {
  return (
    <main className="bg-[var(--bg)] text-[var(--fg)]">
      <Banner
        message="Предзапись на запуск в Ташкенте открыта — первые пары получают 3 месяца премиум-подписки."
        action={{ href: "#signup", label: "Оставить заявку" }}
      />
      <Container className="pb-20 pt-16">
        <section className="grid items-center gap-16 lg:grid-cols-[1.2fr,1fr]">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full bg-white/60 px-4 py-2 text-sm font-medium uppercase tracking-wide text-[var(--brand)] shadow-sm ring-1 ring-black/5 backdrop-blur">
              Сервис №1 для подготовки свадьбы в Узбекистане
            </p>
            <h1 className="text-5xl font-extrabold leading-tight text-[var(--fg)]">
              WeddingTech UZ
              <span className="block text-3xl font-semibold text-[var(--muted)]">
                Каталог площадок, бронирования и реестр подарков — всё в одном месте.
              </span>
            </h1>
            <p className="max-w-2xl text-lg leading-7 text-[var(--fg)]/80">
              Подберите идеальную площадку, соберите команду профессионалов и ведите подготовку без хаоса в мессенджерах. Мы
              сопровождаем каждую пару от первой идеи до последнего гостя.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" onClick={navigateTo("/catalog")}>
                Открыть каталог
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={navigateTo("/couple/signup")}
              >
                Начать подготовку
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-[#ffd6cc] via-white to-[#ffe6f2] blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] bg-white/80 p-6 shadow-xl ring-1 ring-black/5 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">План проекта пары «Айсель & Тимур»</p>
              <ul className="mt-4 space-y-3 text-sm text-[var(--fg)]/90">
                <li className="flex items-start justify-between gap-3">
                  <span className="font-medium">Забронирована площадка</span>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">готово</span>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span className="font-medium">Согласован список гостей</span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">в процессе</span>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span className="font-medium">Отправка приглашений</span>
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">на этой неделе</span>
                </li>
                <li className="flex items-start justify-between gap-3">
                  <span className="font-medium">Онлайн-реестр подарков</span>
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">готов к запуску</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <MetricList />
      </Container>
      <section className="bg-white/80 py-16 shadow-inner ring-1 ring-black/5">
        <Container>
          <Section
            title="Почему пары выбирают WeddingTech"
            description="Сервисы, интегрированные между собой, экономят время и помогают избежать лишних расходов."
          >
            <FeatureGrid />
          </Section>
        </Container>
      </section>
      <Container className="py-16">
        <Section
          title="Партнёрам и площадкам"
          description="Подключайтесь к платформе, чтобы получать готовые лиды и управлять бронированиями в одном окне."
        >
          <PartnerSteps />
        </Section>
      </Container>
    </main>
  );
}
