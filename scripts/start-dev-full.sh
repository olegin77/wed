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

# Создание директории для PID файлов
PID_DIR="/run/wed"
if [ ! -d "$PID_DIR" ]; then
    echo -e "${YELLOW}📁 Создание директории для PID файлов...${NC}"
    sudo mkdir -p "$PID_DIR"
    sudo chmod 777 "$PID_DIR"
fi

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
HOST=0.0.0.0

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

# Функция для проверки и освобождения порта
check_and_free_port() {
    local port=$1
    local service=$2
    
    # Проверяем, занят ли порт
    if ss -lntp 2>/dev/null | grep -q ":${port} "; then
        echo -e "${YELLOW}⚠️  Порт ${port} занят. Освобождаем...${NC}"
        
        # Пытаемся найти PID из файла
        local pid_file="${PID_DIR}/${service}.pid"
        if [ -f "$pid_file" ]; then
            local old_pid=$(cat "$pid_file")
            if kill -0 "$old_pid" 2>/dev/null; then
                echo -e "${YELLOW}   Останавливаем старый процесс (PID: $old_pid)${NC}"
                kill "$old_pid" 2>/dev/null || true
                sleep 1
                # Если процесс всё ещё жив, убиваем принудительно
                if kill -0 "$old_pid" 2>/dev/null; then
                    kill -9 "$old_pid" 2>/dev/null || true
                fi
            fi
            rm -f "$pid_file"
        fi
        
        # Дополнительная проверка и освобождение порта через lsof
        local pids=$(lsof -ti :${port} 2>/dev/null || true)
        if [ -n "$pids" ]; then
            echo -e "${YELLOW}   Убиваем процессы на порту ${port}: $pids${NC}"
            echo "$pids" | xargs -r kill -9 2>/dev/null || true
        fi
        
        sleep 1
        echo -e "${GREEN}✓ Порт ${port} освобождён${NC}"
    fi
}

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
    
    check_and_free_port "$port" "$service"
    
    echo -e "${BLUE}▶️  Запуск ${service} на порту ${port}...${NC}"
    cd "apps/${service}"
    
    # Создаём лог-файл с ротацией
    local log_file="/tmp/${service}.log"
    if [ -f "$log_file" ]; then
        # Простая ротация: если файл больше 5 МБ, создаём бэкап
        local size=$(stat -f%z "$log_file" 2>/dev/null || stat -c%s "$log_file" 2>/dev/null)
        if [ "$size" -gt 5242880 ]; then
            for i in 4 3 2 1; do
                [ -f "${log_file}.$i" ] && mv "${log_file}.$i" "${log_file}.$((i+1))"
            done
            mv "$log_file" "${log_file}.1"
        fi
    fi
    
    PORT=${port} HOST=${HOST:-0.0.0.0} npm start > "$log_file" 2>&1 &
    local pid=$!
    echo $pid > "${PID_DIR}/${service}.pid"
    echo -e "${GREEN}✓ ${service} запущен (PID: $pid, порт: ${port})${NC}"
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
check_and_free_port 3000 "next"

echo -e "${GREEN}🌐 Запуск Next.js фронтенда...${NC}"
npm run dev -- -H ${HOST:-0.0.0.0} -p 3000 > /tmp/next.log 2>&1 &
NEXT_PID=$!
echo $NEXT_PID > "${PID_DIR}/next.pid"
echo -e "${GREEN}✓ Next.js запущен (PID: $NEXT_PID, порт: 3000)${NC}"

echo ""
echo -e "${GREEN}=================================================="
echo "✅ ПРОЕКТ УСПЕШНО ЗАПУЩЕН!"
echo "==================================================${NC}"
echo ""
echo -e "${BLUE}🌐 Доступные сервисы:${NC}"
echo ""
printf "%-20s %-25s %s\n" "Сервис" "URL" "Статус"
echo "─────────────────────────────────────────────────────────────"
printf "%-20s %-25s %s\n" "Frontend" "http://localhost:3000" "$(ss -lntp 2>/dev/null | grep -q ':3000 ' && echo '✓' || echo '✗')"
printf "%-20s %-25s %s\n" "Auth Service" "http://localhost:3001" "$(ss -lntp 2>/dev/null | grep -q ':3001 ' && echo '✓' || echo '✗')"
printf "%-20s %-25s %s\n" "Catalog Service" "http://localhost:3002" "$(ss -lntp 2>/dev/null | grep -q ':3002 ' && echo '✓' || echo '✗')"
printf "%-20s %-25s %s\n" "Enquiries" "http://localhost:3003" "$(ss -lntp 2>/dev/null | grep -q ':3003 ' && echo '✓' || echo '✗')"
printf "%-20s %-25s %s\n" "Billing" "http://localhost:3004" "$(ss -lntp 2>/dev/null | grep -q ':3004 ' && echo '✓' || echo '✗')"
printf "%-20s %-25s %s\n" "Vendors" "http://localhost:3005" "$(ss -lntp 2>/dev/null | grep -q ':3005 ' && echo '✓' || echo '✗')"
printf "%-20s %-25s %s\n" "Guests" "http://localhost:3006" "$(ss -lntp 2>/dev/null | grep -q ':3006 ' && echo '✓' || echo '✗')"
printf "%-20s %-25s %s\n" "Payments" "http://localhost:3007" "$(ss -lntp 2>/dev/null | grep -q ':3007 ' && echo '✓' || echo '✗')"
echo "─────────────────────────────────────────────────────────────"
printf "%-20s %-25s\n" "PostgreSQL" "localhost:5434"
printf "%-20s %-25s\n" "MinIO Console" "http://localhost:9001"
echo ""
echo -e "${YELLOW}📋 Управление:${NC}"
echo "   Ctrl+C           - Остановить все сервисы"
echo "   ./scripts/stop-dev-full.sh - Остановить сервисы скриптом"
echo ""
echo -e "${GREEN}💡 Логи сервисов в /tmp/*.log${NC}"
echo -e "${GREEN}💡 PID файлы в ${PID_DIR}/*.pid${NC}"
echo "=================================================="

# Функция для корректной остановки
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Остановка сервисов...${NC}"
    
    # Остановка всех процессов
    for pid_file in "${PID_DIR}"/*.pid; do
        if [ -f "$pid_file" ]; then
            local pid=$(cat "$pid_file")
            local service=$(basename "$pid_file" .pid)
            if kill -0 "$pid" 2>/dev/null; then
                echo -e "${YELLOW}   Останавливаем ${service} (PID: ${pid})${NC}"
                kill "$pid" 2>/dev/null || true
                sleep 0.5
                # Если процесс всё ещё жив, убиваем принудительно
                if kill -0 "$pid" 2>/dev/null; then
                    kill -9 "$pid" 2>/dev/null || true
                fi
            fi
            rm -f "$pid_file"
        fi
    done
    
    echo -e "${GREEN}✓ Все сервисы остановлены${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Ожидание
wait $NEXT_PID
