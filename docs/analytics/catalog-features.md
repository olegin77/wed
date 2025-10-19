# Catalog feature extraction (`infra/feast/extract-features.ts`)

Экстрактор признаков для каталога превращает разрозненные метрики в
нормализованные факторы `[0, 1]`, которые затем используются оффлайн-скорером
`@wt/mlrank`. Файл `infra/feast/extract-features.ts` поддерживает как текущие
поля баз данных, так и новые аналитические витрины, автоматически игнорируя
отсутствующие значения.

## Поддерживаемые источники

| Фактор       | Поддерживаемые поля (в порядке приоритета)                                   | Комментарии |
|--------------|------------------------------------------------------------------------------|-------------|
| `conv`       | `analytics.conversion30d`, `analytics.conversionRate`, `metrics.conversionRate`, `enquiryConversionRate`, `conversionRate`, `conv` | Значения интерпретируются как доля `0..1` или процент. |
| `rating`     | `reviews.average`, `reviewAverage`, `metrics.ratingAverage`, `ratingAverage`, `rating` | Поддерживаются нормализованные (`0..1`), пятибалльные и процентные шкалы. |
| `profile`    | `profile.completeness`, `profile.score`, `profileCompleteness`, `metrics.profileCompleteness`, `profileScore` | Значения 0..100 переводятся в диапазон `0..1`. |
| `calendar`   | `calendar.availabilityRatio`, `calendar.futureAvailabilityRatio`, `calendar.coverageRatio`, `metrics.calendarAvailability`, `calendarAvailability`, `calendarCoverage` + свежесть (`calendar.staleDays`, `calendar.freshnessDays`, `calendarFreshnessDays`, `calendar.updatedAt`, `calendarUpdatedAt`) | Итоговая метрика — взвешенное среднее доступности (70%) и свежести (30%). |
| `price` (опц.) | `pricing.relativeScore`, `analytics.priceSignal`, `priceSignal`, `priceScore` | Считывается как доля/процент, добавляется только при наличии. |

## Нормализация и устойчивость

- Любые значения вне диапазона автоматически зажимаются в `[0, 1]` с помощью
  `clampNormalized()` из `@wt/mlrank`.
- Для процентных полей автоматически поддерживается ввод в диапазоне `0..100`.
- Свежесть календаря преобразуется из дней без обновлений: 0 дней → `1`, 45 и
  более дней → `0`.
- Обновления, пришедшие в виде строковых дат, автоматически конвертируются в
  `Date` и сравниваются с текущим временем.

## Использование

```ts
import { extract } from "infra/feast/extract-features";
import { score } from "@wt/mlrank";

const factors = extract(vendorSnapshot);
const rank = score(factors);
```

Экстрактор не выбрасывает исключения при отсутствии отдельных показателей и
гарантирует, что результат всегда содержит валидные значения для ранжирования.
