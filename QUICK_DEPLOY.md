# 🚀 Быстрый деплой WeddingTech на DigitalOcean

## ⚡ За 5 минут онлайн!

### 1. Подготовка (1 минута)
```bash
# В корневой директории проекта
./scripts/setup-production-env.sh
```

### 2. Проверка готовности (1 минута)
```bash
./scripts/deploy-to-do.sh build-only
```

### 3. Деплой на DigitalOcean (3 минуты)

1. **Откройте [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)**
2. **Нажмите "Create App"**
3. **Выберите "GitHub" и подключите репозиторий `olegin77/wed`**
4. **Выберите ветку `main`**
5. **DigitalOcean автоматически обнаружит `.do/app.yaml`**
6. **Нажмите "Create Resources"**

### 4. Настройка переменных окружения

В панели DigitalOcean:
1. Перейдите в **Settings → App-Level Environment Variables**
2. Добавьте переменные из `.env.example`:
   ```
   NODE_ENV=production
   NODE_VERSION=20
   PORT=3000
   NEXT_PUBLIC_APP_URL=https://your-app-name.ondigitalocean.app
   ```

### 5. Готово! 🎉

Ваше приложение будет доступно по адресу:
`https://your-app-name.ondigitalocean.app`

## 📋 Что уже настроено

- ✅ **Next.js приложение** готово к продакшену
- ✅ **Конфигурация DigitalOcean** в `.do/app.yaml`
- ✅ **Переменные окружения** в `.env.example`
- ✅ **Автоматические скрипты** для деплоя
- ✅ **Документация** в `DEPLOY_README.md`

## 🔧 Дополнительные настройки

### Домен
1. В DigitalOcean добавьте ваш домен
2. Настройте DNS записи
3. SSL сертификат настроится автоматически

### База данных
1. Создайте PostgreSQL кластер в DigitalOcean
2. Добавьте `DATABASE_URL` в переменные окружения
3. Запустите миграции Prisma

### Мониторинг
1. Подключите Sentry для отслеживания ошибок
2. Настройте Google Analytics
3. Добавьте Uptime мониторинг

## 🆘 Если что-то пошло не так

1. **Проверьте логи** в DigitalOcean App Platform
2. **Убедитесь**, что все переменные окружения настроены
3. **Проверьте**, что репозиторий подключен правильно
4. **Обратитесь** к `DEPLOY_README.md` для подробной документации

---

**Время деплоя:** ~5 минут  
**Сложность:** Легко  
**Результат:** Рабочее приложение онлайн! 🚀