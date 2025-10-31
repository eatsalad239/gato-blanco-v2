#!/bin/bash

# Gato Blanco Connect Deployment Script
# Deploys both V2 and V3 versions to Digital Ocean droplet

echo "🚀 Starting Gato Blanco Connect Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DROPLET_USER="root"  # Change this to your droplet username
DROPLET_IP=""        # You'll need to provide this
V2_DIR="/var/www/gato-blanco-v2"
V3_DIR="/var/www/gato-blanco-v3"

# Function to deploy version
deploy_version() {
    local version=$1
    local repo_branch=$2
    local deploy_dir=$3
    local domain=$4

    echo -e "${BLUE}📦 Deploying ${version}...${NC}"

    # Build the application
    echo "Building ${version}..."
    git checkout $repo_branch
    npm run build

    # Create deployment directory on server
    echo "Creating deployment directory..."
    ssh ${DROPLET_USER}@${DROPLET_IP} "sudo mkdir -p ${deploy_dir} && sudo chown -R www-data:www-data ${deploy_dir}"

    # Upload built files
    echo "Uploading files..."
    rsync -avz --delete dist/ ${DROPLET_USER}@${DROPLET_IP}:${deploy_dir}/

    # Configure Nginx
    echo "Configuring Nginx..."
    ssh ${DROPLET_USER}@${DROPLET_IP} "sudo tee /etc/nginx/sites-available/${domain} > /dev/null <<EOF
server {
    listen 80;
    server_name ${domain};

    root ${deploy_dir};
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF"

    # Enable site
    ssh ${DROPLET_USER}@${DROPLET_IP} "sudo ln -sf /etc/nginx/sites-available/${domain} /etc/nginx/sites-enabled/"
    ssh ${DROPLET_USER}@${DROPLET_IP} "sudo nginx -t && sudo systemctl reload nginx"

    echo -e "${GREEN}✅ ${version} deployed successfully!${NC}"
    echo -e "${YELLOW}🌐 Access at: http://${domain}${NC}"
}

# Check if droplet IP is provided
if [ -z "$DROPLET_IP" ]; then
    echo -e "${RED}❌ Error: Please set DROPLET_IP in this script${NC}"
    echo -e "${YELLOW}💡 Edit line 13 in deploy.sh with your Digital Ocean droplet IP${NC}"
    exit 1
fi

# Deploy V2
deploy_version "V2 Premium" "v2-enhancements" "$V2_DIR" "gato-blanco-v2.yourdomain.com"

# Deploy V3
deploy_version "V3 Nuclear" "v3-nuclear" "$V3_DIR" "gato-blanco-v3.yourdomain.com"

echo -e "${GREEN}🎉 All deployments completed!${NC}"
echo -e "${BLUE}📋 Summary:${NC}"
echo -e "  V2 Premium: http://gato-blanco-v2.yourdomain.com"
echo -e "  V3 Nuclear: http://gato-blanco-v3.yourdomain.com"