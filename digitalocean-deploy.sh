#!/bin/bash

# Digital Ocean Deployment Script for Gato Blanco Connect
# Run this on your local machine after setting your droplet IP

echo "🐳 Digital Ocean Deployment for Gato Blanco Connect"

# Configuration - UPDATE THESE VALUES
DROPLET_IP="YOUR_DROPLET_IP_HERE"  # e.g., "123.456.789.0"
DROPLET_USER="root"                # Usually "root" or your username

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ "$DROPLET_IP" = "YOUR_DROPLET_IP_HERE" ]; then
    echo -e "${RED}❌ Please edit this script and set your DROPLET_IP${NC}"
    echo -e "${YELLOW}💡 Find your IP in Digital Ocean dashboard${NC}"
    exit 1
fi

# Function to deploy version
deploy_version() {
    local version=$1
    local branch=$2
    local domain=$3

    echo -e "${BLUE}🚀 Deploying ${version}...${NC}"

    # Switch to branch and build
    git checkout $branch
    npm run build

    # Create directory on server
    echo "Creating directory on server..."
    ssh ${DROPLET_USER}@${DROPLET_IP} "sudo mkdir -p /var/www/${domain}"

    # Upload files
    echo "Uploading files..."
    rsync -avz --delete dist/ ${DROPLET_USER}@${DROPLET_IP}:/var/www/${domain}/

    # Configure Nginx
    echo "Configuring Nginx..."
    ssh ${DROPLET_USER}@${DROPLET_IP} "sudo tee /etc/nginx/sites-available/${domain} > /dev/null <<EOF
server {
    listen 80;
    server_name ${domain};

    root /var/www/${domain};
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
}
EOF"

    # Enable site
    ssh ${DROPLET_USER}@${DROPLET_IP} "sudo ln -sf /etc/nginx/sites-available/${domain} /etc/nginx/sites-enabled/ 2>/dev/null || true"
    ssh ${DROPLET_USER}@${DROPLET_IP} "sudo nginx -t && sudo systemctl reload nginx"

    echo -e "${GREEN}✅ ${version} deployed! Access at: http://${domain}${NC}"
}

# Deploy both versions
deploy_version "V2 Premium" "v2-enhancements" "gato-blanco-v2.yourdomain.com"
deploy_version "V3 Nuclear" "v3-nuclear" "gato-blanco-v3.yourdomain.com"

echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo -e "${BLUE}📋 URLs:${NC}"
echo -e "  V2: http://gato-blanco-v2.yourdomain.com"
echo -e "  V3: http://gato-blanco-v3.yourdomain.com"
