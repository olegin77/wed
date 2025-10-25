# 🛠️ WeddingTech Installation Scripts

This directory contains automated installation and maintenance scripts for the WeddingTech platform.

## 📁 Scripts Overview

### 🚀 Production Installation Scripts

#### `auto-install-droplet.sh`
**Full automated installation script for production servers**

- **Purpose**: Complete zero-touch installation on fresh Ubuntu 22.04 servers
- **Duration**: ~15-20 minutes
- **Features**:
  - Automatic dependency installation (Docker, Node.js, pnpm)
  - Repository cloning and configuration
  - Environment setup with secure password generation
  - Docker image building
  - Service deployment
  - Nginx reverse proxy setup
  - SSL certificate installation (Let's Encrypt)
  - Firewall configuration
  - Systemd service setup
  - Automatic backup configuration
  - Health checks and error recovery

**Usage:**
```bash
# Basic usage
curl -fsSL https://raw.githubusercontent.com/YOUR_REPO/wed/main/scripts/auto-install-droplet.sh | bash

# With environment variables
export DOMAIN="yourdomain.com"
export GIT_REPO="https://github.com/YOUR_USERNAME/YOUR_REPO.git"
export GIT_BRANCH="main"
curl -fsSL https://raw.githubusercontent.com/YOUR_REPO/wed/main/scripts/auto-install-droplet.sh | bash
```

**Environment Variables:**
- `DOMAIN` - Your domain name (default: prompts user)
- `GIT_REPO` - Git repository URL (default: https://github.com/olegin77/wed.git)
- `GIT_BRANCH` - Git branch to clone (default: main)

**Logs:** `/var/log/weddingtech-install.log`

---

#### `quick-install.sh`
**Interactive installation wrapper**

- **Purpose**: User-friendly installation with interactive prompts
- **Duration**: ~15-20 minutes
- **Features**:
  - Interactive domain and repository URL prompts
  - Calls `auto-install-droplet.sh` internally
  - Colorful output and progress indicators

**Usage:**
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/YOUR_REPO/wed/main/scripts/quick-install.sh)
```

---

### 🔧 Development Scripts

#### `start-dev-full.sh`
**Start full development environment**

Starts all services in development mode with hot-reload.

**Usage:**
```bash
./scripts/start-dev-full.sh
```

---

#### `stop-dev-full.sh`
**Stop development environment**

Gracefully stops all development services.

**Usage:**
```bash
./scripts/stop-dev-full.sh
```

---

### 🧪 Testing Scripts

#### `smoke.sh`
**Run smoke tests**

Runs basic smoke tests to verify system functionality.

**Usage:**
```bash
./scripts/smoke.sh
```

---

### 📦 Database Scripts

#### `seed.js`
**Database seeding script**

Populates database with initial/test data.

**Usage:**
```bash
npm run prisma:seed
# OR
node scripts/seed.js
```

---

## 🏗️ Installation Architecture

### Automated Installation Flow

```
1. System Check
   ├── Verify Ubuntu 22.04
   ├── Check RAM (min 8GB, creates swap if needed)
   └── Check disk space

2. System Updates
   ├── apt update & upgrade
   └── Install build essentials

3. User Setup
   └── Create 'weddingtech' user

4. Docker Installation
   ├── Install Docker Engine
   ├── Install Docker Compose
   └── Add user to docker group

5. Node.js Installation
   ├── Install Node.js 20.x (NodeSource)
   └── Install pnpm globally

6. Repository Clone
   └── Clone git repository to /home/weddingtech/app

7. Environment Configuration
   ├── Generate .env file
   ├── Create secure passwords
   └── Configure service URLs

8. Dependencies Installation
   ├── pnpm install
   └── prisma generate

9. Docker Build
   └── docker-compose build

10. Service Startup
    ├── docker-compose up -d
    ├── Wait for services
    └── Run database migrations

11. Nginx Configuration
    ├── Install Nginx
    ├── Configure reverse proxy
    └── Enable site

12. SSL Setup
    ├── Install Certbot
    └── Obtain Let's Encrypt certificate

13. Firewall Setup
    └── Configure UFW (ports 22, 80, 443)

14. Systemd Service
    ├── Create weddingtech.service
    └── Enable autostart

15. Backup Configuration
    ├── Create backup script
    └── Configure cron job (daily 2 AM)

16. Health Checks
    ├── Verify containers
    ├── Check endpoints
    └── Review logs
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Docker Build Fails: "Lockfile is not up to date"

**Error:**
```
ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile" 
because pnpm-lock.yaml is not up to date
```

**Solution:**
The automated script handles this by running `pnpm install` before Docker build. If you encounter this manually:

```bash
cd /workspace
pnpm install
git add pnpm-lock.yaml
git commit -m "Update pnpm lockfile"
```

---

#### 2. Port Already in Use

**Error:**
```
Error starting userland proxy: listen tcp 0.0.0.0:3000: bind: address already in use
```

**Solution:**
```bash
# Find and kill process using the port
lsof -i :3000
kill -9 <PID>

# Or stop all Docker containers
docker-compose down
docker-compose up -d
```

---

#### 3. SSL Certificate Failed

**Error:**
```
Certbot failed to authenticate
```

**Solution:**
- Ensure your domain DNS points to the server IP
- Check firewall allows port 80
- Wait 5-10 minutes for DNS propagation
- Run manually: `certbot --nginx -d yourdomain.com`

---

#### 4. Insufficient Memory

**Error:**
```
JavaScript heap out of memory
```

**Solution:**
The script automatically creates a swap file. If needed manually:
```bash
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

#### 5. Database Connection Failed

**Error:**
```
Can't reach database server
```

**Solution:**
```bash
# Check PostgreSQL container
docker-compose ps db
docker-compose logs db

# Restart database
docker-compose restart db

# Wait 30 seconds for initialization
sleep 30
docker-compose exec web pnpm run prisma:migrate deploy
```

---

## 📊 Monitoring

### View Logs

```bash
# All services
docker-compose -f /home/weddingtech/app/docker-compose.yml logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f db

# Installation log
tail -f /var/log/weddingtech-install.log

# System service
journalctl -u weddingtech -f
```

### Check Status

```bash
# Docker containers
docker-compose ps

# System service
systemctl status weddingtech

# Nginx
systemctl status nginx

# Disk usage
df -h

# Memory usage
free -h

# Docker resource usage
docker stats
```

---

## 🔄 Updating the Platform

```bash
# Switch to app user
su - weddingtech
cd ~/app

# Pull latest changes
git pull origin main

# Update dependencies
pnpm install

# Rebuild images
docker-compose build

# Restart services
docker-compose up -d

# Run new migrations
docker-compose exec web pnpm run prisma:migrate deploy

# Check status
docker-compose ps
docker-compose logs -f
```

---

## 🗑️ Uninstallation

To completely remove WeddingTech:

```bash
# Stop and remove containers
su - weddingtech
cd ~/app
docker-compose down -v

# Remove systemd service
sudo systemctl stop weddingtech
sudo systemctl disable weddingtech
sudo rm /etc/systemd/system/weddingtech.service
sudo systemctl daemon-reload

# Remove Nginx configuration
sudo rm /etc/nginx/sites-enabled/weddingtech
sudo rm /etc/nginx/sites-available/weddingtech
sudo systemctl reload nginx

# Remove SSL certificate
sudo certbot delete --cert-name yourdomain.com

# Remove application files (CAREFUL!)
sudo rm -rf /home/weddingtech

# Optional: Remove installed software
sudo apt-get remove --purge nodejs npm docker-ce docker-ce-cli containerd.io
```

---

## 🤝 Contributing

To add new installation scripts:

1. Create script in `/workspace/scripts/`
2. Add shebang: `#!/bin/bash`
3. Make executable: `chmod +x script.sh`
4. Add documentation to this README
5. Test on fresh Ubuntu 22.04 VM
6. Submit pull request

---

## 📞 Support

For issues with installation scripts:

1. Check logs: `/var/log/weddingtech-install.log`
2. Review troubleshooting section above
3. Open issue on GitHub with log output
4. Include OS version: `lsb_release -a`
5. Include Docker version: `docker --version`

---

**Last Updated:** 2025-10-25
