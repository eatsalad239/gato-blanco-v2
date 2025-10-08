#!/bin/bash

# 🚀 Gato Blanco Café - Deployment Verification Script
# This script checks if everything is ready for production deployment

echo "🔍 Gato Blanco Café - Pre-Deployment Check"
echo "=========================================="

ISSUES_FOUND=0

# Check Docker
echo "1. Checking Docker..."
if command -v docker &> /dev/null; then
    echo "   ✅ Docker is installed"
else
    echo "   ❌ Docker is not installed"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check Docker Compose
echo "2. Checking Docker Compose..."
if command -v docker-compose &> /dev/null; then
    echo "   ✅ Docker Compose is installed"
else
    echo "   ❌ Docker Compose is not installed"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Check essential files
echo "3. Checking essential files..."

REQUIRED_FILES=(
    "Dockerfile"
    "docker-compose.yml"
    "nginx.conf"
    "package.json"
    "src/App.tsx"
    "src/index.css"
    "index.html"
    "manifest.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file exists"
    else
        echo "   ❌ $file is missing"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
done

# Check PWA icons
echo "4. Checking PWA icons..."
ICON_SIZES=(72 96 128 144 152 192 384 512)
MISSING_ICONS=0

for size in "${ICON_SIZES[@]}"; do
    if [ -f "public/icon-${size}.svg" ]; then
        echo "   ✅ icon-${size}.svg exists"
    else
        echo "   ⚠️  icon-${size}.svg missing (will use placeholder)"
        MISSING_ICONS=$((MISSING_ICONS + 1))
    fi
done

# Check environment file
echo "5. Checking environment configuration..."
if [ -f ".env" ]; then
    echo "   ✅ .env file exists"
    
    # Check for default passwords
    if grep -q "change_me_in_production" .env; then
        echo "   ⚠️  Default passwords found in .env - UPDATE BEFORE PRODUCTION!"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
        echo "   ✅ .env appears to have custom values"
    fi
else
    echo "   ⚠️  .env file not found - will use defaults"
    echo "   💡 Run: cp .env.example .env"
fi

# Check port availability
echo "6. Checking port availability..."
if lsof -Pi :80 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "   ⚠️  Port 80 is in use - Docker deployment may conflict"
    echo "   💡 Stop other web servers or change port in docker-compose.yml"
else
    echo "   ✅ Port 80 is available"
fi

# Check disk space
echo "7. Checking disk space..."
AVAILABLE_SPACE=$(df / | tail -1 | awk '{print $4}')
if [ "$AVAILABLE_SPACE" -gt 1048576 ]; then  # 1GB in KB
    echo "   ✅ Sufficient disk space available"
else
    echo "   ⚠️  Low disk space - may need more for Docker images"
fi

# Test build
echo "8. Testing application build..."
if [ -f "package.json" ]; then
    echo "   🔨 Attempting npm install..."
    if npm install --silent > /dev/null 2>&1; then
        echo "   ✅ Dependencies installed successfully"
        
        echo "   🔨 Attempting build..."
        if npm run build > /dev/null 2>&1; then
            echo "   ✅ Application builds successfully"
        else
            echo "   ❌ Build failed - check package.json and dependencies"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
    else
        echo "   ❌ npm install failed"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
else
    echo "   ❌ package.json not found"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
echo "📊 DEPLOYMENT READINESS REPORT"
echo "=============================="

if [ $ISSUES_FOUND -eq 0 ]; then
    echo "🎉 EXCELLENT! Your Gato Blanco Café is 100% ready for deployment!"
    echo ""
    echo "🚀 Quick Deploy Commands:"
    echo "   Local:      docker-compose up -d"
    echo "   Production: ./deploy.sh"
    echo ""
    echo "🌐 After deployment, access at:"
    echo "   Local:      http://localhost"
    echo "   Production: http://your-domain.com"
    
elif [ $ISSUES_FOUND -le 2 ]; then
    echo "✅ GOOD! Your café is mostly ready with minor issues."
    echo "   Fix the issues above and you're ready to go!"
    
elif [ $ISSUES_FOUND -le 5 ]; then
    echo "⚠️  NEEDS ATTENTION! Several issues found."
    echo "   Fix the critical issues before deployment."
    
else
    echo "❌ NOT READY! Multiple critical issues found."
    echo "   Please address all issues before attempting deployment."
fi

echo ""
echo "💡 QUICK FIXES:"
echo "   Icons: Use https://favicon.io/favicon-generator/ to create PNG icons"
echo "   Environment: cp .env.example .env && nano .env"
echo "   Dependencies: npm install"
echo "   Build: npm run build"

if [ $MISSING_ICONS -gt 0 ]; then
    echo ""
    echo "🎨 PWA ICON FIX:"
    echo "   1. Visit: https://favicon.io/favicon-generator/"
    echo "   2. Text: 'GB' or '⚡'"
    echo "   3. Background: Blue (#4469ff)"
    echo "   4. Download and replace public/icon-*.png files"
fi

echo ""
echo "📖 Full deployment guide: DEPLOYMENT-GUIDE.md"
echo "🔧 Troubleshooting: Check PRODUCTION-AUDIT.md"

exit $ISSUES_FOUND