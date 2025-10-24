#!/bin/bash
# ============================================
# Скрипт инициализации базы данных WeddingTech
# ============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================="
echo "🗄️  ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ WEDDINGTECH"
echo "==================================================${NC}"
echo ""

# Проверка наличия docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose не найден. Установите Docker Compose.${NC}"
    exit 1
fi

# Проверка что контейнер базы данных запущен
if ! docker-compose ps | grep -q "wed-db-1.*Up"; then
    echo -e "${YELLOW}⚠️  Контейнер базы данных не запущен. Запускаем...${NC}"
    docker-compose up -d db
fi

echo -e "${YELLOW}⏳ Ожидание готовности PostgreSQL...${NC}"
# Ждем готовности базы данных (до 60 секунд)
for i in {1..60}; do
    if docker-compose exec -T db pg_isready -U pg > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PostgreSQL готов!${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "${RED}✗ Timeout: PostgreSQL не готов после 60 секунд${NC}"
        echo -e "${YELLOW}Проверьте логи: docker-compose logs db${NC}"
        exit 1
    fi
    echo -n "."
    sleep 1
done

# Проверка существования базы данных 'wt'
echo -e "${YELLOW}📝 Проверка базы данных 'wt'...${NC}"
DB_EXISTS=$(docker-compose exec -T db psql -U pg -tc "SELECT 1 FROM pg_database WHERE datname = 'wt'" | grep -c 1 || echo "0")

if [ "$DB_EXISTS" = "0" ]; then
    echo -e "${YELLOW}📝 Создание базы данных 'wt'...${NC}"
    docker-compose exec -T db psql -U pg -c "CREATE DATABASE wt"
    echo -e "${GREEN}✓ База данных 'wt' создана${NC}"
else
    echo -e "${GREEN}✓ База данных 'wt' уже существует${NC}"
fi

# Генерация Prisma Client
echo -e "${YELLOW}🔧 Генерация Prisma Client...${NC}"
if command -v pnpm &> /dev/null; then
    pnpm prisma generate
elif command -v npm &> /dev/null; then
    npm run prisma:gen
else
    npx prisma generate
fi
echo -e "${GREEN}✓ Prisma Client сгенерирован${NC}"

# Применение миграций
echo -e "${YELLOW}🗄️  Применение миграций базы данных...${NC}"
if ls prisma/migrations/*.sql 2>/dev/null | head -1 | grep -q .; then
    # Если есть миграции, используем migrate deploy
    if command -v pnpm &> /dev/null; then
        pnpm prisma migrate deploy
    elif command -v npm &> /dev/null; then
        npm run prisma:migrate
    else
        npx prisma migrate deploy
    fi
else
    # Если миграций нет, создаем начальную миграцию
    echo -e "${YELLOW}📝 Создание начальной миграции...${NC}"
    if command -v pnpm &> /dev/null; then
        pnpm prisma migrate dev --name init
    else
        npx prisma migrate dev --name init
    fi
fi
echo -e "${GREEN}✓ Миграции применены успешно${NC}"

# Проверка подключения
echo -e "${YELLOW}🔍 Проверка подключения к базе данных...${NC}"
if docker-compose exec -T db psql -U pg -d wt -c "SELECT 'Connection successful' as status" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Подключение к базе данных успешно!${NC}"
else
    echo -e "${RED}✗ Не удалось подключиться к базе данных${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}=================================================="
echo "✅ БАЗА ДАННЫХ УСПЕШНО ИНИЦИАЛИЗИРОВАНА!"
echo "==================================================${NC}"
echo ""
echo -e "${BLUE}📊 Информация о базе данных:${NC}"
echo "   Host:     localhost"
echo "   Port:     5434"
echo "   Database: wt"
echo "   User:     pg"
echo "   Password: pg"
echo ""
echo -e "${BLUE}🔧 Полезные команды:${NC}"
echo "   Prisma Studio:  pnpm prisma:studio"
echo "   Миграции:       pnpm prisma:migrate"
echo "   Логи БД:        docker-compose logs db"
echo "=================================================="
