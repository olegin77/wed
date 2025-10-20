# Chunked uploads helper

Пакет `packages/storage/chunk/` предоставляет утилиту для загрузки крупных файлов по частям поверх абстрактного backend-а (S3, MinIO и т.п.).

## Основные сущности

- `chunkUpload(params)` — разбивает поток (`Readable`) на куски фиксированного размера и поочерёдно отправляет их в целевой storage.
- `MultipartUploadTarget` — контракт для бэкенда, включающий методы `initiate`, `uploadPart`, `complete`, опционально `abort`.
- `createMemoryTarget()` — in-memory реализация для локальной разработки и юнит-тестов.
- Колбэк `onProgress` получает информацию о размере части и суммарном объёме загруженных данных.

```ts
import { Readable } from "node:stream";
import { chunkUpload, createMemoryTarget } from "@wt/storage/chunk";

const target = createMemoryTarget();
const source = Readable.from([Buffer.alloc(5 * 1024 * 1024)]); // 5 MiB

await chunkUpload({
  objectKey: "uploads/video.mp4",
  chunkSize: 1024 * 1024,
  source,
  target,
  onProgress: ({ partNumber, totalUploaded }) => {
    console.log(`Uploaded part ${partNumber}, total ${totalUploaded} bytes`);
  },
});
```

## Расширения

- Реализовать адаптер для MinIO/S3, который использует их API multipart-upload.
- Добавить метрики (продолжительность, пропускная способность) и интеграцию с аудит-логом.
- Поддержать повторную отправку части при временных ошибках сети.
