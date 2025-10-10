#!/bin/bash

# Gato Blanco Café - Production Deployment Script
# This script helps deploy the application to production

set -e

echo "🚀 Gato Blanco Café - Production Deployment"
echo "============================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your production values before continuing."
    echo "   Important: Update database passwords, API keys, and domain settings."
    read -p "Press Enter when you've updated the .env file..."
fi

# Create SSL directory for certificates
mkdir -p ssl

# Create necessary directories
mkdir -p logs
mkdir -p backup

# Build and start the application
echo "🔨 Building application..."
docker-compose build --no-cache

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker-compose ps

# Display connection information
echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Application is running at:"
echo "   HTTP:  http://localhost"
echo "   HTTPS: https://localhost (if SSL configured)"
echo ""
echo "📊 Admin Dashboard:"
echo "   Click the ADMIN button in the top-right corner"
echo ""
echo "🗄️  Database access:"
echo "   Host: localhost:5432"
echo "   Database: gato_blanco"
echo "   User: gato_blanco_user"
echo ""
echo "📝 Logs:"
echo "   docker-compose logs -f                 # All services"
echo "   docker-compose logs -f gato-blanco-app # App only"
echo ""
echo "🛠️  Management:"
echo "   docker-compose stop    # Stop services"
echo "   docker-compose start   # Start services"
echo "   docker-compose restart # Restart services"
echo "   docker-compose down    # Stop and remove containers"
echo ""

# Offer to show logs
read -p "Would you like to view the application logs? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose logs -f gato-blanco-app
fi