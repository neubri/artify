# 🚀 Artify Backend - Deployment Guide

## 🏗️ Production Deployment Checklist

### 📋 Pre-deployment Steps

#### 1. Environment Setup

```bash
# Copy and configure environment variables
cp .env.example .env

# Update production values
NODE_ENV=production
PORT=3001
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=artify_production
DB_USERNAME=your_db_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_very_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
SOCKET_CORS_ORIGIN=https://your-frontend-domain.com
```

#### 2. Database Setup

```bash
# Install dependencies
npm install --production

# Setup database
npm run db:create
npm run db:migrate
npm run db:seed
```

#### 3. Security Checklist

- ✅ Strong JWT secret (32+ characters)
- ✅ Secure database password
- ✅ CORS origins configured for your domain
- ✅ Environment variables properly set
- ✅ No sensitive data in code
- ✅ HTTPS enabled (recommended)

---

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S artify -u 1001

# Change ownership
USER artify

EXPOSE 3001

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./.env:/app/.env

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: artify_production
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

---

## ☁️ Cloud Platform Deployment

### Heroku

```bash
# Install Heroku CLI and login
heroku create artify-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set GEMINI_API_KEY=your_api_key

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku main

# Run migrations
heroku run npm run db:migrate
heroku run npm run db:seed
```

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Set environment variables in Railway dashboard
```

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set run command: `npm start`
4. Configure environment variables
5. Add PostgreSQL database component

---

## 🔧 Production Configuration

### Environment Variables Required

```env
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=artify_production
DB_USERNAME=postgres
DB_PASSWORD=secure_password
JWT_SECRET=your_jwt_secret_minimum_32_chars
SOCKET_CORS_ORIGIN=https://yourdomain.com
GEMINI_API_KEY=your_gemini_api_key
```

### PM2 Process Manager (Linux/VPS)

```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'artify-backend',
    script: 'bin/www',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

---

## 🔍 Health Monitoring

### Basic Health Check

```bash
curl https://your-domain.com/api/health
```

### Expected Response

```json
{
  "success": true,
  "message": "Artify API is running!",
  "timestamp": "2025-07-31T03:00:00.000Z",
  "version": "1.0.0"
}
```

### Monitoring Endpoints

- `GET /api/health` - Basic health check
- `GET /api` - API information
- WebSocket connection: `wss://your-domain.com`

---

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Failed

```bash
# Check database status
pg_isready -h localhost -p 5432

# Test connection
psql -h localhost -U postgres -d artify_production
```

#### Port Already in Use

```bash
# Find process using port
lsof -ti:3001

# Kill process
kill -9 $(lsof -ti:3001)
```

#### Permission Errors

```bash
# Fix file permissions
chmod +x bin/www
chown -R node:node /app
```

### Logs

```bash
# View application logs
tail -f logs/app.log

# PM2 logs
pm2 logs artify-backend

# Docker logs
docker logs container_name
```

---

## 📊 Performance Optimization

### Production Tweaks

- Enable gzip compression
- Use Redis for session storage
- Implement rate limiting
- Add request logging
- Configure CORS properly
- Use HTTPS

### Database Optimization

- Add database indexes
- Use connection pooling
- Configure query timeout
- Monitor slow queries

---

## 🔐 Security Best Practices

### Application Security

- ✅ Input validation and sanitization
- ✅ JWT token expiration
- ✅ Rate limiting implemented
- ✅ CORS configured
- ✅ Environment variables secured
- ✅ No hardcoded secrets

### Infrastructure Security

- Use HTTPS/SSL certificates
- Configure firewall rules
- Regular security updates
- Monitor access logs
- Backup database regularly

---

## 📞 Support

For deployment support:

- Check API documentation: `API_DOCUMENTATION.md`
- Review application logs
- Test endpoints with health checks
- Monitor database connections

**Last Updated:** July 31, 2025
**Version:** 1.0.0
