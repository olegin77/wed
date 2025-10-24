# 🔧 Исправление Интеграции WeddingTech

## 📋 Проблемы, которые были обнаружены

### 1. **Разрозненная архитектура**
- ❌ Два отдельных Next.js приложения (корневое и в `apps/svc-website`)
- ❌ Микросервисы работали изолированно без связи с фронтендом
- ❌ Отсутствовал API Gateway для объединения сервисов
- ❌ Нет единой точки входа для разработки

### 2. **Отсутствие интеграции**
- ❌ Next.js не знал о существовании микросервисов
- ❌ Нет API rewrites для проксирования запросов
- ❌ Каждый сервис работал на своем порту без координации

### 3. **Проблемы с деплоем**
- ❌ Конфигурация деплоя учитывала только веб-приложение
- ❌ Микросервисы не включены в процесс деплоя
- ❌ Отсутствовала конфигурация базы данных

## ✅ Что было исправлено

### 1. **API Gateway через Next.js Rewrites**
Добавлены rewrites в `next.config.mjs` для проксирования API запросов:

```javascript
// Теперь запросы автоматически направляются к нужному микросервису
/api/auth/*     → svc-auth (port 3001)
/api/catalog/*  → svc-catalog (port 3002)
/api/enquiries/* → svc-enquiries (port 3003)
/api/billing/*  → svc-billing (port 3004)
/api/vendors/*  → svc-vendors (port 3005)
/api/guests/*   → svc-guests (port 3006)
/api/payments/* → svc-payments (port 3007)
```

### 2. **Единая Docker Compose конфигурация**
Обновлен `docker-compose.yml` для запуска всех сервисов:
- ✅ База данных PostgreSQL с health checks
- ✅ MinIO для хранения файлов
- ✅ Все 7 микросервисов
- ✅ Next.js фронтенд
- ✅ Автоматические зависимости между сервисами

### 3. **Скрипты для разработки**
Созданы удобные скрипты запуска:

**`scripts/start-dev-full.sh`** - Запускает весь проект:
- Запускает PostgreSQL и MinIO
- Применяет миграции БД
- Запускает все микросервисы
- Запускает Next.js фронтенд
- Показывает статус всех сервисов

**`scripts/stop-dev-full.sh`** - Останавливает все сервисы

### 4. **Dockerfile для продакшена**
Созданы два Dockerfile:
- **`Dockerfile.service`** - для микросервисов
- **`Dockerfile.web`** - для Next.js приложения

### 5. **Обновленная конфигурация деплоя**
Файл `.do/app.yaml` теперь включает:
- ✅ Managed PostgreSQL база данных
- ✅ Все микросервисы как отдельные сервисы
- ✅ Next.js фронтенд с правильными переменными окружения
- ✅ Автоматическая связь между сервисами

### 6. **Улучшенный package.json**
Добавлены новые команды:
```json
{
  "dev:full": "Запуск всего проекта (фронтенд + все микросервисы)",
  "stop": "Остановка всех сервисов",
  "docker:up": "Запуск Docker контейнеров",
  "docker:down": "Остановка Docker контейнеров",
  "docker:build": "Сборка Docker образов",
  "prisma:gen": "Генерация Prisma Client",
  "prisma:migrate": "Применение миграций",
  "prisma:studio": "Открыть Prisma Studio"
}
```

## 🚀 Как запустить проект

### Вариант 1: Локальная разработка (быстрый старт)

```bash
# 1. Установка зависимостей
npm install

# 2. Запуск полного проекта (все сервисы)
npm run dev:full
```

Это запустит:
- ✅ PostgreSQL на порту 5434
- ✅ MinIO на портах 9000 и 9001
- ✅ Все микросервисы на портах 3001-3007
- ✅ Next.js фронтенд на порту 3000

### Вариант 2: Docker Compose (для продакшена)

```bash
# Сборка и запуск всех контейнеров
docker-compose up --build

# Или в фоновом режиме
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

### Вариант 3: Быстрая сборка

```bash
# Использование готового скрипта
./QUICK_BUILD.sh
```

## 📊 Архитектура после исправлений

```
┌─────────────────────────────────────────────────────────┐
│                     ПОЛЬЗОВАТЕЛЬ                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js Frontend (Port 3000)                │
│              + API Gateway (Rewrites)                    │
└──┬──────┬──────┬──────┬──────┬──────┬──────┬───────────┘
   │      │      │      │      │      │      │
   │      │      │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼      ▼      ▼
┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│Auth│ │Cat │ │Enq │ │Bill│ │Ven │ │Gue │ │Pay │
│3001│ │3002│ │3003│ │3004│ │3005│ │3006│ │3007│
└──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘ └──┬─┘
   │      │      │      │      │      │      │
   └──────┴──────┴──────┴──────┴──────┴──────┘
                        │
                        ▼
              ┌─────────────────────┐
              │  PostgreSQL (5434)  │
              └─────────────────────┘
```

## 🔍 Как проверить, что все работает

### 1. Проверка запущенных сервисов

```bash
# Проверка портов
lsof -i :3000  # Next.js
lsof -i :3001  # Auth
lsof -i :3002  # Catalog
lsof -i :3003  # Enquiries
lsof -i :3004  # Billing
lsof -i :3005  # Vendors
lsof -i :3006  # Guests
lsof -i :3007  # Payments
lsof -i :5434  # PostgreSQL
```

### 2. Проверка health endpoints

```bash
# Все микросервисы имеют /health endpoint
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # Catalog
curl http://localhost:3003/health  # Enquiries
# и т.д.
```

### 3. Проверка API через Next.js

```bash
# Запросы через Next.js API Gateway
curl http://localhost:3000/api/catalog/search
curl http://localhost:3000/api/auth/health
```

### 4. Проверка базы данных

```bash
# Открыть Prisma Studio
npm run prisma:studio

# Или подключиться напрямую
psql postgresql://pg:pg@localhost:5434/wt
```

## 📝 Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Database
DATABASE_URL=postgresql://pg:pg@localhost:5434/wt

# Internal API (для Next.js rewrites)
INTERNAL_API_URL=http://localhost

# Application
NODE_ENV=development
PORT=3000

# Auth
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=minio123
```

## 🎯 Доступные URL после запуска

| Сервис | URL | Описание |
|--------|-----|----------|
| **Frontend** | http://localhost:3000 | Главная страница |
| **Auth API** | http://localhost:3000/api/auth/* | Аутентификация |
| **Catalog API** | http://localhost:3000/api/catalog/* | Каталог |
| **Enquiries API** | http://localhost:3000/api/enquiries/* | Заявки |
| **Billing API** | http://localhost:3000/api/billing/* | Биллинг |
| **Vendors API** | http://localhost:3000/api/vendors/* | Вендоры |
| **Guests API** | http://localhost:3000/api/guests/* | Гости |
| **Payments API** | http://localhost:3000/api/payments/* | Платежи |
| **PostgreSQL** | localhost:5434 | База данных |
| **MinIO Console** | http://localhost:9001 | Файловое хранилище |
| **Prisma Studio** | http://localhost:5555 | UI для БД |

## 🐛 Troubleshooting

### Порты уже заняты
```bash
# Найти процесс на порту
lsof -i :3000
# Убить процесс
kill -9 <PID>
```

### База данных недоступна
```bash
# Перезапустить PostgreSQL
docker-compose restart db
# Проверить логи
docker-compose logs db
```

### Миграции не применяются
```bash
# Сбросить и применить заново
npx prisma migrate reset
npx prisma migrate deploy
```

### Микросервисы не запускаются
```bash
# Проверить логи
cat /tmp/svc-auth.log
cat /tmp/svc-catalog.log
# и т.д.
```

## 📚 Дополнительная документация

- `README.md` - Общая информация о проекте
- `QUICK_DEPLOY.md` - Быстрый деплой на DigitalOcean
- `DEPLOY_README.md` - Подробная документация по деплою
- `QUICK_BUILD.sh` - Скрипт быстрой сборки

## ✨ Итог

Теперь проект работает как **единая интегрированная система**:
- ✅ Фронтенд и бэкенд полностью интегрированы
- ✅ Все микросервисы доступны через единый API Gateway
- ✅ База данных подключена и работает
- ✅ Простой запуск одной командой
- ✅ Готово к деплою на DigitalOcean

**Запуск проекта:**
```bash
npm run dev:full
```

**Остановка:**
```bash
npm run stop
```

**Деплой:**
```bash
# Следуйте инструкциям в QUICK_DEPLOY.md
```

---

Создано: 2025-10-24
Версия: 2.0
