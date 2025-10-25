# 🔧 Комплексное Исправление Проблем с Доступом к Сервисам

## 📋 Краткое Резюме

**Проблема:** Сервисы показывали "успешный запуск", но не были доступны извне. Smoke тесты не проходили.

**Причина:** 
1. Сервисы фактически не запускались или падали сразу после запуска
2. Отсутствие верификации доступности после запуска
3. Неправильная конфигурация Docker (нет health checks, неявный host binding)
4. Отсутствие диагностических инструментов

**Решение:** Комплексный набор исправлений и инструментов для надежного запуска и мониторинга.

---

## 🎯 Что Было Сделано

### 1. Создан Надежный Скрипт Запуска ✨

**Файл:** `scripts/start-services-robust.sh`

**Возможности:**
- ✅ Запуск PostgreSQL и MinIO через Docker Compose
- ✅ Ожидание готовности базы данных (до 60 секунд)
- ✅ Автоматическое применение Prisma миграций
- ✅ Последовательный запуск всех 7 микросервисов
- ✅ Проверка health endpoint каждого сервиса (до 30 попыток)
- ✅ Автоматическое освобождение занятых портов
- ✅ Детальное логирование в `/tmp/weddingtech-logs/`
- ✅ Запуск Next.js frontend с проверкой готовности
- ✅ Итоговый отчет с таблицей статусов
- ✅ Автоматический запуск smoke тестов

**Использование:**
```bash
./scripts/start-services-robust.sh
```

### 2. Система Мониторинга в Реальном Времени 📊

**Файл:** `scripts/monitor-services.sh`

**Возможности:**
- ✅ Continuous мониторинг всех сервисов
- ✅ Проверка HTTP endpoints
- ✅ Проверка процессов по PID
- ✅ Статус Docker контейнеров
- ✅ Статистика по портам
- ✅ Автообновление каждые N секунд

**Использование:**
```bash
./scripts/monitor-services.sh 5  # обновление каждые 5 сек
```

### 3. Комплексная Диагностика 🔍

**Файл:** `scripts/diagnose-services.sh`

**7 диагностических тестов:**
1. Проверка открытых портов
2. Тест подключения к сервисам с хоста
3. Проверка доступности базы данных
4. DNS разрешение имен в Docker
5. Сетевая связность между контейнерами
6. Конфигурация Docker сети
7. HTTP ответы с валидацией

**Использование:**
```bash
./scripts/diagnose-services.sh
```

### 4. Улучшенная Docker Конфигурация 🐳

**Файл:** `docker-compose.yml`

**Изменения для всех сервисов:**
```yaml
environment:
  HOST: 0.0.0.0  # Явное указание для внешнего доступа
  PORT: 300X
  DATABASE_URL: postgresql://pg:pg@db:5432/wt

healthcheck:  # Новые health checks
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:300X/healthz"]
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 10s
```

**Изменения для Frontend:**
```yaml
environment:
  INTERNAL_API_URL: http://host.docker.internal  # Вместо localhost
  HOST: 0.0.0.0

depends_on:  # Теперь ждем health status, не просто запуск
  svc-auth:
    condition: service_healthy
  # ... остальные сервисы

extra_hosts:  # Для доступа к хосту из контейнера
  - "host.docker.internal:host-gateway"
```

**Файл:** `Dockerfile.service`

**Изменения:**
```dockerfile
# Добавлены инструменты для health checks
RUN apk add --no-cache wget curl
```

### 5. Улучшенный Скрипт Остановки 🛑

**Файлы:** 
- `scripts/stop-services-robust.sh` (новый)
- `scripts/stop-dev-full.sh` (обновлен)

**Возможности:**
- ✅ Корректная остановка всех процессов
- ✅ Поддержка нескольких PID директорий
- ✅ Освобождение всех портов
- ✅ Остановка Docker контейнеров
- ✅ Опциональная очистка логов

### 6. Документация 📚

Созданы подробные руководства:
- `SERVICE_ACCESS_FIX_GUIDE.md` - Полное руководство по использованию
- `TEST_RESULTS.md` - Результаты тестирования и диагностики
- `COMPREHENSIVE_FIX_SUMMARY.md` - Этот файл

---

## 🚀 Быстрый Старт

### Вариант 1: Локальный Запуск (Рекомендуется для Разработки)

```bash
# 1. Остановить все существующие процессы
./scripts/stop-services-robust.sh

# 2. Запустить все сервисы с верификацией
./scripts/start-services-robust.sh

# Скрипт автоматически:
# - Запустит PostgreSQL и MinIO через Docker
# - Применит миграции Prisma
# - Запустит все 7 микросервисов
# - Запустит Next.js frontend
# - Проверит доступность всех сервисов
# - Запустит smoke тесты

# 3. (Опционально) Запустить мониторинг в отдельном терминале
./scripts/monitor-services.sh
```

### Вариант 2: Docker Compose (Для Production-Like Setup)

```bash
# 1. Пересборка всех образов с новыми изменениями
docker-compose build

# 2. Запуск всех сервисов
docker-compose up -d

# 3. Проверка health status
docker-compose ps

# 4. Проверка логов
docker-compose logs -f

# 5. Smoke тесты (после ~30 секунд для инициализации)
./scripts/smoke.sh
```

---

## 📊 Ожидаемые Результаты

### После Успешного Запуска:

```
==================================================
✅ ВСЕ СЕРВИСЫ УСПЕШНО ЗАПУЩЕНЫ И РАБОТАЮТ!
==================================================

🌐 Доступные сервисы:

Сервис              URL                            Статус    
────────────────────────────────────────────────────────────
Frontend            http://localhost:3000          ✓
Auth Service        http://localhost:3001/healthz  ✓
Catalog Service     http://localhost:3002/healthz  ✓
Enquiries           http://localhost:3003/healthz  ✓
Billing             http://localhost:3004/healthz  ✓
Vendors             http://localhost:3005/healthz  ✓
Guests              http://localhost:3006/healthz  ✓
Payments            http://localhost:3007/healthz  ✓
────────────────────────────────────────────────────────────
PostgreSQL          localhost:5434
MinIO Console       http://localhost:9001

🧪 Запуск smoke тестов...
==================================================
🧪 ЗАПУСК SMOKE ТЕСТОВ
==================================================

📍 Проверка фронтенда:
Проверка Главная страница... ✓ OK
Проверка Frontend health... ✓ OK

🔧 Проверка микросервисов:
Проверка Auth Service... ✓ OK
Проверка Catalog Service... ✓ OK
Проверка Enquiries Service... ✓ OK
Проверка Billing Service... ✓ OK
Проверка Vendors Service... ✓ OK
Проверка Guests Service... ✓ OK
Проверка Payments Service... ✓ OK

==================================================
✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ (9/9)
==================================================
```

---

## 🔍 Диагностика Проблем

### Если сервис не запускается:

```bash
# 1. Проверить логи сервиса
tail -50 /tmp/weddingtech-logs/svc-auth.log

# 2. Проверить не занят ли порт
lsof -i :3001

# 3. Запустить диагностику
./scripts/diagnose-services.sh

# 4. Попробовать запустить сервис вручную
cd apps/svc-auth
PORT=3001 HOST=0.0.0.0 DATABASE_URL="postgresql://pg:pg@localhost:5434/wt" node src/main.js
```

### Если health check не проходит:

```bash
# 1. Проверить что процесс запущен
ps aux | grep "node src/main.js"

# 2. Проверить endpoint вручную
curl -v http://localhost:3001/healthz

# 3. Проверить логи на ошибки
tail -100 /tmp/weddingtech-logs/svc-auth.log | grep -i error
```

### Если Docker контейнер не healthy:

```bash
# 1. Проверить статус
docker-compose ps

# 2. Проверить логи
docker-compose logs svc-auth

# 3. Проверить health check вручную внутри контейнера
docker exec -it workspace-svc-auth-1 wget -qO- http://localhost:3001/healthz

# 4. Перезапустить контейнер
docker-compose restart svc-auth
```

---

## 📈 Метрики и Мониторинг

### Мониторинг в Реальном Времени:

```bash
# Запустить continuous мониторинг
./scripts/monitor-services.sh 5
```

Вы увидите:
```
==================================================
📊 МОНИТОРИНГ СЕРВИСОВ WEDDINGTECH
==================================================
Обновление: 2025-10-25 12:34:56
==================================================

🔧 Микросервисы:
Сервис              Порт       HTTP            Процесс        
────────────────────────────────────────────────────────────
svc-auth            3001       ✓ OK            ✓ (PID: 12345)
svc-catalog         3002       ✓ OK            ✓ (PID: 12346)
...
```

### Проверка Health Endpoints:

```bash
# Все сервисы
for port in 3001 3002 3003 3004 3005 3006 3007; do
  echo -n "Port $port: "
  curl -s http://localhost:$port/healthz | jq .status
done

# Ожидаемый вывод:
# Port 3001: "ok"
# Port 3002: "ok"
# ...
```

### Проверка Логов:

```bash
# Последние 20 строк всех логов
tail -20 /tmp/weddingtech-logs/*.log

# Следить за логами в реальном времени
tail -f /tmp/weddingtech-logs/svc-auth.log

# Поиск ошибок во всех логах
grep -i error /tmp/weddingtech-logs/*.log
```

---

## 🎓 Лучшие Практики

### 1. Запуск Проекта
- ✅ Всегда используйте `start-services-robust.sh`
- ✅ Дождитесь завершения всех проверок
- ✅ Убедитесь что smoke тесты прошли
- ✅ Держите мониторинг открытым при разработке

### 2. Остановка Проекта
- ✅ Используйте `stop-services-robust.sh` для чистой остановки
- ✅ Не убивайте процессы вручную (через kill -9)
- ✅ Проверяйте что все порты освободились

### 3. Отладка
- ✅ Сначала запустите `diagnose-services.sh`
- ✅ Проверяйте логи в `/tmp/weddingtech-logs/`
- ✅ Используйте `curl` для ручной проверки endpoints
- ✅ Проверяйте переменные окружения (`.env` файл)

### 4. Разработка
- ✅ Запускайте smoke тесты после каждого изменения
- ✅ Используйте мониторинг для отслеживания здоровья сервисов
- ✅ Регулярно проверяйте логи на warnings
- ✅ Перезапускайте только нужный сервис, не все сразу

---

## 📂 Структура Файлов

```
workspace/
├── docker-compose.yml          # ✅ Обновлен: health checks, HOST
├── Dockerfile.service          # ✅ Обновлен: wget/curl
├── Dockerfile.web             # Без изменений
├── scripts/
│   ├── start-services-robust.sh    # ✅ НОВЫЙ: основной скрипт
│   ├── stop-services-robust.sh     # ✅ НОВЫЙ: остановка
│   ├── monitor-services.sh         # ✅ НОВЫЙ: мониторинг
│   ├── diagnose-services.sh        # ✅ НОВЫЙ: диагностика
│   ├── smoke.sh                    # Без изменений
│   ├── start-dev-full.sh           # Старая версия (работает)
│   └── stop-dev-full.sh            # ✅ Обновлен: две PID директории
├── SERVICE_ACCESS_FIX_GUIDE.md     # ✅ НОВЫЙ: руководство
├── TEST_RESULTS.md                  # ✅ НОВЫЙ: результаты тестов
└── COMPREHENSIVE_FIX_SUMMARY.md     # ✅ НОВЫЙ: это файл
```

---

## ✅ Чеклист Верификации

После запуска проверьте:

- [ ] PostgreSQL доступен: `pg_isready -h localhost -p 5434`
- [ ] MinIO доступен: `curl http://localhost:9000/minio/health/live`
- [ ] Auth Service: `curl http://localhost:3001/healthz`
- [ ] Catalog Service: `curl http://localhost:3002/healthz`
- [ ] Enquiries Service: `curl http://localhost:3003/healthz`
- [ ] Billing Service: `curl http://localhost:3004/healthz`
- [ ] Vendors Service: `curl http://localhost:3005/healthz`
- [ ] Guests Service: `curl http://localhost:3006/healthz`
- [ ] Payments Service: `curl http://localhost:3007/healthz`
- [ ] Frontend: `curl http://localhost:3000/`
- [ ] Smoke тесты: `./scripts/smoke.sh` = 0 exit code
- [ ] Нет зависших процессов: `ps aux | grep node`
- [ ] Логи без критических ошибок: `grep -i critical /tmp/weddingtech-logs/*.log`

---

## 🎯 Следующие Шаги

### Немедленные действия:
1. Запустить `./scripts/start-services-robust.sh`
2. Верифицировать все сервисы доступны
3. Запустить smoke тесты
4. Проверить в браузере `http://localhost:3000`

### Краткосрочные задачи:
1. Настроить автоматический запуск сервисов при старте системы
2. Добавить алерты при падении сервисов
3. Настроить ротацию логов
4. Добавить метрики производительности

### Долгосрочные задачи:
1. Настроить централизованное логирование (ELK stack)
2. Добавить distributed tracing (Jaeger)
3. Настроить service mesh (Istio/Linkerd)
4. Добавить circuit breakers между сервисами

---

## 💡 Дополнительные Заметки

### Переменные Окружения

Файл `.env` должен содержать:
```bash
DATABASE_URL=postgresql://pg:pg@localhost:5434/wt
INTERNAL_API_URL=http://localhost
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
```

### Директории

- **PID файлы:** `/tmp/weddingtech-pids/*.pid`
- **Логи:** `/tmp/weddingtech-logs/*.log`
- **Docker volumes:** управляются Docker Compose

### Порты

| Сервис | Порт | Endpoint |
|--------|------|----------|
| Frontend | 3000 | / |
| Auth | 3001 | /healthz |
| Catalog | 3002 | /healthz |
| Enquiries | 3003 | /healthz |
| Billing | 3004 | /healthz |
| Vendors | 3005 | /healthz |
| Guests | 3006 | /healthz |
| Payments | 3007 | /healthz |
| PostgreSQL | 5434 | - |
| MinIO API | 9000 | - |
| MinIO Console | 9001 | - |

---

## 📞 Помощь и Поддержка

При проблемах:
1. Запустите `./scripts/diagnose-services.sh`
2. Проверьте логи в `/tmp/weddingtech-logs/`
3. Обратитесь к `SERVICE_ACCESS_FIX_GUIDE.md`
4. Проверьте `TEST_RESULTS.md` для примеров решения проблем

---

**Дата создания:** 2025-10-25  
**Версия:** 1.0.0  
**Статус:** ✅ Готово к использованию
