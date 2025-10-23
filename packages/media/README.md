# @wt/media

Пакет для обработки и оптимизации медиафайлов в приложении WeddingTech.

## Функции

- **Оптимизация изображений**: Сжатие и изменение размера изображений
- **Множественные варианты**: Создание различных размеров и форматов
- **Метаданные**: Извлечение информации об изображениях
- **Поддержка форматов**: JPEG, WebP, AVIF, PNG

## Использование

```typescript
import { minifyImage, minifyVariants, extractMetadata } from '@wt/media';

// Оптимизация одного изображения
const result = await minifyImage(imageBuffer, {
  width: 800,
  height: 600,
  quality: 80,
  format: 'webp'
});

// Создание множественных вариантов
const variants = await minifyVariants(imageBuffer, [
  { width: 400, height: 300, format: 'webp' },
  { width: 800, height: 600, format: 'jpeg' },
  { width: 1200, height: 900, format: 'avif' }
]);

// Извлечение метаданных
const metadata = await extractMetadata(imageBuffer);
```

## API

### minifyImage(source, options)

Оптимизирует изображение с заданными параметрами.

**Параметры:**
- `source: Buffer` - исходное изображение
- `options: MinifyOptions` - параметры оптимизации

**Возвращает:** `Promise<MinifyResult>`

### minifyVariants(source, variants)

Создает несколько вариантов изображения.

**Параметры:**
- `source: Buffer` - исходное изображение
- `variants: MinifyOptions[]` - массив вариантов

**Возвращает:** `Promise<MinifyVariantResult[]>`

### extractMetadata(source)

Извлекает метаданные изображения.

**Параметры:**
- `source: Buffer` - исходное изображение

**Возвращает:** `Promise<Metadata | null>`

## Зависимости

- **sharp**: Библиотека для обработки изображений
- **typescript**: Компилятор TypeScript
- **@types/node**: Типы для Node.js
