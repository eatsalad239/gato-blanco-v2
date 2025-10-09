# Gato Blanco Café - Docker & Play Store Setup Guide

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ installed
- Android Studio (for Play Store deployment)

### Local Development
```bash
# Build and run locally
./deploy.sh full

# Or step by step:
./deploy.sh check     # Check dependencies
./deploy.sh build     # Build the app
./deploy.sh docker    # Build Docker image
./deploy.sh local     # Run locally
```

Access your app at: `http://localhost`

## 🐳 Docker Deployment

### Environment Setup
1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your production values:
   - Database passwords
   - Stripe API keys
   - Email configuration
   - Domain settings

### Local Deployment
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Health check
./deploy.sh health
```

### Production Deployment
```bash
# Deploy to production
./deploy.sh prod

# Create database backup
./deploy.sh backup

# Monitor logs
./deploy.sh logs
```

## 📱 Android Play Store Setup

### 1. Build the Android App
The Android app is a TWA (Trusted Web Activity) that wraps your web app:

```bash
cd android-app
./gradlew assembleRelease
```

### 2. Digital Asset Links
Add this to your web app's `/.well-known/assetlinks.json`:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.gatoblanco.cafe",
    "sha256_cert_fingerprints": ["YOUR_RELEASE_KEY_SHA256"]
  }
}]
```

### 3. Generate Release Key
```bash
keytool -genkey -v -keystore gato-blanco-release.keystore -alias gato-blanco -keyalg RSA -keysize 2048 -validity 10000
```

### 4. Sign the APK
```bash
cd android-app
./gradlew assembleRelease -Pandroid.injected.signing.store.file=../gato-blanco-release.keystore -Pandroid.injected.signing.store.password=YOUR_PASSWORD -Pandroid.injected.signing.key.alias=gato-blanco -Pandroid.injected.signing.key.password=YOUR_PASSWORD
```

### 5. Play Store Submission
1. Create Google Play Console account
2. Upload APK/AAB file
3. Fill in store listing:
   - Title: "Gato Blanco Café - Premium Colombian Coffee"
   - Description: "Authentic Colombian coffee experience in Zona Rosa, Medellín"
   - Screenshots: Use the generated ones in `/android-app/screenshots/`
   - Category: Food & Drink

## 🌐 Domain & SSL Setup

### 1. Domain Configuration
Point your domain to your server:
```
A record: gatoblanco.cafe -> YOUR_SERVER_IP
CNAME: www.gatoblanco.cafe -> gatoblanco.cafe
```

### 2. SSL Certificate (Let's Encrypt)
The production setup includes automatic SSL via Traefik:
```yaml
# In docker-compose.prod.yml
traefik:
  - "traefik.http.routers.gato-blanco.tls.certresolver=letsencrypt"
```

## 🔧 Production Configuration

### Required Services
- **Web App**: Main React application
- **Database**: PostgreSQL for persistent data
- **Cache**: Redis for sessions and caching
- **Reverse Proxy**: Traefik for SSL and load balancing
- **Monitoring**: Prometheus + Grafana

### Security Checklist
- [ ] Change all default passwords
- [ ] Configure firewall (ports 80, 443, 22 only)
- [ ] Enable automatic updates
- [ ] Set up database backups
- [ ] Configure monitoring alerts

### Performance Optimization
- [ ] Enable gzip compression
- [ ] Configure CDN for static assets
- [ ] Set up database connection pooling
- [ ] Configure Redis for caching

## 📊 Monitoring & Maintenance

### Health Checks
```bash
# Application health
curl -f http://localhost/health

# Database health
docker-compose exec database pg_isready

# Redis health
docker-compose exec redis redis-cli ping
```

### Backups
```bash
# Create database backup
./deploy.sh backup

# Restore from backup
docker-compose exec -T database psql -U gato_blanco_user -d gato_blanco < backup_file.sql
```

### Log Management
```bash
# View specific service logs
docker-compose logs -f gato-blanco-app
docker-compose logs -f database
docker-compose logs -f redis

# Follow all logs
docker-compose logs -f
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using port 80
   lsof -i :80
   # Kill process if needed
   sudo kill -9 PID
   ```

2. **Database connection issues**
   ```bash
   # Check database logs
   docker-compose logs database
   # Reset database
   docker-compose down -v
   docker-compose up -d
   ```

3. **SSL certificate issues**
   ```bash
   # Check Traefik logs
   docker-compose logs traefik
   # Verify domain DNS
   nslookup gatoblanco.cafe
   ```

### Performance Issues
1. Check resource usage: `docker stats`
2. Monitor database performance: Access Grafana at `http://localhost:3001`
3. Analyze logs for errors: `./deploy.sh logs | grep ERROR`

## 📈 Scaling

### Horizontal Scaling
```yaml
# In docker-compose.prod.yml
gato-blanco-app:
  deploy:
    replicas: 3  # Run 3 instances
```

### Database Scaling
- Consider read replicas for high traffic
- Implement database connection pooling
- Use Redis for session storage

### CDN Integration
- Configure Cloudflare or AWS CloudFront
- Cache static assets
- Optimize images

## 🛡️ Security

### Web Application
- HTTPS only (enforced by Traefik)
- Security headers configured
- Input validation and sanitization
- Rate limiting

### Database
- Encrypted connections
- Regular security updates
- Backup encryption
- Access control

### Android App
- Certificate pinning
- Secure storage
- Runtime application self-protection (RASP)

## 📞 Support

For technical support or questions:
- Check logs: `./deploy.sh logs`
- Health check: `./deploy.sh health`
- Documentation: See README files in each service directory