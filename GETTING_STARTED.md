# 🚀 WeddingTech Platform - Getting Started

**Welcome to WeddingTech!** This guide will help you get the platform up and running in minutes.

## 📋 Prerequisites

- **Node.js**: v20.x or newer
- **npm**: v10.x or newer
- **Docker**: For PostgreSQL and MinIO (optional, can use local PostgreSQL)
- **PostgreSQL**: v15+ (if not using Docker)

## ⚡ Quick Start (Recommended)

Run everything with one command:

```bash
npm run dev:full
```

This automatically:
- ✅ Creates `.env` file (if missing)
- ✅ Starts Docker containers (PostgreSQL + MinIO)
- ✅ Waits for database to be ready
- ✅ Creates the database
- ✅ Applies migrations
- ✅ Starts all 7 microservices
- ✅ Starts Next.js frontend

**Access:** http://localhost:3000

## 🛑 Stopping Services

```bash
npm run stop
# OR press Ctrl+C in the terminal running dev:full
```

## 📦 Manual Setup (Alternative)

If you prefer step-by-step setup:

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Infrastructure

```bash
docker-compose up -d db minio
```

### 3. Initialize Database

```bash
./scripts/init-database.sh
```

### 4. Start Services

```bash
# Start all microservices and frontend
npm run dev:full
```

## 🌐 Available Services

After successful startup:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Next.js web application |
| **Auth** | http://localhost:3001 | Authentication service |
| **Catalog** | http://localhost:3002 | Vendor catalog service |
| **Enquiries** | http://localhost:3003 | Enquiry management |
| **Billing** | http://localhost:3004 | Billing & invoicing |
| **Vendors** | http://localhost:3005 | Vendor management |
| **Guests** | http://localhost:3006 | Guest list management |
| **Payments** | http://localhost:3007 | Payment processing |
| **PostgreSQL** | localhost:5434 | Database |
| **MinIO** | http://localhost:9001 | Object storage console |

## 🔧 Development Commands

### Basic Commands

```bash
# Development
npm run dev              # Frontend only
npm run dev:full         # All services
npm run stop             # Stop all services

# Build & Production
npm run build            # Build Next.js app
npm start                # Start production server

# Database
npm run prisma:gen       # Generate Prisma Client
npm run prisma:migrate   # Apply migrations
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:seed      # Seed test data

# Docker
npm run docker:up        # Start containers
npm run docker:down      # Stop containers
npm run docker:logs      # View container logs
```

### Service Logs

All service logs are stored in `/tmp/`:

```bash
tail -f /tmp/svc-auth.log       # Auth service
tail -f /tmp/svc-catalog.log    # Catalog service
tail -f /tmp/next.log           # Frontend
```

## 🔍 Health Checks

Verify services are running:

```bash
# Frontend
curl http://localhost:3000

# Services
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # Catalog
curl http://localhost:3003/health  # Enquiries
curl http://localhost:3004/health  # Billing
curl http://localhost:3005/health  # Vendors
curl http://localhost:3006/health  # Guests
curl http://localhost:3007/health  # Payments
```

## 🐛 Troubleshooting

### Issue: Services not starting

**Check logs:**
```bash
ls -la /tmp/*.log
tail -f /tmp/svc-*.log
```

### Issue: Port already in use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Issue: Database connection failed

```bash
# Check if Docker container is running
docker-compose ps

# Restart database
docker-compose restart db

# Check database logs
docker-compose logs db
```

### Issue: Prisma Client errors

```bash
# Regenerate Prisma Client
npm run prisma:gen

# Reset database (⚠️ destroys all data)
npx prisma migrate reset
```

### Issue: Missing dependencies

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📁 Project Structure

```
/workspace
├── app/                   # Next.js App Router pages
├── src/                   # UI components & utilities
├── apps/                  # Microservices
│   ├── svc-auth/          # Authentication
│   ├── svc-catalog/       # Vendor catalog
│   ├── svc-enquiries/     # Enquiries
│   ├── svc-billing/       # Billing
│   ├── svc-vendors/       # Vendor management
│   ├── svc-guests/        # Guest management
│   └── svc-payments/      # Payments
├── packages/              # Shared packages
│   ├── prisma/            # Database schema
│   ├── security/          # Security utilities
│   └── ...
├── scripts/               # Development scripts
├── docs/                  # Documentation
├── docker-compose.yml     # Docker configuration
├── next.config.mjs        # Next.js + API Gateway config
├── schema.prisma          # Database schema
└── package.json           # Dependencies & scripts
```

## 🏗️ Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   Next.js       │  :3000
│   (Frontend +   │
│   API Gateway)  │
└────────┬────────┘
         │
         ├─────► Auth Service      :3001
         ├─────► Catalog Service   :3002
         ├─────► Enquiries         :3003
         ├─────► Billing           :3004
         ├─────► Vendors           :3005
         ├─────► Guests            :3006
         └─────► Payments          :3007
                       │
                       ▼
              ┌────────────────┐
              │   PostgreSQL   │  :5434
              └────────────────┘
```

## 🔐 Environment Variables

The `.env` file is auto-created with sensible defaults. Key variables:

```bash
# Database
DATABASE_URL=postgresql://pg:pg@localhost:5434/wt

# Application
NODE_ENV=development
PORT=3000

# Auth
NEXTAUTH_SECRET=dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000

# MinIO (S3-compatible storage)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minio
MINIO_SECRET_KEY=minio123
```

## 📚 Next Steps

1. ✅ **Explore the Frontend:** http://localhost:3000
2. ✅ **Open Prisma Studio:** `npm run prisma:studio`
3. ✅ **Read Architecture Docs:** [docs/architecture/](./docs/architecture/)
4. ✅ **Production Deployment:** [INSTALL.md](./INSTALL.md)

## 🆘 Getting Help

- **Documentation:** [docs/](./docs/)
- **Architecture:** [docs/architecture/flows.md](./docs/architecture/flows.md)
- **API Docs:** [docs/api/](./docs/api/)
- **Production Setup:** [INSTALL.md](./INSTALL.md)

---

**Ready to build something amazing! 🎉**

*Last updated: 2025-10-24*
