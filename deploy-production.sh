#!/usr/bin/env bash

##############################################################################
# Gato Blanco Café - Production Deployment Script
# One-command deployment for serving customers immediately
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="gato-blanco-cafe"
DOMAIN="${DOMAIN:-localhost}"
ENV_FILE=".env"

# ASCII Art Banner
show_banner() {
    echo -e "${CYAN}"
    cat << "EOF"
    ╔═══════════════════════════════════════════════════════════════╗
    ║                    🇨🇴 GATO BLANCO CAFÉ 🇨🇴                     ║
    ║               Premium Colombian Coffee Experience              ║
    ║                 🚀 Production Deployment 🚀                   ║
    ╚═══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# Logging functions
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

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Check system requirements
check_system() {
    log_step "Checking system requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is required but not installed."
        log_info "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        log_success "Docker installed successfully!"
    else
        log_success "Docker is available"
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is required but not installed."
        log_info "Installing Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        log_success "Docker Compose installed successfully!"
    else
        log_success "Docker Compose is available"
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_warning "Node.js not found, will use Docker for build"
    else
        log_success "Node.js is available"
    fi
    
    # Check available ports
    if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warning "Port 80 is in use. Stopping conflicting services..."
        sudo pkill -f nginx || true
        sudo pkill -f apache || true
    fi
    
    if lsof -Pi :443 -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warning "Port 443 is in use. This is normal if SSL is configured."
    fi
}

# Setup environment
setup_environment() {
    log_step "Setting up environment configuration..."
    
    if [ ! -f "$ENV_FILE" ]; then
        log_info "Creating environment file from template..."
        cp .env.example "$ENV_FILE"
        
        # Generate secure passwords
        POSTGRES_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
        REDIS_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
        SECRET_KEY=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
        JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
        
        # Update environment file with secure values
        sed -i "s/your_secure_postgres_password_here/$POSTGRES_PASS/" "$ENV_FILE"
        sed -i "s/your_secure_redis_password_here/$REDIS_PASS/" "$ENV_FILE"
        sed -i "s/your_super_secret_key_here/$SECRET_KEY/" "$ENV_FILE"
        sed -i "s/your_jwt_secret_here/$JWT_SECRET/" "$ENV_FILE"
        
        if [ "$DOMAIN" != "localhost" ]; then
            sed -i "s/DOMAIN=gatoblanco.cafe/DOMAIN=$DOMAIN/" "$ENV_FILE"
        fi
        
        log_success "Environment file created with secure passwords"
    else
        log_success "Environment file already exists"
    fi
}

# Build application
build_application() {
    log_step "Building the application..."
    
    # Create necessary directories
    mkdir -p data/{postgres,redis} logs backups
    
    # Build Docker images
    log_info "Building Docker images..."
    docker build -t $APP_NAME:latest .
    
    log_success "Application built successfully"
}

# Deploy services
deploy_services() {
    log_step "Deploying services..."
    
    # Start the application stack
    log_info "Starting application services..."
    docker-compose up -d
    
    log_success "Services deployed successfully"
}

# Setup SSL (Let's Encrypt)
setup_ssl() {
    if [ "$DOMAIN" != "localhost" ] && [ "$DOMAIN" != "" ]; then
        log_step "Setting up SSL certificate for $DOMAIN..."
        
        # Install certbot if not available
        if ! command -v certbot &> /dev/null; then
            log_info "Installing certbot..."
            sudo apt update
            sudo apt install -y certbot
        fi
        
        # Generate SSL certificate
        sudo certbot certonly --standalone --non-interactive --agree-tos \
            --email "admin@$DOMAIN" \
            -d "$DOMAIN" \
            -d "www.$DOMAIN" || log_warning "SSL setup failed, continuing with HTTP"
        
        # Setup auto-renewal
        echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
        
        log_success "SSL certificate configured"
    else
        log_info "Skipping SSL setup for localhost"
    fi
}

# Health check
perform_health_check() {
    log_step "Performing health check..."
    
    local max_attempts=30
    local attempt=1
    local health_url="http://localhost/health"
    
    log_info "Waiting for application to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f "$health_url" &> /dev/null; then
            log_success "Application is healthy and ready!"
            return 0
        fi
        
        log_info "Attempt $attempt/$max_attempts - waiting for app to be ready..."
        sleep 5
        ((attempt++))
    done
    
    log_error "Health check failed after $max_attempts attempts"
    log_info "Check logs with: docker-compose logs"
    return 1
}

# Display deployment info
show_deployment_info() {
    echo -e "${GREEN}"
    cat << "EOF"
    
    🎉 DEPLOYMENT COMPLETE! 🎉
    
    Your Gato Blanco Café is now LIVE and ready for customers!
    
EOF
    echo -e "${NC}"
    
    echo -e "${CYAN}📍 Access Points:${NC}"
    if [ "$DOMAIN" != "localhost" ]; then
        echo -e "   🌐 Website: https://$DOMAIN"
        echo -e "   🌐 Alt URL: http://$DOMAIN"
    else
        echo -e "   🌐 Website: http://localhost"
    fi
    echo -e "   📱 Mobile: Same URL (PWA-enabled)"
    echo -e "   🔧 Admin: Add ?admin=true to URL"
    
    echo -e "\n${YELLOW}🏪 Business Features:${NC}"
    echo -e "   ☕ Menu with dual pricing (USD/COP)"
    echo -e "   🎯 Gringo services (tourism, classes, events)"
    echo -e "   💳 Payment processing ready"
    echo -e "   📊 Business analytics dashboard"
    echo -e "   🌍 English/Spanish language support"
    echo -e "   📱 Mobile app via PWA installation"
    
    echo -e "\n${BLUE}🚀 Management Commands:${NC}"
    echo -e "   View logs:     docker-compose logs -f"
    echo -e "   Stop services: docker-compose down"
    echo -e "   Restart:       docker-compose restart"
    echo -e "   Backup DB:     ./deploy.sh backup"
    echo -e "   Update app:    ./deploy.sh update"
    
    echo -e "\n${PURPLE}📈 Next Steps:${NC}"
    echo -e "   1. Configure payment methods in admin panel"
    echo -e "   2. Customize menu prices for local market"
    echo -e "   3. Set up social media integration"
    echo -e "   4. Train staff on the system"
    echo -e "   5. Launch marketing campaigns"
    
    echo -e "\n${GREEN}💰 Start serving customers immediately!${NC}"
    echo -e "Your competitive advantage in Zona Rosa is now LIVE! 🇨🇴☕"
}

# Backup database
backup_database() {
    log_step "Creating database backup..."
    
    local backup_file="backups/backup_$(date +%Y%m%d_%H%M%S).sql"
    
    if docker-compose ps database | grep -q "Up"; then
        docker-compose exec -T database pg_dumpall -c -U gato_blanco_user > "$backup_file"
        log_success "Database backup created: $backup_file"
    else
        log_error "Database container is not running"
        exit 1
    fi
}

# Update application
update_application() {
    log_step "Updating application..."
    
    # Pull latest changes (if git repo)
    if [ -d ".git" ]; then
        git pull origin main || log_warning "Git pull failed, continuing with local version"
    fi
    
    # Rebuild and restart
    docker-compose down
    build_application
    deploy_services
    perform_health_check
    
    log_success "Application updated successfully"
}

# Setup monitoring (optional)
setup_monitoring() {
    log_step "Setting up monitoring..."
    
    # Start monitoring services if configured
    if grep -q "prometheus" docker-compose.yml; then
        docker-compose up -d prometheus grafana
        log_success "Monitoring services started"
        log_info "Grafana available at: http://localhost:3000 (admin/admin)"
        log_info "Prometheus available at: http://localhost:9090"
    else
        log_info "Monitoring services not configured"
    fi
}

# Main deployment function
full_deployment() {
    show_banner
    
    log_info "Starting full production deployment..."
    
    check_system
    setup_environment
    build_application
    deploy_services
    setup_ssl
    setup_monitoring
    
    if perform_health_check; then
        show_deployment_info
    else
        log_error "Deployment completed but health check failed"
        log_info "Check logs and try manual troubleshooting"
        exit 1
    fi
}

# Show usage
show_usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  deploy          Full production deployment (default)"
    echo "  check           Check system requirements"
    echo "  build           Build application only"
    echo "  start           Start services"
    echo "  stop            Stop services"
    echo "  restart         Restart services"
    echo "  logs            Show application logs"
    echo "  health          Perform health check"
    echo "  backup          Backup database"
    echo "  update          Update and restart application"
    echo "  ssl             Setup SSL certificate"
    echo "  monitor         Setup monitoring services"
    echo "  info            Show deployment information"
    echo ""
    echo "Options:"
    echo "  --domain DOMAIN    Set custom domain (default: localhost)"
    echo "  --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy --domain gatoblanco.cafe"
    echo "  $0 backup"
    echo "  $0 logs"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --domain)
            DOMAIN="$2"
            shift 2
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            COMMAND="$1"
            shift
            ;;
    esac
done

# Execute command
case "${COMMAND:-deploy}" in
    deploy|full)
        full_deployment
        ;;
    check)
        check_system
        ;;
    build)
        build_application
        ;;
    start)
        deploy_services
        ;;
    stop)
        docker-compose down
        ;;
    restart)
        docker-compose restart
        ;;
    logs)
        docker-compose logs -f
        ;;
    health)
        perform_health_check
        ;;
    backup)
        backup_database
        ;;
    update)
        update_application
        ;;
    ssl)
        setup_ssl
        ;;
    monitor)
        setup_monitoring
        ;;
    info)
        show_deployment_info
        ;;
    *)
        show_usage
        exit 1
        ;;
esac