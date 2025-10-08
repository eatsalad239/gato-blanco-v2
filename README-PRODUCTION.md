# 🚀 Gato Blanco Café - Production Deployment Guide

## Prerequisites

- Docker & Docker Compose installed
- Domain name (optional, can run on localhost)
- SSL certificates (optional, for HTTPS)

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <your-repo>
   cd spark-template
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

3. **Deploy**
   ```bash
   # Make deployment script executable
   chmod +x deploy.sh
   
   # Run deployment
   ./deploy.sh
   ```

4. **Access Application**
   - Frontend: http://localhost
   - Admin Dashboard: Click "ADMIN" button in top-right corner

## What's Included

### ✅ Production Ready Features

- **Docker Multi-stage Build** - Optimized production image
- **Nginx Reverse Proxy** - Static file serving + compression
- **PostgreSQL Database** - Persistent data storage
- **Redis Cache** - Session management and caching
- **Health Checks** - Container monitoring
- **Security Headers** - XSS, CSRF protection
- **SSL Ready** - HTTPS support (certificates needed)

### 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Database      │    │     Redis       │
│   (Nginx)       │    │  (PostgreSQL)   │    │   (Cache)       │
│   Port: 80/443  │    │   Port: 5432    │    │   Port: 6379    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Business Features

### 📊 Full-Stack Dashboard
- **Real-time Analytics** - Orders, revenue, customers
- **Inventory Management** - Stock levels, low stock alerts
- **Customer Management** - Customer profiles, order history
- **Order Processing** - Order status, payment tracking
- **Service Bookings** - Tour bookings, class scheduling
- **Event Management** - Event creation and attendee tracking

### 💳 Payment Processing (Ready for Integration)
- Stripe integration prepared
- Local (COP) and Gringo (USD) pricing
- Payment status tracking
- Automatic receipt generation

### 🌐 Multi-language Support
- English/Spanish interface
- Automatic gringo detection
- Premium pricing for tourists

### 📱 Mobile Optimized
- PWA ready with manifest.json
- Mobile-first responsive design
- Touch-friendly interfaces
- Offline capability

## What You Need to Add

### 🔄 Backend API (Optional Enhancement)
The app currently uses browser storage. For production scale, consider adding:

```javascript
// Example backend structure needed
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── orders.js
│   │   │   ├── customers.js
│   │   │   └── payments.js
│   │   ├── models/
│   │   └── middleware/
│   ├── Dockerfile
│   └── package.json
```

### 💰 Payment Integration
1. **Stripe Setup**
   ```bash
   # Add to .env
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

2. **Colombian Payment Methods**
   - PSE (Pagos Seguros en Línea)
   - Efecty integration
   - Bancolombia API

### 📧 Email Notifications
Add SMTP configuration for:
- Order confirmations
- Booking confirmations
- Low stock alerts
- Daily revenue reports

### 🔒 SSL Certificates
For HTTPS in production:
```bash
# Using Let's Encrypt
certbot certonly --webroot -w /var/www/html -d yourdomain.com
```

### 📈 Monitoring (Optional)
Uncomment in docker-compose.yml:
- Prometheus for metrics
- Grafana for dashboards
- Uptime monitoring

## Security Checklist

- [ ] Change default passwords in .env
- [ ] Configure firewall (ports 80, 443 only)
- [ ] Set up SSL certificates
- [ ] Enable database backups
- [ ] Configure log rotation
- [ ] Set up monitoring alerts

## Scaling Considerations

### Load Balancing
For high traffic, add:
```yaml
# nginx-lb/nginx.conf
upstream app_servers {
    server gato-blanco-app-1:80;
    server gato-blanco-app-2:80;
}
```

### Database Optimization
- Connection pooling
- Read replicas
- Database indexing
- Query optimization

### CDN Integration
- CloudFlare for global delivery
- AWS CloudFront
- Static asset optimization

## Backup Strategy

### Database Backups
```bash
# Daily backup script
docker exec postgres pg_dump -U gato_blanco_user gato_blanco > backup_$(date +%Y%m%d).sql
```

### File Backups
- Application code
- User uploads
- SSL certificates
- Configuration files

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   sudo lsof -i :80
   sudo kill -9 <PID>
   ```

2. **Database Connection Failed**
   ```bash
   docker-compose logs database
   ```

3. **SSL Certificate Issues**
   - Check certificate paths in nginx.conf
   - Verify domain DNS settings

### Performance Tuning

1. **Nginx Optimization**
   - worker_processes auto
   - Enable gzip compression
   - Set proper cache headers

2. **Database Tuning**
   - shared_buffers = 256MB
   - effective_cache_size = 1GB
   - max_connections = 100

## Support

For production support:
1. Check logs: `docker-compose logs -f`
2. Monitor health: `docker-compose ps`
3. Database access: Connect to localhost:5432
4. Redis access: Connect to localhost:6379

## License

This production setup is ready for commercial use. Update branding and terms as needed for your business.