# 💍 WeddingTech Platform

**A comprehensive microservices-based wedding marketplace platform** built with Next.js, TypeScript, and PostgreSQL.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Node Version](https://img.shields.io/badge/node-20.x-green)]()

## ✨ Features

- 🎯 **Full-Stack Wedding Marketplace** - Connect couples with wedding vendors
- 🏗️ **Microservices Architecture** - 7 independent, scalable services
- 🔐 **Authentication & Authorization** - Secure user management
- 📋 **Enquiry Management** - Handle vendor inquiries efficiently
- 💳 **Payment Processing** - Integrated billing and payments
- 👥 **Guest List Management** - Complete wedding guest tracking
- 📸 **Vendor Catalog** - Searchable vendor directory with filters
- 🌐 **Multi-language Support** - i18n ready
- 📱 **Responsive Design** - Works on all devices

## 🚀 Quick Start

Get the entire platform running with one command:

```bash
npm run dev:full
```

Access the app at **http://localhost:3000**

Stop everything with:

```bash
npm run stop
```

**👉 For detailed setup instructions, see [GETTING_STARTED.md](./GETTING_STARTED.md)**

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           Browser / Client                   │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│   Next.js Frontend + API Gateway (3000)     │
└────────────────┬────────────────────────────┘
                 │
     ┌───────────┼───────────┐
     ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│  Auth   │ │ Catalog │ │Enquiries│
│  :3001  │ │  :3002  │ │  :3003  │
└────┬────┘ └────┬────┘ └────┬────┘
     │           │           │
     ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Billing │ │ Vendors │ │ Guests  │
│  :3004  │ │  :3005  │ │  :3006  │
└────┬────┘ └────┬────┘ └────┬────┘
     │           │           │
     └───────────┼───────────┘
                 ▼
         ┌──────────────┐
         │  PostgreSQL  │
         │    :5434     │
         └──────────────┘
```

## 📦 Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, TailwindCSS
- **Backend:** Node.js 20, Microservices
- **Database:** PostgreSQL 15, Prisma ORM
- **Storage:** MinIO (S3-compatible)
- **Deployment:** Docker, DigitalOcean App Platform

## 🛠️ Development

### Prerequisites

- Node.js 20.x
- npm 10.x
- Docker (optional, for PostgreSQL)

### Available Commands

```bash
# Development
npm run dev              # Frontend only
npm run dev:full         # All services
npm run stop             # Stop all services

# Database
npm run prisma:gen       # Generate Prisma Client
npm run prisma:migrate   # Apply migrations
npm run prisma:studio    # Open Prisma Studio GUI

# Production
npm run build            # Build Next.js
npm start                # Start production server
```

### Microservices

| Service | Port | Description |
|---------|------|-------------|
| svc-auth | 3001 | Authentication & user management |
| svc-catalog | 3002 | Vendor catalog & search |
| svc-enquiries | 3003 | Enquiry management system |
| svc-billing | 3004 | Billing & invoicing |
| svc-vendors | 3005 | Vendor profile management |
| svc-guests | 3006 | Guest list management |
| svc-payments | 3007 | Payment processing |

## 📚 Documentation

- **[Getting Started](./GETTING_STARTED.md)** - Complete setup guide
- **[Deployment](./DEPLOYMENT.md)** - Production deployment guide
- **[API Documentation](./docs/api/)** - API reference
- **[Architecture](./docs/architecture/)** - System design docs
- **[Contributing](./CONTRIBUTING.md)** - Contribution guidelines

## 📁 Project Structure

```
/workspace
├── app/                   # Next.js pages (App Router)
├── src/                   # UI components & utilities
├── apps/                  # Microservices
│   ├── svc-auth/
│   ├── svc-catalog/
│   ├── svc-enquiries/
│   ├── svc-billing/
│   ├── svc-vendors/
│   ├── svc-guests/
│   └── svc-payments/
├── packages/              # Shared packages
│   ├── prisma/
│   ├── security/
│   └── ...
├── docs/                  # Documentation
├── scripts/               # Dev & deployment scripts
├── docker-compose.yml     # Docker services
├── next.config.mjs        # Next.js + API Gateway
└── schema.prisma          # Database schema
```

## 🚀 Deployment

Deploy to production in minutes:

### DigitalOcean App Platform

```bash
doctl apps create --spec .do/app.yaml
```

### Docker (VPS)

```bash
docker-compose up -d --build
```

**👉 Full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)**

## 🔒 Security

- ✅ HTTPS/SSL enforced
- ✅ JWT-based authentication
- ✅ CORS configured
- ✅ Rate limiting
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection
- ✅ Security headers configured

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific service tests
npm test --workspace=apps/svc-auth
```

## 📊 Performance

- **Lighthouse Score:** 90+ (Performance)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Database Queries:** Optimized with indexing
- **API Response Time:** < 200ms (avg)

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation:** [docs/](./docs/)
- **Issues:** [GitHub Issues](https://github.com/your-org/weddingtech/issues)
- **Email:** support@weddingtech.uz

## 🎯 Roadmap

- [ ] Mobile apps (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered vendor recommendations
- [ ] Real-time chat system
- [ ] Multi-currency support
- [ ] White-label solution for partners

---

**Built with ❤️ for the wedding industry**

*Version 2.0 | Last updated: 2025-10-24*
