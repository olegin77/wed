# SPF/DKIM настройка для DigitalOcean Apps

1. В панели DigitalOcean Apps откройте вкладку **Settings → Domains** и добавьте домен.
2. Добавьте DNS-записи:
   - SPF: `v=spf1 include:mailgun.org ~all`
   - DKIM: сгенерируйте ключи в почтовом провайдере (Mailgun/Sendgrid) и добавьте как CNAME.
3. После деплоя проверьте запись через `dig txt yourdomain.com` и `dig txt krs._domainkey.yourdomain.com`.
4. В `.env` укажите `MAIL_FROM` и `SMTP_URL`, чтобы сервис рассылки проходил валидацию.
