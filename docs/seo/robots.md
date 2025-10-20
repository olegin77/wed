# robots.txt configuration

Документ описывает правила индексации для публичного сайта WeddingTech и служит справкой для SEO- и контент-команд.

## Цели

- Разрешить индексацию публичных страниц каталога и контента.
- Запретить индексацию внутренних кабинетов, API и префетч-сервисов.
- Ограничить агрессивных краулеров (AhrefsBot, MJ12bot), не влияя на работу поисковых систем.
- Эксплицитно указать расположение индексных файлов sitemap.

## Структура

```txt
User-agent: *
Allow: /

Disallow: /admin/
Disallow: /vendors/dashboard/
Disallow: /auth/
Disallow: /api/
Disallow: /_next/
Disallow: /preview/

User-agent: MJ12bot
Crawl-delay: 10

User-agent: AhrefsBot
Crawl-delay: 10

Sitemap: https://wed.weddingtech.uz/sitemap-index.xml
Sitemap: https://wed.weddingtech.uz/vendors/sitemap.xml
```

### Общие правила

- `Allow: /` открывает индексацию всего публичного каталога и лендингов.
- `Disallow` секции блокируют приватные интерфейсы и динамические ресурсы (Next.js runtime, предпросмотры черновиков).
- Дополнительные `Crawl-delay` применяются только к ботам, генерирующим повышенную нагрузку.

### Карты сайта

- `sitemap-index.xml` — корневой индекс всех публичных sitemap.
- `vendors/sitemap.xml` — отдельная карта площадок для быстрого обновления карточек.

## Обновления

При добавлении новых внутренних разделов необходимо повторно проверить `robots.txt` и синхронизировать список запретов, чтобы исключить утечки приватных страниц в поисковую выдачу.
