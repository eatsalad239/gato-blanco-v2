# 🚀 Gato Blanco Café - Complete Deployment Guide

## 🎯 QUICK START (Launch in 5 minutes!)

### Option 1: Local Docker Deployment
```bash
# 1. Clone or have the project ready
cd gato-blanco-cafe

# 2. Create environment file
cp .env.example .env

# 3. Edit environment variables (optional for local testing)
nano .env

# 4. Build and launch
docker-compose up -d

# 5. Access your café at http://localhost
```

### Option 2: GitHub Pages (Free Hosting)
```bash
# 1. Push to GitHub repository
git add .
git commit -m "Deploy Gato Blanco Café"
git push origin main

# 2. Enable GitHub Pages in repository settings
# 3. Set source to "GitHub Actions"
# 4. Use the workflow file below
```

### Option 3: Production VPS/Cloud
```bash
# 1. On your server (Ubuntu/Debian)
sudo apt update && sudo apt install docker.io docker-compose

# 2. Clone your repository
git clone https://github.com/yourusername/gato-blanco-cafe.git
cd gato-blanco-cafe

# 3. Set production environment
cp .env.example .env
nano .env  # Set real passwords and domain

# 4. Deploy
./deploy.sh
```

## 🔧 DETAILED DEPLOYMENT OPTIONS

### A. Docker Compose (Recommended for Production)

**What you get:**
- ✅ Full application with database
- ✅ Production-ready nginx
- ✅ Redis caching
- ✅ Automatic health checks
- ✅ SSL ready
- ✅ Database backups

**Requirements:**
- Docker & Docker Compose installed
- 2GB RAM minimum
- 10GB disk space

**Commands:**
```bash
# Quick deploy
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Update app
git pull && docker-compose up -d --build

# Backup database
npm run backup:db
```

### B. GitHub Pages (Free Static Hosting)

**What you get:**
- ✅ Free hosting
- ✅ HTTPS included
- ✅ Global CDN
- ⚠️ No backend (uses browser storage)

**Setup:**
1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. Push to GitHub and enable Pages in Settings

### C. Vercel (Easy Deployment)

**What you get:**
- ✅ Free tier available
- ✅ Automatic deployments
- ✅ Global CDN
- ✅ Custom domains

**Setup:**
1. Connect GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

### D. DigitalOcean Droplet

**What you get:**
- ✅ Full control
- ✅ Database included
- ✅ $5/month minimum
- ✅ Root access

**Setup:**
```bash
# 1. Create Ubuntu 22.04 droplet
# 2. SSH into server
ssh root@your-server-ip

# 3. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 4. Clone and deploy
git clone https://github.com/yourusername/gato-blanco-cafe.git
cd gato-blanco-cafe
cp .env.example .env
nano .env  # Set passwords and domain
docker-compose up -d

# 5. Setup domain (optional)
# Point your domain's A record to your droplet's IP
```

## 🌐 DOMAIN & SSL SETUP

### Free Domain Options:
- **Freenom**: .tk, .ml, .ga domains
- **Subdomain**: yourname.github.io (GitHub Pages)
- **Netlify/Vercel**: Free subdomain included

### SSL Certificate (Free with Let's Encrypt):
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (add to crontab)
0 12 * * * /usr/bin/certbot renew --quiet
```

### Update nginx.conf for SSL:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Your existing nginx config...
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## 🔧 ENVIRONMENT CONFIGURATION

### Minimal .env for Local Testing:
```bash
POSTGRES_PASSWORD=localpassword123
REDIS_PASSWORD=localredis123
NODE_ENV=development
```

### Production .env Example:
```bash
# Database (use strong passwords!)
POSTGRES_PASSWORD=YourSuperSecure2024Password!
POSTGRES_USER=gato_blanco_user
POSTGRES_DB=gato_blanco

# Redis
REDIS_PASSWORD=YourRedisPassword2024!

# Application
NODE_ENV=production
DOMAIN=yourdomain.com

# SSL (for Let's Encrypt)
SSL_EMAIL=admin@yourdomain.com

# Security
JWT_SECRET=your-very-long-random-jwt-secret-here-minimum-32-chars
ENCRYPTION_KEY=32-character-encryption-key-here

# Payment (when ready)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# Email notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.business.email@gmail.com
SMTP_PASS=your-app-password

# External APIs
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
WHATSAPP_API_TOKEN=your_whatsapp_business_api_token
```

## 📊 MONITORING & MAINTENANCE

### Check Application Health:
```bash
# Check all services
docker-compose ps

# View application logs
docker-compose logs -f gato-blanco-app

# Check database
docker-compose logs -f database

# Monitor resource usage
docker stats
```

### Backup Strategy:
```bash
# Manual database backup
npm run backup:db

# Automated daily backup (add to crontab)
0 2 * * * cd /path/to/gato-blanco-cafe && npm run backup:db

# Backup files to cloud storage (optional)
# Use rsync, AWS CLI, or similar tools
```

### Security Updates:
```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Docker images
docker-compose pull && docker-compose up -d

# Update application
git pull && docker-compose up -d --build
```

## 🚀 GO-LIVE CHECKLIST

### Before Launch:
- [ ] Set strong passwords in .env
- [ ] Configure domain and SSL
- [ ] Test all features (menu, booking, admin)
- [ ] Setup automated backups
- [ ] Configure email notifications
- [ ] Test mobile PWA installation
- [ ] Verify admin dashboard access

### Post-Launch:
- [ ] Monitor error logs for first 24 hours
- [ ] Test real customer workflows
- [ ] Setup payment processing (Stripe)
- [ ] Configure email confirmations
- [ ] Add contact information
- [ ] Setup Google Analytics (optional)
- [ ] Create social media accounts
- [ ] Plan marketing launch

## 🆘 TROUBLESHOOTING

### Common Issues:

**Port 80 already in use:**
```bash
# Find what's using port 80
sudo lsof -i :80
# Kill the process or change port in docker-compose.yml
```

**Database connection failed:**
```bash
# Check database logs
docker-compose logs database
# Ensure passwords match in .env
```

**Can't access admin:**
```bash
# Admin button is in top-right corner
# No login required - click "🚀 ADMIN" button
```

**PWA not installing:**
```bash
# Convert SVG icons to PNG:
# Use https://cloudconvert.com/svg-to-png
# Upload icon-72.svg, icon-192.svg etc.
# Download PNG files and replace in public/
```

## 💡 COST BREAKDOWN

### Free Options:
- **GitHub Pages**: $0/month (static hosting)
- **Netlify/Vercel Free**: $0/month (static)

### Paid Options:
- **DigitalOcean Droplet**: $5/month (basic)
- **AWS EC2 t3.micro**: ~$8/month
- **Google Cloud Run**: Pay per use (~$5-20/month)
- **Domain**: $10-15/year
- **Email service**: $0-10/month

### Recommended for Café Business:
**DigitalOcean $5/month droplet** = Total cost under $10/month with domain!

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. **Test Everything** (30 minutes)
2. **Add Real Content** (2 hours)
3. **Setup Payment Processing** (4 hours)
4. **Configure Email** (1 hour)
5. **Launch Marketing** (ongoing)

Your café app is now ready to serve real customers! 🚀☕