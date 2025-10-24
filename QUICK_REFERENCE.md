# ⚡ WeddingTech - Quick Reference

**Fast access to common commands and information**

---

## 🚀 Essential Commands

### Start/Stop Platform

```bash
# Start everything (recommended)
npm run dev:full

# Stop all services
npm run stop
# OR press Ctrl+C

# Start frontend only
npm run dev
```

### Database

```bash
# Generate Prisma Client
npm run prisma:gen

# Apply migrations
npm run prisma:migrate

# Open Prisma Studio (GUI)
npm run prisma:studio

# Seed test data
npm run prisma:seed
```

### Docker

```bash
# Start containers
npm run docker:up

# Stop containers
npm run docker:down

# View logs
npm run docker:logs

# Restart database
docker-compose restart db
```

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to DigitalOcean
doctl apps create --spec .do/app.yaml
```

---

## 🌐 Service URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Auth** | http://localhost:3001 |
| **Catalog** | http://localhost:3002 |
| **Enquiries** | http://localhost:3003 |
| **Billing** | http://localhost:3004 |
| **Vendors** | http://localhost:3005 |
| **Guests** | http://localhost:3006 |
| **Payments** | http://localhost:3007 |
| **MinIO Console** | http://localhost:9001 |

---

## 🔍 Health Checks

```bash
# Frontend
curl http://localhost:3000

# Services (all have /health endpoint)
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
curl http://localhost:3005/health
curl http://localhost:3006/health
curl http://localhost:3007/health
```

---

## 📊 Logs

```bash
# View service logs
tail -f /tmp/svc-auth.log
tail -f /tmp/svc-catalog.log
tail -f /tmp/svc-enquiries.log
tail -f /tmp/svc-billing.log
tail -f /tmp/svc-vendors.log
tail -f /tmp/svc-guests.log
tail -f /tmp/svc-payments.log
tail -f /tmp/next.log

# View all service logs
tail -f /tmp/svc-*.log

# Docker container logs
docker-compose logs -f
docker-compose logs -f db
```

---

## 🗄️ Database Access

```bash
# Via Docker
docker-compose exec db psql -U pg -d wt

# Direct connection
psql -h localhost -p 5434 -U pg -d wt

# Connection string
postgresql://pg:pg@localhost:5434/wt
```

---

## 🐛 Troubleshooting

### Port already in use

```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database issues

```bash
# Restart database
docker-compose restart db

# Reset database (⚠️ destroys data)
npx prisma migrate reset
```

### Services not starting

```bash
# Check logs
tail -f /tmp/svc-*.log

# Check running processes
ps aux | grep node

# Kill all node processes
pkill node
```

### Clean install

```bash
# Remove everything
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables |
| `schema.prisma` | Database schema |
| `package.json` | Dependencies & scripts |
| `next.config.mjs` | Next.js + API Gateway config |
| `docker-compose.yml` | Docker services config |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | Platform overview |
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Complete setup guide |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribution guidelines |
| [ROADMAP.md](./ROADMAP.md) | Future features |
| [PLATFORM_STATUS.md](./PLATFORM_STATUS.md) | Current status |
| [AUDIT_SUMMARY.md](./AUDIT_SUMMARY.md) | Audit report |

---

## 🔐 Environment Variables

```bash
# Database
DATABASE_URL=postgresql://pg:pg@localhost:5434/wt

# Application
NODE_ENV=development
PORT=3000

# Auth
NEXTAUTH_SECRET=dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=minio123
```

---

## 🏗️ Project Structure

```
/workspace
├── app/              # Next.js pages
├── src/              # UI components
├── apps/             # Microservices
│   ├── svc-auth/
│   ├── svc-catalog/
│   ├── svc-enquiries/
│   ├── svc-billing/
│   ├── svc-vendors/
│   ├── svc-guests/
│   └── svc-payments/
├── packages/         # Shared packages
├── scripts/          # Dev scripts
├── docs/             # Documentation
└── schema.prisma     # Database schema
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific service tests
npm test --workspace=apps/svc-auth

# Run with coverage
npm test -- --coverage

# E2E tests
npm run test:e2e
```

---

## 🎯 Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Commit changes
git add .
git commit -m "feat: your feature description"

# Push to remote
git push origin feature/your-feature

# Create pull request on GitHub
```

---

## 📞 Support

- **Questions:** Check [GETTING_STARTED.md](./GETTING_STARTED.md)
- **Issues:** Check [AUDIT_SUMMARY.md](./AUDIT_SUMMARY.md)
- **Features:** Check [ROADMAP.md](./ROADMAP.md)
- **Contributing:** Check [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## ⚡ Performance Tips

```bash
# Enable production mode
NODE_ENV=production npm start

# Optimize build
npm run build

# Clear Next.js cache
rm -rf .next

# Regenerate Prisma Client
npm run prisma:gen
```

---

## 🔄 Common Workflows

### Adding a new service

1. Create service directory in `apps/`
2. Add `package.json` with start script
3. Create `src/main.js` entry point
4. Add health check endpoint
5. Update `start-dev-full.sh`
6. Update documentation

### Updating database schema

1. Edit `schema.prisma`
2. Create migration: `npx prisma migrate dev --name your_migration`
3. Generate client: `npm run prisma:gen`
4. Restart services

### Deploying to staging

1. Commit changes: `git commit -am "your message"`
2. Push to staging branch: `git push origin staging`
3. Trigger deployment (CI/CD or manual)
4. Verify deployment: Check health endpoints

---

**Keep this handy for quick reference! 📌**

*Last updated: 2025-10-24*
