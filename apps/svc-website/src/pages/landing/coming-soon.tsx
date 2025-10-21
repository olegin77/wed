import React from "react";

import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Container from "../../ui/Container";

/**
 * Простая страница-прелендинг для сбора email-адресов до публичного запуска.
 */
export default function ComingSoonLanding() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      return;
    }
    setSubmitted(true);
  }

  return (
    <main className="bg-[var(--bg)] text-[var(--fg)]">
      <Container className="flex min-h-screen flex-col items-center justify-center py-16">
        <Card className="w-full max-w-2xl space-y-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand)]">
            WeddingTech запускается совсем скоро
          </p>
          <h1 className="text-4xl font-extrabold text-[var(--fg)]">Станьте первыми пользователями</h1>
          <p className="text-base leading-7 text-[var(--fg)]/80">
            Оставьте контакты, и мы пришлём приглашение в закрытую бету. Пары из предзаписи получают расширенную аналитику и
            бонусы на бронирования.
          </p>
          {submitted ? (
            <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              Спасибо! Мы свяжемся с вами, как только откроем доступ.
            </p>
          ) : (
            <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="coming-soon-email">
                Email
              </label>
              <input
                id="coming-soon-email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                required
                placeholder="Введите email"
                className="w-full flex-1 rounded-2xl border border-black/10 px-4 py-3 text-base text-[var(--fg)] shadow-sm focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
              />
              <Button type="submit" className="whitespace-nowrap">
                Оставить заявку
              </Button>
            </form>
          )}
          <p className="small text-[var(--muted)]">
            Нажимая на кнопку, вы соглашаетесь получать письма о запуске и обновлениях продукта.
          </p>
        </Card>
      </Container>
    </main>
  );
}
