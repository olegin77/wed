#!/bin/bash
# ============================================
# Continuous monitoring script for services
# ============================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

REFRESH_INTERVAL=${1:-5}

check_service() {
    local name=$1
    local port=$2
    local path=${3:-/healthz}
    
    if timeout 2 curl -fsS "http://localhost:${port}${path}" >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        return 1
    fi
}

check_process() {
    local pid_file=$1
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file" 2>/dev/null)
        if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} (PID: $pid)"
            return 0
        else
            echo -e "${RED}✗${NC} (dead)"
            return 1
        fi
    else
        echo -e "${YELLOW}?${NC} (no pidfile)"
        return 2
    fi
}

while true; do
    clear
    echo -e "${BLUE}=================================================="
    echo "📊 МОНИТОРИНГ СЕРВИСОВ WEDDINGTECH"
    echo "=================================================="
    echo "Обновление: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "==================================================${NC}"
    echo ""
    
    echo -e "${BLUE}🔧 Микросервисы:${NC}"
    printf "%-20s %-10s %-15s %-15s\n" "Сервис" "Порт" "HTTP" "Процесс"
    echo "────────────────────────────────────────────────────────────"
    
    services=(
        "svc-auth:3001"
        "svc-catalog:3002"
        "svc-enquiries:3003"
        "svc-billing:3004"
        "svc-vendors:3005"
        "svc-guests:3006"
        "svc-payments:3007"
    )
    
    PID_DIR="/tmp/weddingtech-pids"
    
    for svc_info in "${services[@]}"; do
        IFS=':' read -r name port <<< "$svc_info"
        printf "%-20s %-10s %-15s " "$name" "$port" "$(check_service "$name" "$port" "/healthz" 2>/dev/null && echo -e "${GREEN}✓ OK${NC}" || echo -e "${RED}✗ FAIL${NC}")"
        check_process "${PID_DIR}/${name}.pid"
    done
    
    echo ""
    echo -e "${BLUE}🌐 Frontend:${NC}"
    printf "%-20s %-10s %-15s %-15s\n" "Сервис" "Порт" "HTTP" "Процесс"
    echo "────────────────────────────────────────────────────────────"
    printf "%-20s %-10s %-15s " "Next.js" "3000" "$(check_service "next" "3000" "/" 2>/dev/null && echo -e "${GREEN}✓ OK${NC}" || echo -e "${RED}✗ FAIL${NC}")"
    check_process "${PID_DIR}/next.pid"
    
    echo ""
    echo -e "${BLUE}🐳 Docker сервисы:${NC}"
    
    if command -v docker &> /dev/null; then
        printf "%-20s %-15s\n" "Контейнер" "Статус"
        echo "────────────────────────────────────────────────────────────"
        
        for container in db minio; do
            if docker ps --filter "name=${container}" --format "{{.Names}}" | grep -q "${container}"; then
                health=$(docker inspect --format='{{.State.Health.Status}}' $(docker ps -q --filter "name=${container}") 2>/dev/null || echo "unknown")
                if [ "$health" = "healthy" ]; then
                    printf "%-20s %s\n" "$container" "${GREEN}✓ healthy${NC}"
                elif [ "$health" = "unknown" ]; then
                    printf "%-20s %s\n" "$container" "${GREEN}✓ running${NC}"
                else
                    printf "%-20s %s\n" "$container" "${YELLOW}⚠ $health${NC}"
                fi
            else
                printf "%-20s %s\n" "$container" "${RED}✗ not running${NC}"
            fi
        done
    else
        echo "  Docker не доступен"
    fi
    
    echo ""
    echo -e "${BLUE}📊 Порты:${NC}"
    if command -v ss &> /dev/null; then
        listening_ports=$(ss -tlnp 2>/dev/null | grep -E ':(3000|3001|3002|3003|3004|3005|3006|3007|5434|9000|9001) ' | wc -l)
        echo "  Прослушивается портов: $listening_ports / 11"
    elif command -v netstat &> /dev/null; then
        listening_ports=$(netstat -tlnp 2>/dev/null | grep -E ':(3000|3001|3002|3003|3004|3005|3006|3007|5434|9000|9001) ' | wc -l)
        echo "  Прослушивается портов: $listening_ports / 11"
    else
        echo "  Информация о портах недоступна (netstat/ss не найдены)"
    fi
    
    echo ""
    echo -e "${YELLOW}Нажмите Ctrl+C для выхода | Обновление каждые ${REFRESH_INTERVAL} сек${NC}"
    
    sleep $REFRESH_INTERVAL
done
