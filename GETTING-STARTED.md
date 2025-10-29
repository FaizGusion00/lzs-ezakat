# 🚀 Getting Started Guide

> **Zakat Selangor - Quick Start for Developers**  
> Author: Faiz Nasir  
> Last Updated: October 29, 2025

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your development machine:

### Required Software

```bash
✅ Docker Desktop 24+ (includes Docker Compose)
✅ Git
✅ Node.js 18+ & npm
✅ PHP 8.2+
✅ Composer 2+
✅ MySQL Client (optional, for direct DB access)
```

### Verify Installation

```bash
# Check versions
docker --version          # Docker version 24.x.x
docker-compose --version  # Docker Compose version 2.x.x
node --version           # v18.x.x or higher
npm --version            # 9.x.x or higher
php --version            # PHP 8.2.x
composer --version       # Composer version 2.x.x
```

---

## 📦 Initial Setup

### 1. Clone the Repository

```bash
# Clone the project
git clone [repository-url]
cd zakat_selangor

# Or if starting fresh (repository already created)
cd zakat_selangor
```

### 2. Start Docker Services

```bash
# Start all services (MySQL, Redis, phpMyAdmin, MinIO, MailHog)
docker-compose up -d

# Check if all containers are running
docker-compose ps

# Expected output:
# NAME                 STATUS              PORTS
# lzs_mysql           Up (healthy)         0.0.0.0:3306->3306/tcp
# lzs_redis           Up (healthy)         0.0.0.0:6379->6379/tcp
# lzs_phpmyadmin      Up                   0.0.0.0:8080->80/tcp
# lzs_minio           Up (healthy)         0.0.0.0:9000-9001->9000-9001/tcp
# lzs_mailhog         Up                   0.0.0.0:1025->1025/tcp, 0.0.0.0:8025->8025/tcp
```

### 3. Access Development Tools

Once Docker services are running, you can access:

| Service | URL | Credentials |
|---------|-----|-------------|
| **phpMyAdmin** | http://localhost:8080 | User: `root`<br/>Password: `root_password_change_me` |
| **MinIO Console** | http://localhost:9001 | User: `minioadmin`<br/>Password: `minioadmin_change_me` |
| **MailHog (Email Testing)** | http://localhost:8025 | No authentication |
| **MySQL (Direct)** | localhost:3306 | User: `lzs_app`<br/>Password: `lzs_password_change_me` |
| **Redis (Direct)** | localhost:6379 | Password: `redis_password_change_me` |

---

## 🔧 Backend Setup (Laravel)

### 1. Create Laravel Project

```bash
# Create backend directory
mkdir -p backend
cd backend

# Install Laravel 11
composer create-project laravel/laravel . "11.*"

# Or if Laravel is already installed globally
laravel new . --force
```

### 2. Configure Environment

```bash
# Copy environment file
cp .env.example .env

# Update .env with database credentials
nano .env
```

Update these values in `.env`:
```ini
APP_NAME="Zakat Selangor"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lzs_zakat_db
DB_USERNAME=lzs_app
DB_PASSWORD=lzs_password_change_me

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=redis_password_change_me
REDIS_PORT=6379

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null

FILESYSTEM_DISK=local
```

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Install Laravel Sanctum (API Authentication)

```bash
composer require laravel/sanctum

php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

php artisan migrate
```

### 5. Install Additional Packages

```bash
# Laravel Telescope (Debugging - optional for development)
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate

# Laravel Pulse (Performance Monitoring)
composer require laravel/pulse
php artisan vendor:publish --provider="Laravel\Pulse\PulseServiceProvider"
php artisan migrate

# Laravel Horizon (Queue Monitoring)
composer require laravel/horizon
php artisan horizon:install

# Spatie Packages (Utilities)
composer require spatie/laravel-permission  # Role & Permission
composer require spatie/laravel-backup      # Automated Backups
```

### 6. Run Migrations

```bash
# Run database migrations
php artisan migrate

# Seed with sample data (optional)
php artisan db:seed
```

### 7. Start Laravel Development Server

```bash
# Start server
php artisan serve

# Server will be available at: http://localhost:8000
```

### 8. Start Queue Worker (Optional)

```bash
# In a new terminal
php artisan queue:work

# Or use Horizon for monitoring
php artisan horizon
```

---

## 💻 Frontend Setup (Next.js)

### 1. Create Next.js Project

```bash
# From project root
cd ..
mkdir -p frontend
cd frontend

# Create Next.js app with TypeScript and Tailwind CSS
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"

# Answer prompts:
# ✔ Would you like to use ESLint? Yes
# ✔ Would you like to use App Router? Yes
# ✔ Would you like to customize the default import alias? No
```

### 2. Install Additional Dependencies

```bash
# UI Components (Shadcn/ui)
npx shadcn-ui@latest init

# State Management & API
npm install @tanstack/react-query axios zustand

# Form Handling
npm install react-hook-form @hookform/resolvers zod

# Date Utilities
npm install date-fns

# Charts
npm install recharts

# Icons
npm install lucide-react
```

### 3. Configure Environment

```bash
# Create environment file
cp .env.example .env.local

# Update .env.local
nano .env.local
```

Add these values:
```ini
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENV=development
```

### 4. Start Development Server

```bash
# Start Next.js dev server
npm run dev

# Application will be available at: http://localhost:3000
```

---

## 🗄️ Database Setup

### 1. Create Database Schema

```bash
cd backend

# Create migration files based on docs/02-DATABASE-SCHEMA.md
# You can manually create migrations or use the SQL DDL directly

# Example: Create users table migration
php artisan make:migration create_users_table

# Edit the migration file and add the schema
# Then run
php artisan migrate
```

### 2. Import Schema (Alternative Method)

If you have a SQL file with the complete schema:

```bash
# Using MySQL client
mysql -h 127.0.0.1 -u lzs_app -p lzs_zakat_db < docs/database-schema.sql

# Or using phpMyAdmin
# 1. Open http://localhost:8080
# 2. Select database 'lzs_zakat_db'
# 3. Go to Import tab
# 4. Choose SQL file
# 5. Click Go
```

### 3. Seed Master Data

```bash
# Create seeder
php artisan make:seeder ProductionSeeder

# Run seeder
php artisan db:seed --class=ProductionSeeder
```

---

## 🧪 Testing the Setup

### Backend API Test

```bash
# Test database connection
php artisan tinker

# In Tinker console:
>>> DB::connection()->getPdo();
>>> DB::select('SELECT DATABASE()');
>>> exit

# Test API endpoint
curl http://localhost:8000/api/health
```

### Frontend Test

```bash
# Visit in browser
open http://localhost:3000

# Should see Next.js welcome page
```

### Docker Services Test

```bash
# Test MySQL
docker-compose exec mysql mysql -u lzs_app -plzs_password_change_me -e "SHOW DATABASES;"

# Test Redis
docker-compose exec redis redis-cli -a redis_password_change_me PING
# Expected: PONG

# View logs
docker-compose logs -f mysql
docker-compose logs -f redis
```

---

## 📁 Project Structure Overview

After setup, your project should look like this:

```
zakat_selangor/
├── docs/                          # ✅ Documentation (already created)
│   ├── 01-SYSTEM-ARCHITECTURE.md
│   ├── 02-DATABASE-SCHEMA.md
│   ├── 03-API-SPECIFICATIONS.md
│   ├── 04-SECURITY.md
│   ├── 05-DEPLOYMENT.md
│   └── diagrams/
├── backend/                       # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── ...
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   ├── .env
│   └── composer.json
├── frontend/                      # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── public/
│   ├── .env.local
│   └── package.json
├── docker/                        # Docker configurations
│   ├── mysql/
│   ├── nginx/
│   └── redis/
├── docker-compose.yml             # ✅ Created
├── .env.example                   # ✅ Created
├── .gitignore                     # ✅ Created
├── README.md                      # ✅ Created
└── GETTING-STARTED.md            # ✅ This file
```

---

## 🔄 Common Commands

### Docker

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service_name]

# Restart a service
docker-compose restart [service_name]

# Rebuild containers
docker-compose up -d --build

# Remove all data (⚠️ WARNING: This deletes all data!)
docker-compose down -v
```

### Laravel

```bash
# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Create migration
php artisan make:migration create_table_name

# Create model with migration
php artisan make:model ModelName -m

# Create controller
php artisan make:controller ControllerName

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run tests
php artisan test
```

### Next.js

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Add Shadcn component
npx shadcn-ui@latest add button
```

---

## 🐛 Troubleshooting

### MySQL Connection Refused

```bash
# Check if MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql

# Test connection
docker-compose exec mysql mysql -u lzs_app -plzs_password_change_me
```

### Redis Connection Error

```bash
# Check if Redis is running
docker-compose ps redis

# Test Redis
docker-compose exec redis redis-cli -a redis_password_change_me PING
```

### Port Already in Use

```bash
# Find process using port 3306
lsof -i :3306

# Kill process (replace PID)
kill -9 PID

# Or change port in docker-compose.yml
# ports:
#   - "3307:3306"  # Use 3307 instead
```

### Laravel Migration Errors

```bash
# Reset database (⚠️ WARNING: This deletes all data!)
php artisan migrate:fresh

# With seeding
php artisan migrate:fresh --seed

# Check migration status
php artisan migrate:status
```

---

## 📚 Next Steps

1. **Read Documentation**: Review all documentation in `/docs` folder
2. **Database Schema**: Implement migrations based on `docs/02-DATABASE-SCHEMA.md`
3. **API Development**: Implement endpoints based on `docs/03-API-SPECIFICATIONS.md`
4. **Frontend Components**: Create UI components using Shadcn/ui
5. **Authentication**: Implement Laravel Sanctum authentication
6. **Payment Integration**: Set up payment gateway integrations
7. **Testing**: Write unit and integration tests

---

## 🆘 Getting Help

### Documentation
- [Laravel Documentation](https://laravel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com)

### Project Documentation
- See `/docs` folder for comprehensive documentation
- ERD Diagrams: `/docs/diagrams/ERD.md`
- System Flow: `/docs/diagrams/SYSTEM-FLOW.md`
- Architecture: `/docs/diagrams/ARCHITECTURE.md`

---

## ✅ Checklist

Before starting development, ensure:

- [ ] Docker services running
- [ ] MySQL accessible via phpMyAdmin
- [ ] Laravel backend running on http://localhost:8000
- [ ] Next.js frontend running on http://localhost:3000
- [ ] Database migrations completed
- [ ] Master data seeded
- [ ] API authentication working
- [ ] Environment variables configured
- [ ] Git repository initialized

---

**Happy Coding! 🎉**

For questions or issues, refer to the documentation or contact the development team.

---

**Document Version**: 1.0.0  
**Last Updated**: October 29, 2025  
**Author**: Faiz Nasir

