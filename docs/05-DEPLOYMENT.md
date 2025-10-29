# 🚀 Deployment Guide

> **Zakat Selangor - Production Deployment & DevOps**  
> Author: Faiz Nasir  
> Target Environment: Docker + Cloud (AWS/Azure)  
> Version: 1.0.0

---

## 📑 Table of Contents

- [Deployment Overview](#deployment-overview)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Docker Deployment](#docker-deployment)
- [Database Migration](#database-migration)
- [SSL/TLS Configuration](#ssltls-configuration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Logging](#monitoring--logging)
- [Maintenance & Updates](#maintenance--updates)

---

## 🎯 Deployment Overview

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   CloudFlare CDN/WAF                     │
│                  (DDoS Protection + SSL)                 │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   Load Balancer (Nginx)                  │
│                    (SSL Termination)                     │
└─────────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────┴──────────────────┐
        ↓                                      ↓
┌──────────────────┐              ┌──────────────────┐
│  App Server 1    │              │  App Server 2    │
│  (Docker)        │              │  (Docker)        │
│  - Nginx         │              │  - Nginx         │
│  - PHP-FPM       │              │  - PHP-FPM       │
│  - Laravel       │              │  - Laravel       │
└──────────────────┘              └──────────────────┘
        │                                      │
        └──────────────────┬──────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   MySQL Primary (RDS)                    │
│                   + Read Replica                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              Redis (ElastiCache/Cluster)                 │
│              (Cache + Session + Queue)                   │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              S3 / MinIO (Object Storage)                 │
│              (Receipts, Uploads, Backups)                │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

### System Requirements

**Minimum Server Specs**:
```
CPU: 4 cores (8 recommended)
RAM: 8 GB (16 GB recommended)
Storage: 100 GB SSD
OS: Ubuntu 22.04 LTS / Amazon Linux 2023
```

**Software Requirements**:
```
✅ Docker 24+
✅ Docker Compose 2.20+
✅ Git
✅ SSL Certificate (Let's Encrypt or commercial)
```

### Domain & DNS

```
Production:
  - api.zakat-selangor.gov.my → API Server
  - app.zakat-selangor.gov.my → Frontend
  - admin.zakat-selangor.gov.my → Admin Panel

Staging:
  - api-staging.zakat-selangor.gov.my
  - app-staging.zakat-selangor.gov.my
```

---

## ⚙️ Environment Setup

### 1. Clone Repository

```bash
# SSH to production server
ssh deploy@production-server

# Clone repository
cd /var/www
git clone git@github.com:lzs/zakat-selangor.git
cd zakat-selangor
```

### 2. Environment Variables

**Backend (.env)**:
```bash
cd backend
cp .env.example .env
nano .env
```

```ini
# Application
APP_NAME="Zakat Selangor"
APP_ENV=production
APP_KEY=base64:GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://api.zakat-selangor.gov.my

# Database
DB_CONNECTION=mysql
DB_HOST=mysql-primary.xxxxx.rds.amazonaws.com
DB_PORT=3306
DB_DATABASE=lzs_zakat_db
DB_USERNAME=lzs_app
DB_PASSWORD=STRONG_PASSWORD_HERE

# Redis
REDIS_HOST=redis-cluster.xxxxx.cache.amazonaws.com
REDIS_PASSWORD=REDIS_PASSWORD_HERE
REDIS_PORT=6379
REDIS_CLIENT=phpredis

# Queue
QUEUE_CONNECTION=redis
QUEUE_FAILED_DRIVER=database

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis

# Mail
MAIL_MAILER=ses
MAIL_FROM_ADDRESS=noreply@zakat-selangor.gov.my
MAIL_FROM_NAME="Lembaga Zakat Selangor"
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=ap-southeast-1

# SMS
SMS_DRIVER=twilio
TWILIO_SID=
TWILIO_TOKEN=
TWILIO_FROM=

# WhatsApp
WHATSAPP_DRIVER=twilio
WHATSAPP_FROM=

# Payment Gateways
FPX_MERCHANT_ID=
FPX_EXCHANGE_ID=
FPX_SIGNING_KEY=
FPX_CALLBACK_URL=https://api.zakat-selangor.gov.my/api/payments/callback/fpx

IPAY88_MERCHANT_CODE=
IPAY88_MERCHANT_KEY=
IPAY88_CALLBACK_URL=https://api.zakat-selangor.gov.my/api/payments/callback/ipay88

# Storage
FILESYSTEM_DISK=s3
AWS_BUCKET=lzs-zakat-storage
AWS_USE_PATH_STYLE_ENDPOINT=false

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=warning
LOG_SLACK_WEBHOOK_URL=

# Monitoring
TELESCOPE_ENABLED=false # Enable only for debugging
PULSE_ENABLED=true
```

**Frontend (.env.local)**:
```bash
cd frontend
cp .env.example .env.local
nano .env.local
```

```ini
# API
NEXT_PUBLIC_API_URL=https://api.zakat-selangor.gov.my/v1
NEXT_PUBLIC_APP_URL=https://app.zakat-selangor.gov.my

# Environment
NEXT_PUBLIC_ENV=production

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry (error tracking)
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
```

### 3. Generate Application Keys

```bash
cd backend

# Generate Laravel app key
php artisan key:generate

# Generate JWT secret (if using JWT)
php artisan jwt:secret
```

---

## 🐳 Docker Deployment

### Docker Compose Configuration

**docker-compose.prod.yml**:
```yaml
version: '3.8'

services:
  # Nginx Web Server
  nginx:
    image: nginx:alpine
    container_name: lzs_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./backend:/var/www/backend
      - ./frontend/.next:/var/www/frontend/.next
      - ./docker/nginx/conf.d:/etc/nginx/conf.d
      - ./docker/nginx/ssl:/etc/nginx/ssl
      - ./docker/nginx/logs:/var/log/nginx
    depends_on:
      - backend
      - frontend
    networks:
      - lzs_network

  # Laravel Backend (PHP-FPM)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: lzs_backend
    restart: unless-stopped
    working_dir: /var/www/backend
    volumes:
      - ./backend:/var/www/backend
      - ./backend/storage:/var/www/backend/storage
    environment:
      - PHP_OPCACHE_ENABLE=1
      - PHP_MEMORY_LIMIT=512M
    env_file:
      - ./backend/.env
    depends_on:
      - redis
    networks:
      - lzs_network

  # Next.js Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: lzs_frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - ./frontend/.env.local
    networks:
      - lzs_network

  # Laravel Queue Worker
  queue:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: lzs_queue
    restart: unless-stopped
    working_dir: /var/www/backend
    command: php artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
    volumes:
      - ./backend:/var/www/backend
    env_file:
      - ./backend/.env
    depends_on:
      - backend
      - redis
    networks:
      - lzs_network

  # Laravel Scheduler
  scheduler:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: lzs_scheduler
    restart: unless-stopped
    working_dir: /var/www/backend
    command: sh -c "while true; do php artisan schedule:run --verbose --no-interaction & sleep 60; done"
    volumes:
      - ./backend:/var/www/backend
    env_file:
      - ./backend/.env
    depends_on:
      - backend
    networks:
      - lzs_network

  # Redis (Local - use ElastiCache in production)
  redis:
    image: redis:7-alpine
    container_name: lzs_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --requirepass "${REDIS_PASSWORD}"
    volumes:
      - redis_data:/data
    networks:
      - lzs_network

networks:
  lzs_network:
    driver: bridge

volumes:
  redis_data:
    driver: local
```

### Backend Dockerfile

**backend/Dockerfile.prod**:
```dockerfile
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    mysql-client \
    nginx

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql bcmath gd xml

# Install Redis extension
RUN apk add --no-cache pcre-dev $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/backend

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chown -R www-data:www-data /var/www/backend/storage /var/www/backend/bootstrap/cache
RUN chmod -R 775 /var/www/backend/storage /var/www/backend/bootstrap/cache

# Optimize Laravel
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Expose port
EXPOSE 9000

CMD ["php-fpm"]
```

### Frontend Dockerfile

**frontend/Dockerfile.prod**:
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source files
COPY . .

# Build application
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### Deploy with Docker Compose

```bash
# Build and start containers
docker-compose -f docker-compose.prod.yml up -d --build

# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop containers
docker-compose -f docker-compose.prod.yml down
```

---

## 🗄️ Database Migration

### 1. Create Database

```bash
# Connect to MySQL
mysql -h mysql-primary.xxxxx.rds.amazonaws.com -u admin -p

# Create database
CREATE DATABASE lzs_zakat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create app user
CREATE USER 'lzs_app'@'%' IDENTIFIED BY 'strong_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON lzs_zakat_db.* TO 'lzs_app'@'%';
FLUSH PRIVILEGES;

EXIT;
```

### 2. Run Migrations

```bash
cd backend

# Check migration status
php artisan migrate:status

# Run migrations
php artisan migrate --force

# Seed master data
php artisan db:seed --class=ProductionSeeder --force

# Verify
php artisan tinker
>>> \App\Models\User::count();
>>> \App\Models\ZakatType::count();
```

### 3. Backup Before Migration

```bash
# Backup before running migrations
mysqldump -h mysql-primary.xxxxx.rds.amazonaws.com \
    -u admin -p lzs_zakat_db > backup_pre_migration_$(date +%Y%m%d).sql

# If migration fails, restore
mysql -h mysql-primary.xxxxx.rds.amazonaws.com \
    -u admin -p lzs_zakat_db < backup_pre_migration_20251029.sql
```

---

## 🔒 SSL/TLS Configuration

### Option 1: Let's Encrypt (Free)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Obtain certificate
certbot --nginx -d api.zakat-selangor.gov.my -d app.zakat-selangor.gov.my

# Auto-renewal (already configured by certbot)
certbot renew --dry-run

# Certificate location
# /etc/letsencrypt/live/api.zakat-selangor.gov.my/fullchain.pem
# /etc/letsencrypt/live/api.zakat-selangor.gov.my/privkey.pem
```

### Option 2: Commercial SSL

```bash
# Copy certificate files to server
scp fullchain.pem privkey.pem deploy@production:/etc/nginx/ssl/

# Set permissions
chmod 644 /etc/nginx/ssl/fullchain.pem
chmod 600 /etc/nginx/ssl/privkey.pem
```

### Nginx SSL Configuration

**docker/nginx/conf.d/api.conf**:
```nginx
server {
    listen 80;
    server_name api.zakat-selangor.gov.my;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.zakat-selangor.gov.my;
    
    root /var/www/backend/public;
    index index.php;
    
    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Logging
    access_log /var/log/nginx/api_access.log;
    error_log /var/log/nginx/api_error.log;
    
    # PHP-FPM Configuration
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass backend:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          
      - name: Install Dependencies
        run: |
          cd backend
          composer install --prefer-dist --no-progress
          
      - name: Run Tests
        run: |
          cd backend
          php artisan test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/zakat-selangor
            git pull origin main
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml up -d --build
            docker-compose -f docker-compose.prod.yml exec -T backend php artisan migrate --force
            docker-compose -f docker-compose.prod.yml exec -T backend php artisan config:cache
            docker-compose -f docker-compose.prod.yml exec -T backend php artisan route:cache
```

### Manual Deployment Script

**deploy.sh**:
```bash
#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Backend deployment
echo "📦 Deploying backend..."
cd backend
composer install --no-dev --optimize-autoloader
php artisan down
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan up
cd ..

# Frontend deployment
echo "📦 Deploying frontend..."
cd frontend
npm ci --only=production
npm run build
cd ..

# Restart services
echo "🔄 Restarting services..."
docker-compose -f docker-compose.prod.yml restart

echo "✅ Deployment complete!"
```

---

## 📊 Monitoring & Logging

### Laravel Pulse (Performance Monitoring)

```bash
# Install Laravel Pulse
cd backend
composer require laravel/pulse

# Publish configuration
php artisan vendor:publish --provider="Laravel\Pulse\PulseServiceProvider"

# Run migrations
php artisan migrate

# Access dashboard
# https://api.zakat-selangor.gov.my/pulse
```

### Centralized Logging

**docker-compose.prod.yml** (add logging driver):
```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Application Monitoring

```bash
# View real-time logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Monitor resource usage
docker stats

# Check queue status
php artisan queue:monitor redis:default --max=100
```

---

## 🔧 Maintenance & Updates

### Zero-Downtime Deployment

```bash
# Use Laravel Octane for zero-downtime reload
php artisan octane:reload

# Or use graceful restart
docker-compose -f docker-compose.prod.yml exec backend php artisan down --retry=60
# Deploy changes
docker-compose -f docker-compose.prod.yml exec backend php artisan up
```

### Database Maintenance

```bash
# Optimize tables
php artisan db:optimize

# Clear old audit logs (>90 days)
php artisan db:clean-audit-logs

# Archive old payments (>2 years)
php artisan db:archive-payments
```

### Cache Management

```bash
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 📋 Post-Deployment Checklist

- [ ] All containers running (`docker-compose ps`)
- [ ] Database migrations successful
- [ ] SSL certificate valid and auto-renewal configured
- [ ] Environment variables set correctly
- [ ] API endpoints responding (health check)
- [ ] Frontend loads without errors
- [ ] Payment gateway integration tested
- [ ] Email/SMS notifications working
- [ ] Backup system running
- [ ] Monitoring dashboards accessible
- [ ] Error tracking configured (Sentry)
- [ ] Log rotation configured
- [ ] Firewall rules applied
- [ ] DNS records pointing correctly
- [ ] CDN/WAF configured (CloudFlare)
- [ ] Performance testing passed

---

**Document Version**: 1.0.0  
**Last Updated**: October 29, 2025  
**Author**: Faiz Nasir  


