#!/bin/bash

# Gato Blanco Connect - Production Digital Ocean Deployment
# Complete production setup with SSL, monitoring, and backup

echo "🌊🚀 GATO BLANCO CONNECT - PRODUCTION DEPLOYMENT 🚀🌊"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# ========================================
# CONFIGURATION - UPDATE THESE VALUES
# ========================================
DROPLET_USER="root"           # Usually 'root' or your username
DROPLET_IP=""                 # Your droplet IP (e.g., 123.456.789.0)
DOMAIN=""                     # Your domain (e.g., gatoblanco.app)
EMAIL=""                      # Your email for SSL certificates

# Deployment paths
APP_DIR="/var/www/gato-blanco"
BACKUP_DIR="/var/www/backups"

# ========================================
# FUNCTIONS
# ========================================

check_requirements() {
    echo -e "${BLUE}🔍 Checking requirements...${NC}"

    # Check if values are set
    if [ -z "$DROPLET_IP" ]; then
        echo -e "${RED}❌ Please set DROPLET_IP in the configuration section${NC}"
        exit 1
    fi

    # Check SSH connection
    echo -e "${YELLOW}Testing SSH connection...${NC}"
    if ! ssh -o ConnectTimeout=10 ${DROPLET_USER}@${DROPLET_IP} "echo 'SSH connection successful'" 2>/dev/null; then
        echo -e "${RED}❌ Cannot connect to droplet. Check IP and SSH keys.${NC}"
        exit 1
    fi

    echo -e "${GREEN}✅ Requirements check passed${NC}"
}

setup_server() {
    echo -e "${BLUE}🛠️ Setting up production server...${NC}"

    ssh ${DROPLET_USER}@${DROPLET_IP} "
        # Update system
        sudo apt update && sudo apt upgrade -y

        # Install Node.js 20 LTS
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs

        # Install Nginx
        sudo apt install -y nginx

        # Install PM2 for process management
        sudo npm install -g pm2

        # Install monitoring tools
        sudo apt install -y htop iotop ncdu

        # Create directories
        sudo mkdir -p ${APP_DIR}
        sudo mkdir -p ${BACKUP_DIR}
        sudo chown -R www-data:www-data ${APP_DIR}
        sudo chown -R www-data:www-data ${BACKUP_DIR}

        # Install certbot for SSL
        sudo apt install -y certbot python3-certbot-nginx

        # Configure firewall (optional)
        sudo ufw allow ssh
        sudo ufw allow 'Nginx Full'
        echo 'y' | sudo ufw enable
    "

    echo -e "${GREEN}✅ Production server setup complete${NC}"
}

deploy_app() {
    echo -e "${BLUE}📦 Deploying Gato Blanco Connect...${NC}"

    # Build locally
    echo -e "${YELLOW}Building application locally...${NC}"
    npm run build

    # Backup existing deployment
    echo -e "${YELLOW}Creating backup on server...${NC}"
    ssh ${DROPLET_USER}@${DROPLET_IP} "
        if [ -d '${APP_DIR}/dist' ]; then
            sudo cp -r ${APP_DIR} ${BACKUP_DIR}/backup-\$(date +%Y%m%d_%H%M%S)
            echo 'Backup created at ${BACKUP_DIR}/backup-\$(date +%Y%m%d_%H%M%S)'
        fi
    "

    # Upload files
    echo -e "${YELLOW}Uploading application...${NC}"
    rsync -avz --delete --exclude='node_modules' --exclude='.git' ./ ${DROPLET_USER}@${DROPLET_IP}:${APP_DIR}/

    # Install dependencies on server
    echo -e "${YELLOW}Installing production dependencies...${NC}"
    ssh ${DROPLET_USER}@${DROPLET_IP} "
        cd ${APP_DIR}
        npm ci --production
    "

    # Start with PM2
    echo -e "${YELLOW}Starting application with PM2...${NC}"
    ssh ${DROPLET_USER}@${DROPLET_IP} "
        cd ${APP_DIR}
        pm2 stop gato-blanco 2>/dev/null || true
        pm2 delete gato-blanco 2>/dev/null || true
        pm2 start server.js --name 'gato-blanco' --env production
        pm2 save
        pm2 startup systemd -u ${DROPLET_USER} --hp /home/${DROPLET_USER}
    "

    echo -e "${GREEN}✅ Application deployed${NC}"
}

configure_nginx() {
    echo -e "${BLUE}🌐 Configuring production Nginx...${NC}"

    # Create Nginx configuration
    ssh ${DROPLET_USER}@${DROPLET_IP} "
        sudo tee /etc/nginx/sites-available/gato-blanco > /dev/null <<EOF
# Upstream to Node.js app
upstream gato_blanco_app {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name ${DOMAIN:-_};
    root ${APP_DIR}/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options 'SAMEORIGIN' always;
    add_header X-XSS-Protection '1; mode=block' always;
    add_header X-Content-Type-Options 'nosniff' always;
    add_header Referrer-Policy 'no-referrer-when-downgrade' always;
    add_header Content-Security-Policy \"default-src 'self' http: https: data: blob: 'unsafe-inline'\" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # API proxy to Node.js
    location /api {
        proxy_pass http://gato_blanco_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Handle client routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control 'public, immutable';
        access_log off;
    }

    # Health check
    location /health {
        access_log off;
        return 200 'healthy\\n';
        add_header Content-Type text/plain;
    }
}
EOF

        # Enable site
        sudo ln -sf /etc/nginx/sites-available/gato-blanco /etc/nginx/sites-enabled/
        sudo rm -f /etc/nginx/sites-enabled/default
        sudo nginx -t && sudo systemctl reload nginx
    "

    echo -e "${GREEN}✅ Production Nginx configured${NC}"
}

setup_ssl() {
    if [ -n "$DOMAIN" ] && [ -n "$EMAIL" ]; then
        echo -e "${BLUE}🔒 Setting up SSL certificate...${NC}"

        ssh ${DROPLET_USER}@${DROPLET_IP} "
            sudo certbot --nginx -d ${DOMAIN} --email ${EMAIL} --agree-tos --non-interactive --redirect
        "

        echo -e "${GREEN}✅ SSL certificate installed with auto-redirect${NC}"
    else
        echo -e "${YELLOW}⚠️ SSL setup skipped (domain/email not provided)${NC}"
        echo -e "${YELLOW}💡 To add SSL later: sudo certbot --nginx -d yourdomain.com${NC}"
    fi
}

setup_monitoring() {
    echo -e "${BLUE}📊 Setting up monitoring...${NC}"

    ssh ${DROPLET_USER}@${DROPLET_IP} "
        # Install monitoring
        sudo npm install -g pm2-logrotate
        pm2 install pm2-logrotate
        pm2 set pm2-logrotate:max_size 10M
        pm2 set pm2-logrotate:retain 7
        pm2 set pm2-logrotate:compress true
        pm2 save

        # Create monitoring script
        sudo tee /usr/local/bin/monitor-gato-blanco > /dev/null <<EOF
#!/bin/bash
echo '=== GATO BLANCO MONITORING ==='
echo 'Time: '\$(date)
echo ''
echo '=== PM2 Status ==='
pm2 jlist | jq -r '.[] | \"\\(.name): \\(.pm2_env.status)\"'
echo ''
echo '=== Nginx Status ==='
sudo systemctl is-active nginx
echo ''
echo '=== Disk Usage ==='
df -h / | tail -1
echo ''
echo '=== Memory Usage ==='
free -h
EOF
        sudo chmod +x /usr/local/bin/monitor-gato-blanco
    "

    echo -e "${GREEN}✅ Monitoring setup complete${NC}"
    echo -e "${YELLOW}💡 Monitor with: ssh ${DROPLET_USER}@${DROPLET_IP} 'monitor-gato-blanco'${NC}"
}

final_setup() {
    echo -e "${BLUE}🎯 Final setup and testing...${NC}"

    # Test the deployment
    if [ -n "$DOMAIN" ]; then
        echo -e "${YELLOW}Testing deployment...${NC}"
        curl -k https://${DOMAIN} > /dev/null 2>&1 && echo -e "${GREEN}✅ HTTPS working${NC}" || echo -e "${RED}❌ HTTPS failed${NC}"
        curl http://${DROPLET_IP} > /dev/null 2>&1 && echo -e "${GREEN}✅ HTTP working${NC}" || echo -e "${RED}❌ HTTP failed${NC}"
    else
        curl http://${DROPLET_IP} > /dev/null 2>&1 && echo -e "${GREEN}✅ HTTP working${NC}" || echo -e "${RED}❌ HTTP failed${NC}"
    fi

    # Get server info
    ssh ${DROPLET_USER}@${DROPLET_IP} "
        echo '=== DEPLOYMENT SUMMARY ==='
        echo 'Time: '\$(date)
        echo ''
        echo '=== PM2 Status ==='
        pm2 status
        echo ''
        echo '=== Nginx Status ==='
        sudo systemctl is-active nginx
        echo ''
        echo '=== App Health Check ==='
        curl -s http://localhost:3000/health || echo 'Health check failed'
    "

    echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
    echo -e "${PURPLE}🌐 Access your production app at:${NC}"
    [ -n "$DOMAIN" ] && echo -e "  🔒 HTTPS: https://${DOMAIN}"
    echo -e "  🌐 HTTP:  http://${DROPLET_IP}"
    echo -e "${BLUE}📊 Monitor: ssh ${DROPLET_USER}@${DROPLET_IP} 'monitor-gato-blanco'${NC}"
    echo -e "${BLUE}💾 Logs: ssh ${DROPLET_USER}@${DROPLET_IP} 'pm2 logs gato-blanco'${NC}"
}

# ========================================
# MAIN DEPLOYMENT
# ========================================

echo -e "${PURPLE}🚀 Starting production Digital Ocean deployment...${NC}"

check_requirements
setup_server
deploy_app
configure_nginx
setup_ssl
setup_monitoring
final_setup

echo -e "${GREEN}🎊 GATO BLANCO CONNECT IS LIVE IN PRODUCTION! 🇨🇴🐱🇨🇴${NC}"
echo -e "${YELLOW}🔧 Management commands:${NC}"
echo -e "  Restart: ssh ${DROPLET_USER}@${DROPLET_IP} 'pm2 restart gato-blanco'"
echo -e "  Logs: ssh ${DROPLET_USER}@${DROPLET_IP} 'pm2 logs gato-blanco'"
echo -e "  Monitor: ssh ${DROPLET_USER}@${DROPLET_IP} 'pm2 monit'"


