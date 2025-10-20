# Review publication policy

Модуль `apps/svc-enquiries/src/reviews/policy.ts` отвечает за автоматическую проверку отзывов перед публикацией.

## Проверки

- Минимальная оценка (`MIN_REVIEW_RATING = 4`).
- Минимальный объём: 80 символов и 15 слов.
- Обязательное наличие медиа (`attachmentsCount > 0`).
- Наличие подтверждённого контракта (`contractVerified`).
- Проверка присутствия гостя (`attendedEvent !== false`).
- Маркеры модерации (`flaggedReasons`) добавляют префикс `moderation_`.

```ts
import { evaluateReview } from "apps/svc-enquiries/src/reviews/policy";

const decision = evaluateReview({
  rating: 5,
  text: "Отличная площадка, команда помогла со всем оформлением и питанием.",
  attachmentsCount: 3,
  contractVerified: true,
});

if (!decision.canPublish) {
  console.log(decision.reasons);
}
```

## Дальнейшие шаги

- Расширить проверку на запрещённую лексику (обогащение `flaggedReasons`).
- Синхронизировать политику с админ-панелью (ручное снятие блокировки).
- Добавить учёт жалоб гостей и антиспам.
