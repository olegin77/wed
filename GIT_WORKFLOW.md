# 🔀 Git Workflow - Избежание Конфликтов при PR

## ⚙️ Правильная Настройка Git

Выполните эти команды один раз после клонирования репозитория:

```bash
# Настройка стратегии слияния
git config pull.rebase false

# Улучшенный вывод конфликтов (показывает 3 версии)
git config merge.conflictstyle diff3

# Нормализация окончаний строк (важно для кросс-платформенной работы)
git config core.autocrlf input

# Автоматическое разрешение конфликтов в lock-файлах
git config merge.npm-package-lock.driver true
```

## 📋 Рабочий Процесс Без Конфликтов

### 1. Начало Работы над Новой Задачей

```bash
# Убедитесь что находитесь на main ветке
git checkout main

# Получите последние изменения
git pull origin main

# Создайте новую ветку от актуального main
git checkout -b feature/your-feature-name
```

### 2. Во Время Работы

```bash
# Регулярно делайте коммиты
git add .
git commit -m "Описание изменений"

# Синхронизируйтесь с main (минимум раз в день)
git fetch origin main
git rebase origin/main

# Если возникли конфликты при rebase:
# 1. Откройте файлы с конфликтами и разрешите их
# 2. После разрешения:
git add .
git rebase --continue
```

### 3. Перед Созданием PR

```bash
# Обновите свою ветку с последними изменениями main
git fetch origin main
git rebase origin/main

# Убедитесь что все работает
npm install
npm run build
npm test

# Отправьте изменения на GitHub
git push origin feature/your-feature-name
```

### 4. Создание Pull Request

```bash
# Использовать GitHub CLI (рекомендуется)
gh pr create --title "Описание PR" --body "Детальное описание изменений"

# Или через веб-интерфейс GitHub
# https://github.com/your-org/weddingtech/compare
```

### 5. Если PR Устарел (есть новые коммиты в main)

```bash
# Переключитесь на свою ветку
git checkout feature/your-feature-name

# Получите последние изменения
git fetch origin main

# Rebase на актуальный main
git rebase origin/main

# Принудительно обновите PR (force push с защитой)
git push --force-with-lease origin feature/your-feature-name
```

## 🚨 Решение Конфликтов

### Если Возник Конфликт

```bash
# Git покажет файлы с конфликтами
# Откройте каждый файл и найдите секции:

<<<<<<< HEAD
Ваш код
=======
Код из main
>>>>>>> origin/main

# Выберите правильную версию или объедините вручную
# Удалите маркеры конфликта (<<<<, ====, >>>>)
```

### После Разрешения Конфликтов

```bash
# Пометьте конфликты как разрешенные
git add <файлы-с-конфликтами>

# Продолжите rebase
git rebase --continue

# Обновите PR
git push --force-with-lease origin feature/your-feature-name
```

### Отмена Rebase (если что-то пошло не так)

```bash
# Отменить rebase и вернуться к состоянию до него
git rebase --abort
```

## 📦 Специальные Случаи

### Конфликты в package-lock.json или pnpm-lock.yaml

```bash
# Просто регенерируйте файл
rm package-lock.json  # или pnpm-lock.yaml
npm install           # или pnpm install

# Добавьте обновленный файл
git add package-lock.json
git rebase --continue
```

### Конфликты в Миграциях Prisma

```bash
# Если конфликт в миграциях, пересоздайте миграцию
git checkout --theirs prisma/migrations/
npm run prisma:migrate dev --create-only
git add prisma/migrations/
git rebase --continue
```

## ✅ Лучшие Практики

### DO ✅

- ✅ Делайте маленькие, сфокусированные PR
- ✅ Регулярно синхронизируйтесь с main (rebase)
- ✅ Пишите понятные commit messages
- ✅ Тестируйте перед push
- ✅ Используйте `git push --force-with-lease` вместо `--force`
- ✅ Удаляйте ветки после слияния PR

### DON'T ❌

- ❌ Не работайте напрямую в main ветке
- ❌ Не делайте `git push --force` (только `--force-with-lease`)
- ❌ Не игнорируйте конфликты
- ❌ Не создавайте гигантские PR с кучей изменений
- ❌ Не коммитьте node_modules или .env файлы

## 🔧 Полезные Команды

```bash
# Посмотреть статус
git status

# Посмотреть историю
git log --oneline --graph

# Посмотреть изменения
git diff

# Отменить незакоммиченные изменения
git checkout -- <file>

# Отменить последний коммит (но сохранить изменения)
git reset --soft HEAD~1

# Посмотреть удаленные ветки
git branch -r

# Удалить локальную ветку
git branch -d feature/old-feature

# Обновить список удаленных веток
git fetch --prune
```

## 🎯 Типичный Рабочий День

```bash
# Утро - начало работы
git checkout main
git pull origin main
git checkout -b feature/new-task

# В течение дня - работа и коммиты
# ... пишете код ...
git add .
git commit -m "feat: добавил новую функцию"

# ... еще код ...
git add .
git commit -m "fix: исправил баг"

# Обед - синхронизация
git fetch origin main
git rebase origin/main

# Вечер - подготовка PR
git fetch origin main
git rebase origin/main
npm run build
npm test
git push origin feature/new-task
gh pr create --title "Добавлена новая функция" --body "..."
```

## 🆘 Если Всё Сломалось

```bash
# Сохраните текущую работу
git stash

# Вернитесь к чистому main
git checkout main
git reset --hard origin/main

# Создайте новую ветку
git checkout -b feature/new-attempt

# Восстановите свои изменения
git stash pop

# Начните заново
```

## 📞 Помощь

Если возникли проблемы:

1. **Проверьте статус**: `git status`
2. **Посмотрите логи**: `git log --oneline --graph`
3. **Проверьте конфигурацию**: `git config --list`
4. **В крайнем случае**: попросите помощь у команды

---

**Настроено для избежания конфликтов! ✨**

*Последнее обновление: 2025-10-25*
