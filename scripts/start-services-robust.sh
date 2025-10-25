#!/bin/bash
# ============================================
# Надежный скрипт запуска сервисов с полной верификацией
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Конфигурация
MAX_RETRIES=30
RETRY_DELAY=2
PID_DIR="/tmp/weddingtech-pids"
LOG_DIR="/tmp/weddingtech-logs"

echo -e "${BLUE}=================================================="
echo "🚀 НАДЕЖНЫЙ ЗАПУСК WEDDINGTECH СЕРВИСОВ"
echo "==================================================${NC}"
echo ""

# Создание директорий
mkdir -p "$PID_DIR" "$LOG_DIR"

# Загрузка переменных окружения
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
fi

# Функция для ожидания готовности сервиса
wait_for_service() {
    local name=$1
    local port=$2
    local path=${3:-/healthz}
    local max_retries=${4:-$MAX_RETRIES}
    
    echo -n "   Ожидание ${name} (порт ${port})... "
    
    for i in $(seq 1 $max_retries); do
        if curl -fsS "http://localhost:${port}${path}" >/dev/null 2>&1; then
            echo -e "${GREEN}✓ Готов${NC}"
            return 0
        fi
        
        if [ $i -eq $max_retries ]; then
            echo -e "${RED}✗ Timeout после ${max_retries} попыток${NC}"
            
            # Показываем последние строки лога для диагностики
            local service_name=$(echo $name | tr '[:upper:]' '[:lower:]' | tr ' ' '-')
            if [ -f "${LOG_DIR}/${service_name}.log" ]; then
                echo -e "${YELLOW}   Последние строки лога:${NC}"
                tail -10 "${LOG_DIR}/${service_name}.log" | sed 's/^/   /'
            fi
            
            return 1
        fi
        
        sleep $RETRY_DELAY
        echo -n "."
    done
}

# Функция для остановки процесса на порту
kill_port() {
    local port=$1
    local pids=$(lsof -ti :${port} 2>/dev/null || true)
    
    if [ -n "$pids" ]; then
        echo -e "${YELLOW}   Освобождение порта ${port}...${NC}"
        echo "$pids" | xargs -r kill -9 2>/dev/null || true
        sleep 1
    fi
}

# Функция для запуска Node.js сервиса
start_node_service() {
    local service_dir=$1
    local service_name=$2
    local port=$3
    
    echo -e "${BLUE}▶️  Запуск ${service_name}...${NC}"
    
    # Проверка существования директории
    if [ ! -d "${service_dir}" ]; then
        echo -e "${RED}✗ Директория ${service_dir} не найдена${NC}"
        return 1
    fi
    
    # Освобождение порта если занят
    kill_port $port
    
    # Запуск сервиса
    cd "${service_dir}"
    
    local log_file="${LOG_DIR}/${service_name}.log"
    local pid_file="${PID_DIR}/${service_name}.pid"
    
    # Очистка старого лога (оставляем последние 1000 строк)
    if [ -f "$log_file" ]; then
        tail -1000 "$log_file" > "${log_file}.tmp"
        mv "${log_file}.tmp" "$log_file"
    fi
    
    # Запуск с правильными переменными окружения
    PORT=$port \
    HOST=0.0.0.0 \
    DATABASE_URL="${DATABASE_URL:-postgresql://pg:pg@localhost:5434/wt}" \
    NODE_ENV="${NODE_ENV:-development}" \
    nohup node src/main.js >> "$log_file" 2>&1 &
    
    local pid=$!
    echo $pid > "$pid_file"
    
    cd - > /dev/null
    
    echo -e "${GREEN}   Запущен (PID: $pid)${NC}"
    
    # Небольшая пауза для инициализации
    sleep 1
    
    # Проверка что процесс все еще жив
    if ! kill -0 $pid 2>/dev/null; then
        echo -e "${RED}✗ Процесс ${service_name} завершился сразу после запуска${NC}"
        echo -e "${YELLOW}   Последние строки лога:${NC}"
        tail -20 "$log_file" | sed 's/^/   /'
        return 1
    fi
    
    return 0
}

# Шаг 1: Запуск инфраструктуры (Docker)
echo -e "${GREEN}🐳 Запуск инфраструктуры (PostgreSQL, MinIO)...${NC}"

if command -v docker-compose &> /dev/null || command -v docker &> /dev/null; then
    # Останавливаем старые контейнеры
    docker-compose down 2>/dev/null || true
    
    # Запускаем только инфраструктуру
    docker-compose up -d db minio
    
    echo -e "${YELLOW}⏳ Ожидание готовности PostgreSQL...${NC}"
    
    for i in {1..60}; do
        if docker-compose exec -T db pg_isready -U pg > /dev/null 2>&1; then
            echo -e "${GREEN}✓ PostgreSQL готов!${NC}"
            break
        fi
        if [ $i -eq 60 ]; then
            echo -e "${RED}✗ Timeout: PostgreSQL не готов${NC}"
            exit 1
        fi
        echo -n "."
        sleep 1
    done
    
    # Проверка/создание базы данных
    echo -e "${YELLOW}📝 Инициализация базы данных...${NC}"
    docker-compose exec -T db psql -U pg -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'wt'" | grep -q 1 || \
        docker-compose exec -T db psql -U pg -d postgres -c "CREATE DATABASE wt"
    
    echo -e "${GREEN}✓ База данных готова${NC}"
    
    # Применение миграций
    echo -e "${GREEN}🗄️  Применение миграций Prisma...${NC}"
    export DATABASE_URL="postgresql://pg:pg@localhost:5434/wt"
    npx prisma generate
    npx prisma migrate deploy 2>/dev/null || npx prisma db push --skip-generate
    
    echo -e "${GREEN}✓ Миграции применены${NC}"
else
    echo -e "${YELLOW}⚠️  Docker не найден, пропуск запуска инфраструктуры${NC}"
    echo -e "${YELLOW}   Убедитесь, что PostgreSQL доступен на localhost:5434${NC}"
fi

echo ""

# Шаг 2: Запуск микросервисов
echo -e "${GREEN}🔧 Запуск микросервисов...${NC}"

SERVICES=(
    "apps/svc-auth:svc-auth:3001"
    "apps/svc-catalog:svc-catalog:3002"
    "apps/svc-enquiries:svc-enquiries:3003"
    "apps/svc-billing:svc-billing:3004"
    "apps/svc-vendors:svc-vendors:3005"
    "apps/svc-guests:svc-guests:3006"
    "apps/svc-payments:svc-payments:3007"
)

FAILED_SERVICES=()

for service_info in "${SERVICES[@]}"; do
    IFS=':' read -r dir name port <<< "$service_info"
    
    if [ -d "$dir" ]; then
        if start_node_service "$dir" "$name" "$port"; then
            # Успешно запущен
            :
        else
            FAILED_SERVICES+=("$name")
        fi
    else
        echo -e "${YELLOW}⚠️  Пропуск ${name} (директория не найдена)${NC}"
    fi
done

echo ""

# Шаг 3: Проверка health-endpoints всех сервисов
echo -e "${GREEN}🏥 Проверка health-endpoints сервисов...${NC}"

HEALTH_FAILED=()

for service_info in "${SERVICES[@]}"; do
    IFS=':' read -r dir name port <<< "$service_info"
    
    if [ -d "$dir" ] && ! [[ " ${FAILED_SERVICES[@]} " =~ " ${name} " ]]; then
        if ! wait_for_service "$name" "$port" "/healthz" 30; then
            HEALTH_FAILED+=("$name:$port")
        fi
    fi
done

echo ""

# Шаг 4: Запуск Next.js фронтенда
echo -e "${GREEN}🌐 Запуск Next.js фронтенда...${NC}"

kill_port 3000

export DATABASE_URL="postgresql://pg:pg@localhost:5434/wt"
export INTERNAL_API_URL="http://localhost"
export PORT=3000
export HOST=0.0.0.0

nohup npm run dev -- -H 0.0.0.0 -p 3000 >> "${LOG_DIR}/next.log" 2>&1 &
NEXT_PID=$!
echo $NEXT_PID > "${PID_DIR}/next.pid"

echo -e "${GREEN}   Запущен (PID: $NEXT_PID)${NC}"

# Ожидание готовности Next.js
echo -n "   Ожидание готовности Next.js... "
for i in {1..60}; do
    if curl -fsS "http://localhost:3000/api/healthz" >/dev/null 2>&1 || \
       curl -fsS "http://localhost:3000/" >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Готов${NC}"
        break
    fi
    
    if [ $i -eq 60 ]; then
        echo -e "${YELLOW}⚠ Timeout, но продолжаем${NC}"
    fi
    
    sleep 2
    echo -n "."
done

echo ""

# Шаг 5: Итоговый отчет
echo -e "${BLUE}=================================================="
echo "📊 ИТОГОВЫЙ ОТЧЕТ"
echo "==================================================${NC}"
echo ""

if [ ${#FAILED_SERVICES[@]} -eq 0 ] && [ ${#HEALTH_FAILED[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ ВСЕ СЕРВИСЫ УСПЕШНО ЗАПУЩЕНЫ И РАБОТАЮТ!${NC}"
else
    echo -e "${YELLOW}⚠️  ОБНАРУЖЕНЫ ПРОБЛЕМЫ:${NC}"
    
    if [ ${#FAILED_SERVICES[@]} -gt 0 ]; then
        echo -e "${RED}   Не запустились:${NC}"
        for svc in "${FAILED_SERVICES[@]}"; do
            echo -e "${RED}     - ${svc}${NC}"
        done
    fi
    
    if [ ${#HEALTH_FAILED[@]} -gt 0 ]; then
        echo -e "${RED}   Health-check не прошли:${NC}"
        for svc in "${HEALTH_FAILED[@]}"; do
            echo -e "${RED}     - ${svc}${NC}"
        done
    fi
fi

echo ""
echo -e "${BLUE}🌐 Доступные сервисы:${NC}"
echo ""

# Проверка всех сервисов
check_service_status() {
    local name=$1
    local port=$2
    local path=${3:-/}
    
    if curl -fsS "http://localhost:${port}${path}" >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
    fi
}

printf "%-20s %-30s %-10s\n" "Сервис" "URL" "Статус"
echo "────────────────────────────────────────────────────────────"
printf "%-20s %-30s %-10s\n" "Frontend" "http://localhost:3000" "$(check_service_status "Frontend" 3000 "/")"
printf "%-20s %-30s %-10s\n" "Auth Service" "http://localhost:3001/healthz" "$(check_service_status "Auth" 3001 "/healthz")"
printf "%-20s %-30s %-10s\n" "Catalog Service" "http://localhost:3002/healthz" "$(check_service_status "Catalog" 3002 "/healthz")"
printf "%-20s %-30s %-10s\n" "Enquiries" "http://localhost:3003/healthz" "$(check_service_status "Enquiries" 3003 "/healthz")"
printf "%-20s %-30s %-10s\n" "Billing" "http://localhost:3004/healthz" "$(check_service_status "Billing" 3004 "/healthz")"
printf "%-20s %-30s %-10s\n" "Vendors" "http://localhost:3005/healthz" "$(check_service_status "Vendors" 3005 "/healthz")"
printf "%-20s %-30s %-10s\n" "Guests" "http://localhost:3006/healthz" "$(check_service_status "Guests" 3006 "/healthz")"
printf "%-20s %-30s %-10s\n" "Payments" "http://localhost:3007/healthz" "$(check_service_status "Payments" 3007 "/healthz")"
echo "────────────────────────────────────────────────────────────"
printf "%-20s %-30s\n" "PostgreSQL" "localhost:5434"
printf "%-20s %-30s\n" "MinIO Console" "http://localhost:9001"

echo ""
echo -e "${GREEN}💡 Полезные команды:${NC}"
echo "   Просмотр логов:      tail -f ${LOG_DIR}/<service>.log"
echo "   Остановка:           ./scripts/stop-dev-full.sh"
echo "   Smoke тесты:         ./scripts/smoke.sh"
echo "   Диагностика:         ./scripts/diagnose-services.sh"
echo ""
echo -e "${BLUE}📁 Логи: ${LOG_DIR}${NC}"
echo -e "${BLUE}📁 PID файлы: ${PID_DIR}${NC}"
echo "=================================================="

# Запуск smoke тестов
if [ ${#FAILED_SERVICES[@]} -eq 0 ] && [ ${#HEALTH_FAILED[@]} -eq 0 ]; then
    echo ""
    echo -e "${YELLOW}🧪 Запуск smoke тестов...${NC}"
    sleep 2
    if ./scripts/smoke.sh; then
        echo -e "${GREEN}✅ Smoke тесты пройдены!${NC}"
        exit 0
    else
        echo -e "${RED}❌ Smoke тесты провалены${NC}"
        echo -e "${YELLOW}   Проверьте логи для деталей${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Пропуск smoke тестов из-за проблем с запуском${NC}"
    exit 1
fi
