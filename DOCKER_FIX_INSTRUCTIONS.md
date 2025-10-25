# Docker Deployment Fix Instructions

## Issues Identified and Fixed

### 1. **svc-auth Prisma Client Issue** ✅ FIXED
**Problem**: The `svc-auth` service was crashing with error:
```
Error: Cannot find module '.prisma/client/index-browser'
```

**Root Cause**: The `apps/svc-auth/package.json` had `@prisma/client` as a local dependency, which conflicted with the workspace-level Prisma Client generation. Other working services (catalog, enquiries, guests, payments, vendors) don't have this dependency.

**Fix Applied**: Removed `@prisma/client` from `apps/svc-auth/package.json` dependencies to match other services.

### 2. **Database Healthcheck Issue** ✅ FIXED
**Problem**: PostgreSQL healthcheck was not specifying the database name, causing connection attempts to default database "pg" which doesn't exist.

**Fix Applied**: Updated `docker-compose.yml` healthcheck to:
```yaml
test: ["CMD-SHELL", "pg_isready -U pg -d wt"]
```

## How to Apply These Fixes

### Option 1: Rebuild Everything (Recommended)
```bash
# Navigate to your app directory
cd /home/weddingtech/app  # or wherever your docker-compose.yml is

# Stop all containers
docker-compose down

# Remove old volumes (this will reset the database)
docker volume rm app_postgres_data app_minio_data

# Rebuild images with no cache
docker-compose build --no-cache

# Start services
docker-compose up -d

# Wait for services to become healthy (2-3 minutes)
docker-compose ps

# Run migrations
docker-compose exec svc-auth sh -c 'cd /app && pnpm exec prisma migrate deploy'

# Verify services
docker-compose ps
```

### Option 2: Rebuild Only svc-auth (Faster)
```bash
cd /home/weddingtech/app

# Stop and remove svc-auth container
docker-compose stop svc-auth
docker-compose rm -f svc-auth

# Rebuild svc-auth service
docker-compose build --no-cache svc-auth

# Start svc-auth
docker-compose up -d svc-auth

# Wait for it to become healthy
docker-compose ps svc-auth

# Run migrations
docker-compose exec svc-auth sh -c 'cd /app && pnpm exec prisma migrate deploy'

# Restart web service if needed
docker-compose restart web
```

### Option 3: If You're Using the Auto-Install Script
```bash
# Re-run the auto-install script
# It will detect existing installation and rebuild
sudo bash scripts/auto-install-droplet.sh
```

## Verification Steps

After applying fixes, verify everything is working:

```bash
# 1. Check all containers are healthy
docker-compose ps

# Expected output: All services should show "Up (healthy)"

# 2. Check svc-auth logs (should not show Prisma errors)
docker-compose logs svc-auth --tail=50

# Expected: Should show "svc ok 3001" or similar

# 3. Check database has tables
docker-compose exec db psql -U pg -d wt -c '\dt'

# Expected: Should list tables like User, Vendor, etc.

# 4. Test API endpoints
curl http://localhost:3001/healthz  # svc-auth
curl http://localhost:3002/healthz  # svc-catalog
curl http://localhost:3003/healthz  # svc-enquiries
curl http://localhost:3004/healthz  # svc-billing
curl http://localhost:3005/healthz  # svc-vendors
curl http://localhost:3006/healthz  # svc-guests
curl http://localhost:3007/healthz  # svc-payments
curl http://localhost:3000          # web frontend

# All should return 200 OK
```

## Troubleshooting

### If svc-auth Still Fails
```bash
# Check if the package.json was updated
docker-compose exec svc-auth cat /app/apps/svc-auth/package.json

# Should NOT contain @prisma/client in dependencies
# If it does, you need to rebuild the image
```

### If Database Migration Fails
```bash
# Try migrating from any service
docker-compose exec svc-catalog sh -c 'cd /app && pnpm exec prisma migrate deploy'

# Or manually from db container
docker-compose exec db psql -U pg -d wt -c 'CREATE TABLE IF NOT EXISTS "User" (id TEXT PRIMARY KEY);'
```

### If Web Service Is Unhealthy
```bash
# Check web logs
docker-compose logs web --tail=100

# Usually it's waiting for other services
# Make sure all microservices are healthy first
```

## Changes Made to Repository

The following files were modified:

1. **apps/svc-auth/package.json**
   - Removed `@prisma/client` dependency
   - Now matches other service configurations

2. **docker-compose.yml**
   - Updated database healthcheck to specify database name `-d wt`

These changes are compatible with the existing setup and don't break other services.

## Next Steps

After successful deployment:

1. **Set up Nginx** (if not done):
   ```bash
   sudo systemctl status nginx
   sudo nginx -t
   ```

2. **Configure SSL** (if needed):
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Monitor logs**:
   ```bash
   docker-compose logs -f
   ```

4. **Seed initial data** (if needed):
   ```bash
   docker-compose exec web sh -c 'cd /app && node scripts/seed.js'
   ```

## Support

If issues persist after applying these fixes:

1. Check full logs: `docker-compose logs > full-logs.txt`
2. Check system resources: `docker stats`
3. Verify network: `docker network inspect app_default`
4. Check disk space: `df -h`

---
**Last Updated**: 2025-10-25
**Fixed Issues**: svc-auth Prisma Client error, database healthcheck
