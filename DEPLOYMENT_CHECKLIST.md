# 🚀 Чеклист Развертывания После Исправлений

## ✅ Предварительная Проверка

- [ ] Все изменения закоммичены в Git
- [ ] `.env` файл настроен правильно
- [ ] Docker и Docker Compose установлены
- [ ] Node.js v20.x установлен
- [ ] pnpm установлен
- [ ] Порты 3000-3007, 5434, 9000-9001 свободны

## 🔧 Шаг 1: Подготовка Окружения

```bash
# Проверка версий
node --version    # должно быть v20.x
pnpm --version    # любая версия >= 8.x
docker --version
docker-compose --version

# Установка зависимостей (если нужно)
pnpm install

# Генерация Prisma Client
pnpm exec prisma generate
```

- [ ] Все команды выполнились успешно
- [ ] Зависимости установлены
- [ ] Prisma Client сгенерирован

## 🐳 Шаг 2: Запуск Инфраструктуры

```bash
# Остановка старых контейнеров (если есть)
docker-compose down

# Запуск PostgreSQL и MinIO
docker-compose up -d db minio

# Ожидание готовности (до 60 сек)
timeout 60 bash -c 'until docker-compose exec -T db pg_isready -U pg; do sleep 2; done'
```

- [ ] Контейнеры запустились
- [ ] PostgreSQL отвечает на pg_isready
- [ ] MinIO доступен на http://localhost:9001

## 🗄️ Шаг 3: Инициализация Базы Данных

```bash
# Создание базы данных (если не существует)
docker-compose exec -T db psql -U pg -d postgres -c "CREATE DATABASE wt" 2>/dev/null || true

# Применение миграций
pnpm exec prisma migrate deploy

# Проверка
docker-compose exec -T db psql -U pg -d wt -c "\dt"
```

- [ ] База данных создана
- [ ] Миграции применены без ошибок
- [ ] Таблицы присутствуют в базе

## 🚀 Шаг 4: Запуск Сервисов

### Вариант A: Использование Нового Скрипта (Рекомендуется)

```bash
./scripts/start-services-robust.sh
```

- [ ] Скрипт запустился
- [ ] Все 7 микросервисов запустились
- [ ] Health checks прошли для всех сервисов
- [ ] Frontend запустился
- [ ] Smoke тесты прошли автоматически

### Вариант B: Docker Compose (Полная Контейнеризация)

```bash
# Пересборка образов
docker-compose build

# Запуск всех сервисов
docker-compose up -d

# Ожидание готовности (30 секунд)
sleep 30

# Проверка статуса
docker-compose ps
```

- [ ] Все контейнеры в состоянии "Up"
- [ ] Health status показывает "healthy" для всех сервисов
- [ ] Логи не содержат критических ошибок

## 🧪 Шаг 5: Верификация

```bash
# Запуск диагностики
./scripts/diagnose-services.sh

# Запуск smoke тестов
./scripts/smoke.sh

# Ручная проверка каждого сервиса
curl http://localhost:3001/healthz  # Auth
curl http://localhost:3002/healthz  # Catalog
curl http://localhost:3003/healthz  # Enquiries
curl http://localhost:3004/healthz  # Billing
curl http://localhost:3005/healthz  # Vendors
curl http://localhost:3006/healthz  # Guests
curl http://localhost:3007/healthz  # Payments
curl http://localhost:3000/         # Frontend
```

- [ ] Диагностика прошла успешно
- [ ] Smoke тесты: 9/9 пройдено
- [ ] Все health endpoints отвечают {"status":"ok"}
- [ ] Frontend загружается в браузере

## 📊 Шаг 6: Мониторинг

```bash
# В отдельном терминале запустить мониторинг
./scripts/monitor-services.sh 5
```

- [ ] Мониторинг запущен
- [ ] Все сервисы показывают статус ✓
- [ ] Процессы живы (PID файлы валидны)
- [ ] Docker контейнеры здоровы

## 📝 Шаг 7: Проверка Логов

```bash
# Проверка логов на ошибки
grep -i error /tmp/weddingtech-logs/*.log
grep -i critical /tmp/weddingtech-logs/*.log
grep -i warning /tmp/weddingtech-logs/*.log

# Просмотр последних записей
tail -20 /tmp/weddingtech-logs/*.log
```

- [ ] Нет критических ошибок
- [ ] Нет unexpected warnings
- [ ] Логи показывают нормальную работу

## 🌐 Шаг 8: Функциональное Тестирование

### Проверка Frontend
```bash
# Открыть в браузере
open http://localhost:3000  # macOS
xdg-open http://localhost:3000  # Linux
```

- [ ] Главная страница загружается
- [ ] Нет ошибок в консоли браузера
- [ ] Навигация работает

### Проверка API Endpoints (через Frontend rewrites)
```bash
curl http://localhost:3000/api/auth/health
curl http://localhost:3000/api/catalog/health
curl http://localhost:3000/api/enquiries/health
```

- [ ] API endpoints доступны через frontend
- [ ] Rewrites работают корректно

## 🔒 Шаг 9: Проверка Безопасности

```bash
# Проверка что сервисы доступны извне (если нужно)
curl http://YOUR_SERVER_IP:3000/

# Проверка security headers
curl -I http://localhost:3000/ | grep -i "x-frame-options\|x-content-type-options\|strict-transport-security"
```

- [ ] Сервисы доступны по нужным адресам
- [ ] Security headers присутствуют
- [ ] Ненужные порты не открыты

## 📈 Шаг 10: Тестирование Производительности (Опционально)

```bash
# Простой stress test
for i in {1..100}; do
  curl -s http://localhost:3001/healthz > /dev/null &
done
wait

# Проверка что сервисы остались живы
./scripts/diagnose-services.sh
```

- [ ] Сервисы выдержали нагрузку
- [ ] Нет memory leaks
- [ ] Response time приемлемый

## 🔄 Шаг 11: Тест Перезапуска

```bash
# Остановка
./scripts/stop-services-robust.sh

# Проверка что все остановлено
lsof -i :3000,3001,3002,3003,3004,3005,3006,3007

# Повторный запуск
./scripts/start-services-robust.sh
```

- [ ] Остановка прошла чисто
- [ ] Все порты освобождены
- [ ] Повторный запуск успешен
- [ ] Smoke тесты снова проходят

## 📋 Итоговая Верификация

### Критичные Проверки (Must Pass)
- [ ] ✅ Все 7 микросервисов работают
- [ ] ✅ Frontend доступен
- [ ] ✅ PostgreSQL принимает соединения
- [ ] ✅ Smoke тесты проходят (9/9)
- [ ] ✅ Health checks возвращают 200 OK
- [ ] ✅ Нет критических ошибок в логах

### Желательные Проверки (Should Pass)
- [ ] ✅ Мониторинг показывает все зеленые статусы
- [ ] ✅ Docker health checks показывают "healthy"
- [ ] ✅ Response time < 500ms для health checks
- [ ] ✅ Security headers присутствуют
- [ ] ✅ Перезапуск работает корректно

### Опциональные Проверки (Nice to Have)
- [ ] ✅ E2E тесты проходят
- [ ] ✅ Нагрузочные тесты выдержаны
- [ ] ✅ Логи структурированы
- [ ] ✅ Метрики собираются

## 🎉 Развертывание Завершено!

Если все критичные и желательные проверки пройдены:

```bash
echo "✅ Развертывание успешно завершено!"
echo "🌐 Сервисы доступны:"
echo "   Frontend: http://localhost:3000"
echo "   Services: http://localhost:3001-3007"
echo "📊 Мониторинг: ./scripts/monitor-services.sh"
echo "🧪 Тесты: ./scripts/smoke.sh"
```

## 🚨 Действия При Проблемах

### Если что-то не работает:

1. **Запустить диагностику:**
   ```bash
   ./scripts/diagnose-services.sh > diagnosis.txt
   ```

2. **Собрать логи:**
   ```bash
   tar czf logs-$(date +%Y%m%d-%H%M%S).tar.gz /tmp/weddingtech-logs/
   ```

3. **Проверить Docker:**
   ```bash
   docker-compose ps
   docker-compose logs > docker-logs.txt
   ```

4. **Обратиться к документации:**
   - `SERVICE_ACCESS_FIX_GUIDE.md` - полное руководство
   - `TEST_RESULTS.md` - примеры решения проблем
   - `COMPREHENSIVE_FIX_SUMMARY.md` - обзор всех изменений

### Контакты для Поддержки
- Документация: См. файлы `*.md` в корне проекта
- Логи: `/tmp/weddingtech-logs/`
- Диагностика: `./scripts/diagnose-services.sh`

---

**Дата:** 2025-10-25  
**Версия:** 1.0.0  
**Проверено:** ✅
