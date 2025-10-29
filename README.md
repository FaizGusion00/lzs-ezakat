# 🕌 Sistem Kutipan Zakat Selangor (LZS)

> **Professional End-to-End Digital Zakat Collection Platform**  
> Author: **Faiz Nasir**  
> Date: October 29, 2025

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [System Objectives](#system-objectives)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Getting Started](#getting-started)

---

## 🎯 Project Overview

Sistem Kutipan Zakat Selangor adalah platform digital end-to-end yang direka untuk:

- ✅ Memudahkan pembayaran zakat secara digital
- ✅ Pengurusan data pembayar yang sistematik
- ✅ Integrasi gateway pembayaran yang selamat
- ✅ Laporan dan analitik yang komprehensif
- ✅ Pematuhan Syariah dan audit trail yang lengkap

---

## 🎯 System Objectives

1. **Kemudahan Pembayar** - Memudahkan individu & syarikat menunaikan zakat dengan cepat & selamat
2. **Pengurangan Kos** - Mengurangkan kos operasi kutipan manual
3. **Ketelusan** - Menjamin ketelusan & audit compliance (Syariah, ISO, dan data)
4. **Pelaporan Pantas** - Mempercepat laporan kepada pengurusan & Majlis Agama

---

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: Zustand / React Query
- **Form Handling**: React Hook Form + Zod

### Backend
- **Framework**: Laravel 11+
- **API**: RESTful API
- **Authentication**: Laravel Sanctum / Passport
- **Queue**: Redis
- **Cache**: Redis

### Database
- **Primary DB**: MySQL 8.0+
- **Search**: MySQL Full-Text Search / Meilisearch (optional)
- **Backup**: Automated daily backups

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Laravel Telescope, Laravel Pulse
- **Logging**: Laravel Log / ELK Stack (optional)

### Payment Gateway
- FPX
- JomPAY
- TnG eWallet / MAE / ShopeePay
- iPay88 / Billplz / ToyyibPay

---

## 📁 Project Structure

```
zakat_selangor/
├── docs/                          # Documentation
│   ├── 01-SYSTEM-ARCHITECTURE.md
│   ├── 02-DATABASE-SCHEMA.md
│   ├── 03-API-SPECIFICATIONS.md
│   ├── 04-SECURITY.md
│   ├── 05-DEPLOYMENT.md
│   └── diagrams/
│       ├── ERD.md
│       ├── SYSTEM-FLOW.md
│       └── ARCHITECTURE.md
├── backend/                       # Laravel Backend
│   ├── app/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   └── ...
├── frontend/                      # Next.js Frontend
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── docker/                        # Docker configurations
│   ├── mysql/
│   ├── redis/
│   └── nginx/
├── docker-compose.yml
└── README.md
```

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

1. **[System Architecture](./docs/01-SYSTEM-ARCHITECTURE.md)** - Overall system design and modules
2. **[Database Schema](./docs/02-DATABASE-SCHEMA.md)** - Complete database design with relationships
3. **[API Specifications](./docs/03-API-SPECIFICATIONS.md)** - RESTful API endpoints
4. **[Security Guidelines](./docs/04-SECURITY.md)** - Security best practices and implementation
5. **[Deployment Guide](./docs/05-DEPLOYMENT.md)** - Production deployment procedures

### Diagrams
- **[Entity Relationship Diagram](./docs/diagrams/ERD.md)** - Visual database relationships
- **[System Flow](./docs/diagrams/SYSTEM-FLOW.md)** - Process flow diagrams
- **[Architecture Diagram](./docs/diagrams/ARCHITECTURE.md)** - System architecture overview

---

## 🚀 Getting Started

### Prerequisites
- Docker Desktop
- Node.js 18+
- Composer
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone [repository-url]
cd zakat_selangor
```

2. **Start Docker containers**
```bash
docker-compose up -d
```

3. **Install backend dependencies**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

4. **Install frontend dependencies**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- phpMyAdmin: http://localhost:8080

---

## 👨‍💻 Development Team

**Lead Developer**: Faiz Nasir  
**Client**: Lembaga Zakat Selangor (LZS)

---

## 📄 License

Proprietary - Lembaga Zakat Selangor © 2025

---

## 📞 Support

For technical support or inquiries, please contact the development team.

