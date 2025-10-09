#!/bin/bash

# Quick deployment check script for Gato Blanco Café
# This script verifies that all components are ready for deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🇨🇴 Gato Blanco Café - Deployment Check 🇨🇴${NC}"
echo "================================================"

# Check if build directory exists
if [ -d "dist" ]; then
    echo -e "${GREEN}✓${NC} Build directory exists"
else
    echo -e "${RED}✗${NC} Build directory missing - run 'npm run build'"
    exit 1
fi

# Check if Dockerfile exists
if [ -f "Dockerfile" ]; then
    echo -e "${GREEN}✓${NC} Dockerfile exists"
else
    echo -e "${RED}✗${NC} Dockerfile missing"
    exit 1
fi

# Check if docker-compose.yml exists
if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✓${NC} Docker Compose configuration exists"
else
    echo -e "${RED}✗${NC} docker-compose.yml missing"
    exit 1
fi

# Check if Android app exists
if [ -d "android-app" ]; then
    echo -e "${GREEN}✓${NC} Android app directory exists"
else
    echo -e "${YELLOW}!${NC} Android app directory missing (optional)"
fi

# Check if .env.example exists
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} Environment template exists"
else
    echo -e "${RED}✗${NC} .env.example missing"
    exit 1
fi

# Check if manifest.json exists
if [ -f "manifest.json" ]; then
    echo -e "${GREEN}✓${NC} PWA manifest exists"
else
    echo -e "${RED}✗${NC} manifest.json missing"
    exit 1
fi

# Check if service worker or PWA files exist
if [ -f "public/sw.js" ] || [ -f "dist/sw.js" ]; then
    echo -e "${GREEN}✓${NC} Service worker exists"
else
    echo -e "${YELLOW}!${NC} Service worker missing (recommended for PWA)"
fi

# Check critical files
CRITICAL_FILES=(
    "src/App.tsx"
    "src/index.css"
    "index.html"
    "package.json"
    "nginx.conf"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file missing"
        exit 1
    fi
done

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker is available"
else
    echo -e "${RED}✗${NC} Docker is not installed"
    exit 1
fi

# Check if Docker Compose is available
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker Compose is available"
else
    echo -e "${RED}✗${NC} Docker Compose is not installed"
    exit 1
fi

# Check if Node.js is available
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js is available ($NODE_VERSION)"
else
    echo -e "${RED}✗${NC} Node.js is not installed"
    exit 1
fi

# Check if npm dependencies are installed
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies are installed"
else
    echo -e "${YELLOW}!${NC} Dependencies not installed - run 'npm install'"
fi

# Summary
echo ""
echo -e "${BLUE}📋 Deployment Summary${NC}"
echo "======================"
echo -e "${GREEN}✓${NC} Core application files ready"
echo -e "${GREEN}✓${NC} Docker configuration ready"
echo -e "${GREEN}✓${NC} PWA manifest configured"
echo -e "${GREEN}✓${NC} Environment template available"

echo ""
echo -e "${YELLOW}🚀 Next Steps:${NC}"
echo "1. Copy .env.example to .env and configure"
echo "2. Run: ./deploy.sh full"
echo "3. For Android: Build APK in android-app/ directory"
echo "4. For production: Use docker-compose.prod.yml"

echo ""
echo -e "${GREEN}🎉 Ready for deployment!${NC}"