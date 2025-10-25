# Docker Deployment Guide

## Исправления для Production Deployment

### Проблема с Prisma Client
Prisma Client генерируется для нескольких версий TypeScript (5.4.5 и 5.9.3). 
Решение: добавлен `docker-entrypoint-service.sh`, который генерирует и копирует Prisma Client для всех версий TypeScript при запуске контейнера.

### Основные изменения:

1. **docker-entrypoint-service.sh** - Новый entrypoint скрипт для сервисов
   - Генерирует Prisma Client при старте контейнера
   - Копирует клиент во все директории @prisma/client для разных версий TypeScript
   - Гарантирует доступность клиента независимо от версии TS

2. **Dockerfile.service** - Обновлен
   - Добавлен ENTRYPOINT с новым скриптом
   - Сохранена команда CMD для запуска сервиса

3. **.dockerignore** - Создан
   - Ускоряет сборку образов
   - Исключает ненужные файлы из контекста сборки

## Быстрая установка

### Для автоматической установки:

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_REPO/main/scripts/install.sh | bash
```

### Ручная установка:

1. Клонировать репозиторий:
```bash
git clone https://github.com/YOUR_REPO/weddingtech-platform.git
cd weddingtech-platform
```

2. Запустить Docker Compose:
```bash
docker-compose up -d --build
```

3. Проверить статус:
```bash
docker-compose ps
docker-compose logs -f
```

4. Доступ к приложению:
- Frontend: http://localhost:3000
- Auth API: http://localhost:3001
- Catalog API: http://localhost:3002
- MinIO Console: http://localhost:9001

## Проверка здоровья сервисов

```bash
# Проверить все сервисы
docker-compose ps

# Логи конкретного сервиса
docker-compose logs -f svc-auth

# Перезапустить сервис
docker-compose restart svc-auth

# Пересобрать и перезапустить
docker-compose up -d --build svc-auth
```

## Troubleshooting

### Prisma Client ошибка
Если видите `Error: Cannot find module '.prisma/client/default'`:
```bash
# Пересоберите образы
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### База данных не инициализирована
```bash
# Выполнить миграции
docker-compose exec svc-auth sh -c "cd /app && pnpm prisma migrate deploy"
```

### Сервисы не становятся healthy
```bash
# Проверить логи
docker-compose logs --tail=100 svc-auth

# Проверить health endpoint вручную
docker-compose exec svc-auth wget -O- http://localhost:3001/healthz
```

## Environment Variables

Создайте `.env` файл в корне проекта:

```env
# Database
DATABASE_URL=postgresql://pg:your_secure_password@db:5432/wt
POSTGRES_PASSWORD=your_secure_password

# MinIO
MINIO_ROOT_USER=minio
MINIO_ROOT_PASSWORD=your_secure_minio_password

# Application
NODE_ENV=production
PORT=3000
```

## Production Checklist

- [ ] Изменить пароли по умолчанию в `.env`
- [ ] Настроить SSL сертификаты для Nginx
- [ ] Настроить backup для PostgreSQL
- [ ] Настроить firewall (открыть только 80, 443, 22)
- [ ] Настроить monitoring (Prometheus + Grafana)
- [ ] Настроить логирование (ELK или Loki)
- [ ] Проверить resource limits в docker-compose.yml
