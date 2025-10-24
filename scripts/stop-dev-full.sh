#!/bin/bash
# Скрипт остановки всех сервисов

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🛑 Остановка всех сервисов WeddingTech...${NC}"

# Остановка Node.js процессов
for pid_file in /tmp/svc-*.pid /tmp/next.pid; do
    if [ -f "$pid_file" ]; then
        PID=$(cat "$pid_file")
        echo "Остановка процесса $PID"
        kill $PID 2>/dev/null || true
        rm "$pid_file"
    fi
done

# Остановка Docker контейнеров
echo -e "${YELLOW}🐳 Остановка Docker контейнеров...${NC}"
docker-compose down

echo -e "${GREEN}✅ Все сервисы остановлены${NC}"
