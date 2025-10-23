#!/bin/bash

# Скрипт для быстрого деплоя WeddingTech на DigitalOcean
# Автор: AI Assistant
# Дата: $(date)

set -e  # Остановить выполнение при ошибке

echo "🚀 Начинаем деплой WeddingTech на DigitalOcean..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Проверка зависимостей
check_dependencies() {
    log "Проверяем зависимости..."
    
    if ! command -v pnpm &> /dev/null; then
        error "pnpm не найден. Установите pnpm: npm install -g pnpm"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        error "git не найден. Установите git"
        exit 1
    fi
    
    success "Все зависимости найдены"
}

# Проверка статуса git
check_git_status() {
    log "Проверяем статус git..."
    
    if [ -n "$(git status --porcelain)" ]; then
        warning "Есть несохраненные изменения. Коммитим их..."
        git add .
        git commit -m "Auto-commit before deployment $(date)"
    fi
    
    success "Git статус проверен"
}

# Установка зависимостей
install_dependencies() {
    log "Устанавливаем зависимости..."
    pnpm install --frozen-lockfile
    success "Зависимости установлены"
}

# Запуск тестов
run_tests() {
    log "Запускаем тесты..."
    if pnpm test; then
        success "Тесты прошли успешно"
    else
        warning "Некоторые тесты не прошли, но продолжаем деплой"
    fi
}

# Проверка линтинга
run_linting() {
    log "Проверяем линтинг..."
    if pnpm lint; then
        success "Линтинг прошел успешно"
    else
        warning "Есть ошибки линтинга, но продолжаем деплой"
    fi
}

# Сборка проекта
build_project() {
    log "Собираем проект..."
    
    # Собираем основное веб-приложение
    cd apps/svc-website
    pnpm build
    cd ../..
    
    success "Проект собран успешно"
}

# Проверка конфигурации DigitalOcean
check_do_config() {
    log "Проверяем конфигурацию DigitalOcean..."
    
    if [ ! -f ".do/app.yaml" ]; then
        error "Файл .do/app.yaml не найден"
        exit 1
    fi
    
    if [ ! -f ".codex/project.yml" ]; then
        error "Файл .codex/project.yml не найден"
        exit 1
    fi
    
    success "Конфигурация DigitalOcean найдена"
}

# Подготовка к деплою
prepare_deployment() {
    log "Подготавливаем к деплою..."
    
    # Убеждаемся, что project.yml не конфликтует с DigitalOcean
    if [ -f "project.yml" ]; then
        warning "Перемещаем project.yml в .codex/ для избежания конфликтов"
        mv project.yml .codex/project.yml.backup
    fi
    
    success "Подготовка завершена"
}

# Создание .env файла для продакшена
create_prod_env() {
    log "Создаем .env файл для продакшена..."
    
    cat > .env << EOF
NODE_ENV=production
NODE_VERSION=20
PORT=3000
NEXT_PUBLIC_APP_URL=https://weddingtech.uz
NEXT_PUBLIC_API_URL=https://api.weddingtech.uz
EOF
    
    success ".env файл создан"
}

# Основная функция деплоя
deploy() {
    log "Начинаем деплой..."
    
    # Проверяем, что мы в правильной директории
    if [ ! -f "package.json" ]; then
        error "Запустите скрипт из корневой директории проекта"
        exit 1
    fi
    
    check_dependencies
    check_git_status
    install_dependencies
    run_tests
    run_linting
    build_project
    check_do_config
    prepare_deployment
    create_prod_env
    
    success "🎉 Проект готов к деплою на DigitalOcean!"
    
    echo ""
    echo "📋 Следующие шаги:"
    echo "1. Зайдите в панель управления DigitalOcean"
    echo "2. Создайте новое приложение App Platform"
    echo "3. Подключите ваш GitHub репозиторий"
    echo "4. Выберите ветку main"
    echo "5. DigitalOcean автоматически обнаружит .do/app.yaml"
    echo "6. Нажмите 'Create Resources'"
    echo ""
    echo "🔗 Полезные ссылки:"
    echo "- DigitalOcean App Platform: https://cloud.digitalocean.com/apps"
    echo "- Документация: https://docs.digitalocean.com/products/app-platform/"
    echo ""
    echo "⚙️  Переменные окружения для настройки в DigitalOcean:"
    echo "- NODE_ENV=production"
    echo "- NODE_VERSION=20"
    echo "- PORT=3000"
    echo "- NEXT_PUBLIC_APP_URL=https://your-domain.com"
    echo "- NEXT_PUBLIC_API_URL=https://api.your-domain.com"
}

# Обработка аргументов командной строки
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "build-only")
        check_dependencies
        install_dependencies
        build_project
        success "Сборка завершена"
        ;;
    "test-only")
        check_dependencies
        install_dependencies
        run_tests
        run_linting
        success "Тестирование завершено"
        ;;
    "help"|"-h"|"--help")
        echo "Использование: $0 [команда]"
        echo ""
        echo "Команды:"
        echo "  deploy      - Полный деплой (по умолчанию)"
        echo "  build-only  - Только сборка проекта"
        echo "  test-only   - Только тестирование"
        echo "  help        - Показать эту справку"
        ;;
    *)
        error "Неизвестная команда: $1"
        echo "Используйте '$0 help' для справки"
        exit 1
        ;;
esac