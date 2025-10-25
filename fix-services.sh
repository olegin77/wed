#!/bin/bash

set -e

echo "=========================================="
echo "Диагностика и исправление сервисов"
echo "=========================================="
echo ""

# Проверяем логи проблемных сервисов
echo "[1] Логи svc-auth (последние 50 строк):"
echo "=========================================="
docker-compose logs --tail=50 svc-auth
echo ""

echo "[2] Логи svc-billing (последние 50 строк):"
echo "=========================================="
docker-compose logs --tail=50 svc-billing
echo ""

# Проверяем, есть ли таблицы в базе данных
echo "[3] Проверка базы данных:"
echo "=========================================="
docker-compose exec -T db psql -U pg -d wt -c "\dt" || echo "Нет доступа к БД"
echo ""

# Проверяем, нужны ли миграции
echo "[4] Проверка необходимости миграций:"
echo "=========================================="
if docker-compose exec -T db psql -U pg -d wt -c "\dt" 2>&1 | grep -q "Did not find any relations"; then
    echo "⚠️  База данных пустая! Необходимо запустить миграции."
    echo ""
    echo "Запускаем миграции..."
    docker-compose exec -T svc-auth sh -c 'cd /app && pnpm exec prisma migrate deploy' || echo "Ошибка при выполнении миграций"
else
    echo "✓ Таблицы в базе данных присутствуют"
fi
echo ""

# Перезапускаем проблемные сервисы
echo "[5] Перезапуск svc-auth:"
echo "=========================================="
docker-compose restart svc-auth
echo ""

echo "[6] Ожидание запуска svc-auth (30 секунд)..."
sleep 30
echo ""

echo "[7] Статус после перезапуска:"
echo "=========================================="
docker-compose ps
echo ""

# Пробуем запустить web
echo "[8] Попытка запуска web сервиса:"
echo "=========================================="
docker-compose up -d web
echo ""

echo "[9] Ожидание запуска web (30 секунд)..."
sleep 30
echo ""

echo "[10] Финальный статус всех сервисов:"
echo "=========================================="
docker-compose ps
echo ""

echo "[11] Проверка доступности веб-приложения:"
echo "=========================================="
if curl -f http://localhost:3000/api/healthz 2>/dev/null; then
    echo "✓ Веб-приложение работает!"
else
    echo "⚠️  Веб-приложение не отвечает. Проверяем логи:"
    docker-compose logs --tail=50 web
fi
echo ""

echo "=========================================="
echo "Готово!"
echo "=========================================="
