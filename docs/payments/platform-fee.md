# Platform commission & reporting

Модуль `apps/svc-payments/src/fee/` рассчитывает комиссию площадки и формирует агрегированный отчёт для финансовой службы.

## API

- `calculateFee(amount, rate?)` — базовый расчёт комиссии с валидацией входных данных и округлением до целых рублей.
- `buildFeeLine({ orderId, amount, rate })` — строка отчёта с полями `gross`, `fee`, `net`.
- `feeReport(lines)` — агрегирует строки, возвращая итоговые суммы (`grossTotal`, `feeTotal`, `netTotal`).

```ts
import { feeReport } from "apps/svc-payments/src/fee";

const report = feeReport([
  { orderId: "order-1", amount: 125000 },
  { orderId: "order-2", amount: 98000, rate: 0.08 },
]);

console.log(report);
```

## Настройка тарифов

- Базовая ставка (`PLATFORM_FEE_RATE`) — 10%.
- Для премиальных поставщиков ставка может быть переопределена на уровне строки отчёта (`rate`).
- При необходимости можно внедрить динамические тарифы, заменив `rate` на функцию, учитывающую категорию поставщика или оборот.

## План развития

- Подключить выгрузку в CSV/Excel.
- Добавить поддержку налогов (НДС) и валютных курсов.
- Интегрировать отчёт в админ-панель с фильтрацией по периодам.
