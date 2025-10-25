# 🚀 Полная Установка WeddingTech на Чистый Сервер

Данное руководство описывает установку платформы WeddingTech с нуля на чистый Ubuntu сервер (DigitalOcean Droplet, AWS EC2, или любой VPS).

## 📋 Требования к Серверу

- **OS**: Ubuntu 22.04 LTS
- **CPU**: минимум 4 ядра
- **RAM**: минимум 8GB
- **Storage**: минимум 50GB SSD
- **Network**: открытые порты 80, 443, 22

## 🔧 Шаг 1: Подготовка Сервера

### 1.1 Подключение к серверу

```bash
ssh root@your_server_ip
```

### 1.2 Обновление системы

```bash
# Обновить список пакетов
apt update && apt upgrade -y

# Установить базовые утилиты
apt install -y curl wget git vim build-essential
```

### 1.3 Создание пользователя для приложения

```bash
# Создать пользователя
useradd -m -s /bin/bash weddingtech

# Добавить в группу sudo (опционально)
usermod -aG sudo weddingtech

# Переключиться на пользователя
su - weddingtech
cd ~
```

## 🐳 Шаг 2: Установка Docker

```bash
# Вернуться к root
exit

# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Добавить пользователя в группу docker
usermod -aG docker weddingtech

# Установить Docker Compose
apt install -y docker-compose

# Проверить установку
docker --version
docker-compose --version

# Запустить Docker
systemctl enable docker
systemctl start docker
```

## 📦 Шаг 3: Установка Node.js и npm

```bash
# Установить Node.js 20.x через NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Проверить версии
node --version  # должно быть v20.x
npm --version   # должно быть v10.x

# Установить pnpm (опционально, если используется)
npm install -g pnpm
```

## 🔐 Шаг 4: Настройка SSH ключей для Git (опционально)

```bash
# Переключиться на пользователя приложения
su - weddingtech

# Сгенерировать SSH ключ
ssh-keygen -t ed25519 -C "deploy@weddingtech"

# Показать публичный ключ (добавить в GitHub/GitLab)
cat ~/.ssh/id_ed25519.pub

# Добавить GitHub в known_hosts
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

## 📥 Шаг 5: Клонирование Проекта

```bash
# Убедитесь что вы под пользователем weddingtech
whoami  # должно показать weddingtech

# Клонировать репозиторий
cd /home/weddingtech
git clone https://github.com/YOUR_USERNAME/weddingtech.git app

# Или если используете SSH ключ:
# git clone git@github.com:YOUR_USERNAME/weddingtech.git app

cd app
```

## ⚙️ Шаг 6: Настройка Окружения

### 6.1 Создать .env файл

```bash
cd /home/weddingtech/app

# Создать .env файл
cat > .env << 'EOF'
# Database
DATABASE_URL=postgresql://pg:SecurePassword123@db:5432/wt

# Application
NODE_ENV=production
PORT=3000

# Auth (ВАЖНО: сгенерируйте свой секретный ключ!)
NEXTAUTH_SECRET=CHANGE_THIS_TO_RANDOM_SECRET_KEY_MIN_32_CHARS
NEXTAUTH_URL=https://yourdomain.com

# MinIO Storage
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=SecureMinioPassword123

# Service URLs (внутренние)
AUTH_SERVICE_URL=http://svc-auth:3001
CATALOG_SERVICE_URL=http://svc-catalog:3002
ENQUIRIES_SERVICE_URL=http://svc-enquiries:3003
BILLING_SERVICE_URL=http://svc-billing:3004
VENDORS_SERVICE_URL=http://svc-vendors:3005
GUESTS_SERVICE_URL=http://svc-guests:3006
PAYMENTS_SERVICE_URL=http://svc-payments:3007
EOF

# ВАЖНО: Отредактируйте .env и замените пароли и секреты!
nano .env
```

### 6.2 Сгенерировать секретный ключ

```bash
# Сгенерировать случайный секрет для NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Скопируйте результат и вставьте в .env как NEXTAUTH_SECRET
```

## 🏗️ Шаг 7: Установка Зависимостей

```bash
cd /home/weddingtech/app

# Установить все зависимости
npm install

# Или если используете pnpm:
# pnpm install

# Сгенерировать Prisma Client
npm run prisma:gen
```

## 🐳 Шаг 8: Запуск Через Docker Compose (Рекомендуется)

### 8.1 Убедиться что пользователь в группе docker

```bash
# Проверить группы
groups

# Если docker нет в списке, выйдите и войдите заново:
exit
su - weddingtech
cd ~/app
```

### 8.2 Запустить все сервисы

```bash
# Собрать образы
docker-compose build

# Запустить все контейнеры в фоне
docker-compose up -d

# Проверить статус
docker-compose ps

# Посмотреть логи
docker-compose logs -f
```

### 8.3 Инициализировать базу данных

```bash
# Дождаться запуска PostgreSQL (30-60 секунд)
sleep 30

# Применить миграции
docker-compose exec web npm run prisma:migrate deploy

# Проверить что таблицы созданы
docker-compose exec db psql -U pg -d wt -c "\dt"
```

## 🌐 Шаг 9: Настройка Nginx (Reverse Proxy)

### 9.1 Установка Nginx

```bash
# Вернуться к root
exit

# Установить Nginx
apt install -y nginx

# Запустить и включить автозапуск
systemctl enable nginx
systemctl start nginx
```

### 9.2 Настроить виртуальный хост

```bash
# Создать конфигурацию
nano /etc/nginx/sites-available/weddingtech
```

Вставьте следующую конфигурацию:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 9.3 Активировать конфигурацию

```bash
# Создать символическую ссылку
ln -s /etc/nginx/sites-available/weddingtech /etc/nginx/sites-enabled/

# Удалить дефолтный сайт
rm /etc/nginx/sites-enabled/default

# Проверить конфигурацию
nginx -t

# Перезапустить Nginx
systemctl reload nginx
```

## 🔒 Шаг 10: Установка SSL сертификата (Let's Encrypt)

```bash
# Установить Certbot
apt install -y certbot python3-certbot-nginx

# Получить SSL сертификат
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot автоматически настроит HTTPS и перенаправление
# Следуйте инструкциям на экране

# Проверить автообновление
certbot renew --dry-run
```

## 🔄 Шаг 11: Настройка Автозапуска (Systemd)

### 11.1 Создать systemd service

```bash
nano /etc/systemd/system/weddingtech.service
```

Вставьте:

```ini
[Unit]
Description=WeddingTech Platform
After=docker.service network-online.target
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/weddingtech/app
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
User=weddingtech
Group=weddingtech
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

### 11.2 Активировать сервис

```bash
# Перезагрузить systemd
systemctl daemon-reload

# Включить автозапуск
systemctl enable weddingtech

# Запустить сервис
systemctl start weddingtech

# Проверить статус
systemctl status weddingtech
```

## 🔥 Шаг 12: Настройка Файрвола (UFW)

```bash
# Включить UFW
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# Активировать файрвол
ufw --force enable

# Проверить статус
ufw status
```

## ✅ Шаг 13: Проверка Работоспособности

### 13.1 Проверить Docker контейнеры

```bash
docker-compose ps

# Все контейнеры должны быть в состоянии "Up"
```

### 13.2 Проверить health endpoints

```bash
# Проверить через curl (локально на сервере)
curl http://localhost:3000/
curl http://localhost:3001/healthz  # Auth service
curl http://localhost:3002/healthz  # Catalog service

# Проверить через браузер (с вашего компьютера)
# https://yourdomain.com
```

### 13.3 Проверить логи

```bash
# Посмотреть логи всех сервисов
docker-compose logs -f

# Или конкретного сервиса
docker-compose logs -f web
docker-compose logs -f db
```

## 🔧 Шаг 14: Настройка Резервного Копирования

### 14.1 Создать скрипт бэкапа базы данных

```bash
mkdir -p /home/weddingtech/backups

nano /home/weddingtech/backup-db.sh
```

Вставьте:

```bash
#!/bin/bash
BACKUP_DIR="/home/weddingtech/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="wt"

cd /home/weddingtech/app
docker-compose exec -T db pg_dump -U pg $DB_NAME | gzip > $BACKUP_DIR/db_${DATE}.sql.gz

# Удалить бэкапы старше 30 дней
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete

echo "Backup created: db_${DATE}.sql.gz"
```

```bash
# Сделать исполняемым
chmod +x /home/weddingtech/backup-db.sh
```

### 14.2 Настроить автоматический бэкап (cron)

```bash
# Открыть crontab для пользователя weddingtech
su - weddingtech
crontab -e

# Добавить строку (бэкап каждый день в 2 AM):
0 2 * * * /home/weddingtech/backup-db.sh >> /home/weddingtech/backups/backup.log 2>&1
```

## 📊 Шаг 15: Мониторинг (Опционально)

### 15.1 Установить инструменты мониторинга

```bash
# Установить htop для мониторинга ресурсов
apt install -y htop

# Установить ctop для мониторинга Docker контейнеров
wget https://github.com/bcicen/ctop/releases/download/v0.7.7/ctop-0.7.7-linux-amd64 -O /usr/local/bin/ctop
chmod +x /usr/local/bin/ctop

# Запустить ctop для просмотра контейнеров
ctop
```

## 🔄 Обновление Приложения

Для обновления приложения после изменений в коде:

```bash
# Переключиться на пользователя приложения
su - weddingtech
cd ~/app

# Получить последние изменения
git pull origin main

# Установить новые зависимости (если есть)
npm install

# Пересобрать образы
docker-compose build

# Перезапустить контейнеры
docker-compose up -d

# Применить новые миграции (если есть)
docker-compose exec web npm run prisma:migrate deploy

# Проверить что все работает
docker-compose ps
docker-compose logs -f
```

## 🚨 Решение Проблем

### Контейнеры не запускаются

```bash
# Проверить логи
docker-compose logs

# Перезапустить все
docker-compose down
docker-compose up -d

# Проверить использование ресурсов
docker stats
```

### База данных не подключается

```bash
# Проверить что PostgreSQL запущен
docker-compose ps db

# Перезапустить базу данных
docker-compose restart db

# Проверить логи базы данных
docker-compose logs db
```

### Порты заняты

```bash
# Найти процесс использующий порт
lsof -i :3000
lsof -i :80

# Убить процесс
kill -9 <PID>
```

### Проблемы с памятью

```bash
# Проверить использование памяти
free -h

# Очистить кэш Docker
docker system prune -a

# Увеличить swap (если нужно)
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## 📚 Дополнительные Команды

### Управление Docker Compose

```bash
# Запустить все сервисы
docker-compose up -d

# Остановить все сервисы
docker-compose down

# Перезапустить конкретный сервис
docker-compose restart web

# Просмотреть логи
docker-compose logs -f [service_name]

# Зайти в контейнер
docker-compose exec web bash
docker-compose exec db psql -U pg -d wt

# Пересобрать образы
docker-compose build --no-cache
```

### Управление Nginx

```bash
# Проверить конфигурацию
nginx -t

# Перезагрузить конфигурацию
systemctl reload nginx

# Перезапустить Nginx
systemctl restart nginx

# Посмотреть логи
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Управление Системными Сервисами

```bash
# Статус сервиса
systemctl status weddingtech

# Перезапуск
systemctl restart weddingtech

# Остановка
systemctl stop weddingtech

# Посмотреть логи
journalctl -u weddingtech -f
```

## 🎯 Чеклист После Установки

- [ ] Все Docker контейнеры запущены и работают
- [ ] База данных инициализирована и миграции применены
- [ ] Nginx настроен и работает
- [ ] SSL сертификат установлен (HTTPS работает)
- [ ] Файрвол настроен (UFW)
- [ ] Systemd сервис включен и работает
- [ ] Резервное копирование настроено
- [ ] Сайт доступен по домену
- [ ] Health endpoints отвечают корректно
- [ ] Логи не содержат критических ошибок
- [ ] Секретные ключи заменены на уникальные
- [ ] .env файл содержит правильные настройки

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи: `docker-compose logs -f`
2. Проверьте статус: `docker-compose ps`
3. Проверьте ресурсы: `docker stats`
4. Проверьте конфигурацию: `nginx -t`

---

**Установка завершена! 🎉**

Ваша платформа WeddingTech теперь работает на: `https://yourdomain.com`

*Последнее обновление: 2025-10-25*
