#!/usr/bin/env bash

##############################################################################
# Build and deploy script for Gato Blanco Café
# Supports both local Docker and cloud deployment
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="gato-blanco-cafe"
DOCKER_IMAGE="${APP_NAME}:latest"
DOCKER_TAG_PROD="${APP_NAME}:production"
REGISTRY_URL="${REGISTRY_URL:-ghcr.io/your-username}"

# Functions
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

# Check dependencies
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    log_success "All dependencies are available."
}

# Build the application
build_app() {
    log_info "Building the application..."
    
    # Install dependencies
    npm install
    
    # Run tests
    # npm test
    
    # Build the app
    npm run build
    
    log_success "Application build completed."
}

# Build Docker image
build_docker() {
    log_info "Building Docker image: $DOCKER_IMAGE"
    
    docker build -t $DOCKER_IMAGE .
    docker tag $DOCKER_IMAGE $DOCKER_TAG_PROD
    
    log_success "Docker image built successfully."
}

# Run locally with Docker
run_local() {
    log_info "Starting local deployment..."
    
    # Create necessary directories
    mkdir -p data/postgres data/redis
    
    # Start services
    docker-compose up -d
    
    log_success "Application started locally!"
    log_info "Access the app at: http://localhost"
    log_info "View logs with: docker-compose logs -f"
    log_info "Stop with: docker-compose down"
}

# Deploy to production
deploy_production() {
    log_info "Deploying to production..."
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        log_warning "Creating .env file from template..."
        cp .env.example .env
        log_warning "Please edit .env file with your production settings before deploying!"
        exit 1
    fi
    
    # Build and push to registry (if configured)
    if [ ! -z "$REGISTRY_URL" ]; then
        log_info "Pushing to registry: $REGISTRY_URL"
        docker tag $DOCKER_TAG_PROD $REGISTRY_URL/$DOCKER_TAG_PROD
        docker push $REGISTRY_URL/$DOCKER_TAG_PROD
    fi
    
    # Deploy with docker-compose
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
    
    log_success "Production deployment completed!"
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost/health &> /dev/null; then
            log_success "Application is healthy!"
            return 0
        fi
        
        log_info "Attempt $attempt/$max_attempts - waiting for app to be ready..."
        sleep 5
        ((attempt++))
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Backup database
backup_database() {
    log_info "Creating database backup..."
    
    local backup_file="backup_$(date +%Y%m%d_%H%M%S).sql"
    
    if docker-compose ps database | grep -q "Up"; then
        docker-compose exec -T database pg_dumpall -c -U gato_blanco_user > $backup_file
        log_success "Database backup created: $backup_file"
    else
        log_error "Database container is not running"
        exit 1
    fi
}

# Clean up
cleanup() {
    log_info "Cleaning up..."
    
    # Remove unused Docker images
    docker image prune -f
    
    # Remove unused volumes (be careful!)
    # docker volume prune -f
    
    log_success "Cleanup completed."
}

# Show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  check       Check dependencies"
    echo "  build       Build the application"
    echo "  docker      Build Docker image"
    echo "  local       Run locally with Docker"
    echo "  prod        Deploy to production"
    echo "  health      Perform health check"
    echo "  backup      Backup database"
    echo "  cleanup     Clean up Docker resources"
    echo "  logs        Show application logs"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  full        Complete build and deploy workflow"
    echo ""
    echo "Examples:"
    echo "  $0 full       # Complete workflow: check, build, docker, local"
    echo "  $0 prod       # Deploy to production"
    echo "  $0 backup     # Create database backup"
}

# Main script logic
case "${1:-}" in
    check)
        check_dependencies
        ;;
    build)
        build_app
        ;;
    docker)
        build_docker
        ;;
    local)
        run_local
        ;;
    prod)
        deploy_production
        ;;
    health)
        health_check
        ;;
    backup)
        backup_database
        ;;
    cleanup)
        cleanup
        ;;
    logs)
        docker-compose logs -f
        ;;
    stop)
        docker-compose down
        ;;
    restart)
        docker-compose restart
        ;;
    full)
        check_dependencies
        build_app
        build_docker
        run_local
        health_check
        ;;
    *)
        show_usage
        exit 1
        ;;
esac