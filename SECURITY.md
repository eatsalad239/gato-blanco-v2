# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting Security Vulnerabilities

If you discover a security vulnerability in Gato Blanco Café, please report it responsibly:

1. **Do NOT** create a public GitHub issue
2. Email security concerns to: security@gatobalanco.com
3. Include detailed information about the vulnerability
4. Allow up to 48 hours for initial response

## Security Measures Implemented

### Frontend Security
- **Content Security Policy** - Prevents XSS attacks
- **X-Frame-Options** - Prevents clickjacking
- **X-Content-Type-Options** - Prevents MIME sniffing
- **Input Validation** - All user inputs are validated
- **HTTPS Enforcement** - SSL/TLS encryption in production

### Backend Security
- **Environment Variables** - Sensitive data stored securely
- **Database Security** - Parameterized queries prevent SQL injection
- **Authentication** - JWT tokens for secure sessions
- **Rate Limiting** - Prevents brute force attacks
- **CORS Configuration** - Restricts cross-origin requests

### Infrastructure Security
- **Docker Security** - Non-root containers
- **Network Isolation** - Services run in isolated networks
- **Regular Updates** - Dependencies updated regularly
- **Backup Encryption** - All backups are encrypted

### Data Protection
- **PII Encryption** - Personal data encrypted at rest
- **Secure Storage** - Passwords hashed with bcrypt
- **Data Minimization** - Only necessary data collected
- **GDPR Compliance** - Right to deletion implemented

## Production Security Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Configure SSL certificates
- [ ] Set up firewall rules
- [ ] Enable database encryption
- [ ] Configure backup encryption
- [ ] Set up monitoring and alerting
- [ ] Review and update .env file
- [ ] Test disaster recovery procedures

## Incident Response

In case of a security incident:

1. **Immediate Action** - Isolate affected systems
2. **Assessment** - Determine scope and impact
3. **Containment** - Prevent further damage
4. **Recovery** - Restore services safely
5. **Lessons Learned** - Update security measures

## Contact

For security-related questions:
- Email: security@gatobalanco.com
- Response Time: 48 hours maximum
- Encryption: PGP key available upon request