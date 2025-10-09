#!/bin/bash

# Gato Blanco Café - One Command Production Setup
# Execute this on your production server

echo "🇨🇴 Gato Blanco Café - Production Setup 🇨🇴"
echo "============================================="

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker $USER

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create application directory
echo "📁 Setting up application..."
mkdir -p /opt/gato-blanco-cafe
cd /opt/gato-blanco-cafe

# Download application files (replace with your repository)
echo "⬇️ Downloading application..."
git clone https://github.com/your-username/gato-blanco-cafe.git .

# Set up environment
echo "⚙️ Configuring environment..."
cp .env.example .env

# Generate secure passwords
POSTGRES_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
REDIS_PASS=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
SECRET_KEY=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)

# Update .env with secure values
sed -i "s/your_secure_postgres_password_here/$POSTGRES_PASS/" .env
sed -i "s/your_secure_redis_password_here/$REDIS_PASS/" .env
sed -i "s/your_super_secret_key_here/$SECRET_KEY/" .env

# Create data directories
mkdir -p data/{postgres,redis} logs backups

# Build and start services
echo "🚀 Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost/health; then
    echo "✅ Application is healthy!"
else
    echo "❌ Health check failed. Check logs with: docker-compose logs"
fi

# Set up auto-start
echo "🔄 Setting up auto-start..."
cat > /etc/systemd/system/gato-blanco.service << EOF
[Unit]
Description=Gato Blanco Cafe
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/gato-blanco-cafe
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl enable gato-blanco.service
systemctl start gato-blanco.service

# Set up backup cron job
echo "💾 Setting up automated backups..."
cat > /etc/cron.d/gato-blanco-backup << EOF
0 2 * * * root cd /opt/gato-blanco-cafe && docker-compose exec -T database pg_dumpall -c -U gato_blanco_user > backups/backup_\$(date +\%Y\%m\%d_\%H\%M\%S).sql
EOF

# Configure firewall
echo "🔒 Configuring firewall..."
ufw allow 22/tcp  # SSH
ufw allow 80/tcp  # HTTP
ufw allow 443/tcp # HTTPS
ufw --force enable

echo ""
echo "🎉 DEPLOYMENT COMPLETE! 🎉"
echo ""
echo "🌐 Your Gato Blanco Café is now live!"
echo "📍 Access at: http://$(curl -s ifconfig.me)"
echo "🔧 Admin panel: Add ?admin=true to the URL"
echo ""
echo "📝 Next steps:"
echo "1. Configure your domain name and SSL"
echo "2. Set up payment processing"
echo "3. Customize menu and prices"
echo "4. Train your staff on the system"
echo ""
echo "🚀 Start serving customers immediately!"
echo "🇨🇴 ¡Vamos a vender café! ☕"