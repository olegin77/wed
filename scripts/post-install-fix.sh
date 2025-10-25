#!/bin/bash
################################################################################
# WeddingTech Post-Installation Fix Script
# 
# Run this script if you encounter issues after installation
#
# Usage: sudo bash scripts/post-install-fix.sh
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_USER="weddingtech"
APP_DIR="/home/${APP_USER}/app"

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

################################################################################
# Fix Functions
################################################################################

fix_ports() {
    log_info "Fixing port conflicts..."
    local ports=(3000 3001 3002 3003 3004 3005 3006 3007 5432 9000 9001)
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            log_warning "Port $port is in use, freeing..."
            lsof -Pi :$port -sTCP:LISTEN -t | xargs kill -9 2>/dev/null || true
            sleep 2
        fi
    done
    
    log_success "Ports checked and freed"
}

fix_database() {
    log_info "Fixing database issues..."
    
    # Check if database is running
    if ! su - "$APP_USER" -c "cd $APP_DIR && docker-compose ps db" | grep -q "Up"; then
        log_info "Starting database..."
        su - "$APP_USER" -c "cd $APP_DIR && docker-compose up -d db"
        sleep 20
    fi
    
    # Check database connection
    if su - "$APP_USER" -c "cd $APP_DIR && docker-compose exec -T db pg_isready -U pg" >/dev/null 2>&1; then
        log_success "Database is accessible"
        
        # Run migrations
        log_info "Running database migrations..."
        if su - "$APP_USER" -c "cd $APP_DIR && docker-compose run --rm svc-auth sh -c 'cd /app && pnpm prisma migrate deploy'"; then
            log_success "Migrations completed"
        else
            log_warning "Migrations failed or no migrations to run"
        fi
    else
        log_error "Cannot connect to database"
        return 1
    fi
}

fix_prisma_client() {
    log_info "Regenerating Prisma Client in all services..."
    
    local services=("svc-auth" "svc-billing" "svc-guests" "svc-payments")
    
    for service in "${services[@]}"; do
        log_info "Generating Prisma Client for $service..."
        if su - "$APP_USER" -c "cd $APP_DIR && docker-compose run --rm $service sh -c 'cd /app && pnpm prisma generate --schema=/app/schema.prisma'" 2>/dev/null; then
            log_success "$service Prisma Client generated"
        else
            log_warning "Failed to generate Prisma Client for $service"
        fi
    done
}

fix_web_service() {
    log_info "Fixing web service..."
    
    # Stop web
    su - "$APP_USER" -c "cd $APP_DIR && docker-compose stop web" 2>/dev/null || true
    
    # Rebuild web
    log_info "Rebuilding web service..."
    if su - "$APP_USER" -c "cd $APP_DIR && docker-compose build --no-cache web"; then
        log_success "Web service rebuilt"
    else
        log_error "Failed to rebuild web service"
        return 1
    fi
    
    # Start web
    log_info "Starting web service..."
    su - "$APP_USER" -c "cd $APP_DIR && docker-compose up -d web"
    
    # Wait and check
    log_info "Waiting for web service to start (60 seconds)..."
    sleep 60
    
    if curl -f -s http://localhost:3000 >/dev/null 2>&1; then
        log_success "Web service is now responding"
    else
        log_warning "Web service still not responding"
        log_info "Check logs with: docker-compose logs web"
    fi
}

fix_nginx() {
    log_info "Checking Nginx configuration..."
    
    # Test config
    if nginx -t 2>/dev/null; then
        log_success "Nginx configuration is valid"
    else
        log_error "Nginx configuration has errors"
        nginx -t
        return 1
    fi
    
    # Restart nginx
    log_info "Restarting Nginx..."
    systemctl restart nginx
    
    if systemctl is-active nginx >/dev/null 2>&1; then
        log_success "Nginx is running"
    else
        log_error "Nginx failed to start"
        return 1
    fi
}

restart_all_services() {
    log_info "Restarting all services..."
    
    su - "$APP_USER" -c "cd $APP_DIR && docker-compose down"
    sleep 5
    su - "$APP_USER" -c "cd $APP_DIR && docker-compose up -d"
    
    log_info "Waiting for services to start (90 seconds)..."
    sleep 90
    
    su - "$APP_USER" -c "cd $APP_DIR && docker-compose ps"
}

show_status() {
    log_info "Current system status:"
    echo ""
    
    # Docker containers
    log_info "Docker Containers:"
    su - "$APP_USER" -c "cd $APP_DIR && docker-compose ps"
    echo ""
    
    # Service endpoints
    log_info "Service Health:"
    local endpoints=(
        "3000:web"
        "3001:svc-auth"
        "3002:svc-catalog"
        "3003:svc-enquiries"
        "3004:svc-billing"
        "3005:svc-vendors"
        "3006:svc-guests"
        "3007:svc-payments"
    )
    
    for endpoint in "${endpoints[@]}"; do
        local port="${endpoint%%:*}"
        local service="${endpoint##*:}"
        if curl -f -s "http://localhost:$port" >/dev/null 2>&1 || curl -f -s "http://localhost:$port/healthz" >/dev/null 2>&1; then
            echo -e "  ${GREEN}✓${NC} $service (port $port)"
        else
            echo -e "  ${RED}✗${NC} $service (port $port)"
        fi
    done
    
    echo ""
    
    # Nginx
    if systemctl is-active nginx >/dev/null 2>&1; then
        echo -e "  ${GREEN}✓${NC} Nginx is running"
    else
        echo -e "  ${RED}✗${NC} Nginx is not running"
    fi
    
    echo ""
}

################################################################################
# Main Menu
################################################################################

main_menu() {
    clear
    echo "=================================="
    echo "WeddingTech Post-Install Fixes"
    echo "=================================="
    echo ""
    echo "1) Show current status"
    echo "2) Fix port conflicts"
    echo "3) Fix database and run migrations"
    echo "4) Regenerate Prisma Client"
    echo "5) Fix web service"
    echo "6) Fix Nginx"
    echo "7) Restart all services"
    echo "8) Run all fixes"
    echo "9) Exit"
    echo ""
    read -p "Select option (1-9): " choice
    
    case $choice in
        1) show_status ;;
        2) fix_ports ;;
        3) fix_database ;;
        4) fix_prisma_client ;;
        5) fix_web_service ;;
        6) fix_nginx ;;
        7) restart_all_services ;;
        8) 
            fix_ports
            fix_database
            fix_prisma_client
            fix_web_service
            fix_nginx
            show_status
            ;;
        9) exit 0 ;;
        *) log_error "Invalid option" ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
    main_menu
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    log_error "This script must be run as root"
    exit 1
fi

# Check if app directory exists
if [ ! -d "$APP_DIR" ]; then
    log_error "Application directory not found: $APP_DIR"
    log_info "Please run the installation script first"
    exit 1
fi

# Run menu
main_menu
