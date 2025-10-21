import React from "react";

import Container from "../ui/Container";
import Section from "../ui/Section";

/**
 * Helpful links shown on the not-found page so visitors can quickly navigate to
 * popular sections without hitting a dead end.
 */
export const NOT_FOUND_LINKS: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Каталог площадок", href: "/" },
  { label: "Блог WeddingTech", href: "/blog" },
  { label: "Частые вопросы", href: "/faq" },
];

export default function NotFoundPage() {
  return (
    <Container width="narrow" className="py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--brand)]">Ошибка 404</p>
      <h1 className="mt-4 text-5xl font-bold text-[var(--fg)]">Страница не найдена</h1>
      <p className="mt-4 text-base text-[var(--muted)]">
        Мы не смогли найти запрошенный адрес. Возможно, ссылка устарела или страница была перемещена.
      </p>

      <div className="mt-8 flex justify-center">
        <a
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] px-6 py-3 text-base font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)]"
          href="/"
        >
          Вернуться на главную
        </a>
      </div>

      <Section
        className="mt-12 text-left"
        title="Попробуйте перейти в один из разделов"
        description="Вот несколько быстрых ссылок, которые помогут продолжить работу с платформой."
      >
        <nav aria-label="Популярные страницы" className="grid gap-3 sm:grid-cols-3">
          {NOT_FOUND_LINKS.map((link) => (
            <a
              key={link.href}
              className="rounded-3xl border border-[var(--muted)]/30 bg-white/60 px-4 py-3 text-sm font-medium text-[var(--fg)] shadow-sm backdrop-blur transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Section>
    </Container>
  );
}
