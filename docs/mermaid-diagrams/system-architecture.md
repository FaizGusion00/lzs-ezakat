graph TB
  %% ===============================
  %% CLIENT LAYER
  %% ===============================
  subgraph Client["🧑‍💻 Client Layer"]
    WEB["🌐 Web App\nNext.js + TailwindCSS"]
    MOBILE["📱 Mobile App\n(Future Release)"]
  end

  %% ===============================
  %% EDGE & SECURITY LAYER
  %% ===============================
  subgraph Edge["🛡️ Edge & Security Layer"]
    CDN["CDN / Edge Cache"]
    WAF["Web Application Firewall (WAF)"]
    TLS["TLS / HTTPS Termination"]
  end

  %% ===============================
  %% APPLICATION LAYER
  %% ===============================
  subgraph AppLayer["⚙️ Application Layer"]
    LB["Nginx Load Balancer"]
    API1["Laravel API Server #1"]
    API2["Laravel API Server #2"]
    WORKER["Background Workers (Horizon)"]
    SCHED["Task Scheduler (Cron)"]
  end

  %% ===============================
  %% DATA & STORAGE LAYER
  %% ===============================
  subgraph Data["🗄️ Data & Storage Layer"]
    MYSQL["MySQL (Primary)"]
    MYSQLR["MySQL (Read Replica)"]
    REDIS["Redis\nCache | Session | Queue"]
    S3["Object Storage\nS3 / MinIO"]
  end

  %% ===============================
  %% EXTERNAL INTEGRATIONS
  %% ===============================
  subgraph Integrations["🔗 External Integrations"]
    FPX["FPX Payment Gateway"]
    JOMPAY["JomPAY"]
    EWALLET["eWallet Providers"]
    EMAIL["Email Service (SES / Mailgun)"]
    SMS["SMS Gateway"]
    WA["WhatsApp Business API"]
  end

  %% ===============================
  %% OBSERVABILITY & MONITORING
  %% ===============================
  subgraph Observability["📊 Observability & Monitoring"]
    PULSE["Laravel Pulse"]
    TELESCOPE["Laravel Telescope"]
    LOGS["Centralized Log Management"]
  end

  %% ===============================
  %% CONNECTIONS
  %% ===============================
  WEB --> CDN --> WAF --> TLS --> LB
  MOBILE --> CDN

  LB --> API1
  LB --> API2

  API1 --> MYSQL
  API2 --> MYSQL
  API1 -. "read-only" .-> MYSQLR
  API2 -. "read-only" .-> MYSQLR
  API1 --> REDIS
  API2 --> REDIS
  API1 --> S3
  API2 --> S3

  WORKER --> REDIS
  SCHED --> MYSQL

  %% External Services
  API1 --> FPX
  API1 --> JOMPAY
  API1 --> EWALLET
  WORKER --> EMAIL
  WORKER --> SMS
  WORKER --> WA

  %% Observability
  API1 --> PULSE
  API1 --> TELESCOPE
  API1 --> LOGS
