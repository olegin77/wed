# k6 search/stress profile

Сценарий `infra/k6/search.js` моделирует нагрузку на эндпоинт поиска.

## Запуск

```bash
BASE_URL=https://staging.wed.tech k6 run infra/k6/search.js
```

## Сценарий

- `setup` проверяет `/health` перед запуском.
- Основной executor `constant-arrival-rate` генерирует 10 запросов в секунду в течение одной минуты.
- Запросы берутся из пула типичных ключевых слов (`SharedArray`).
- Метрика `search_duration` (Trend) фиксирует латентность, а в threshold заложено `p95 < 900ms`.
- `handleSummary` сохраняет полный отчёт в `k6-summary.json` для CI-артефактов.

## Расширения

- Поднять нагрузку до 50 rps и добавить второй сценарий для автокомплита.
- Подключить `handleSummary` к InfluxDB/Prometheus для живых графиков.
- Добавить авторизацию (JWT) через `setup`.
