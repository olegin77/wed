# One-click deploy (DigitalOcean App Platform)
1) Добавить `DO_API_TOKEN` в GitHub Secrets.
2) Создать App из `infra/do/app.yaml` (deploy_on_push: main).
3) В Actions запустить "DO Deploy (manual)" и указать APP ID.
4) Проверить `/health` (<250 мс на холодном старте желательно).
