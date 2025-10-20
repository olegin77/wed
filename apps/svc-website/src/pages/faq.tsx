import React from "react";

import Card from "../ui/Card";
import Container from "../ui/Container";
import Section from "../ui/Section";

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export const FAQ_ITEMS: ReadonlyArray<FaqItem> = [
  {
    question: "Когда запуск сервиса?",
    answer:
      "Первые пары получат доступ к WeddingTech в Ташкенте в начале следующего квартала. Мы уже собираем предзапись и обратную связь.",
  },
  {
    question: "Сколько это стоит?",
    answer:
      "Для пар платформа остаётся бесплатной. Поставщики оплачивают подписку после пробного периода, чтобы получать больше лидов и инструменты аналитики.",
  },
  {
    question: "Можно ли импортировать список гостей?",
    answer:
      "Да, загрузите CSV или синхронизируйте контакты вручную. Уведомления об RSVP автоматически обновят статистику по столам и меню.",
  },
];

function FaqList() {
  return (
    <div className="space-y-4">
      {FAQ_ITEMS.map((item) => (
        <Card key={item.question} title={item.question} className="bg-white/80">
          <p className="text-base leading-7 text-[var(--fg)]/85">{item.answer}</p>
        </Card>
      ))}
    </div>
  );
}

/**
 * Страница с часто задаваемыми вопросами, которая помогает посетителям быстро
 * понять дорожную карту продукта и доступные функции.
 */
export default function FaqPage() {
  return (
    <main className="bg-[var(--bg)]">
      <Container className="py-16">
        <Section
          title="Частые вопросы"
          description="Собрали ответы от первой волны пользователей и партнёров."
        >
          <FaqList />
        </Section>
      </Container>
    </main>
  );
}
