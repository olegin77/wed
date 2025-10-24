#!/bin/bash
# ============================================
# Smoke tests для проверки работы всех сервисов
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

FAILED=0
PASSED=0

echo "=================================================="
echo "🧪 ЗАПУСК SMOKE ТЕСТОВ"
echo "=================================================="
echo ""

# Функция для проверки HTTP эндпоинта
check_endpoint() {
    local name=$1
    local url=$2
    local expected_pattern=$3
    
    echo -n "Проверка ${name}... "
    
    if response=$(curl -fsS "$url" 2>&1); then
        if [ -n "$expected_pattern" ]; then
            if echo "$response" | grep -q "$expected_pattern"; then
                echo -e "${GREEN}✓ OK${NC}"
                ((PASSED++))
                return 0
            else
                echo -e "${RED}✗ FAIL (неверный ответ)${NC}"
                echo "  Ожидалось: $expected_pattern"
                echo "  Получено: $response"
                ((FAILED++))
                return 1
            fi
        else
            echo -e "${GREEN}✓ OK${NC}"
            ((PASSED++))
            return 0
        fi
    else
        echo -e "${RED}✗ FAIL${NC}"
        echo "  Ошибка: $response"
        ((FAILED++))
        return 1
    fi
}

# Функция для проверки health-check эндпоинта
check_healthz() {
    local name=$1
    local port=$2
    
    check_endpoint "$name" "http://localhost:${port}/healthz" '"status":"ok"'
}

echo "📍 Проверка фронтенда:"
check_endpoint "Главная страница" "http://localhost:3000/" "WeddingTech"
check_endpoint "Frontend health" "http://localhost:3000/api/healthz" '"status":"ok"'
echo ""

echo "🔧 Проверка микросервисов:"
check_healthz "Auth Service" 3001
check_healthz "Catalog Service" 3002
check_healthz "Enquiries Service" 3003
check_healthz "Billing Service" 3004
check_healthz "Vendors Service" 3005
check_healthz "Guests Service" 3006
check_healthz "Payments Service" 3007
echo ""

echo "=================================================="
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ (${PASSED}/${PASSED})${NC}"
    echo "=================================================="
    exit 0
else
    echo -e "${RED}❌ ТЕСТЫ ПРОВАЛЕНЫ: ${FAILED} из $((PASSED + FAILED))${NC}"
    echo -e "${GREEN}✓ Успешно: ${PASSED}${NC}"
    echo -e "${RED}✗ Провалено: ${FAILED}${NC}"
    echo "=================================================="
    exit 1
fi
