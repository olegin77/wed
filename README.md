# 💍 WeddingTech Platform

Платформа для организации свадеб на базе микросервисной архитектуры с Next.js, TypeScript и PostgreSQL.

## 🚀 Быстрый Старт (Разработка)

```bash
# Клонировать репозиторий
git clone <your-repo-url>
cd weddingtech

# Установить зависимости
npm install

# Запустить все сервисы
npm run dev:full
```

Откройте **http://localhost:3000** в браузере.

## 📚 Документация

### Основные Руководства

- 🚀 **[INSTALL.md](./INSTALL.md)** - Полная установка на чистый сервер (Ubuntu, Docker, Node.js, nginx, SSL)
- 🛠️ **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Быстрый старт для локальной разработки
- 🔀 **[GIT_WORKFLOW.md](./GIT_WORKFLOW.md)** - Работа с Git без конфликтов в PR

### Дополнительно

- 📝 **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Правила контрибуции
- 📜 **[CHANGELOG.md](./CHANGELOG.md)** - История изменений
- 🗺️ **[ROADMAP.md](./ROADMAP.md)** - Планы развития
- 📋 **[SUMMARY.md](./SUMMARY.md)** - Обзор всей документации

## 🏗️ Архитектура

```
Browser → Next.js (3000) → Микросервисы (3001-3007) → PostgreSQL (5434)
```

**Микросервисы:**
- svc-auth (3001) - Аутентификация
- svc-catalog (3002) - Каталог поставщиков
- svc-enquiries (3003) - Запросы
- svc-billing (3004) - Биллинг
- svc-vendors (3005) - Управление поставщиками  
- svc-guests (3006) - Списки гостей
- svc-payments (3007) - Платежи

## 📦 Технологии

- **Frontend:** Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend:** Node.js 20, Microservices
- **Database:** PostgreSQL 15, Prisma ORM
- **Storage:** MinIO (S3-compatible)
- **Deployment:** Docker, DigitalOcean

## 🔧 Основные Команды

```bash
# Разработка
npm run dev              # Только frontend
npm run dev:full         # Все сервисы
npm run stop             # Остановить все

# База данных
npm run prisma:gen       # Генерация Prisma Client
npm run prisma:migrate   # Применить миграции
npm run prisma:studio    # Открыть Prisma Studio

# Production
npm run build            # Собрать проект
npm start                # Запустить production сервер

# Docker
docker-compose up -d     # Запустить все контейнеры
docker-compose down      # Остановить все
```

## 📁 Структура Проекта

```
/workspace
├── app/                 # Next.js страницы
├── src/                 # React компоненты
├── apps/                # Микросервисы
│   ├── svc-auth/
│   ├── svc-catalog/
│   ├── svc-enquiries/
│   ├── svc-billing/
│   ├── svc-vendors/
│   ├── svc-guests/
│   └── svc-payments/
├── packages/            # Общие пакеты
├── scripts/             # Скрипты развертывания
├── docker-compose.yml   # Docker конфигурация
└── schema.prisma        # Схема базы данных
```

## 🚀 Production Deployment

Для установки на сервер см. **[INSTALL.md](./INSTALL.md)**

Быстрый запуск с Docker:

```bash
docker-compose up -d --build
```

## 🔒 Безопасность

- HTTPS/SSL обязателен
- JWT аутентификация
- CORS настроен
- Rate limiting включен
- SQL injection защита (Prisma)
- XSS защита

## 🆘 Помощь

- Документация: см. файлы `*.md`
- Проблемы: проверьте логи в `/tmp/*.log`
- Health checks: `curl http://localhost:300X/health`

## 📝 Лицензия

MIT License

---

**Версия 2.0** | Обновлено: 2025-10-25
