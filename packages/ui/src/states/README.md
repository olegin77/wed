# Состояния компонентов

Документация по состояниям компонентов в дизайн-системе WeddingTech.

## Поддерживаемые состояния

### 1. Hover (Наведение)
Состояние при наведении курсора мыши на элемент.

**Визуальные изменения:**
- Изменение цвета фона
- Увеличение тени
- Легкое перемещение вверх (для кнопок)
- Изменение цвета границы (для инпутов)

### 2. Focus (Фокус)
Состояние при получении фокуса клавиатурой или мышью.

**Визуальные изменения:**
- Кольцо фокуса вокруг элемента
- Увеличение тени
- Выделение границы

### 3. Active (Активное)
Состояние при нажатии на элемент.

**Визуальные изменения:**
- Уменьшение тени
- Возврат в исходное положение
- Изменение цвета фона

### 4. Disabled (Отключен)
Состояние отключенного элемента.

**Визуальные изменения:**
- Снижение непрозрачности
- Изменение курсора на `not-allowed`
- Приглушение цветов

### 5. Error (Ошибка)
Состояние ошибки для элементов ввода.

**Визуальные изменения:**
- Красная граница
- Красное кольцо фокуса
- Красный цвет текста

### 6. Success (Успех)
Состояние успешного заполнения.

**Визуальные изменения:**
- Зеленая граница
- Зеленое кольцо фокуса
- Зеленая галочка

## Использование

### Button
```tsx
import { Button } from '@wt/ui';

// Обычная кнопка
<Button variant="primary">Нажми меня</Button>

// Кнопка с состоянием ошибки
<Button variant="danger" state="error">Удалить</Button>

// Отключенная кнопка
<Button disabled>Недоступно</Button>

// Кнопка с загрузкой
<Button loading>Загрузка...</Button>
```

### Input
```tsx
import { Input } from '@wt/ui';

// Обычный инпут
<Input label="Имя" placeholder="Введите имя" />

// Инпут с ошибкой
<Input 
  label="Email" 
  error="Неверный формат email" 
  state="error" 
/>

// Инпут с успехом
<Input 
  label="Пароль" 
  success 
  state="success" 
/>

// Отключенный инпут
<Input disabled label="Только для чтения" />
```

### Card
```tsx
import { Card } from '@wt/ui';

// Обычная карточка
<Card>Содержимое карточки</Card>

// Интерактивная карточка
<Card interactive onClick={handleClick}>
  Нажми меня
</Card>

// Карточка с состоянием
<Card state="hover" variant="elevated">
  Карточка с тенью
</Card>
```

## CSS-переменные

Все состояния настраиваются через CSS-переменные:

```css
/* Button states */
--wt-button-bg: var(--wt-accent);
--wt-button-hover-bg: #6d28d9;
--wt-button-active-bg: #5b21b6;
--wt-button-focus-ring: 0 0 0 3px rgba(124, 58, 237, 0.3);
--wt-button-disabled-opacity: 0.5;

/* Input states */
--wt-input-border: 1px solid #e5e7eb;
--wt-input-hover-border: 1px solid var(--wt-accent);
--wt-input-focus-ring: 0 0 0 3px rgba(124, 58, 237, 0.1);
--wt-input-error-border: 1px solid var(--wt-error);
--wt-input-success-border: 1px solid var(--wt-success);

/* Card states */
--wt-card-shadow: var(--wt-shadow);
--wt-card-hover-shadow: var(--wt-shadow-lg);
--wt-card-focus-ring: 0 0 0 3px rgba(124, 58, 237, 0.1);
```

## Доступность

Все состояния учитывают требования доступности:

- **Focus visible**: Четкое выделение при навигации с клавиатуры
- **High contrast**: Поддержка режима высокой контрастности
- **Screen readers**: Семантические HTML-элементы
- **Keyboard navigation**: Полная поддержка навигации с клавиатуры

## Анимации

Все переходы между состояниями анимированы:

- **Duration**: 150ms (быстрые переходы)
- **Easing**: ease-in-out
- **Properties**: background-color, color, box-shadow, transform, border-color

## Темная тема

Все состояния поддерживают темную тему через CSS-переменные:

```css
[data-theme="dark"] {
  --wt-button-bg: #a78bfa;
  --wt-input-bg: #0b0f19;
  --wt-card-bg: #0b0f19;
}
```
