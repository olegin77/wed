# Типографика

Компоненты типографики для дизайн-системы WeddingTech.

## Компоненты

### Display
Большие заголовки для главных страниц и секций.

```tsx
import { Display } from '@wt/ui/typography';

<Display size="xl" weight="bold" color="accent">
  Добро пожаловать в WeddingTech
</Display>
```

### Heading
Заголовки различных уровней (h1-h6).

```tsx
import { Heading } from '@wt/ui/typography';

<Heading level={1} size="2xl" weight="semibold">
  Заголовок страницы
</Heading>
```

### Text
Основной текстовый контент.

```tsx
import { Text } from '@wt/ui/typography';

<Text size="base" weight="normal" color="default">
  Основной текст страницы
</Text>
```

### Caption
Подписи и мелкий текст.

```tsx
import { Caption } from '@wt/ui/typography';

<Caption size="sm" color="muted">
  Подпись к изображению
</Caption>
```

### Code
Моноширинный текст для кода.

```tsx
import { Code } from '@wt/ui/typography';

<Code size="sm" color="accent">
  const greeting = 'Hello World';
</Code>
```

### Link
Ссылки и интерактивный текст.

```tsx
import { Link } from '@wt/ui/typography';

<Link href="/profile" size="base" color="accent" underline="hover">
  Перейти к профилю
</Link>
```

## Размеры шрифтов

- `xs` - 12px (11px на мобильных, 13px на десктопе)
- `sm` - 14px (13px на мобильных, 15px на десктопе)
- `base` - 16px (15px на мобильных, 17px на десктопе)
- `lg` - 18px (17px на мобильных, 19px на десктопе)
- `xl` - 20px (19px на мобильных, 21px на десктопе)
- `2xl` - 24px (22px на мобильных, 26px на десктопе)
- `3xl` - 30px (26px на мобильных, 32px на десктопе)
- `4xl` - 36px (30px на мобильных, 40px на десктопе)
- `5xl` - 48px (40px на мобильных, 52px на десктопе)
- `6xl` - 60px
- `7xl` - 72px
- `8xl` - 96px
- `9xl` - 128px

## Веса шрифтов

- `thin` - 100
- `extralight` - 200
- `light` - 300
- `normal` - 400
- `medium` - 500
- `semibold` - 600
- `bold` - 700
- `extrabold` - 800
- `black` - 900

## Цвета

- `default` - Основной цвет текста
- `muted` - Приглушенный цвет
- `accent` - Акцентный цвет
- `success` - Цвет успеха
- `warning` - Цвет предупреждения
- `error` - Цвет ошибки
- `info` - Информационный цвет

## Семейства шрифтов

- `--wt-font-family` - Основной шрифт (системный)
- `--wt-font-display` - Шрифт для заголовков (Inter)
- `--wt-font-mono` - Моноширинный шрифт
- `--wt-font-serif` - Шрифт с засечками

## Адаптивность

Типографика автоматически адаптируется под размер экрана:
- На мобильных устройствах размеры уменьшены
- На десктопе размеры увеличены
- Сохраняется читаемость на всех устройствах
