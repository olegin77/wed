# 🚀 Деплой WeddingTech на DigitalOcean

## Быстрый старт

1. **Подготовка проекта:**
   ```bash
   ./scripts/setup-production-env.sh
   ./scripts/deploy-to-do.sh
   ```

2. **Настройка в DigitalOcean:**
   - Зайдите в [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Создайте новое приложение
   - Подключите GitHub репозиторий
   - Выберите ветку `main`
   - DigitalOcean автоматически обнаружит `.do/app.yaml`

3. **Настройка переменных окружения:**
   - В панели DigitalOcean перейдите в Settings → App-Level Environment Variables
   - Добавьте необходимые переменные из `.env.example`

## Структура проекта

```
├── .do/
│   └── app.yaml              # Конфигурация DigitalOcean App Platform
├── .codex/
│   └── project.yml           # Конфигурация Codex (перенесена из корня)
├── apps/
│   └── svc-website/          # Основное веб-приложение (Next.js)
├── packages/                  # Общие пакеты
├── scripts/
│   ├── deploy-to-do.sh       # Скрипт деплоя
│   └── setup-production-env.sh # Настройка окружения
└── .env.example              # Пример переменных окружения
```

## Переменные окружения

### Обязательные
- `NODE_ENV=production`
- `NODE_VERSION=20`
- `PORT=3000`

### Рекомендуемые
- `NEXT_PUBLIC_APP_URL` - URL вашего приложения
- `NEXT_PUBLIC_API_URL` - URL API
- `DATABASE_URL` - URL базы данных
- `NEXTAUTH_SECRET` - Секретный ключ для аутентификации

## Мониторинг

После деплоя рекомендуется настроить:
- Логирование (Sentry, LogRocket)
- Мониторинг производительности
- Алерты для критических ошибок

## Поддержка

При возникновении проблем:
1. Проверьте логи в DigitalOcean
2. Убедитесь, что все переменные окружения настроены
3. Проверьте статус базы данных и внешних сервисов
