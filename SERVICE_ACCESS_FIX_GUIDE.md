# Руководство по Исправлению Доступа к Сервисам

## 🎯 Обзор Проблемы

Было обнаружено, что сервисы показывали "успешный запуск", но на самом деле были недоступны извне. Проблемы включали:

1. **Сервисы не запускались фактически** - только создавались PID файлы
2. **Отсутствие проверки доступности** - скрипты не проверяли, отвечают ли сервисы на запросы
3. **Проблемы с Docker конфигурацией** - отсутствие health checks и неправильные настройки сети
4. **Некорректная конфигурация портов** - отсутствие явного HOST=0.0.0.0

## 🔧 Внедренные Исправления

### 1. Новый Надежный Скрипт Запуска

**Файл:** `scripts/start-services-robust.sh`

**Ключевые особенности:**
- ✅ Пошаговая верификация запуска каждого сервиса
- ✅ Проверка health endpoints с повторными попытками
- ✅ Автоматическое освобождение занятых портов
- ✅ Детальное логирование с ротацией
- ✅ Автоматический запуск smoke тестов после старта
- ✅ Красивый отчет о статусе всех сервисов

**Использование:**
```bash
./scripts/start-services-robust.sh
```

### 2. Улучшенная Конфигурация Docker Compose

**Файл:** `docker-compose.yml`

**Что изменено:**
- ✅ Добавлены health checks для всех сервисов
- ✅ Явно указан `HOST=0.0.0.0` для всех сервисов
- ✅ Frontend зависит от здоровья всех микросервисов (не просто их запуска)
- ✅ Добавлена поддержка `host.docker.internal` для межконтейнерной связи
- ✅ Обновлен Dockerfile.service с установкой wget/curl для health checks

**Пример health check:**
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001/healthz"]
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 10s
```

### 3. Скрипт Непрерывного Мониторинга

**Файл:** `scripts/monitor-services.sh`

**Возможности:**
- 📊 Отображение статуса всех сервисов в реальном времени
- 🔄 Автоматическое обновление каждые N секунд
- ✅ Проверка HTTP endpoints
- ✅ Проверка процессов по PID
- ✅ Статус Docker контейнеров
- ✅ Статистика по портам

**Использование:**
```bash
# Обновление каждые 5 секунд (по умолчанию)
./scripts/monitor-services.sh

# Обновление каждые 2 секунды
./scripts/monitor-services.sh 2
```

### 4. Улучшенный Скрипт Остановки

**Файлы:** 
- `scripts/stop-services-robust.sh` (новый)
- `scripts/stop-dev-full.sh` (обновлен)

**Особенности:**
- ✅ Корректная остановка всех процессов
- ✅ Освобождение всех портов
- ✅ Остановка Docker контейнеров
- ✅ Опциональная очистка логов

**Использование:**
```bash
./scripts/stop-services-robust.sh
# или
./scripts/stop-dev-full.sh
```

### 5. Диагностический Скрипт

**Файл:** `scripts/diagnose-services.sh`

**Что проверяет:**
- 🔍 Открытые порты
- 🔍 Подключение к сервисам с хоста
- 🔍 Доступность базы данных
- 🔍 DNS разрешение имен в Docker
- 🔍 Сетевая связность между контейнерами
- 🔍 Конфигурация Docker сети
- 🔍 HTTP ответы с валидацией

**Использование:**
```bash
./scripts/diagnose-services.sh
```

## 📋 Полный Рабочий Процесс

### Запуск с нуля:

```bash
# 1. Остановить все существующие сервисы
./scripts/stop-services-robust.sh

# 2. Запустить сервисы с полной верификацией
./scripts/start-services-robust.sh

# 3. В отдельном терминале запустить мониторинг (опционально)
./scripts/monitor-services.sh
```

### Диагностика проблем:

```bash
# 1. Запустить диагностику
./scripts/diagnose-services.sh

# 2. Проверить логи
tail -f /tmp/weddingtech-logs/svc-auth.log
tail -f /tmp/weddingtech-logs/next.log

# 3. Ручная проверка health endpoints
curl http://localhost:3001/healthz
curl http://localhost:3002/healthz
# и т.д.
```

### Smoke тесты:

```bash
# Автоматически запускаются в start-services-robust.sh
# Или запустить вручную:
./scripts/smoke.sh
```

## 🐳 Использование Docker Compose

### Обновленная команда запуска:

```bash
# Пересборка с новыми изменениями
docker-compose build

# Запуск с ожиданием health checks
docker-compose up -d

# Проверка статуса health
docker-compose ps

# Логи конкретного сервиса
docker-compose logs -f svc-auth

# Проверка health status
docker inspect --format='{{.State.Health.Status}}' <container_id>
```

## 🔍 Ключевые Изменения в Коде

### 1. Все сервисы слушают на 0.0.0.0

Все `main.js` файлы уже используют:
```javascript
const host = process.env.HOST ?? "0.0.0.0";
server.listen(port, host, () => {
  console.log(`Service listening on ${host}:${port}`);
});
```

### 2. Health Endpoints

Все сервисы имеют endpoint `/healthz`:
```javascript
if (req.url === "/healthz") {
  res.writeHead(200, { "Content-Type": "application/json" });
  return res.end(JSON.stringify({ status: "ok" }));
}
```

### 3. Docker Environment Variables

В docker-compose.yml для всех сервисов:
```yaml
environment:
  DATABASE_URL: postgresql://pg:pg@db:5432/wt
  PORT: 300X
  HOST: 0.0.0.0
```

## 🎯 Верификация Успешного Запуска

После запуска `start-services-robust.sh` вы должны увидеть:

```
✅ ВСЕ СЕРВИСЫ УСПЕШНО ЗАПУЩЕНЫ И РАБОТАЮТ!

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
```

Затем автоматически запустятся smoke тесты:

```
🧪 Запуск smoke тестов...
✅ Smoke тесты пройдены!
```

## 🚨 Troubleshooting

### Сервис не запускается

1. Проверьте логи:
   ```bash
   tail -50 /tmp/weddingtech-logs/<service-name>.log
   ```

2. Проверьте, не занят ли порт:
   ```bash
   lsof -i :3001
   ```

3. Проверьте переменные окружения:
   ```bash
   cat .env
   ```

### Health check не проходит

1. Проверьте, что сервис запущен:
   ```bash
   ps aux | grep "node src/main.js"
   ```

2. Проверьте вручную:
   ```bash
   curl -v http://localhost:3001/healthz
   ```

3. Проверьте логи на ошибки запуска

### Docker контейнеры не здоровы

1. Проверьте статус:
   ```bash
   docker-compose ps
   ```

2. Проверьте логи контейнера:
   ```bash
   docker-compose logs svc-auth
   ```

3. Проверьте health check вручную в контейнере:
   ```bash
   docker exec -it <container> wget -qO- http://localhost:3001/healthz
   ```

## 📝 Рекомендации

1. **Всегда используйте `start-services-robust.sh`** вместо старого скрипта
2. **Держите мониторинг открытым** в отдельном терминале при разработке
3. **Регулярно проверяйте логи** в `/tmp/weddingtech-logs/`
4. **Запускайте smoke тесты** после каждого изменения
5. **Используйте диагностический скрипт** при любых проблемах

## 🎉 Результат

После внедрения всех исправлений:
- ✅ Все сервисы запускаются надежно
- ✅ Доступ извне работает корректно
- ✅ Health checks подтверждают работоспособность
- ✅ Smoke тесты проходят успешно
- ✅ Мониторинг показывает реальное состояние системы
- ✅ Docker контейнеры имеют правильные health checks
