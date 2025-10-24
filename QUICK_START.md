# 🚀 Быстрый старт WeddingTech

## 1️⃣ Первый запуск проекта

### Автоматический способ (рекомендуется)

```bash
# Все в одной команде
./scripts/start-dev-full.sh
```

Этот скрипт автоматически:
- ✅ Создаст `.env` файл (если отсутствует)
- ✅ Запустит Docker контейнеры (PostgreSQL + MinIO)
- ✅ Дождется готовности базы данных
- ✅ Создаст базу данных
- ✅ Установит зависимости
- ✅ Применит миграции
- ✅ Запустит все микросервисы
- ✅ Запустит Next.js фронтенд

### Ручной способ

```bash
# 1. Создайте .env файл (если нет)
cp .env.example .env

# 2. Запустите Docker контейнеры
docker-compose up -d db minio

# 3. Установите зависимости
pnpm install

# 4. Инициализируйте базу данных
./scripts/init-database.sh

# 5. Запустите приложение
pnpm dev
```

## 2️⃣ Доступ к сервисам

После успешного запуска:

| Сервис | URL | Описание |
|--------|-----|----------|
| **Frontend** | http://localhost:3000 | Next.js приложение |
| **Auth Service** | http://localhost:3001 | Аутентификация |
| **Catalog Service** | http://localhost:3002 | Каталог услуг |
| **Enquiries** | http://localhost:3003 | Запросы |
| **Billing** | http://localhost:3004 | Биллинг |
| **Vendors** | http://localhost:3005 | Поставщики |
| **Guests** | http://localhost:3006 | Гости |
| **Payments** | http://localhost:3007 | Платежи |
| **PostgreSQL** | localhost:5434 | База данных |
| **MinIO Console** | http://localhost:9001 | Хранилище файлов |

## 3️⃣ Управление проектом

### Запуск

```bash
# Полный запуск (все сервисы)
./scripts/start-dev-full.sh

# Только фронтенд
pnpm dev

# Только Docker инфраструктура
docker-compose up -d db minio
```

### Остановка

```bash
# Остановить все сервисы
./scripts/stop-dev-full.sh

# Или
Ctrl+C  # в терминале где запущен start-dev-full.sh

# Остановить Docker контейнеры
docker-compose down
```

### Просмотр логов

```bash
# Логи всех Docker контейнеров
docker-compose logs -f

# Логи только БД
docker-compose logs db -f

# Логи микросервисов
tail -f /tmp/svc-*.log
```

## 4️⃣ База данных

### Управление миграциями

```bash
# Применить миграции
pnpm prisma migrate deploy

# Создать новую миграцию
pnpm prisma migrate dev --name your_migration_name

# Prisma Studio (GUI для БД)
pnpm prisma studio
```

### Подключение к БД

```bash
# Через Docker
docker-compose exec db psql -U pg -d wt

# Настройки подключения:
# Host: localhost
# Port: 5434
# Database: wt
# User: pg
# Password: pg
```

## 5️⃣ Полезные команды

```bash
# Установка зависимостей
pnpm install

# Сборка проекта
pnpm build

# Запуск продакшн версии
pnpm start

# Линтинг
pnpm lint

# Форматирование кода
pnpm format

# Тесты
pnpm test
```

## 🐛 Решение проблем

### Проблема: База данных не запускается

```bash
# Проверьте статус контейнеров
docker-compose ps

# Проверьте логи
docker-compose logs db

# Пересоздайте контейнеры
docker-compose down -v
docker-compose up -d
```

### Проблема: Ошибка миграций

```bash
# Удалите node_modules и переустановите
rm -rf node_modules
pnpm install

# Сбросьте базу данных
docker-compose down -v
docker-compose up -d db
./scripts/init-database.sh
```

### Проблема: Порт уже занят

```bash
# Найдите процесс на порту 3000
lsof -i :3000

# Убейте процесс
kill -9 <PID>

# Или измените порт в .env
PORT=3001
```

## 📚 Документация

- **Подробная документация:** [DATABASE_INIT_FIX.md](./DATABASE_INIT_FIX.md)
- **Развертывание:** [DEPLOY_README.md](./DEPLOY_README.md)
- **README:** [README.md](./README.md)

## 💡 Первые шаги

1. ✅ Запустите проект: `./scripts/start-dev-full.sh`
2. ✅ Откройте браузер: http://localhost:3000
3. ✅ Откройте Prisma Studio: `pnpm prisma studio`
4. ✅ Начните разработку!

## 🎯 Структура проекта

```
wedding-tech/
├── app/                 # Next.js App Router
├── apps/               # Микросервисы
│   ├── svc-auth/       # Аутентификация
│   ├── svc-catalog/    # Каталог
│   └── ...
├── packages/           # Общие пакеты
│   └── prisma/         # Prisma схема
├── scripts/            # Утилиты
├── .env                # Переменные окружения
├── docker-compose.yml  # Docker конфигурация
└── schema.prisma       # Prisma схема
```

---

**Готово! Начните разработку 🎉**
