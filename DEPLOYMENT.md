# 🚀 WeddingTech Platform - Deployment Guide

This guide covers deploying the WeddingTech platform to production environments.

## 📋 Deployment Options

### Option 1: DigitalOcean App Platform (Recommended)

DigitalOcean App Platform provides managed infrastructure with automatic scaling, SSL, and CI/CD.

### Option 2: Docker Compose (VPS/Dedicated Server)

Deploy using Docker containers on any VPS (DigitalOcean Droplet, AWS EC2, etc).

### Option 3: Kubernetes

For enterprise-scale deployments with complex orchestration needs.

---

## 🌊 DigitalOcean App Platform Deployment

### Prerequisites

- DigitalOcean account
- `doctl` CLI tool installed
- GitHub repository connected to DO

### Quick Deploy

```bash
# Login to DigitalOcean
doctl auth init

# Deploy app
doctl apps create --spec .do/app.yaml

# Or use the web UI:
# https://cloud.digitalocean.com/apps/new
```

### Configuration (.do/app.yaml)

The platform includes a pre-configured `.do/app.yaml` that defines:

- **Frontend:** Next.js web app
- **7 Microservices:** auth, catalog, enquiries, billing, vendors, guests, payments
- **Database:** Managed PostgreSQL cluster
- **Storage:** Spaces (S3-compatible)

### Environment Variables

Set these in the DigitalOcean dashboard:

```bash
# Database (automatically provided by DO)
DATABASE_URL=${db.DATABASE_URL}

# Application
NODE_ENV=production
NEXTAUTH_SECRET=<generate-secure-secret>
NEXTAUTH_URL=https://your-app.ondigitalocean.app

# Storage
SPACES_ENDPOINT=nyc3.digitaloceanspaces.com
SPACES_BUCKET=weddingtech-media
SPACES_ACCESS_KEY=<your-spaces-key>
SPACES_SECRET_KEY=<your-spaces-secret>
```

### Database Setup

```bash
# Apply migrations after first deployment
doctl apps exec <app-id> --component web -- npm run prisma:migrate

# Seed initial data (optional)
doctl apps exec <app-id> --component web -- npm run prisma:seed
```

### Custom Domain

1. Add domain in DigitalOcean dashboard
2. Update DNS records
3. SSL certificate auto-provisioned

---

## 🐳 Docker Compose Deployment (VPS)

### Server Requirements

- **CPU:** 4+ cores
- **RAM:** 8GB+ minimum
- **Storage:** 50GB+ SSD
- **OS:** Ubuntu 22.04 LTS (recommended)

### Installation Steps

#### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Create app user
sudo useradd -m -s /bin/bash weddingtech
sudo usermod -aG docker weddingtech
```

#### 2. Clone Repository

```bash
# Switch to app user
sudo su - weddingtech

# Clone repo
git clone <your-repo-url> /home/weddingtech/app
cd /home/weddingtech/app
```

#### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit with production values
nano .env
```

**Production .env:**

```bash
# Database
DATABASE_URL=postgresql://pg:pg@db:5432/wt

# Application
NODE_ENV=production
PORT=3000

# Auth
NEXTAUTH_SECRET=<strong-random-secret>
NEXTAUTH_URL=https://yourdomain.com

# MinIO (internal)
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=<strong-random-key>
MINIO_SECRET_KEY=<strong-random-secret>
```

#### 4. Build & Deploy

```bash
# Build containers
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### 5. Initialize Database

```bash
# Apply migrations
docker-compose exec web npm run prisma:migrate

# Seed data (optional)
docker-compose exec web npm run prisma:seed
```

#### 6. Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx certbot python3-certbot-nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/weddingtech
```

**Nginx configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/weddingtech /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL with Let's Encrypt
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### 7. Setup Systemd Service (Auto-restart)

```bash
sudo nano /etc/systemd/system/weddingtech.service
```

```ini
[Unit]
Description=WeddingTech Platform
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/weddingtech/app
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
User=weddingtech

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable weddingtech
sudo systemctl start weddingtech
```

---

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (GKE, EKS, AKS, or self-managed)
- `kubectl` configured
- Helm 3+ installed

### Deployment Steps

#### 1. Create Namespace

```bash
kubectl create namespace weddingtech
```

#### 2. Deploy Database

Use managed PostgreSQL or deploy with Helm:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install postgresql bitnami/postgresql \
  --namespace weddingtech \
  --set auth.username=pg \
  --set auth.password=<secure-password> \
  --set auth.database=wt
```

#### 3. Deploy Application

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/ -n weddingtech

# Check deployment
kubectl get pods -n weddingtech
kubectl get services -n weddingtech
```

#### 4. Setup Ingress

```bash
# Install NGINX Ingress Controller
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace

# Apply ingress resource
kubectl apply -f k8s/ingress.yaml -n weddingtech
```

---

## 🔒 Security Checklist

### Before Production

- [ ] Change all default passwords
- [ ] Generate strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS/SSL
- [ ] Setup firewall rules
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Setup monitoring & alerts
- [ ] Configure backups
- [ ] Enable audit logging
- [ ] Review environment variables
- [ ] Disable debug mode
- [ ] Setup CSP headers

### Recommended Security Headers

```javascript
// next.config.mjs
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
];
```

---

## 📊 Monitoring

### Recommended Tools

- **Application Monitoring:** New Relic, DataDog, or Sentry
- **Infrastructure:** Prometheus + Grafana
- **Logs:** ELK Stack or Loki
- **Uptime:** UptimeRobot or Pingdom

### Health Checks

Configure health check endpoints:

```bash
# Service health checks
GET /health

# Response
{
  "status": "ok",
  "db": true,
  "timestamp": "2025-10-24T12:00:00Z"
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to DigitalOcean
        uses: digitalocean/app_action@v1
        with:
          app_name: weddingtech
          token: ${{ secrets.DIGITALOCEAN_TOKEN }}
```

---

## 💾 Backup Strategy

### Database Backups

```bash
# Automated daily backups
0 2 * * * docker-compose exec -T db pg_dump -U pg wt > /backups/wt-$(date +\%Y\%m\%d).sql

# Backup retention: 30 days
find /backups -name "wt-*.sql" -mtime +30 -delete
```

### Media Files Backup

```bash
# Sync to S3/Spaces
aws s3 sync /var/lib/minio s3://backup-bucket/media --delete
```

---

## 🔧 Maintenance

### Zero-Downtime Deployments

```bash
# Rolling update with Docker
docker-compose pull
docker-compose up -d --no-deps --build web

# Health check before routing traffic
curl http://localhost:3000/health
```

### Database Migrations

```bash
# Test migrations in staging first
npm run prisma:migrate

# Production deployment
docker-compose exec web npm run prisma:migrate
```

### Scaling Services

```bash
# Scale specific service
docker-compose up -d --scale svc-catalog=3

# Kubernetes
kubectl scale deployment svc-catalog --replicas=3 -n weddingtech
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue:** Database connection timeout
```bash
# Check database status
docker-compose logs db
# Increase connection pool size
DATABASE_URL="postgresql://pg:pg@localhost:5434/wt?connection_limit=20"
```

**Issue:** Out of memory
```bash
# Check memory usage
docker stats
# Increase Node.js heap size
NODE_OPTIONS="--max-old-space-size=4096"
```

**Issue:** Slow response times
```bash
# Enable caching
# Check indexes
# Scale horizontally
```

---

## 📚 Additional Resources

- [DigitalOcean Documentation](https://docs.digitalocean.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Docker Production Guide](https://docs.docker.com/config/containers/start-containers-automatically/)

---

**Production-ready deployment! 🚀**

*Last updated: 2025-10-24*
