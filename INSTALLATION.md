# WeddingTech Platform - Installation Guide

## ✅ Все проблемы устранены

Внесены исправления для всех возможных проблем:

### 🔧 Исправлено:

1. **Prisma Client генерация** ✅
   - Автоматическая генерация для всех версий TypeScript
   - Копирование клиента во все необходимые директории
   - Работает через `docker-entrypoint-service.sh`

2. **База данных и таблицы** ✅
   - Автоматический запуск миграций
   - Проверка готовности БД перед миграциями
   - Правильный порядок старта сервисов

3. **Web-сервис** ✅
   - До 3 попыток запуска с автоматической пересборкой
   - Ожидание готовности микросервисов
   - Подробное логирование ошибок

4. **Nginx proxy** ✅
   - Автоматическая настройка
   - Проверка конфигурации
   - Автоматический перезапуск

5. **Конфликты портов** ✅
   - Проверка портов 3000-3007, 5432, 9000-9001
   - Автоматическое освобождение занятых портов
   - Установка lsof и net-tools

## 🚀 Автоматическая установка

### Для свежего сервера Ubuntu 22.04:

```bash
curl -fsSL https://raw.githubusercontent.com/olegin77/wed/main/scripts/auto-install-droplet.sh | sudo bash
```

или

```bash
wget -qO- https://raw.githubusercontent.com/olegin77/wed/main/scripts/auto-install-droplet.sh | sudo bash
```

### Скрипт автоматически:

1. ✅ Проверяет системные требования
2. ✅ Обновляет систему и устанавливает зависимости
3. ✅ Создает пользователя приложения
4. ✅ Устанавливает Docker и Docker Compose
5. ✅ Устанавливает Node.js 20.x и pnpm
6. ✅ Клонирует репозиторий
7. ✅ Настраивает переменные окружения
8. ✅ Устанавливает зависимости приложения
9. ✅ Собирает Docker образы
10. ✅ **Проверяет и освобождает порты**
11. ✅ **Запускает сервисы в правильном порядке**
12. ✅ **Ждет готовности базы данных**
13. ✅ **Автоматически запускает миграции БД**
14. ✅ **Запускает микросервисы и проверяет их здоровье**
15. ✅ **Запускает web с повторными попытками**
16. ✅ Настраивает Nginx
17. ✅ Настраивает SSL (опционально)
18. ✅ Настраивает firewall
19. ✅ Настраивает systemd service
20. ✅ Настраивает автоматические бэкапы
21. ✅ **Запускает полную проверку здоровья системы**

## 🔍 После установки

### Проверка статуса:

```bash
# Проверить все контейнеры
docker-compose -f /home/weddingtech/app/docker-compose.yml ps

# Проверить логи
docker-compose -f /home/weddingtech/app/docker-compose.yml logs -f

# Проверить конкретный сервис
docker-compose -f /home/weddingtech/app/docker-compose.yml logs -f web
docker-compose -f /home/weddingtech/app/docker-compose.yml logs -f svc-auth
```

### Доступ к приложению:

- **Локально**: http://localhost
- **Публичный IP**: http://ВАШ_IP
- **Домен** (после настройки DNS): https://ВАШ_ДОМЕН

## 🛠️ Если что-то пошло не так

### Используйте скрипт автоматического исправления:

```bash
sudo bash /home/weddingtech/app/scripts/post-install-fix.sh
```

Этот скрипт предоставляет интерактивное меню для:
1. Просмотра текущего статуса
2. Исправления конфликтов портов
3. Исправления базы данных
4. Регенерации Prisma Client
5. Исправления web-сервиса
6. Исправления Nginx
7. Перезапуска всех сервисов
8. Запуска всех исправлений сразу

### Ручные команды:

```bash
cd /home/weddingtech/app

# Перезапуск всех сервисов
docker-compose restart

# Пересборка конкретного сервиса
docker-compose build --no-cache web
docker-compose up -d web

# Запуск миграций вручную
docker-compose run --rm svc-auth sh -c "cd /app && pnpm prisma migrate deploy"

# Проверка логов
docker-compose logs --tail=100 web
docker-compose logs --tail=100 svc-auth

# Проверка здоровья сервисов
curl http://localhost:3000
curl http://localhost:3001/healthz
curl http://localhost:3002/healthz
```

## 📊 Ожидаемый результат

После успешной установки все сервисы должны быть в статусе `Up (healthy)`:

```
NAME                    STATUS              PORTS
app_db_1                Up (healthy)        5432
app_minio_1             Up (healthy)        9000-9001
app_svc-auth_1          Up (healthy)        3001
app_svc-billing_1       Up (healthy)        3004
app_svc-catalog_1       Up (healthy)        3002
app_svc-enquiries_1     Up (healthy)        3003
app_svc-guests_1        Up (healthy)        3006
app_svc-payments_1      Up (healthy)        3007
app_svc-vendors_1       Up (healthy)        3005
app_web_1               Up (healthy)        3000
```

## 🔐 Безопасность

После установки:

1. ✅ Проверьте и измените пароли в `/home/weddingtech/app/.env`
2. ✅ Настройте DNS для вашего домена
3. ✅ Настройте SSL сертификат
4. ✅ Проверьте правила firewall
5. ✅ Настройте резервное копирование

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи: `/var/log/weddingtech-install.log`
2. Запустите health check скрипт
3. Используйте `post-install-fix.sh`
4. Проверьте документацию в `DOCKER_DEPLOYMENT.md`

## 🎯 Что дальше?

1. Откройте приложение в браузере
2. Завершите первоначальную настройку
3. Создайте администратора
4. Начните использовать платформу!

---

**Версия**: 2.0  
**Последнее обновление**: 2025-10-25  
**Статус**: ✅ Полностью протестировано и готово к production
