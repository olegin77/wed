# Исправления развертывания WeddingTech

## Резюме выполненных исправлений

Все запрошенные исправления были успешно применены. Ниже приведено подробное описание изменений.

---

## 1. Исправление ошибок EADDRINUSE

### Проблема
При повторном запуске сервисов возникали ошибки EADDRINUSE из-за того, что порты оставались занятыми предыдущими процессами.

### Решение
- Добавлена функция `check_and_free_port()` в `scripts/start-dev-full.sh`
- Перед запуском каждого сервиса проверяется занятость порта с помощью `ss -lntp`
- Если порт занят, сначала пытаемся убить процесс по PID из файла
- Дополнительно используется `lsof` для поиска и завершения процессов на занятом порту
- Все PID файлы хранятся в `/run/wed/<service>.pid`

---

## 2. Управление PID файлами

### Изменения в start-dev-full.sh
- Создание директории `/run/wed` для хранения PID файлов
- При запуске каждого сервиса PID записывается в файл
- Добавлен `trap` для корректной остановки по Ctrl+C
- Функция `cleanup()` читает все PID файлы и корректно завершает процессы

### Изменения в stop-dev-full.sh
- Чтение PID из файлов в `/run/wed/`
- Корректное завершение процессов с помощью `kill`
- Принудительное завершение (`kill -9`) если процесс не завершился
- Дополнительная проверка и очистка портов через `lsof`
- Удаление PID файлов после остановки

---

## 3. Прослушивание на 0.0.0.0

### Переменная HOST
- Добавлена переменная `HOST=0.0.0.0` в `.env` файл
- Все микросервисы уже слушали на `0.0.0.0` (проверено)
- Frontend запускается с флагом `-H ${HOST:-0.0.0.0}`
- Переменная `HOST` передается в каждый микросервис через `npm start`

### next.config.mjs
- Добавлен `experimental.allowedDevOrigins` с разрешенными источниками:
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
  - `http://0.0.0.0:3000`

---

## 4. Роутинг фронтенда

### Текущее состояние
- Главная страница находится в `app/page.tsx` и доступна по пути `/`
- Нет middleware или редиректов, которые бы перенаправляли неаутентифицированных пользователей
- Страница успешно загружается без авто-редиректа на `/dashboard`

### Проверено
- `app/layout.tsx` - базовый layout без редиректов
- `app/page.tsx` - домашняя страница с маркетинговым контентом
- Отсутствие middleware.ts в корне проекта

---

## 5. Health-чеки

### Микросервисы
Добавлен/обновлен эндпоинт `GET /healthz` для всех сервисов:
- **svc-auth** (3001): `/healthz` → `{"status":"ok"}`
- **svc-catalog** (3002): `/healthz` → `{"status":"ok","db":true}`
- **svc-enquiries** (3003): `/healthz` → `{"status":"ok","db":true}`
- **svc-billing** (3004): `/healthz` → `{"status":"ok","service":"billing"}`
- **svc-vendors** (3005): `/healthz` → `{"status":"ok","db":true}`
- **svc-guests** (3006): `/healthz` → `{"status":"ok","db":true}`
- **svc-payments** (3007): `/healthz` → `{"status":"ok"}`

### Frontend
- Создан файл `app/api/healthz/route.ts`
- Эндпоинт `GET /api/healthz` возвращает:
  ```json
  {
    "status": "ok",
    "timestamp": "2025-10-24T...",
    "service": "frontend"
  }
  ```

---

## 6. Тесты

### Smoke тесты (scripts/smoke.sh)
Создан скрипт `scripts/smoke.sh` который проверяет:
1. Главную страницу (/) - должна содержать "WeddingTech"
2. Frontend health (`/api/healthz`) - должен вернуть `{"status":"ok"}`
3. Health-чеки всех микросервисов (3001-3007) - `/healthz`

Использование:
```bash
./scripts/smoke.sh
# или
npm run test:smoke
```

### E2E тесты (Playwright)
Создан тест `e2e/homepage.spec.ts` который проверяет:
1. Загрузку главной страницы без редиректа
2. Отсутствие авто-редиректа на `/dashboard` без сессии
3. Наличие работающих навигационных ссылок

Создан `playwright.config.ts` с конфигурацией:
- Базовый URL: `http://localhost:3000`
- Автоматический запуск dev-сервера перед тестами
- Поддержка CI/CD окружения

Использование:
```bash
npm run test:e2e        # Запуск тестов
npm run test:e2e:ui     # Запуск с UI
```

---

## 7. Ротация логов

### Реализация
В `start-dev-full.sh` добавлена ротация логов:
- Проверка размера лог-файла перед записью
- Если размер > 5 МБ, создается бэкап
- Хранятся до 5 ротаций (`.log.1`, `.log.2`, ..., `.log.5`)
- Логи записываются в `/tmp/<service>.log`

### Логи сервисов
- `/tmp/svc-auth.log`
- `/tmp/svc-catalog.log`
- `/tmp/svc-enquiries.log`
- `/tmp/svc-billing.log`
- `/tmp/svc-vendors.log`
- `/tmp/svc-guests.log`
- `/tmp/svc-payments.log`
- `/tmp/next.log`

---

## 8. Исправление MODULE_TYPELESS_PACKAGE_JSON

### Решение
Добавлено `"type": "module"` в корневой `package.json`:
```json
{
  "name": "weddingtech-website",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  ...
}
```

Это устраняет предупреждения о typeless package.json при запуске.

---

## 9. Итоговая таблица портов

После запуска `./scripts/start-dev-full.sh` выводится таблица:

```
🌐 Доступные сервисы:

Сервис               URL                       Статус
─────────────────────────────────────────────────────────────
Frontend             http://localhost:3000     ✓
Auth Service         http://localhost:3001     ✓
Catalog Service      http://localhost:3002     ✓
Enquiries            http://localhost:3003     ✓
Billing              http://localhost:3004     ✓
Vendors              http://localhost:3005     ✓
Guests               http://localhost:3006     ✓
Payments             http://localhost:3007     ✓
─────────────────────────────────────────────────────────────
PostgreSQL           localhost:5434
MinIO Console        http://localhost:9001
```

---

## Проверка работоспособности

### Запуск сервисов
```bash
./scripts/start-dev-full.sh
```

### Проверка портов
```bash
ss -lntp | egrep ':(3000|3001|3002|3003|3004|3005|3006|3007)\s'
```

### Проверка главной страницы
```bash
curl -I http://127.0.0.1:3000/
# Ожидается: HTTP/1.1 200 OK
```

### Запуск smoke тестов
```bash
./scripts/smoke.sh
# Ожидается: ✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ
```

### Остановка сервисов
```bash
./scripts/stop-dev-full.sh
# или
Ctrl+C (при запуске в foreground режиме)
```

---

## Дополнительные улучшения

1. **Безопасность**: Все сервисы используют `applySecurityHeaders()`
2. **Graceful shutdown**: Добавлена обработка SIGINT/SIGTERM для корректной остановки
3. **Мониторинг**: Можно отслеживать статус через health-чеки
4. **Логирование**: Централизованные логи в `/tmp/` с ротацией
5. **Отказоустойчивость**: Автоматическая очистка портов при перезапуске

---

## Структура файлов

```
/workspace/
├── scripts/
│   ├── start-dev-full.sh    # Обновлен: PID, порты, ротация
│   ├── stop-dev-full.sh     # Обновлен: чтение PID, корректная остановка
│   └── smoke.sh             # Новый: smoke тесты
├── app/
│   ├── api/
│   │   └── healthz/
│   │       └── route.ts     # Новый: health-check фронтенда
│   ├── layout.tsx           # Без изменений
│   └── page.tsx             # Без изменений
├── e2e/
│   └── homepage.spec.ts     # Новый: E2E тест главной страницы
├── playwright.config.ts     # Новый: конфигурация Playwright
├── next.config.mjs          # Обновлен: allowedDevOrigins
├── package.json             # Обновлен: type:module, playwright, scripts
└── .env                     # Обновлен: HOST=0.0.0.0

Микросервисы (обновлены health-чеки):
├── apps/svc-auth/src/
│   ├── main.js             # /healthz endpoint
│   └── server.js           # /healthz endpoint
├── apps/svc-catalog/src/main.js
├── apps/svc-enquiries/src/main.js
├── apps/svc-billing/src/main.js
├── apps/svc-vendors/src/main.js
├── apps/svc-guests/src/main.js
└── apps/svc-payments/src/main.js
```

---

## Следующие шаги

1. Установить зависимости:
   ```bash
   npm install
   ```

2. Запустить проект:
   ```bash
   ./scripts/start-dev-full.sh
   ```

3. Проверить smoke тесты:
   ```bash
   ./scripts/smoke.sh
   ```

4. Опционально: установить Playwright для E2E тестов:
   ```bash
   npx playwright install
   npm run test:e2e
   ```

---

## Заключение

Все запрошенные исправления были успешно применены:
- ✅ Исправлены ошибки EADDRINUSE
- ✅ Добавлено управление PID файлами
- ✅ Настроено прослушивание на 0.0.0.0
- ✅ Проверен и подтвержден роутинг фронтенда
- ✅ Добавлены health-чеки для всех сервисов
- ✅ Созданы smoke и E2E тесты
- ✅ Настроена ротация логов
- ✅ Устранены MODULE_TYPELESS предупреждения
- ✅ Добавлена информативная таблица портов

Проект готов к разработке и тестированию!
