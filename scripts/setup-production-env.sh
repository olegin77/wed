#!/bin/bash

# Скрипт для настройки переменных окружения для продакшена
# Автор: AI Assistant

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Создание .env файла для продакшена
create_prod_env() {
    log "Создаем .env файл для продакшена..."
    
    cat > .env << 'EOF'
# Production Environment Variables
NODE_ENV=production
NODE_VERSION=20
PORT=3000

# Application URLs
NEXT_PUBLIC_APP_URL=https://weddingtech.uz
NEXT_PUBLIC_API_URL=https://api.weddingtech.uz

# Database (если используется)
DATABASE_URL=postgresql://username:password@localhost:5432/weddingtech

# Security
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://weddingtech.uz

# External Services
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Email Service (если используется)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Storage (если используется)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=weddingtech-uploads

# Redis (если используется)
REDIS_URL=redis://localhost:6379

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
EOF
    
    success ".env файл создан"
}

# Создание .env.example файла
create_env_example() {
    log "Создаем .env.example файл..."
    
    cat > .env.example << 'EOF'
# Production Environment Variables
NODE_ENV=production
NODE_VERSION=20
PORT=3000

# Application URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/weddingtech

# Security
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-domain.com

# External Services
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name

# Redis
REDIS_URL=redis://localhost:6379

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
EOF
    
    success ".env.example файл создан"
}

# Обновление .gitignore
update_gitignore() {
    log "Обновляем .gitignore..."
    
    if ! grep -q "\.env$" .gitignore; then
        echo "" >> .gitignore
        echo "# Environment files" >> .gitignore
        echo ".env" >> .gitignore
        echo ".env.local" >> .gitignore
        echo ".env.production" >> .gitignore
        success ".gitignore обновлен"
    else
        warning ".env уже добавлен в .gitignore"
    fi
}

# Создание README для деплоя
create_deploy_readme() {
    log "Создаем README для деплоя..."
    
    cat > DEPLOY_README.md << 'EOF'
# 🚀 Деплой WeddingTech на DigitalOcean

## Быстрый старт

1. **Подготовка проекта:**
   ```bash
   ./scripts/setup-production-env.sh
   ./scripts/deploy-to-do.sh
   ```

2. **Настройка в DigitalOcean:**
   - Зайдите в [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Создайте новое приложение
   - Подключите GitHub репозиторий
   - Выберите ветку `main`
   - DigitalOcean автоматически обнаружит `.do/app.yaml`

3. **Настройка переменных окружения:**
   - В панели DigitalOcean перейдите в Settings → App-Level Environment Variables
   - Добавьте необходимые переменные из `.env.example`

## Структура проекта

```
├── .do/
│   └── app.yaml              # Конфигурация DigitalOcean App Platform
├── .codex/
│   └── project.yml           # Конфигурация Codex (перенесена из корня)
├── apps/
│   └── svc-website/          # Основное веб-приложение (Next.js)
├── packages/                  # Общие пакеты
├── scripts/
│   ├── deploy-to-do.sh       # Скрипт деплоя
│   └── setup-production-env.sh # Настройка окружения
└── .env.example              # Пример переменных окружения
```

## Переменные окружения

### Обязательные
- `NODE_ENV=production`
- `NODE_VERSION=20`
- `PORT=3000`

### Рекомендуемые
- `NEXT_PUBLIC_APP_URL` - URL вашего приложения
- `NEXT_PUBLIC_API_URL` - URL API
- `DATABASE_URL` - URL базы данных
- `NEXTAUTH_SECRET` - Секретный ключ для аутентификации

## Мониторинг

После деплоя рекомендуется настроить:
- Логирование (Sentry, LogRocket)
- Мониторинг производительности
- Алерты для критических ошибок

## Поддержка

При возникновении проблем:
1. Проверьте логи в DigitalOcean
2. Убедитесь, что все переменные окружения настроены
3. Проверьте статус базы данных и внешних сервисов
EOF
    
    success "DEPLOY_README.md создан"
}

# Основная функция
main() {
    log "Настраиваем окружение для продакшена..."
    
    create_prod_env
    create_env_example
    update_gitignore
    create_deploy_readme
    
    success "🎉 Окружение настроено!"
    
    echo ""
    echo "📋 Следующие шаги:"
    echo "1. Отредактируйте .env файл с вашими настройками"
    echo "2. Запустите: ./scripts/deploy-to-do.sh"
    echo "3. Следуйте инструкциям в DEPLOY_README.md"
    echo ""
    echo "⚠️  Не забудьте:"
    echo "- Добавить .env в .gitignore (уже сделано)"
    echo "- Настроить переменные окружения в DigitalOcean"
    echo "- Проверить все URL и ключи API"
}

# Запуск
main "$@"