#!/bin/bash
# Скрипт остановки всех сервисов

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PID_DIR="/run/wed"

echo -e "${YELLOW}🛑 Остановка всех сервисов WeddingTech...${NC}"

# Остановка Node.js процессов по PID файлам
if [ -d "$PID_DIR" ]; then
    for pid_file in "${PID_DIR}"/*.pid; do
        if [ -f "$pid_file" ]; then
            PID=$(cat "$pid_file")
            SERVICE=$(basename "$pid_file" .pid)
            
            if kill -0 "$PID" 2>/dev/null; then
                echo -e "${YELLOW}Останавливаем ${SERVICE} (PID: ${PID})${NC}"
                kill "$PID" 2>/dev/null || true
                sleep 0.5
                
                # Если процесс всё ещё жив, убиваем принудительно
                if kill -0 "$PID" 2>/dev/null; then
                    echo -e "${YELLOW}Принудительная остановка ${SERVICE}${NC}"
                    kill -9 "$PID" 2>/dev/null || true
                fi
            else
                echo -e "${YELLOW}Процесс ${SERVICE} (PID: ${PID}) уже остановлен${NC}"
            fi
            
            rm -f "$pid_file"
        fi
    done
else
    echo -e "${YELLOW}Директория ${PID_DIR} не найдена${NC}"
fi

# Дополнительная очистка процессов на портах
echo -e "${YELLOW}🔍 Проверка портов на оставшиеся процессы...${NC}"
for port in 3000 3001 3002 3003 3004 3005 3006 3007; do
    pids=$(lsof -ti :${port} 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo -e "${YELLOW}Найдены процессы на порту ${port}: $pids${NC}"
        echo "$pids" | xargs -r kill -9 2>/dev/null || true
    fi
done

# Очистка логов (опционально, можно закомментировать для сохранения истории)
# rm -f /tmp/svc-*.log /tmp/next.log 2>/dev/null || true

# Остановка Docker контейнеров (если доступны)
if command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}🐳 Остановка Docker контейнеров...${NC}"
    docker-compose down 2>/dev/null || true
fi

echo -e "${GREEN}✅ Все сервисы остановлены${NC}"
