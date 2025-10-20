# Security audit logging

Пакет `packages/audit/security/` реализует централизованный аудит безопасности для всех сервисов.

## Основные компоненты

- `createSecurityAuditLogger({ sinks, clock })` — нормализует события (тип, актор, ресурс, уровень критичности) и отправляет их в указанные sinks.
- `createConsoleSink()` — development-реализация, пишет JSON в консоль.
- `createMemorySink()` — вспомогательный sink для тестов, возвращает накопленные события через `all()`.
- `recordSecurityEvent(event)` — готовый синглтон для сервисов, где не нужна кастомизация.

### Событие

```ts
await recordSecurityEvent({
  type: "login_failure",
  actorId: "user-1",
  resource: "svc-auth",
  severity: "warning",
  ipAddress: "203.0.113.1",
  metadata: { reason: "invalid_password" },
});
```

- Поля `type` и `actorId` обязательны; остальное нормализуется (resource/ip/userAgent — `unknown`, severity — `info`).
- Метаданные проходят санитизацию: ключи с `password`, `secret`, `token`, `key` заменяются на `[redacted]`.

## Расширения

- Реализовать sink для PostgreSQL/ClickHouse.
- Подключить интеграцию с SIEM (Splunk, Elastic Security).
- Добавить кореляцию с инцидентами (incident_id) и поддержку батчевого экспорта.
