#!/bin/bash
################################################################################
# WeddingTech Automated Installation Script for Fresh Droplet
# 
# This script automatically installs and configures WeddingTech platform
# on a fresh Ubuntu 22.04 LTS server with automatic error handling.
#
# Usage: 
#   curl -fsSL https://raw.githubusercontent.com/YOUR_REPO/wed/main/scripts/auto-install-droplet.sh | bash
#   OR
#   wget -qO- https://raw.githubusercontent.com/YOUR_REPO/wed/main/scripts/auto-install-droplet.sh | bash
#
# Author: AI Assistant
# Date: 2025-10-25
################################################################################

set -e  # Exit on error
set -u  # Exit on undefined variable

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_USER="weddingtech"
APP_DIR="/home/${APP_USER}/app"
DOMAIN="${DOMAIN:-}" # Set via environment variable or prompt later
GIT_REPO="${GIT_REPO:-https://github.com/olegin77/wed.git}"
GIT_BRANCH="${GIT_BRANCH:-main}"

# Logging
LOG_FILE="/var/log/weddingtech-install.log"
exec 1> >(tee -a "$LOG_FILE")
exec 2>&1

################################################################################
# Helper Functions
################################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root"
        exit 1
    fi
}

check_ubuntu() {
    if ! grep -q "Ubuntu" /etc/os-release; then
        log_error "This script is designed for Ubuntu 22.04 LTS"
        exit 1
    fi
}

retry_command() {
    local max_attempts=3
    local timeout=1
    local attempt=1
    local command="$@"

    while [ $attempt -le $max_attempts ]; do
        log_info "Attempt $attempt of $max_attempts: $command"
        if eval "$command"; then
            return 0
        fi
        log_warning "Command failed. Retrying in $timeout seconds..."
        sleep $timeout
        timeout=$((timeout * 2))
        attempt=$((attempt + 1))
    done

    log_error "Command failed after $max_attempts attempts: $command"
    return 1
}

check_command() {
    if command -v "$1" &> /dev/null; then
        log_success "$1 is installed"
        return 0
    else
        log_warning "$1 is not installed"
        return 1
    fi
}

fix_apt_lock() {
    log_info "Fixing APT lock issues..."
    killall apt apt-get dpkg 2>/dev/null || true
    rm -f /var/lib/apt/lists/lock
    rm -f /var/cache/apt/archives/lock
    rm -f /var/lib/dpkg/lock*
    dpkg --configure -a 2>/dev/null || true
    apt-get clean
    apt-get update
}

################################################################################
# Installation Steps
################################################################################

step1_check_requirements() {
    log_info "Step 1: Checking system requirements..."
    
    check_root
    check_ubuntu
    
    # Check RAM
    local total_ram=$(free -g | awk '/^Mem:/{print $2}')
    if [ "$total_ram" -lt 7 ]; then
        log_warning "Recommended RAM is 8GB, you have ${total_ram}GB"
        log_info "Creating swap file to compensate..."
        
        if [ ! -f /swapfile ]; then
            fallocate -l 4G /swapfile
            chmod 600 /swapfile
            mkswap /swapfile
            swapon /swapfile
            echo '/swapfile none swap sw 0 0' >> /etc/fstab
            log_success "Swap file created"
        fi
    fi
    
    # Check disk space
    local free_space=$(df / | awk 'NR==2 {print $4}')
    if [ "$free_space" -lt 50000000 ]; then  # 50GB in KB
        log_warning "Low disk space. Recommended: 50GB+"
    fi
    
    log_success "System requirements check completed"
}

step2_update_system() {
    log_info "Step 2: Updating system packages..."
    
    export DEBIAN_FRONTEND=noninteractive
    
    if ! retry_command "apt-get update"; then
        fix_apt_lock
        retry_command "apt-get update"
    fi
    
    retry_command "apt-get upgrade -y -o Dpkg::Options::='--force-confdef' -o Dpkg::Options::='--force-confold'"
    retry_command "apt-get install -y curl wget git vim build-essential software-properties-common apt-transport-https ca-certificates gnupg lsb-release"
    
    log_success "System updated successfully"
}

step3_create_user() {
    log_info "Step 3: Creating application user..."
    
    if id "$APP_USER" &>/dev/null; then
        log_warning "User $APP_USER already exists"
    else
        useradd -m -s /bin/bash "$APP_USER"
        log_success "User $APP_USER created"
    fi
    
    # Ensure home directory exists
    mkdir -p "/home/$APP_USER"
    chown -R "$APP_USER:$APP_USER" "/home/$APP_USER"
}

step4_install_docker() {
    log_info "Step 4: Installing Docker..."
    
    if check_command docker; then
        log_info "Docker already installed, checking version..."
        docker --version
    else
        log_info "Installing Docker..."
        
        # Remove old versions
        apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
        
        # Install Docker
        if ! retry_command "curl -fsSL https://get.docker.com -o /tmp/get-docker.sh"; then
            log_error "Failed to download Docker installation script"
            return 1
        fi
        
        sh /tmp/get-docker.sh
        rm /tmp/get-docker.sh
        
        log_success "Docker installed"
    fi
    
    # Add user to docker group
    usermod -aG docker "$APP_USER" || true
    
    # Enable and start Docker
    systemctl enable docker
    systemctl start docker
    
    # Install Docker Compose
    if ! check_command docker-compose; then
        log_info "Installing Docker Compose..."
        apt-get install -y docker-compose
    fi
    
    docker --version
    docker-compose --version
    
    log_success "Docker setup completed"
}

step5_install_nodejs() {
    log_info "Step 5: Installing Node.js 20.x..."
    
    if check_command node; then
        local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$node_version" == "20" ]; then
            log_info "Node.js 20.x already installed"
            node --version
            return 0
        else
            log_warning "Different Node.js version detected, reinstalling..."
        fi
    fi
    
    # Remove old Node.js
    apt-get remove -y nodejs npm 2>/dev/null || true
    
    # Add NodeSource repository
    if ! retry_command "curl -fsSL https://deb.nodesource.com/setup_20.x | bash -"; then
        log_error "Failed to add NodeSource repository"
        return 1
    fi
    
    retry_command "apt-get install -y nodejs"
    
    # Install pnpm
    npm install -g pnpm
    
    node --version
    npm --version
    pnpm --version
    
    log_success "Node.js and pnpm installed"
}

step6_clone_repository() {
    log_info "Step 6: Cloning repository..."
    
    if [ -d "$APP_DIR/.git" ]; then
        log_info "Repository already exists, pulling latest changes..."
        su - "$APP_USER" -c "cd $APP_DIR && git pull origin $GIT_BRANCH"
    else
        log_info "Cloning repository from $GIT_REPO..."
        mkdir -p "$APP_DIR"
        chown "$APP_USER:$APP_USER" "$APP_DIR"
        
        if ! su - "$APP_USER" -c "git clone -b $GIT_BRANCH $GIT_REPO $APP_DIR"; then
            log_error "Failed to clone repository. Check if the repository URL is correct."
            log_info "You can set GIT_REPO environment variable before running this script:"
            log_info "export GIT_REPO=https://github.com/YOUR_USERNAME/YOUR_REPO.git"
            return 1
        fi
    fi
    
    log_success "Repository cloned/updated"
}

step7_configure_environment() {
    log_info "Step 7: Configuring environment variables..."
    
    local env_file="$APP_DIR/.env"
    
    if [ -f "$env_file" ]; then
        log_warning ".env file already exists, backing up..."
        cp "$env_file" "$env_file.backup.$(date +%Y%m%d_%H%M%S)"
    fi
    
    # Generate secure passwords
    local db_password=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
    local minio_password=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
    local nextauth_secret=$(openssl rand -base64 32)
    
    # Prompt for domain if not set
    if [ -z "$DOMAIN" ]; then
        echo ""
        read -p "Enter your domain name (e.g., example.com): " DOMAIN
        if [ -z "$DOMAIN" ]; then
            DOMAIN="localhost"
            log_warning "No domain provided, using localhost"
        fi
    fi
    
    cat > "$env_file" << EOF
# Database
DATABASE_URL=postgresql://pg:${db_password}@db:5432/wt
DB_PASSWORD=${db_password}

# Application
NODE_ENV=production
PORT=3000

# Auth
NEXTAUTH_SECRET=${nextauth_secret}
NEXTAUTH_URL=https://${DOMAIN}

# MinIO Storage
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=${minio_password}

# Service URLs (internal)
AUTH_SERVICE_URL=http://svc-auth:3001
CATALOG_SERVICE_URL=http://svc-catalog:3002
ENQUIRIES_SERVICE_URL=http://svc-enquiries:3003
BILLING_SERVICE_URL=http://svc-billing:3004
VENDORS_SERVICE_URL=http://svc-vendors:3005
GUESTS_SERVICE_URL=http://svc-guests:3006
PAYMENTS_SERVICE_URL=http://svc-payments:3007
EOF
    
    chown "$APP_USER:$APP_USER" "$env_file"
    chmod 600 "$env_file"
    
    log_success "Environment configured"
    log_info "Credentials saved to $env_file"
}

step8_install_dependencies() {
    log_info "Step 8: Installing application dependencies..."
    
    su - "$APP_USER" -c "cd $APP_DIR && pnpm install"
    su - "$APP_USER" -c "cd $APP_DIR && pnpm run prisma:gen"
    
    log_success "Dependencies installed"
}

step9_build_docker_images() {
    log_info "Step 9: Building Docker images..."
    
    if [ ! -f "$APP_DIR/docker-compose.yml" ]; then
        log_error "docker-compose.yml not found in $APP_DIR"
        return 1
    fi
    
    # Build images as app user
    if ! su - "$APP_USER" -c "cd $APP_DIR && docker-compose build"; then
        log_error "Docker build failed. Checking for common issues..."
        
        # Check Docker daemon
        if ! systemctl is-active docker > /dev/null; then
            log_info "Starting Docker daemon..."
            systemctl start docker
            sleep 5
        fi
        
        # Retry build
        log_info "Retrying Docker build..."
        if ! su - "$APP_USER" -c "cd $APP_DIR && docker-compose build --no-cache"; then
            log_error "Docker build failed again. Please check logs above."
            return 1
        fi
    fi
    
    log_success "Docker images built successfully"
}

check_ports_available() {
    log_info "Checking if required ports are available..."
    
    local ports=(3000 3001 3002 3003 3004 3005 3006 3007 5434 9000 9001)
    local occupied_ports=()
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            occupied_ports+=($port)
            log_warning "Port $port is already in use"
            lsof -Pi :$port -sTCP:LISTEN | grep -v "COMMAND" || true
        fi
    done
    
    if [ ${#occupied_ports[@]} -gt 0 ]; then
        log_error "The following ports are occupied: ${occupied_ports[*]}"
        log_info "You can free these ports by stopping the processes using them"
        read -p "Do you want to continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            return 1
        fi
    else
        log_success "All required ports are available"
    fi
    
    return 0
}

wait_for_healthy_containers() {
    local max_wait=300  # 5 minutes
    local wait_interval=10
    local elapsed=0
    
    log_info "Waiting for all containers to become healthy..."
    
    while [ $elapsed -lt $max_wait ]; do
        local unhealthy_count=$(su - "$APP_USER" -c "cd $APP_DIR && docker-compose ps --format json" | grep -c '"Health":"unhealthy"' || echo "0")
        local starting_count=$(su - "$APP_USER" -c "cd $APP_DIR && docker-compose ps --format json" | grep -c '"Health":"starting"' || echo "0")
        
        if [ "$unhealthy_count" -eq 0 ] && [ "$starting_count" -eq 0 ]; then
            log_success "All containers are healthy"
            return 0
        fi
        
        log_info "Still waiting... ($elapsed/$max_wait seconds) - Unhealthy: $unhealthy_count, Starting: $starting_count"
        sleep $wait_interval
        elapsed=$((elapsed + wait_interval))
    done
    
    log_warning "Timeout waiting for containers to become healthy"
    su - "$APP_USER" -c "cd $APP_DIR && docker-compose ps"
    return 1
}

step10_start_services() {
    log_info "Step 10: Starting services..."
    
    # Check ports availability
    if ! check_ports_available; then
        log_error "Cannot proceed with occupied ports"
        return 1
    fi
    
    # Start services
    log_info "Starting Docker Compose services..."
    su - "$APP_USER" -c "cd $APP_DIR && docker-compose up -d"
    
    # Wait for services to become healthy
    if ! wait_for_healthy_containers; then
        log_warning "Some containers may not be healthy. Checking logs..."
        su - "$APP_USER" -c "cd $APP_DIR && docker-compose logs --tail=20"
    fi
    
    # Check service status
    log_info "Current service status:"
    su - "$APP_USER" -c "cd $APP_DIR && docker-compose ps"
    
    # Initialize database with retries
    log_info "Initializing database..."
    local max_db_attempts=3
    local db_attempt=1
    
    while [ $db_attempt -le $max_db_attempts ]; do
        log_info "Database migration attempt $db_attempt of $max_db_attempts"
        
        # Try migration through svc-auth service (it has Prisma installed)
        if su - "$APP_USER" -c "cd $APP_DIR && docker-compose exec -T svc-auth sh -c 'cd /app && pnpm exec prisma migrate deploy'"; then
            log_success "Database initialized successfully"
            
            # Verify tables exist
            if su - "$APP_USER" -c "cd $APP_DIR && docker-compose exec -T db psql -U pg -d wt -c '\dt' | grep -q 'User'"; then
                log_success "Database tables verified"
                break
            else
                log_warning "Migration succeeded but tables not found, retrying..."
            fi
        else
            log_warning "Database migration failed on attempt $db_attempt"
        fi
        
        if [ $db_attempt -eq $max_db_attempts ]; then
            log_error "Database migration failed after $max_db_attempts attempts"
            log_info "You can manually run: docker-compose exec svc-auth sh -c 'cd /app && pnpm exec prisma migrate deploy'"
            return 1
        fi
        
        db_attempt=$((db_attempt + 1))
        sleep 10
    done
    
    # Check web container specifically
    log_info "Checking web container status..."
    local web_status=$(su - "$APP_USER" -c "cd $APP_DIR && docker-compose ps web --format '{{.Status}}'" || echo "not running")
    
    if echo "$web_status" | grep -qi "unhealthy"; then
        log_warning "Web container is unhealthy, checking logs..."
        su - "$APP_USER" -c "cd $APP_DIR && docker-compose logs --tail=50 web"
        
        log_info "Attempting to rebuild web container..."
        su - "$APP_USER" -c "cd $APP_DIR && docker-compose build --no-cache web"
        su - "$APP_USER" -c "cd $APP_DIR && docker-compose up -d web"
        
        log_info "Waiting for web container to start..."
        sleep 30
        
        web_status=$(su - "$APP_USER" -c "cd $APP_DIR && docker-compose ps web --format '{{.Status}}'" || echo "not running")
        if echo "$web_status" | grep -qi "unhealthy"; then
            log_error "Web container still unhealthy after rebuild. Please check logs manually."
            return 1
        fi
    fi
    
    log_success "Services started successfully"
}

step11_configure_nginx() {
    log_info "Step 11: Configuring Nginx reverse proxy..."
    
    # Check if port 3000 is accessible
    log_info "Verifying port 3000 is accessible..."
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            log_success "Port 3000 is accessible"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            log_error "Port 3000 is not accessible after $max_attempts attempts"
            log_info "Checking web container status..."
            su - "$APP_USER" -c "cd $APP_DIR && docker-compose logs --tail=50 web"
            return 1
        fi
        
        log_info "Waiting for port 3000 to become accessible (attempt $attempt/$max_attempts)..."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    if ! check_command nginx; then
        apt-get install -y nginx
    fi
    
    local nginx_config="/etc/nginx/sites-available/weddingtech"
    
    cat > "$nginx_config" << 'EOF'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    client_max_body_size 100M;

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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF
    
    # Replace domain placeholder
    sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" "$nginx_config"
    
    # Enable site
    ln -sf "$nginx_config" /etc/nginx/sites-enabled/weddingtech
    rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload
    if nginx -t; then
        systemctl enable nginx
        systemctl restart nginx
        log_success "Nginx configured"
        
        # Verify nginx is proxying correctly
        log_info "Testing nginx proxy..."
        sleep 2
        if curl -f http://localhost > /dev/null 2>&1; then
            log_success "Nginx proxy is working correctly"
        else
            log_warning "Nginx proxy may not be working correctly. Check logs with: journalctl -u nginx -n 50"
        fi
    else
        log_error "Nginx configuration test failed"
        return 1
    fi
}

step12_configure_ssl() {
    log_info "Step 12: Configuring SSL certificate..."
    
    if [ "$DOMAIN" == "localhost" ] || [ -z "$DOMAIN" ]; then
        log_warning "Skipping SSL setup for localhost"
        return 0
    fi
    
    # Install certbot
    if ! check_command certbot; then
        apt-get install -y certbot python3-certbot-nginx
    fi
    
    # Get certificate
    log_info "Obtaining SSL certificate for $DOMAIN..."
    log_warning "Make sure your domain DNS points to this server's IP!"
    
    if certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN"; then
        log_success "SSL certificate obtained"
    else
        log_warning "SSL certificate installation failed. You can run it manually later:"
        log_info "certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    fi
}

step13_configure_firewall() {
    log_info "Step 13: Configuring firewall..."
    
    if check_command ufw; then
        # Allow necessary ports
        ufw allow 22/tcp comment 'SSH'
        ufw allow 80/tcp comment 'HTTP'
        ufw allow 443/tcp comment 'HTTPS'
        
        # Enable firewall
        echo "y" | ufw enable
        
        ufw status
        log_success "Firewall configured"
    else
        log_warning "UFW not available, skipping firewall configuration"
    fi
}

step14_configure_systemd() {
    log_info "Step 14: Configuring systemd service..."
    
    local service_file="/etc/systemd/system/weddingtech.service"
    
    cat > "$service_file" << EOF
[Unit]
Description=WeddingTech Platform
After=docker.service network-online.target
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
User=$APP_USER
Group=$APP_USER
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
    
    systemctl daemon-reload
    systemctl enable weddingtech
    
    log_success "Systemd service configured"
}

step15_configure_backups() {
    log_info "Step 15: Configuring automatic backups..."
    
    local backup_dir="/home/$APP_USER/backups"
    local backup_script="/home/$APP_USER/backup-db.sh"
    
    mkdir -p "$backup_dir"
    chown "$APP_USER:$APP_USER" "$backup_dir"
    
    cat > "$backup_script" << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/weddingtech/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="wt"

cd /home/weddingtech/app
docker-compose exec -T db pg_dump -U pg $DB_NAME | gzip > $BACKUP_DIR/db_${DATE}.sql.gz

# Delete backups older than 30 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete

echo "Backup created: db_${DATE}.sql.gz"
EOF
    
    chmod +x "$backup_script"
    chown "$APP_USER:$APP_USER" "$backup_script"
    
    # Add to crontab
    (crontab -u "$APP_USER" -l 2>/dev/null; echo "0 2 * * * $backup_script >> $backup_dir/backup.log 2>&1") | crontab -u "$APP_USER" -
    
    log_success "Backup configured (daily at 2 AM)"
}

step16_health_check() {
    log_info "Step 16: Running comprehensive health checks..."
    
    # Check Docker containers
    log_info "Checking Docker containers status..."
    su - "$APP_USER" -c "cd $APP_DIR && docker-compose ps"
    
    # Check each service health
    log_info "Checking individual service health..."
    local services=("svc-auth:3001" "svc-catalog:3002" "svc-enquiries:3003" "svc-billing:3004" "svc-vendors:3005" "svc-guests:3006" "svc-payments:3007" "web:3000")
    local failed_services=()
    
    for service in "${services[@]}"; do
        local name="${service%%:*}"
        local port="${service##*:}"
        
        if curl -f http://localhost:$port/healthz > /dev/null 2>&1 || curl -f http://localhost:$port > /dev/null 2>&1; then
            log_success "$name is responding on port $port"
        else
            log_warning "$name is NOT responding on port $port"
            failed_services+=($name)
        fi
    done
    
    # Check database connectivity
    log_info "Checking database connectivity..."
    if su - "$APP_USER" -c "cd $APP_DIR && docker-compose exec -T db psql -U pg -d wt -c 'SELECT 1' > /dev/null 2>&1"; then
        log_success "Database is accessible"
        
        # Check if tables exist
        local table_count=$(su - "$APP_USER" -c "cd $APP_DIR && docker-compose exec -T db psql -U pg -d wt -c '\dt' | grep -c 'table' || echo '0'")
        if [ "$table_count" -gt 0 ]; then
            log_success "Database has $table_count tables"
        else
            log_error "Database has no tables! Migration may have failed."
            failed_services+=("database-migration")
        fi
    else
        log_error "Database is NOT accessible"
        failed_services+=("database")
    fi
    
    # Check nginx
    if systemctl is-active nginx > /dev/null 2>&1; then
        log_success "Nginx is running"
        
        if curl -f http://localhost > /dev/null 2>&1; then
            log_success "Nginx proxy is working"
        else
            log_warning "Nginx is running but proxy may not be working"
        fi
    else
        log_warning "Nginx is not running"
    fi
    
    # Check disk space
    local disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ "$disk_usage" -gt 80 ]; then
        log_warning "Disk usage is at ${disk_usage}%"
    else
        log_success "Disk usage is at ${disk_usage}%"
    fi
    
    # Check memory
    local mem_free=$(free -m | awk 'NR==2 {print $7}')
    if [ "$mem_free" -lt 500 ]; then
        log_warning "Low free memory: ${mem_free}MB"
    else
        log_success "Available memory: ${mem_free}MB"
    fi
    
    # Check logs for critical errors
    log_info "Checking for critical errors in logs..."
    if su - "$APP_USER" -c "cd $APP_DIR && docker-compose logs --tail=100 | grep -i 'fatal\|critical'" > /tmp/critical_errors.log 2>&1; then
        if [ -s /tmp/critical_errors.log ]; then
            log_error "Critical errors found in logs:"
            head -10 /tmp/critical_errors.log
        fi
    fi
    
    # Summary
    log_info ""
    log_info "========== HEALTH CHECK SUMMARY =========="
    if [ ${#failed_services[@]} -eq 0 ]; then
        log_success "All services are healthy! ✓"
    else
        log_error "The following services have issues: ${failed_services[*]}"
        log_info "Please check the logs for these services:"
        for failed in "${failed_services[@]}"; do
            log_info "  docker-compose -f $APP_DIR/docker-compose.yml logs --tail=50 $failed"
        done
    fi
    log_info "=========================================="
    
    log_success "Health checks completed"
}

################################################################################
# Troubleshooting Guide
################################################################################

print_troubleshooting_guide() {
    cat << 'TROUBLESHOOTING'

================================================================================
                         TROUBLESHOOTING GUIDE
================================================================================

If you encounter issues, here are common problems and solutions:

1. DATABASE HAS NO TABLES
   Symptom: Services start but APIs return errors
   Solution:
   ```
   docker-compose -f /home/weddingtech/app/docker-compose.yml exec svc-auth sh -c 'cd /app && pnpm exec prisma migrate deploy'
   ```

2. WEB SERVICE UNHEALTHY
   Symptom: web container shows as unhealthy
   Solution:
   ```
   docker-compose -f /home/weddingtech/app/docker-compose.yml logs --tail=50 web
   # If build errors, rebuild:
   docker-compose -f /home/weddingtech/app/docker-compose.yml build --no-cache web
   docker-compose -f /home/weddingtech/app/docker-compose.yml up -d web
   ```

3. NGINX NOT PROXYING
   Symptom: curl http://localhost works but external IP doesn't respond
   Solution:
   - Check nginx status: systemctl status nginx
   - Test config: nginx -t
   - Check logs: journalctl -u nginx -n 50
   - Verify port 3000: curl http://localhost:3000

4. PORT ALREADY IN USE
   Symptom: Error "port already in use"
   Solution:
   ```
   # Find process using port
   sudo lsof -i :3000
   # Kill process if needed
   sudo kill -9 <PID>
   ```

5. SERVICES NOT STARTING
   Solution:
   ```
   # Check all services
   docker-compose -f /home/weddingtech/app/docker-compose.yml ps
   # Check specific service logs
   docker-compose -f /home/weddingtech/app/docker-compose.yml logs --tail=100 <service-name>
   # Restart services
   docker-compose -f /home/weddingtech/app/docker-compose.yml restart
   ```

6. OUT OF MEMORY
   Solution: The script automatically creates swap, but you can increase it:
   ```
   sudo fallocate -l 8G /swapfile2
   sudo chmod 600 /swapfile2
   sudo mkswap /swapfile2
   sudo swapon /swapfile2
   ```

For more help, check:
- Installation log: /var/log/weddingtech-install.log
- Docker logs: docker-compose -f /home/weddingtech/app/docker-compose.yml logs -f
================================================================================

TROUBLESHOOTING
}

################################################################################
# Main Installation Flow
################################################################################

main() {
    log_info "=========================================="
    log_info "WeddingTech Automated Installation"
    log_info "=========================================="
    log_info "Starting at $(date)"
    log_info ""
    
    # Run installation steps
    step1_check_requirements || { log_error "Step 1 failed"; exit 1; }
    step2_update_system || { log_error "Step 2 failed"; exit 1; }
    step3_create_user || { log_error "Step 3 failed"; exit 1; }
    step4_install_docker || { log_error "Step 4 failed"; exit 1; }
    step5_install_nodejs || { log_error "Step 5 failed"; exit 1; }
    step6_clone_repository || { log_error "Step 6 failed"; exit 1; }
    step7_configure_environment || { log_error "Step 7 failed"; exit 1; }
    step8_install_dependencies || { log_error "Step 8 failed"; exit 1; }
    step9_build_docker_images || { log_error "Step 9 failed"; exit 1; }
    step10_start_services || { log_error "Step 10 failed"; print_troubleshooting_guide; exit 1; }
    step11_configure_nginx || { log_error "Step 11 failed"; print_troubleshooting_guide; exit 1; }
    step12_configure_ssl || log_warning "Step 12 completed with warnings"
    step13_configure_firewall || log_warning "Step 13 completed with warnings"
    step14_configure_systemd || { log_error "Step 14 failed"; exit 1; }
    step15_configure_backups || log_warning "Step 15 completed with warnings"
    step16_health_check || log_warning "Step 16 completed with warnings"
    
    log_info ""
    log_info "=========================================="
    log_success "Installation completed successfully!"
    log_info "=========================================="
    log_info ""
    log_info "🎉 Your WeddingTech platform is now running!"
    log_info ""
    log_info "📍 Access your application at:"
    if [ "$DOMAIN" == "localhost" ]; then
        log_info "   http://localhost"
    else
        log_info "   https://$DOMAIN"
    fi
    log_info ""
    log_info "📋 Important files:"
    log_info "   - Application: $APP_DIR"
    log_info "   - Environment: $APP_DIR/.env"
    log_info "   - Logs: $LOG_FILE"
    log_info "   - Backups: /home/$APP_USER/backups"
    log_info ""
    log_info "🔧 Useful commands:"
    log_info "   - View logs: docker-compose -f $APP_DIR/docker-compose.yml logs -f"
    log_info "   - Check status: docker-compose -f $APP_DIR/docker-compose.yml ps"
    log_info "   - Restart: systemctl restart weddingtech"
    log_info ""
    log_info "⚠️  Don't forget to:"
    log_info "   1. Review and secure $APP_DIR/.env"
    log_info "   2. Update your domain DNS to point to this server"
    log_info "   3. Configure your application settings"
    log_info ""
    log_info "Installation log saved to: $LOG_FILE"
    log_info "Completed at $(date)"
    log_info ""
    log_info "💡 If you encounter any issues, run this command to see the troubleshooting guide:"
    log_info "   cat $LOG_FILE | grep -A 100 'TROUBLESHOOTING GUIDE'"
}

# Run main installation
main "$@"
