#!/bin/bash
# ============================================
# Скрипт запуска полного проекта WeddingTech
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================="
echo "🚀 ЗАПУСК ПРОЕКТА WEDDINGTECH (Full Stack)"
echo "==================================================${NC}"
echo ""

# Проверка наличия .env
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Создание .env файла...${NC}"
    cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql://pg:pg@localhost:5434/wt

# Internal API URL (for Next.js rewrites)
INTERNAL_API_URL=http://localhost

# Application
NODE_ENV=development
PORT=3000

# Auth
NEXTAUTH_SECRET=dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Minio
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=minio123
EOF
    echo -e "${GREEN}✓ Файл .env создан${NC}"
fi

# Загрузка переменных окружения
export $(cat .env | grep -v '^#' | xargs)

# Запуск базы данных и Minio
echo -e "${GREEN}🐳 Запуск инфраструктуры...${NC}"
docker-compose up -d db minio

echo -e "${YELLOW}⏳ Ожидание готовности PostgreSQL...${NC}"
# Ждем готовности базы данных (до 60 секунд)
for i in {1..60}; do
    if docker-compose exec -T db pg_isready -U pg > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PostgreSQL готов!${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "${RED}✗ Timeout: PostgreSQL не готов после 60 секунд${NC}"
        exit 1
    fi
    echo -n "."
    sleep 1
done

# Создаем базу данных, если её нет
echo -e "${YELLOW}📝 Проверка базы данных 'wt'...${NC}"
docker-compose exec -T db psql -U pg -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'wt'" | grep -q 1 || \
    docker-compose exec -T db psql -U pg -d postgres -c "CREATE DATABASE wt" && \
    echo -e "${GREEN}✓ База данных 'wt' готова${NC}"

# Применение миграций
echo -e "${GREEN}🗄️  Применение миграций базы данных...${NC}"
npx prisma generate
npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init

# Создание функции для запуска сервисов
run_service() {
    local service=$1
    local port=$2
    echo -e "${BLUE}▶️  Запуск ${service} на порту ${port}...${NC}"
    cd "apps/${service}"
    PORT=${port} npm start > "/tmp/${service}.log" 2>&1 &
    echo $! > "/tmp/${service}.pid"
    cd ../..
}

# Запуск микросервисов
echo -e "${GREEN}🔧 Запуск микросервисов...${NC}"

# Проверка и запуск каждого сервиса
if [ -d "apps/svc-auth" ]; then
    run_service "svc-auth" 3001
fi

if [ -d "apps/svc-catalog" ]; then
    run_service "svc-catalog" 3002
fi

if [ -d "apps/svc-enquiries" ]; then
    run_service "svc-enquiries" 3003
fi

if [ -d "apps/svc-billing" ]; then
    run_service "svc-billing" 3004
fi

if [ -d "apps/svc-vendors" ]; then
    run_service "svc-vendors" 3005
fi

if [ -d "apps/svc-guests" ]; then
    run_service "svc-guests" 3006
fi

if [ -d "apps/svc-payments" ]; then
    run_service "svc-payments" 3007
fi

echo -e "${YELLOW}⏳ Ожидание инициализации сервисов (5 сек)...${NC}"
sleep 5

# Запуск Next.js приложения
echo -e "${GREEN}🌐 Запуск Next.js фронтенда...${NC}"
npm run dev > /tmp/next.log 2>&1 &
NEXT_PID=$!
echo $NEXT_PID > /tmp/next.pid

echo ""
echo -e "${GREEN}=================================================="
echo "✅ ПРОЕКТ УСПЕШНО ЗАПУЩЕН!"
echo "==================================================${NC}"
echo ""
echo -e "${BLUE}🌐 Доступные сервисы:${NC}"
echo "   Frontend:        http://localhost:3000"
echo "   Auth Service:    http://localhost:3001"
echo "   Catalog Service: http://localhost:3002"
echo "   Enquiries:       http://localhost:3003"
echo "   Billing:         http://localhost:3004"
echo "   Vendors:         http://localhost:3005"
echo "   Guests:          http://localhost:3006"
echo "   Payments:        http://localhost:3007"
echo "   PostgreSQL:      localhost:5434"
echo "   MinIO Console:   http://localhost:9001"
echo ""
echo -e "${YELLOW}📋 Управление:${NC}"
echo "   Ctrl+C           - Остановить все сервисы"
echo "   ./scripts/stop-dev-full.sh - Остановить сервисы скриптом"
echo ""
echo -e "${GREEN}💡 Логи сервисов в /tmp/*.log${NC}"
echo "=================================================="

# Функция для корректной остановки
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Остановка сервисов...${NC}"
    
    # Остановка всех процессов
    for pid_file in /tmp/svc-*.pid /tmp/next.pid; do
        if [ -f "$pid_file" ]; then
            kill $(cat "$pid_file") 2>/dev/null || true
            rm "$pid_file"
        fi
    done
    
    echo -e "${GREEN}✓ Все сервисы остановлены${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Ожидание
wait $NEXT_PID
