# Enquiry archive & GDPR deletion

Модуль `apps/svc-enquiries/src/archive/` реализует единый интерфейс для архивирования заявок и полного удаления записей по требованиям GDPR.

## Архитектура

- `ArchiveRecord` — структура сохранённой заявки: идентификатор, временная метка, причина, инициатор и опциональный снапшот данных.
- `ArchiveStore` — контракт для хранилища. Текущая реализация `InMemoryArchiveStore` подходит для разработки и юнит-тестов.
- `createArchiveManager(store)` — фабрика, возвращающая операции `archive`, `restore`, `purge`, `list`.
- Хелперы `archiveEnquiry`, `restoreEnquiry`, `purgeEnquiry`, `listArchivedEnquiries` используют singleton на базе `InMemoryArchiveStore`.

```ts
import {
  archiveEnquiry,
  restoreEnquiry,
  purgeEnquiry,
  listArchivedEnquiries,
} from "apps/svc-enquiries/src/archive";

await archiveEnquiry({ enquiryId: "enq-42", reason: "duplicate", archivedBy: "ops" });
const entries = await listArchivedEnquiries();

await restoreEnquiry("enq-42"); // восстановление из архива
await purgeEnquiry("enq-42");   // полное удаление
```

## План развития

- Подключить реальное хранилище (PostgreSQL или S3) путём реализации интерфейса `ArchiveStore`.
- Добавить автоматический retention-период и периодические задачи на чистку устаревших архивов.
- Связать операции с аудиторским логом безопасности.
