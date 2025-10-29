# 🏗️ Architecture Diagrams

> **Zakat Selangor - Visual Architecture Documentation**  
> Author: Faiz Nasir  
> Version: 1.0.0

---

## 📑 Table of Contents

- [Complete System Architecture](#complete-system-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Architecture](#database-architecture)
- [Infrastructure Architecture](#infrastructure-architecture)
- [Security Architecture](#security-architecture)

---

## 🌐 Complete System Architecture

### Full Stack Overview

```mermaid
graph TB
    subgraph "User Devices"
        WEB[Web Browser<br/>Desktop/Mobile]
        MOBILE[Mobile App<br/>iOS/Android - Future]
    end
    
    subgraph "Edge Layer - CDN & Security"
        CF[CloudFlare CDN<br/>Static Assets + Cache]
        WAF[Web Application Firewall<br/>DDoS Protection]
    end
    
    subgraph "Load Balancing"
        LB[Nginx Load Balancer<br/>SSL Termination<br/>Rate Limiting]
    end
    
    subgraph "Application Servers"
        direction TB
        
        subgraph "Frontend Cluster"
            NEXT1[Next.js App 1<br/>SSR + SSG]
            NEXT2[Next.js App 2<br/>SSR + SSG]
        end
        
        subgraph "Backend Cluster"
            API1[Laravel API 1<br/>REST Endpoints]
            API2[Laravel API 2<br/>REST Endpoints]
        end
        
        subgraph "Background Workers"
            QUEUE[Laravel Horizon<br/>Queue Processing]
            SCHED[Laravel Scheduler<br/>Cron Jobs]
        end
    end
    
    subgraph "Data Layer"
        direction TB
        
        MYSQL_M[(MySQL Primary<br/>Write Operations)]
        MYSQL_R[(MySQL Replica<br/>Read Operations)]
        
        REDIS[(Redis Cluster<br/>Cache + Session + Queue)]
    end
    
    subgraph "Storage Layer"
        S3[Object Storage<br/>S3 / MinIO<br/>PDFs + Uploads]
    end
    
    subgraph "External Services"
        direction TB
        
        subgraph "Payment Gateways"
            FPX[FPX]
            JOMPAY[JomPAY]
            EWALLET[eWallet]
            IPAY88[iPay88]
        end
        
        subgraph "Communication"
            EMAIL[Email Service<br/>AWS SES]
            SMS[SMS Gateway<br/>Twilio]
            WA[WhatsApp API]
        end
        
        subgraph "Integration"
            MYKAD[MyKad Verification]
            SSM[SSM e-Data]
            LHDN[LHDN Integration<br/>Future]
        end
    end
    
    subgraph "Monitoring & Logging"
        PULSE[Laravel Pulse<br/>Performance]
        TELESCOPE[Laravel Telescope<br/>Debugging]
        LOGS[Centralized Logs]
    end
    
    subgraph "Backup & DR"
        BACKUP[Automated Backups<br/>Daily + Incremental]
        DR[Disaster Recovery<br/>Multi-Region - Future]
    end
    
    %% Connections
    WEB --> CF
    MOBILE --> CF
    CF --> WAF
    WAF --> LB
    
    LB --> NEXT1
    LB --> NEXT2
    LB --> API1
    LB --> API2
    
    NEXT1 -.API Calls.-> API1
    NEXT2 -.API Calls.-> API2
    
    API1 --> MYSQL_M
    API2 --> MYSQL_M
    API1 -.Read Only.-> MYSQL_R
    API2 -.Read Only.-> MYSQL_R
    
    API1 --> REDIS
    API2 --> REDIS
    QUEUE --> REDIS
    
    MYSQL_M --> MYSQL_R
    
    API1 --> S3
    API2 --> S3
    
    API1 -.Webhooks.-> FPX
    API1 -.Webhooks.-> JOMPAY
    API1 -.Webhooks.-> EWALLET
    API1 -.Webhooks.-> IPAY88
    
    QUEUE --> EMAIL
    QUEUE --> SMS
    QUEUE --> WA
    
    API1 -.Verify.-> MYKAD
    API1 -.Verify.-> SSM
    
    API1 --> PULSE
    API1 --> TELESCOPE
    API1 --> LOGS
    
    MYSQL_M --> BACKUP
    
    style WEB fill:#3b82f6
    style MOBILE fill:#3b82f6
    style CF fill:#f59e0b
    style MYSQL_M fill:#ef4444
    style REDIS fill:#ef4444
    style S3 fill:#10b981
```

---

## 💻 Frontend Architecture

### Next.js Application Structure

```mermaid
graph TB
    subgraph "Next.js App Router"
        direction TB
        
        APP[app/<br/>Root Layout]
        
        subgraph "Public Pages"
            HOME[/home<br/>Landing Page]
            LOGIN[/auth/login<br/>Login Page]
            REGISTER[/auth/register<br/>Register Page]
            CALC[/calculator<br/>Zakat Calculator]
        end
        
        subgraph "Protected Pages - Payer"
            DASH[/dashboard<br/>User Dashboard]
            PROFILE[/profile<br/>User Profile]
            HISTORY[/payments<br/>Payment History]
            PAYMENT[/pay<br/>Payment Page]
        end
        
        subgraph "Protected Pages - Amil"
            AMIL_DASH[/amil/dashboard<br/>Amil Dashboard]
            COLLECT[/amil/collect<br/>Collection Form]
            COMMISSION[/amil/commissions<br/>Commission Tracking]
        end
        
        subgraph "Protected Pages - Admin"
            ADMIN_DASH[/admin/dashboard<br/>Admin Dashboard]
            REPORTS[/admin/reports<br/>Reports & Analytics]
            USERS[/admin/users<br/>User Management]
        end
    end
    
    subgraph "Shared Components"
        LAYOUT[Layout Components<br/>Header, Footer, Sidebar]
        UI[UI Components<br/>Shadcn/ui + Custom]
        FORMS[Form Components<br/>React Hook Form]
        CHARTS[Charts & Graphs<br/>Recharts]
    end
    
    subgraph "State Management"
        QUERY[React Query<br/>Server State<br/>API Caching]
        ZUSTAND[Zustand<br/>Client State<br/>UI State]
    end
    
    subgraph "API Client"
        AXIOS[Axios Instance<br/>HTTP Client<br/>Interceptors]
        AUTH[Auth Service<br/>Token Management]
    end
    
    subgraph "Utilities"
        HELPERS[Helper Functions<br/>Formatters, Validators]
        HOOKS[Custom Hooks<br/>useAuth, useUser, etc.]
        CONSTANTS[Constants & Configs]
    end
    
    APP --> HOME
    APP --> LOGIN
    APP --> REGISTER
    APP --> CALC
    APP --> DASH
    APP --> PROFILE
    APP --> HISTORY
    APP --> PAYMENT
    APP --> AMIL_DASH
    APP --> COLLECT
    APP --> COMMISSION
    APP --> ADMIN_DASH
    APP --> REPORTS
    APP --> USERS
    
    HOME --> LAYOUT
    DASH --> UI
    PAYMENT --> FORMS
    REPORTS --> CHARTS
    
    DASH --> QUERY
    PROFILE --> ZUSTAND
    
    QUERY --> AXIOS
    AXIOS --> AUTH
    
    FORMS --> HELPERS
    UI --> HOOKS
    
    style APP fill:#3b82f6
    style QUERY fill:#10b981
    style AXIOS fill:#f59e0b
```

### Component Hierarchy

```
app/
├── layout.tsx (Root Layout)
├── page.tsx (Home Page)
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── (payer)/
│   ├── dashboard/
│   ├── profile/
│   ├── payments/
│   └── pay/
├── (amil)/
│   ├── dashboard/
│   ├── collect/
│   └── commissions/
└── (admin)/
    ├── dashboard/
    ├── reports/
    └── users/

components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
├── ui/ (Shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── ...
├── forms/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── PaymentForm.tsx
└── charts/
    ├── PaymentChart.tsx
    └── AmilChart.tsx

lib/
├── api/
│   ├── axios.ts
│   ├── auth.ts
│   └── endpoints/
├── hooks/
│   ├── useAuth.ts
│   ├── useUser.ts
│   └── usePayments.ts
├── store/
│   └── useStore.ts (Zustand)
└── utils/
    ├── formatters.ts
    ├── validators.ts
    └── constants.ts
```

---

## ⚙️ Backend Architecture

### Laravel Application Layers

```mermaid
graph TB
    subgraph "HTTP Layer"
        ROUTES[Routes<br/>api.php, web.php]
        MIDDLEWARE[Middleware<br/>Auth, CORS, Rate Limit]
        CONTROLLERS[Controllers<br/>REST API Endpoints]
    end
    
    subgraph "Application Layer"
        REQUESTS[Form Requests<br/>Validation]
        RESOURCES[API Resources<br/>Response Formatting]
        SERVICES[Services<br/>Business Logic]
        ACTIONS[Actions<br/>Single Responsibility]
    end
    
    subgraph "Domain Layer"
        MODELS[Eloquent Models<br/>ORM Entities]
        REPOSITORIES[Repositories<br/>Data Access]
        EVENTS[Events & Listeners]
        JOBS[Queue Jobs]
    end
    
    subgraph "Infrastructure Layer"
        DATABASE[(Database<br/>MySQL)]
        CACHE[(Cache<br/>Redis)]
        STORAGE[Storage<br/>S3/MinIO]
        QUEUE[Queue<br/>Redis/SQS]
    end
    
    subgraph "External Integrations"
        PAYMENT[Payment Gateways]
        NOTIFICATION[Notification Services]
        VERIFICATION[Verification APIs]
    end
    
    ROUTES --> MIDDLEWARE
    MIDDLEWARE --> CONTROLLERS
    CONTROLLERS --> REQUESTS
    CONTROLLERS --> RESOURCES
    CONTROLLERS --> SERVICES
    
    SERVICES --> ACTIONS
    SERVICES --> MODELS
    SERVICES --> REPOSITORIES
    
    ACTIONS --> EVENTS
    ACTIONS --> JOBS
    
    MODELS --> DATABASE
    REPOSITORIES --> DATABASE
    
    SERVICES --> CACHE
    JOBS --> QUEUE
    SERVICES --> STORAGE
    
    SERVICES --> PAYMENT
    JOBS --> NOTIFICATION
    SERVICES --> VERIFICATION
    
    style ROUTES fill:#3b82f6
    style SERVICES fill:#10b981
    style DATABASE fill:#ef4444
```

### Laravel Directory Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── PaymentController.php
│   │   │   ├── ZakatController.php
│   │   │   └── Admin/
│   │   ├── Middleware/
│   │   │   ├── RoleMiddleware.php
│   │   │   └── CheckVerified.php
│   │   ├── Requests/
│   │   │   ├── RegisterRequest.php
│   │   │   ├── PaymentRequest.php
│   │   │   └── CalculationRequest.php
│   │   └── Resources/
│   │       ├── UserResource.php
│   │       ├── PaymentResource.php
│   │       └── ReceiptResource.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Payment.php
│   │   ├── ZakatCalculation.php
│   │   ├── Receipt.php
│   │   └── AuditLog.php
│   ├── Services/
│   │   ├── ZakatService.php
│   │   ├── PaymentService.php
│   │   ├── ReceiptService.php
│   │   └── NotificationService.php
│   ├── Actions/
│   │   ├── CreatePayment.php
│   │   ├── GenerateReceipt.php
│   │   └── CalculateZakat.php
│   ├── Jobs/
│   │   ├── SendEmailJob.php
│   │   ├── GenerateReceiptPDF.php
│   │   └── ProcessPaymentCallback.php
│   ├── Events/
│   │   ├── PaymentSuccessful.php
│   │   └── UserRegistered.php
│   ├── Listeners/
│   │   ├── SendPaymentNotification.php
│   │   └── GenerateReceipt.php
│   └── Repositories/
│       ├── PaymentRepository.php
│       └── UserRepository.php
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── routes/
│   ├── api.php
│   └── web.php
└── config/
    ├── services.php
    ├── payment.php
    └── zakat.php
```

---

## 🗄️ Database Architecture

### Data Flow & Relationships

```mermaid
graph LR
    subgraph "Master Data - Read Heavy"
        BRANCHES[Branches]
        ZAKAT_TYPES[Zakat Types]
    end
    
    subgraph "Core Data - Balanced R/W"
        USERS[Users]
    end
    
    subgraph "Transactional Data - Write Heavy"
        CALCULATIONS[Zakat Calculations]
        PAYMENTS[Payments]
        RECEIPTS[Receipts]
        COMMISSIONS[Amil Commissions]
    end
    
    subgraph "Supporting Data - Write Heavy"
        NOTIFICATIONS[Notifications]
        AUDIT_LOGS[Audit Logs]
    end
    
    BRANCHES -->|1:N| USERS
    ZAKAT_TYPES -->|1:N| CALCULATIONS
    ZAKAT_TYPES -->|1:N| PAYMENTS
    
    USERS -->|1:N| CALCULATIONS
    USERS -->|1:N| PAYMENTS
    USERS -->|1:N| COMMISSIONS
    USERS -->|1:N| NOTIFICATIONS
    
    CALCULATIONS -->|1:N| PAYMENTS
    PAYMENTS -->|1:1| RECEIPTS
    PAYMENTS -->|1:N| COMMISSIONS
    PAYMENTS -->|1:N| AUDIT_LOGS
    
    style BRANCHES fill:#94a3b8
    style ZAKAT_TYPES fill:#94a3b8
    style USERS fill:#3b82f6
    style PAYMENTS fill:#ef4444
    style RECEIPTS fill:#10b981
```

### Database Scaling Strategy

```mermaid
graph TB
    subgraph "Application Layer"
        APP1[App Server 1]
        APP2[App Server 2]
    end
    
    subgraph "Connection Pool"
        POOL[PgBouncer / ProxySQL<br/>Connection Pooling]
    end
    
    subgraph "Primary Database"
        PRIMARY[(MySQL Primary<br/>Write Operations)]
    end
    
    subgraph "Read Replicas"
        REPLICA1[(Replica 1<br/>Read Operations)]
        REPLICA2[(Replica 2<br/>Analytics/Reports)]
    end
    
    subgraph "Cache Layer"
        REDIS[(Redis Cluster<br/>Query Results<br/>Session Data)]
    end
    
    APP1 --> POOL
    APP2 --> POOL
    
    POOL -->|Write| PRIMARY
    POOL -->|Read| REPLICA1
    POOL -->|Read| REPLICA2
    
    PRIMARY -.Replication.-> REPLICA1
    PRIMARY -.Replication.-> REPLICA2
    
    APP1 --> REDIS
    APP2 --> REDIS
    
    style PRIMARY fill:#ef4444
    style REDIS fill:#f59e0b
```

---

## 🏗️ Infrastructure Architecture

### Cloud Infrastructure (AWS Example)

```mermaid
graph TB
    subgraph "Region: ap-southeast-1 (Singapore)"
        subgraph "VPC"
            subgraph "Public Subnet - AZ1"
                LB1[Load Balancer]
                NAT1[NAT Gateway]
            end
            
            subgraph "Private Subnet - AZ1"
                APP1[App Server 1<br/>Docker]
                WORKER1[Queue Worker 1]
            end
            
            subgraph "Public Subnet - AZ2"
                NAT2[NAT Gateway]
            end
            
            subgraph "Private Subnet - AZ2"
                APP2[App Server 2<br/>Docker]
                WORKER2[Queue Worker 2]
            end
            
            subgraph "Database Subnet - AZ1"
                RDS1[RDS Primary<br/>MySQL]
            end
            
            subgraph "Database Subnet - AZ2"
                RDS2[RDS Replica<br/>MySQL]
            end
            
            subgraph "Cache Subnet"
                CACHE[ElastiCache<br/>Redis Cluster]
            end
        end
        
        subgraph "Storage Services"
            S3[S3 Bucket<br/>Receipts + Backups]
            EFS[EFS<br/>Shared Storage]
        end
    end
    
    subgraph "External Services"
        CF[CloudFlare<br/>CDN + WAF]
        SES[AWS SES<br/>Email Service]
        SNS[AWS SNS<br/>Notifications]
    end
    
    INTERNET([Internet]) --> CF
    CF --> LB1
    
    LB1 --> APP1
    LB1 --> APP2
    
    APP1 --> NAT1
    APP2 --> NAT2
    
    APP1 --> RDS1
    APP2 --> RDS1
    APP1 -.Read.-> RDS2
    APP2 -.Read.-> RDS2
    
    RDS1 -.Replication.-> RDS2
    
    APP1 --> CACHE
    APP2 --> CACHE
    WORKER1 --> CACHE
    WORKER2 --> CACHE
    
    APP1 --> S3
    APP2 --> S3
    APP1 --> EFS
    APP2 --> EFS
    
    WORKER1 --> SES
    WORKER2 --> SNS
    
    style INTERNET fill:#3b82f6
    style CF fill:#f59e0b
    style RDS1 fill:#ef4444
    style S3 fill:#10b981
```

---

## 🔒 Security Architecture

### Security Layers & Controls

```mermaid
graph TB
    subgraph "Layer 7 - Monitoring"
        SIEM[SIEM<br/>Security Events]
        ALERTS[Alerts & Incidents]
        AUDIT[Audit Logs]
    end
    
    subgraph "Layer 6 - Application Security"
        INPUT_VAL[Input Validation]
        OUTPUT_ENC[Output Encoding]
        CSRF[CSRF Protection]
        XSS[XSS Prevention]
    end
    
    subgraph "Layer 5 - Authentication & Authorization"
        AUTH[Laravel Sanctum<br/>Token Auth]
        RBAC[Role-Based Access<br/>Control]
        2FA[Two-Factor Auth<br/>Optional]
    end
    
    subgraph "Layer 4 - Data Security"
        ENCRYPT_REST[Encryption at Rest<br/>MySQL Encryption]
        ENCRYPT_TRANSIT[Encryption in Transit<br/>TLS 1.3]
        MASK[Data Masking]
    end
    
    subgraph "Layer 3 - Network Security"
        WAF[Web Application<br/>Firewall]
        RATE_LIMIT[Rate Limiting]
        IP_FILTER[IP Filtering]
    end
    
    subgraph "Layer 2 - Infrastructure Security"
        FW[Firewall<br/>Security Groups]
        VPC[VPC Isolation]
        SSL[SSL/TLS Certs]
    end
    
    subgraph "Layer 1 - Physical Security"
        DATACENTER[Data Center<br/>Physical Access]
        BACKUP[Encrypted Backups]
        DR[Disaster Recovery]
    end
    
    SIEM --> ALERTS
    ALERTS --> AUDIT
    
    INPUT_VAL --> AUTH
    OUTPUT_ENC --> AUTH
    CSRF --> AUTH
    XSS --> AUTH
    
    AUTH --> ENCRYPT_REST
    RBAC --> ENCRYPT_TRANSIT
    2FA --> MASK
    
    ENCRYPT_REST --> WAF
    ENCRYPT_TRANSIT --> RATE_LIMIT
    MASK --> IP_FILTER
    
    WAF --> FW
    RATE_LIMIT --> VPC
    IP_FILTER --> SSL
    
    FW --> DATACENTER
    VPC --> BACKUP
    SSL --> DR
    
    style SIEM fill:#ef4444
    style AUTH fill:#f59e0b
    style ENCRYPT_REST fill:#10b981
    style WAF fill:#3b82f6
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant DB
    participant Redis

    User->>Frontend: Enter email + password
    Frontend->>API: POST /api/auth/login
    API->>DB: Find user by email
    DB-->>API: User data (hashed password)
    API->>API: Verify password (bcrypt)
    
    alt Password Valid
        API->>API: Generate Sanctum token
        API->>DB: Store token hash
        API->>Redis: Cache user session
        API-->>Frontend: Return token + user data
        Frontend->>Frontend: Store token (httpOnly cookie)
        Frontend-->>User: Redirect to dashboard
    else Password Invalid
        API-->>Frontend: 401 Unauthorized
        Frontend-->>User: Show error
    end
    
    Note over Frontend,API: Subsequent requests
    
    Frontend->>API: GET /api/user/profile<br/>Authorization: Bearer {token}
    API->>Redis: Check token in cache
    Redis-->>API: Token valid + user data
    API-->>Frontend: Return profile data
```

---

**Document Version**: 1.0.0  
**Last Updated**: October 29, 2025  
**Author**: Faiz Nasir

