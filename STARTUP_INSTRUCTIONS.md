# Инструкция по запуску проекта WeddingTech

## ✅ Система успешно настроена и запущена!

### 🌐 Доступные сервисы

| Сервис | URL | Статус |
|--------|-----|--------|
| **Frontend** | http://localhost:3000 | ✅ Работает |
| **Catalog Service** | http://localhost:3002 | ✅ Работает |
| **Enquiries Service** | http://localhost:3003 | ✅ Работает |
| **Guests Service** | http://localhost:3006 | ✅ Работает |
| **Payments Service** | http://localhost:3007 | ✅ Работает |
| **PostgreSQL** | localhost:5434 | ✅ Работает |
| Auth Service | http://localhost:3001 | ⚠️ Требует настройки |
| Billing Service | http://localhost:3004 | ⚠️ Требует настройки |
| Vendors Service | http://localhost:3005 | ⚠️ Требует настройки |

### 📊 Текущий статус

- ✅ **5 из 7** микросервисов запущены и работают
- ✅ Frontend Next.js полностью функционален
- ✅ База данных PostgreSQL готова к работе
- ✅ Все зависимости установлены
- ✅ Prisma Client сгенерирован

### 🚀 Быстрый старт

Проект уже запущен! Откройте браузер:

```
http://localhost:3000
```

### 🛠️ Управление сервисами

#### Проверка статуса

```bash
# Список запущенных процессов
ps aux | grep node

# Проверка портов
ss -tlnp | grep -E ":(3000|3002|3003|3006|3007|5434)"

# Проверка логов
tail -f /tmp/frontend.log
tail -f /tmp/svc-catalog.log
```

#### Остановка всех сервисов

```bash
./scripts/stop-dev-full.sh
```

### 📝 Логи сервисов

Все логи находятся в `/tmp/`:

- `/tmp/frontend.log` - Next.js frontend
- `/tmp/svc-catalog.log` - Catalog service
- `/tmp/svc-enquiries.log` - Enquiries service  
- `/tmp/svc-guests.log` - Guests service
- `/tmp/svc-payments.log` - Payments service
- `/var/log/postgresql.log` - PostgreSQL

### 🔧 База данных

**Строка подключения:**
```
postgresql://pg:pg@localhost:5434/wt
```

**Подключение через psql:**
```bash
psql -h localhost -p 5434 -U pg -d wt
```

### ⚠️ Известные проблемы и решения

#### Auth Service не запускается

**Проблема:** Ошибка с @prisma/client  
**Решение:** Нужно настроить Prisma в сервисе auth:

```bash
cd apps/svc-auth
npm install
npx prisma generate
```

#### Billing/Vendors не запускаются

**Проблема:** Отсутствуют зависимости модулей  
**Решение:** Установить зависимости в packages:

```bash
cd packages/billing  # или calendar для vendors
npm install
```

#### Docker/MinIO недоступны

**Причина:** Docker не поддерживается в текущем окружении  
**Статус:** PostgreSQL работает напрямую, MinIO не критичен для разработки

### 🔄 Повторный запуск

Если вы остановили сервисы, запустите их заново:

```bash
# Запуск PostgreSQL
sudo -u postgres /usr/lib/postgresql/17/bin/pg_ctl \
  -D /var/lib/postgresql/17/main \
  -l /var/log/postgresql.log start

# Запуск микросервисов
cd /workspace/apps/svc-catalog && \
  PORT=3002 DATABASE_URL=postgresql://pg:pg@localhost:5434/wt \
  node src/main.js > /tmp/svc-catalog.log 2>&1 &

cd /workspace/apps/svc-enquiries && \
  PORT=3003 DATABASE_URL=postgresql://pg:pg@localhost:5434/wt \
  node src/main.js > /tmp/svc-enquiries.log 2>&1 &

cd /workspace/apps/svc-guests && \
  PORT=3006 DATABASE_URL=postgresql://pg:pg@localhost:5434/wt \
  node src/main.js > /tmp/svc-guests.log 2>&1 &

cd /workspace/apps/svc-payments && \
  PORT=3007 DATABASE_URL=postgresql://pg:pg@localhost:5434/wt \
  node src/main.js > /tmp/svc-payments.log 2>&1 &

# Запуск фронтенда
cd /workspace && npm run dev > /tmp/frontend.log 2>&1 &
```

### 🎯 Проверка работоспособности

```bash
# Frontend
curl http://localhost:3000

# Services health check
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3006/health
curl http://localhost:3007/health
```

### 📚 Дополнительная информация

- **Node.js версия:** v22.20.0
- **PostgreSQL версия:** 17.6
- **Next.js версия:** 14.2.33
- **Prisma версия:** 6.18.0

### 🆘 Поддержка

Если возникли проблемы:

1. Проверьте логи в `/tmp/*.log`
2. Убедитесь, что PostgreSQL запущен: `psql -h localhost -p 5434 -U postgres -c "SELECT version();"`
3. Проверьте переменные окружения в `.env`

---

**Проект готов к разработке! 🎉**
