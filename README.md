# WeddingTech UZ (MVP)
## Local
1) docker-compose up -d db
2) export DATABASE_URL=postgresql://pg:pg@localhost:5434/wt
3) pnpm run prisma:gen && pnpm run prisma:migrate && pnpm run prisma:seed
4) запустить сервисы (auth/catalog/enquiries/vendors/billing)
## DO App Platform
- см. infra/do/app.yaml и docs/ops/do/one-click-deploy.md
