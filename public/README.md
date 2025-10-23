# Иконки и манифест приложения

Этот каталог содержит иконки и манифест для PWA-приложения WeddingTech.

## Файлы

### Иконки
- `icon.svg` - Исходная SVG иконка
- `icon-192.png` - PNG иконка 192x192px
- `icon-512.png` - PNG иконка 512x512px
- `favicon.ico` - Favicon для браузера
- `apple-touch-icon.png` - Иконка для iOS (180x180px)

### Манифест
- `manifest.json` - Web App Manifest для PWA

## Использование

### В HTML
```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.json">
```

### В Next.js
```jsx
import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      {children}
    </>
  );
}
```

## Создание новых иконок

Для создания новых размеров иконок используйте ImageMagick:

```bash
# Создание иконки 256x256
convert icon.svg -resize 256x256 icon-256.png

# Создание иконки 144x144
convert icon.svg -resize 144x144 icon-144.png
```

## Цветовая схема

- Основной цвет: #7c3aed (фиолетовый)
- Градиент: от #7c3aed до #a78bfa
- Фон: белый
- Текст: белый
