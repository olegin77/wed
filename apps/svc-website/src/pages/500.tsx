import React from "react";

import Container from "../ui/Container";

/**
 * Quick troubleshooting tips displayed on the 500 error page to help visitors
 * recover without immediately pinging the support team.
 */
export const ERROR_TIPS: ReadonlyArray<string> = [
  "Обновите страницу — проблема могла быть временной.",
  "Проверьте статус сервисов в наших социальных сетях.",
  "Напишите нам на support@weddingtech.uz, если ошибка повторяется.",
];

export default function Error500Page() {
  return (
    <Container width="narrow" className="py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--brand)]">Ошибка 500</p>
      <h1 className="mt-4 text-5xl font-bold text-[var(--fg)]">Что-то пошло не так</h1>
      <p className="mt-4 text-base text-[var(--muted)]">
        Мы уже получили уведомление и разбираемся с проблемой. Попробуйте шаги ниже — они помогают в большинстве случаев.
      </p>

      <ul className="mx-auto mt-10 max-w-xl space-y-3 text-left text-sm leading-6 text-[var(--fg)]/90">
        {ERROR_TIPS.map((tip) => (
          <li key={tip} className="flex items-start gap-3 rounded-3xl bg-white/60 p-4 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <span aria-hidden className="mt-1 inline-block h-2 w-2 rounded-full bg-[var(--brand)]" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-center gap-4 text-sm text-[var(--muted)]">
        <a className="text-[var(--brand)] underline" href="mailto:support@weddingtech.uz">
          support@weddingtech.uz
        </a>
        <span aria-hidden>•</span>
        <a className="text-[var(--brand)] underline" href="/">
          Вернуться на главную
        </a>
      </div>
    </Container>
  );
}
