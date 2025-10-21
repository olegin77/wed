import React from "react";

import Container from "../../ui/Container";
import Section from "../../ui/Section";

/**
 * WeddingTech terms of service surface. Sections mirror the legal document so
 * the marketing site has a consistent, scannable representation for visitors.
 */
export const TERMS_SECTIONS: ReadonlyArray<{
  heading: string;
  body: string;
}> = [
  {
    heading: "Назначение сервиса",
    body: "WeddingTech UZ соединяет пары с проверенными вендорами и помогает управлять подготовкой к свадьбе.",
  },
  {
    heading: "Учетные записи",
    body: "Пары и вендоры обязуются предоставлять правдивые данные. Команда может ограничить доступ при нарушениях.",
  },
  {
    heading: "Контент и права",
    body: "Загружая контент, пользователь гарантирует наличие прав на материалы и разрешает их публикацию в каталоге.",
  },
  {
    heading: "Платежи и комиссии",
    body: "Расчеты происходят напрямую между сторонами. Комиссия платформы взимается согласно выбранному тарифу.",
  },
  {
    heading: "Поддержка",
    body: "Команда отвечает на вопросы по адресу support@weddingtech.uz и помогает в разрешении спорных ситуаций.",
  },
];

function TermsSectionList() {
  return (
    <div className="space-y-6">
      {TERMS_SECTIONS.map((section) => (
        <article key={section.heading} className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <h3 className="text-xl font-semibold text-[var(--fg)]">{section.heading}</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--fg)]/90">{section.body}</p>
        </article>
      ))}
    </div>
  );
}

export default function TermsPage() {
  return (
    <Container width="narrow" className="py-16">
      <header className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--brand)]">Пользовательское соглашение</p>
        <h1 className="text-4xl font-bold text-[var(--fg)]">Правила использования WeddingTech UZ</h1>
        <p className="mx-auto max-w-2xl text-base text-[var(--muted)]">
          Публичная версия ключевых условий, которые принимают пары и вендоры,
          чтобы начать работу с платформой.
        </p>
      </header>

      <Section title="Основные разделы" description="Сводка обязательств и условий для пользователей сервиса.">
        <TermsSectionList />
      </Section>

      <Section title="Связаться с поддержкой">
        <p className="text-sm leading-6 text-[var(--fg)]/90">
          Остались вопросы? Напишите нам на
          <a className="ml-1 text-[var(--brand)] underline" href="mailto:support@weddingtech.uz">
            support@weddingtech.uz
          </a>
           — команда помогает в течение одного рабочего дня.
        </p>
      </Section>
    </Container>
  );
}
