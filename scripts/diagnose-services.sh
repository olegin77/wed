#!/bin/bash
# ============================================
# Comprehensive Service Diagnostics Script
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "=================================================="
echo "🔍 КОМПЛЕКСНАЯ ДИАГНОСТИКА СЕРВИСОВ"
echo "=================================================="
echo ""

# Test 1: Check if ports are listening
echo -e "${BLUE}[1/7] Проверка открытых портов...${NC}"
for port in 3000 3001 3002 3003 3004 3005 3006 3007 5434 9000; do
    if command -v netstat &> /dev/null; then
        if netstat -tuln | grep -q ":${port} "; then
            echo -e "  ${GREEN}✓${NC} Порт ${port} прослушивается"
        else
            echo -e "  ${RED}✗${NC} Порт ${port} не прослушивается"
        fi
    elif command -v ss &> /dev/null; then
        if ss -tuln | grep -q ":${port} "; then
            echo -e "  ${GREEN}✓${NC} Порт ${port} прослушивается"
        else
            echo -e "  ${RED}✗${NC} Порт ${port} не прослушивается"
        fi
    else
        echo -e "  ${YELLOW}⚠${NC}  netstat/ss недоступны, пропуск проверки портов"
        break
    fi
done
echo ""

# Test 2: Check service connectivity from host
echo -e "${BLUE}[2/7] Тест подключения к сервисам с хоста...${NC}"
services=(
    "Frontend:3000:/api/healthz"
    "Auth:3001:/healthz"
    "Catalog:3002:/healthz"
    "Enquiries:3003:/healthz"
    "Billing:3004:/healthz"
    "Vendors:3005:/healthz"
    "Guests:3006:/healthz"
    "Payments:3007:/healthz"
)

for service_info in "${services[@]}"; do
    IFS=':' read -r name port path <<< "$service_info"
    echo -n "  Тест ${name} (${port}${path})... "
    
    if timeout 5 curl -fsS "http://localhost:${port}${path}" >/dev/null 2>&1; then
        echo -e "${GREEN}✓ OK${NC}"
    else
        echo -e "${RED}✗ FAIL${NC}"
        # Try to get more info
        if timeout 5 curl -v "http://localhost:${port}${path}" 2>&1 | head -20; then
            :
        fi
    fi
done
echo ""

# Test 3: Check database connectivity
echo -e "${BLUE}[3/7] Проверка подключения к базе данных...${NC}"
if command -v psql &> /dev/null; then
    if PGPASSWORD=pg psql -h localhost -p 5434 -U pg -d wt -c "SELECT 1" &>/dev/null; then
        echo -e "  ${GREEN}✓${NC} База данных доступна"
    else
        echo -e "  ${RED}✗${NC} База данных недоступна"
    fi
else
    echo -e "  ${YELLOW}⚠${NC}  psql недоступен, попытка через curl..."
    # If psql not available, we can't test DB directly
fi
echo ""

# Test 4: Check if services can resolve each other
echo -e "${BLUE}[4/7] Проверка DNS разрешения имен сервисов...${NC}"
if command -v docker &> /dev/null; then
    # Test DNS resolution from within a container
    if docker ps --format "{{.Names}}" | grep -q "svc-auth"; then
        echo "  Тест резолвинга из контейнера svc-auth:"
        for svc in db minio svc-catalog svc-enquiries; do
            echo -n "    ${svc}... "
            if docker exec workspace-svc-auth-1 getent hosts ${svc} >/dev/null 2>&1 || \
               docker exec workspace_svc-auth_1 getent hosts ${svc} >/dev/null 2>&1 || \
               docker exec svc-auth getent hosts ${svc} >/dev/null 2>&1; then
                echo -e "${GREEN}✓${NC}"
            else
                echo -e "${RED}✗${NC}"
            fi
        done
    else
        echo -e "  ${YELLOW}⚠${NC}  Контейнеры не запущены"
    fi
else
    echo -e "  ${YELLOW}⚠${NC}  Docker недоступен"
fi
echo ""

# Test 5: Check network connectivity between containers
echo -e "${BLUE}[5/7] Проверка сетевой связности между контейнерами...${NC}"
if command -v docker &> /dev/null && docker ps -q | grep -q .; then
    echo "  Тест связности из svc-auth к другим сервисам:"
    for target in svc-catalog:3002 svc-enquiries:3003 db:5432; do
        IFS=':' read -r host port <<< "$target"
        echo -n "    ${host}:${port}... "
        if docker exec workspace-svc-auth-1 timeout 2 sh -c "echo > /dev/tcp/${host}/${port}" 2>/dev/null || \
           docker exec workspace_svc-auth_1 timeout 2 sh -c "echo > /dev/tcp/${host}/${port}" 2>/dev/null || \
           docker exec svc-auth timeout 2 sh -c "echo > /dev/tcp/${host}/${port}" 2>/dev/null; then
            echo -e "${GREEN}✓${NC}"
        else
            echo -e "${RED}✗${NC}"
        fi
    done
else
    echo -e "  ${YELLOW}⚠${NC}  Docker недоступен или контейнеры не запущены"
fi
echo ""

# Test 6: Check Docker network configuration
echo -e "${BLUE}[6/7] Проверка конфигурации Docker сети...${NC}"
if command -v docker &> /dev/null; then
    echo "  Docker Networks:"
    docker network ls | grep -E "workspace|bridge" || echo "    Нет сетей workspace"
    
    echo ""
    echo "  Контейнеры и их сети:"
    docker ps --format "table {{.Names}}\t{{.Networks}}" | head -15 || true
else
    echo -e "  ${YELLOW}⚠${NC}  Docker недоступен"
fi
echo ""

# Test 7: Test actual HTTP endpoints with response validation
echo -e "${BLUE}[7/7] Проверка HTTP ответов с валидацией...${NC}"
for service_info in "${services[@]}"; do
    IFS=':' read -r name port path <<< "$service_info"
    echo -n "  ${name}... "
    
    response=$(timeout 5 curl -fsS "http://localhost:${port}${path}" 2>&1 || echo "error")
    
    if echo "$response" | grep -q '"status":"ok"' || echo "$response" | grep -q '"status": "ok"'; then
        echo -e "${GREEN}✓ OK - Валидный ответ${NC}"
    elif [ "$response" = "error" ]; then
        echo -e "${RED}✗ FAIL - Нет подключения${NC}"
    else
        echo -e "${YELLOW}⚠ WARNING - Неожиданный ответ:${NC} ${response:0:50}"
    fi
done
echo ""

echo "=================================================="
echo -e "${BLUE}Диагностика завершена${NC}"
echo "=================================================="
