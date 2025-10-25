#!/bin/bash
# ============================================
# Надежный скрипт остановки всех сервисов
# ============================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PID_DIR="/tmp/weddingtech-pids"
LOG_DIR="/tmp/weddingtech-logs"

echo -e "${YELLOW}🛑 Остановка всех сервисов WeddingTech...${NC}"
echo ""

# Функция для остановки процесса
stop_service() {
    local service=$1
    local pid_file="${PID_DIR}/${service}.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        echo -n "  Остановка ${service} (PID: ${pid})... "
        
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
            
            # Ждем до 5 секунд
            for i in {1..10}; do
                if ! kill -0 "$pid" 2>/dev/null; then
                    echo -e "${GREEN}✓${NC}"
                    rm -f "$pid_file"
                    return 0
                fi
                sleep 0.5
            done
            
            # Принудительная остановка
            echo -n "(принудительно)... "
            kill -9 "$pid" 2>/dev/null || true
            echo -e "${GREEN}✓${NC}"
        else
            echo -e "${YELLOW}уже остановлен${NC}"
        fi
        
        rm -f "$pid_file"
    else
        echo -e "  ${service}: ${YELLOW}не запущен${NC}"
    fi
}

# Остановка Node.js сервисов
echo "🔧 Остановка микросервисов:"
if [ -d "$PID_DIR" ]; then
    for pid_file in "${PID_DIR}"/*.pid; do
        if [ -f "$pid_file" ]; then
            service=$(basename "$pid_file" .pid)
            stop_service "$service"
        fi
    done
else
    echo "  ${YELLOW}PID директория не найдена${NC}"
fi

echo ""

# Остановка процессов на портах (на случай если PID файлы потеряны)
echo "🔌 Освобождение портов:"

ports=(3000 3001 3002 3003 3004 3005 3006 3007)

for port in "${ports[@]}"; do
    echo -n "  Порт ${port}... "
    
    pids=$(lsof -ti :${port} 2>/dev/null || true)
    
    if [ -n "$pids" ]; then
        echo "$pids" | xargs -r kill -9 2>/dev/null || true
        echo -e "${GREEN}✓ освобожден${NC}"
    else
        echo -e "${YELLOW}свободен${NC}"
    fi
done

echo ""

# Остановка Docker контейнеров
echo "🐳 Остановка Docker контейнеров:"

if command -v docker-compose &> /dev/null; then
    docker-compose down 2>/dev/null && echo -e "  ${GREEN}✓ Контейнеры остановлены${NC}" || echo -e "  ${YELLOW}⚠ Ошибка остановки контейнеров${NC}"
elif command -v docker &> /dev/null; then
    echo "  Останавливаем контейнеры вручную..."
    for container in workspace-db-1 workspace-minio-1; do
        if docker ps -q --filter "name=${container}" | grep -q .; then
            docker stop "${container}" 2>/dev/null && echo -e "  ${GREEN}✓ ${container} остановлен${NC}"
        fi
    done
else
    echo -e "  ${YELLOW}Docker не доступен${NC}"
fi

echo ""

# Очистка временных файлов (опционально)
read -p "Удалить лог-файлы? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -d "$LOG_DIR" ]; then
        rm -rf "$LOG_DIR"
        echo -e "${GREEN}✓ Логи удалены${NC}"
    fi
fi

echo ""
echo -e "${GREEN}✅ Все сервисы остановлены!${NC}"
