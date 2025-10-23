# @wt/security

Пакет для обеспечения безопасности приложения WeddingTech.

## Функции

- **Security Headers**: Набор заголовков безопасности для HTTP-ответов
- **CSRF Protection**: Защита от CSRF-атак
- **Rate Limiting**: Ограничение частоты запросов

## Использование

```typescript
import { securityHeaders } from '@wt/security';

// Применение заголовков безопасности
app.use((req, res, next) => {
  securityHeaders.forEach(([name, value]) => {
    res.setHeader(name, value);
  });
  next();
});
```

## Заголовки безопасности

- `X-Frame-Options`: DENY
- `X-Content-Type-Options`: nosniff
- `Referrer-Policy`: strict-origin-when-cross-origin
- `Cross-Origin-Resource-Policy`: same-origin
- `Cross-Origin-Opener-Policy`: same-origin
- `Permissions-Policy`: camera=(), microphone=(), geolocation=()
- `X-DNS-Prefetch-Control`: off
- `X-XSS-Protection`: 1; mode=block
- `Strict-Transport-Security`: max-age=31536000; includeSubDomains
- `Content-Security-Policy`: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';
