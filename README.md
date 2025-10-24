# WeddingTech UZ - Полнофункциональная платформа для свадебного маркетплейса

## 🚀 Быстрый старт (обновлено!)

### Запуск всего проекта одной командой:

```bash
npm run dev:full
```

Это запустит:
- ✅ PostgreSQL базу данных
- ✅ MinIO файловое хранилище  
- ✅ Все 7 микросервисов (auth, catalog, enquiries, billing, vendors, guests, payments)
- ✅ Next.js фронтенд с интегрированным API Gateway

**Доступ к приложению:** http://localhost:3000

### Остановка проекта:

```bash
npm run stop
```

---

## 📦 Установка

```bash
# 1. Установка зависимостей
npm install

# 2. Настройка окружения (создаст .env автоматически)
npm run dev:full
```

---

## 🏗️ Архитектура

Проект построен на микросервисной архитектуре с единым API Gateway через Next.js:

```
Frontend (Next.js) → API Gateway → Микросервисы → PostgreSQL
      :3000           /api/*      :3001-:3007      :5434
```

### Микросервисы:
- **svc-auth** (3001) - Аутентификация и авторизация
- **svc-catalog** (3002) - Каталог вендоров и услуг
- **svc-enquiries** (3003) - Система заявок
- **svc-billing** (3004) - Биллинг и платежи
- **svc-vendors** (3005) - Управление вендорами
- **svc-guests** (3006) - Управление гостями
- **svc-payments** (3007) - Обработка платежей

---

## 📝 Доступные команды

### Разработка
```bash
npm run dev           # Только Next.js фронтенд
npm run dev:full      # Весь проект (фронтенд + все микросервисы)
npm run stop          # Остановить все сервисы
```

### Docker
```bash
npm run docker:up     # Запустить контейнеры
npm run docker:down   # Остановить контейнеры
npm run docker:build  # Собрать образы
npm run docker:logs   # Просмотр логов
```

### База данных
```bash
npm run prisma:gen      # Генерация Prisma Client
npm run prisma:migrate  # Применение миграций
npm run prisma:studio   # Открыть Prisma Studio (UI для БД)
npm run prisma:seed     # Заполнить тестовыми данными
```

### Сборка
```bash
npm run build         # Сборка Next.js приложения
npm start             # Запуск production сервера
./QUICK_BUILD.sh      # Полная сборка с проверками
```

---

## 🌐 URL после запуска

| Сервис | URL | Описание |
|--------|-----|----------|
| **Frontend** | http://localhost:3000 | Главная страница |
| **API Gateway** | http://localhost:3000/api/* | Единая точка для всех API |
| **PostgreSQL** | localhost:5434 | База данных |
| **MinIO** | http://localhost:9001 | Файловое хранилище |
| **Prisma Studio** | http://localhost:5555 | UI для БД |

---

## 🔧 Что было исправлено

**Проблема:** Проект собирался как разрозненные страницы без связи между собой.

**Решение:** 
- ✅ Создан единый API Gateway через Next.js rewrites
- ✅ Все микросервисы интегрированы через `/api/*` routes
- ✅ Docker Compose конфигурация для всех сервисов
- ✅ Автоматические скрипты запуска/остановки
- ✅ Обновлена конфигурация деплоя

**Подробности:** См. [INTEGRATION_FIX.md](./INTEGRATION_FIX.md)

---

## 📚 Документация

- [INTEGRATION_FIX.md](./INTEGRATION_FIX.md) - Подробности исправлений интеграции
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Быстрый деплой на DigitalOcean
- [DEPLOY_README.md](./DEPLOY_README.md) - Полная документация по деплою
- [QUICK_BUILD.sh](./QUICK_BUILD.sh) - Скрипт быстрой сборки

---

## 🚢 Деплой на DigitalOcean

```bash
# Следуйте инструкциям:
cat QUICK_DEPLOY.md
```

Конфигурация: `.do/app.yaml` включает все микросервисы и managed PostgreSQL.

---

## 🛠️ Технологии

- **Frontend:** Next.js 14, React 18, TypeScript
- **Backend:** Node.js 20, Microservices Architecture
- **Database:** PostgreSQL 15 + Prisma ORM
- **Storage:** MinIO (S3-compatible)
- **Deployment:** Docker, DigitalOcean App Platform

---

## 📊 Структура проекта

```
/workspace
├── app/              # Next.js App Router pages
├── src/              # UI компоненты и утилиты
├── apps/             # Микросервисы
│   ├── svc-auth/
│   ├── svc-catalog/
│   ├── svc-enquiries/
│   └── ...
├── packages/         # Общие пакеты
├── scripts/          # Скрипты разработки и деплоя
├── docker-compose.yml
├── next.config.mjs   # Next.js конфигурация + API Gateway
└── schema.prisma     # Схема базы данных
```

---

## 🐛 Troubleshooting

### Порты заняты
```bash
lsof -i :3000  # Найти процесс
kill -9 <PID>  # Убить процесс
```

### База данных недоступна
```bash
docker-compose restart db
```

### Сброс базы данных
```bash
npx prisma migrate reset
```

**Больше решений:** См. [INTEGRATION_FIX.md](./INTEGRATION_FIX.md#-troubleshooting)

---

## 📄 Лицензия

MIT

---

**Версия:** 2.0 (Обновлено: 2025-10-24)  
**Статус:** ✅ Полностью интегрирован и готов к использованию
