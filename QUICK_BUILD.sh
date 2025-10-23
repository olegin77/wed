#!/bin/bash
# ============================================
# Скрипт быстрой сборки проекта WeddingTech
# ============================================
# Версия: 1.0
# Дата: 2025-10-23
# ============================================

set -e  # Остановка при ошибке

echo "=================================================="
echo "🚀 БЫСТРАЯ СБОРКА ПРОЕКТА WEDDINGTECH"
echo "=================================================="
echo ""

# Цветовые коды для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверка версии Node.js
echo -e "${YELLOW}📋 Проверка окружения...${NC}"
NODE_VERSION=$(node -v)
echo "   ✓ Node.js: $NODE_VERSION"

# Предупреждение если версия не 20.x
if [[ ! $NODE_VERSION =~ ^v20\. ]]; then
    echo -e "${YELLOW}   ⚠️  Рекомендуется Node.js v20.x (текущая: $NODE_VERSION)${NC}"
fi

NPM_VERSION=$(npm -v)
echo "   ✓ npm: $NPM_VERSION"
echo ""

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Файл .env не найден. Создание из примера...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}   ✓ Файл .env создан из .env.example${NC}"
    else
        echo -e "${RED}   ✗ Файл .env.example не найден. Создание базового .env...${NC}"
        cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql://pg:pg@localhost:5434/wt

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000

# Application
NODE_ENV=development
EOF
        echo -e "${GREEN}   ✓ Создан базовый файл .env${NC}"
    fi
    echo ""
fi

# Шаг 1: Установка зависимостей
echo -e "${GREEN}📦 Шаг 1/5: Установка зависимостей...${NC}"
if [ ! -d "node_modules" ]; then
    echo "   Устанавливаем npm пакеты..."
    npm install
else
    echo "   node_modules существует, обновляем зависимости..."
    npm update
fi
echo -e "${GREEN}   ✓ Зависимости установлены${NC}"
echo ""

# Шаг 2: Запуск Docker-сервисов
echo -e "${GREEN}🐳 Шаг 2/5: Проверка Docker-сервисов...${NC}"
if command -v docker-compose &> /dev/null; then
    # Проверяем, запущена ли БД
    if ! docker-compose ps | grep -q "db.*Up"; then
        echo "   Запускаем PostgreSQL..."
        docker-compose up -d db
        echo "   Ожидание готовности БД (5 сек)..."
        sleep 5
    else
        echo "   ✓ PostgreSQL уже запущен"
    fi
    
    # Опционально запускаем MinIO
    if ! docker-compose ps | grep -q "minio.*Up"; then
        echo "   Запускаем MinIO..."
        docker-compose up -d minio
    else
        echo "   ✓ MinIO уже запущен"
    fi
else
    echo -e "${YELLOW}   ⚠️  docker-compose не найден. Пропускаем этот шаг.${NC}"
    echo -e "${YELLOW}   Убедитесь, что PostgreSQL доступен на localhost:5434${NC}"
fi
echo ""

# Шаг 3: Генерация Prisma Client
echo -e "${GREEN}🗄️  Шаг 3/5: Генерация Prisma Client...${NC}"
if [ -f "schema.prisma" ]; then
    npx prisma generate
    echo -e "${GREEN}   ✓ Prisma Client сгенерирован${NC}"
else
    echo -e "${YELLOW}   ⚠️  schema.prisma не найден, пропускаем${NC}"
fi
echo ""

# Шаг 4: Миграции базы данных
echo -e "${GREEN}🔄 Шаг 4/5: Применение миграций БД...${NC}"
if [ -f "schema.prisma" ]; then
    echo "   Применяем миграции..."
    npx prisma migrate deploy 2>/dev/null || {
        echo -e "${YELLOW}   ⚠️  Миграции не применены (возможно, БД недоступна)${NC}"
        echo -e "${YELLOW}   Попробуйте выполнить вручную: npx prisma migrate dev${NC}"
    }
else
    echo -e "${YELLOW}   ⚠️  schema.prisma не найден, пропускаем${NC}"
fi
echo ""

# Шаг 5: Сборка проекта
echo -e "${GREEN}🏗️  Шаг 5/5: Сборка Next.js проекта...${NC}"
npm run build

echo ""
echo "=================================================="
echo -e "${GREEN}✅ СБОРКА ЗАВЕРШЕНА УСПЕШНО!${NC}"
echo "=================================================="
echo ""
echo "Доступные команды:"
echo "  npm run dev    - Запуск в режиме разработки (http://localhost:3000)"
echo "  npm run build  - Повторная сборка проекта"
echo "  npm run start  - Запуск production сервера"
echo ""
echo "Дополнительно:"
echo "  docker-compose up -d      - Запуск всех Docker-сервисов"
echo "  docker-compose down       - Остановка всех Docker-сервисов"
echo "  npx prisma studio         - Открыть Prisma Studio (UI для БД)"
echo "  npx prisma migrate dev    - Применить миграции в dev режиме"
echo ""
echo "=================================================="
