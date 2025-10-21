import React from "react";

import Container from "../../ui/Container";
import Section from "../../ui/Section";

/**
 * Structured list of privacy policy sections rendered below. Each entry keeps
 * the heading and supporting bullet points so the page remains easy to scan.
 */
export const PRIVACY_SECTIONS: ReadonlyArray<{
  heading: string;
  points: ReadonlyArray<string>;
}> = [
  {
    heading: "Минимизация данных",
    points: [
      "Собираем только контактную информацию и историю заявок пары.",
      "Документы удостоверения личности и платёжные реквизиты не сохраняются.",
    ],
  },
  {
    heading: "Прозрачность и контроль",
    points: [
      "Выгрузка данных доступна по запросу на support@weddingtech.uz в течение 7 дней.",
      "Пользователь может обновить или исправить профиль в личном кабинете.",
    ],
  },
  {
    heading: "Удаление и хранение",
    points: [
      "После подтверждения личности удаляем персональные данные до 72 часов.",
      "Резервные копии хранятся в зашифрованном виде и удаляются по расписанию.",
    ],
  },
  {
    heading: "Безопасность",
    points: [
      "Доступ к данным ограничен ролями и логируется в аудит-трек.",
      "Все соединения защищены TLS, критичные сервисы проходят мониторинг 24/7.",
    ],
  },
];

function PrivacySectionList() {
  return (
    <div className="space-y-6">
      {PRIVACY_SECTIONS.map((section) => (
        <article key={section.heading} className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur">
          <h3 className="text-xl font-semibold text-[var(--fg)]">{section.heading}</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--fg)]/90">
            {section.points.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span aria-hidden className="mt-1 inline-block h-2 w-2 rounded-full bg-[var(--brand)]" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <Container width="narrow" className="py-16">
      <header className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--brand)]">Политика конфиденциальности</p>
        <h1 className="text-4xl font-bold text-[var(--fg)]">Как WeddingTech UZ обрабатывает данные</h1>
        <p className="mx-auto max-w-2xl text-base text-[var(--muted)]">
          Мы бережно относимся к информации о парах и вендорах. Ниже описаны
          принципы обработки данных и способы контроля над ними.
        </p>
      </header>

      <Section
        title="Ключевые положения"
        description="Краткое описание правил обработки персональных данных на платформе WeddingTech UZ."
      >
        <PrivacySectionList />
      </Section>

      <Section
        title="Контакты для вопросов"
        description="Наша команда готова помочь с экспортом или удалением данных."
      >
        <address className="space-y-2 text-sm leading-6 not-italic text-[var(--fg)]/90">
          <p>
            Email для запросов по персональным данным:
            <a className="ml-1 text-[var(--brand)] underline" href="mailto:support@weddingtech.uz">
              support@weddingtech.uz
            </a>
          </p>
          <p>
            Ответственный по защите данных:
            <span className="ml-1 font-medium text-[var(--fg)]">Dilshod Rakhimov</span>
          </p>
        </address>
      </Section>
    </Container>
  );
}
